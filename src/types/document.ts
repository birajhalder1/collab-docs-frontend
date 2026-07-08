export interface DocumentEntity {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  version: number;
  lamportClock: number;
  createdAt: number;
  updatedAt: number;
  deleted: boolean;
  synced: boolean;
}