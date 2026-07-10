import api from "@/services/api";
import { db } from "@/db/db";
import { pullDocument } from "./pull.service";
import { mergeDocument } from "./merge.service";

export async function pullAllDocuments() {
  // Get all documents available to the user
  const response = await api.get("/documents");

  const serverDocuments = response.data.data;
  for (const serverDoc of serverDocuments) {
    // Check if the document already exists locally
    const localDoc = await db.documents.get(serverDoc.id);

    // New document (owned or shared)
    if (!localDoc) {
      await db.documents.put({
        id: serverDoc.id,
        title: serverDoc.title,
        content: serverDoc.content,
        role: serverDoc.role,
        isOwner: serverDoc.isOwner,
        version: serverDoc.version,
        lamportClock: serverDoc.lamportClock,
        updatedAt: new Date(serverDoc.updatedAt).getTime(),
        createdAt: new Date(serverDoc.updatedAt).getTime(),
        ownerId: serverDoc.ownerId,
        synced: true,
        deleted: false,
      });

      continue;
    }

    await db.documents.put({
      ...localDoc,
      title: serverDoc.title,
      content: serverDoc.content,
      role: serverDoc.role,
      isOwner: serverDoc.isOwner,
      ownerId: serverDoc.ownerId,
      version: serverDoc.version,
      lamportClock: serverDoc.lamportClock,
      synced: true,
    });

    // Server has a newer version
    if (serverDoc.version > localDoc.version) {
      const latest = await pullDocument(serverDoc.id, localDoc.version);

      if (latest) {
        await mergeDocument(latest);
      }
    }
  }
}
