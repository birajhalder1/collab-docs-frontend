// import Dexie, { Table } from "dexie";
// import { DocumentEntity } from "@/types/document";

// export interface SyncQueueItem {
//   id: string;
//   type: "create" | "update" | "delete";
//   documentId: string;
//   payload: unknown;
//   createdAt: number;
//   retryCount: number;
// }

// export class EditorDatabase extends Dexie {
//   documents!: Table<DocumentEntity, string>;
//   syncQueue!: Table<SyncQueueItem, string>;

//   constructor() {
//     super("collab-editor-db");

//     this.version(2).stores({
//       documents: "id, ownerId, updatedAt, synced",
//       syncQueue: "id, documentId, createdAt",
//     });
//   }
// }

// export const db = new EditorDatabase();

import Dexie, { Table } from "dexie";
import { DocumentEntity } from "@/types/document";

export interface SyncQueueItem {
  opId: string;
  clientId: string;
  documentId: string;
  type: "create" | "update" | "delete";
  payload: any;
  baseVersion: number;
  lamportClock: number;
  createdAt: number;
  retryCount: number;
}

export class EditorDatabase extends Dexie {
  documents!: Table<DocumentEntity, string>;
  syncQueue!: Table<SyncQueueItem, string>;

  constructor() {
    super("collab-editor-db");

    this.version(3).stores({
      documents: "id, ownerId, updatedAt, synced",
      syncQueue: "opId, documentId, createdAt",
    });
  }
}

export const db = new EditorDatabase();
