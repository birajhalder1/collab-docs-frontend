// export interface SyncOperation {
//   id: string;
//   type: "create" | "update" | "delete";
//   documentId: string;
//   payload: any;
//   createdAt: number;
//   retryCount: number;
// }

// export interface PushRequest {
//   clientId: string;
//   operations: SyncOperation[];
// }

// export interface PullResponse {
//   documentId: string;
//   version: number;
//   lamportClock: number;
//   title: string;
//   content: string;
//   operations: any[];
// }

export interface SyncOperation {
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

export interface PushRequest {
  clientId: string;
  operations: SyncOperation[];
}

// export interface PullResponse {
//   documentId: string;
//   version: number;
//   lamportClock: number;
//   title: string;
//   content: string;
//   operations: SyncOperation[];
// }

export interface PullResponse {
  documentId: string;
  title: string;
  content: string;
  version: number;
  lamportClock: number;
  role: "owner" | "editor" | "viewer";
  isOwner: boolean;
  ownerId: string;
  operations: SyncOperation[];
}
