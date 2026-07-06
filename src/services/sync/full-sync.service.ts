import { db } from "@/db/db";
import { pullDocument } from "./pull.service";
import { mergeDocument } from "./merge.service";

export async function pullAllDocuments() {
  const documents = await db.documents.toArray();

  for (const document of documents) {
    try {
      const remote = await pullDocument(document.id, document.version);

      if (remote) {
        await mergeDocument(remote);
      }
    } catch (error) {
      console.error(`Pull failed for document ${document.id}`, error);
    }
  }
}
