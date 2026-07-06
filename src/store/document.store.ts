"use client";

import { create } from "zustand";
import { db } from "@/db/db";
import { enqueueOperation } from "@/services/sync/queue";
import { DocumentEntity } from "@/types/document";

interface DocumentStore {
  currentDocument: DocumentEntity | null;

  createDocument: (document: DocumentEntity) => Promise<void>;
  updateDocument: (
    id: string,
    updates: Partial<DocumentEntity>,
  ) => Promise<void>;

  deleteDocument: (id: string) => Promise<void>;
  getDocument: (id: string) => Promise<DocumentEntity | undefined>;
  setCurrentDocument: (document: DocumentEntity | null) => void;
  markAsSynced: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  currentDocument: null,

  createDocument: async (document) => {
    await db.documents.put(document);
    // await enqueueOperation("create", document.id, document);
    await enqueueOperation("create", document.id, document, 0);
  },

  updateDocument: async (id, updates) => {
    const existing = await db.documents.get(id);

    if (!existing) return;

    const normalizedUpdates = { ...updates };

    // Prevent empty titles
    if (
      typeof normalizedUpdates.title === "string" &&
      normalizedUpdates.title.trim() === ""
    ) {
      normalizedUpdates.title = "Untitled Document";
    }

    // const updatedDocument = {
    //   ...existing,
    //   ...normalizedUpdates,
    //   updatedAt: Date.now(),
    //   synced: false,
    // };
    const updatedDocument = {
      ...existing,
      ...normalizedUpdates,
      version: existing.version + 1,
      updatedAt: Date.now(),
      synced: false,
    };

    await db.documents.put(updatedDocument);

    // await enqueueOperation("update", id, updatedDocument);
    await enqueueOperation("update", id, updatedDocument, existing.version);

    set((state) => ({
      currentDocument:
        state.currentDocument?.id === id
          ? updatedDocument
          : state.currentDocument,
    }));
  },

  // deleteDocument: async (id) => {
  //   await db.documents.delete(id);

  //   await enqueueOperation("delete", id, { id });

  //   set((state) => ({
  //     currentDocument:
  //       state.currentDocument?.id === id ? null : state.currentDocument,
  //   }));
  // },
  deleteDocument: async (id) => {
    const existing = await db.documents.get(id);
    await db.documents.delete(id);
    await enqueueOperation("delete", id, { id }, existing?.version ?? 0);
    set((state) => ({
      currentDocument:
        state.currentDocument?.id === id ? null : state.currentDocument,
    }));
  },

  getDocument: async (id) => {
    return db.documents.get(id);
  },

  setCurrentDocument: (document) =>
    set({
      currentDocument: document,
    }),

  markAsSynced: async (id) => {
    const doc = await db.documents.get(id);

    if (!doc) return;

    await db.documents.put({
      ...doc,
      synced: true,
    });
  },
}));
