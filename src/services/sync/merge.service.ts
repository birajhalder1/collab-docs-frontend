import { db } from "@/db/db";
import { PullResponse } from "./sync.types";

export async function mergeDocument(remote: PullResponse) {
  const local = await db.documents.get(remote.documentId);

  if (!local) {
    return;
  }

  // Ignore if already latest
  if (
    remote.version <= local.version &&
    remote.content === local.content &&
    remote.title === local.title
  ) {
    return;
  }

  await db.documents.put({
    ...local,
    title: remote.title,
    content: remote.content,
    version: remote.version,
    synced: true,
    updatedAt: Date.now(),
  });
}
