import api from "@/services/api";
import { db } from "@/db/db";

export async function initializeDocuments() {
  const count = await db.documents.count();

  // Local DB already has data
  if (count > 0) {
    return;
  }

  const response = await api.get("/documents");

  const documents = response.data.data;

  if (!documents?.length) return;

  await db.documents.bulkPut(
    documents.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      ownerId: doc.owner,
      collaborators: doc.collaborators,
      version: doc.version,
      lamportClock: doc.lamportClock,
      createdAt: new Date(doc.createdAt).getTime(),
      updatedAt: new Date(doc.updatedAt).getTime(),
      synced: true,
      deleted: false,
    }))
  );
}