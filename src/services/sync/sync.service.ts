import { db } from "@/db/db";
import { pushOperations } from "./push.service";
import { mergeDocument } from "./merge.service";
import { pullAllDocuments } from "./full-sync.service";

let syncing = false;

export async function syncDocuments() {
  if (syncing) return;
  if (!navigator.onLine) return;

  syncing = true;

  try {
    const queue = await db.syncQueue.orderBy("createdAt").toArray();

    // if (queue.length === 0) {
    //   await pullAllDocuments();
    //   return;
    // }

    if (queue.length > 0) {
      const grouped = queue.reduce(
        (acc, operation) => {
          if (!acc[operation.documentId]) {
            acc[operation.documentId] = [];
          }

          acc[operation.documentId].push(operation);

          return acc;
        },
        {} as Record<string, typeof queue>,
      );

      for (const [documentId, operations] of Object.entries(grouped)) {
        const result = await pushOperations(documentId, operations);

        if (!result) continue;

        await db.syncQueue.bulkDelete(operations.map((o) => o.opId));

        await mergeDocument(result);

        await db.documents.update(documentId, {
          synced: true,
        });
      }
    }

    // Always pull latest documents after pushing
    await pullAllDocuments();

    const grouped = queue.reduce(
      (acc, operation) => {
        if (!acc[operation.documentId]) {
          acc[operation.documentId] = [];
        }

        acc[operation.documentId].push(operation);

        return acc;
      },
      {} as Record<string, typeof queue>,
    );

    for (const [documentId, operations] of Object.entries(grouped)) {
      const result = await pushOperations(documentId, operations);

      if (!result) continue;

      // remove queue
      await db.syncQueue.bulkDelete(operations.map((o) => o.opId));

      // merge latest server state
      await mergeDocument(result);

      await db.documents.update(documentId, {
        synced: true,
      });

      // console.log(`Synced ${operations.length} operations`);
    }
  } catch (error) {
    console.error(error);

    const queue = await db.syncQueue.toArray();

    for (const operation of queue) {
      await db.syncQueue.update(operation.opId, {
        retryCount: operation.retryCount + 1,
      });
    }
  } finally {
    syncing = false;
  }
}
