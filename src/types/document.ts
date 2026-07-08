export type DocumentRole = "owner" | "editor" | "viewer";
export interface DocumentEntity {
  id: string;
  title: string;
  content: string;

  role: DocumentRole;
  isOwner: boolean; 

  ownerId: string;
  version: number;
  lamportClock: number;
  createdAt: number;
  updatedAt: number;
  deleted: boolean;
  synced: boolean;
}