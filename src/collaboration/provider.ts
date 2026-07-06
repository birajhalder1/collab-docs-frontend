import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";

export interface CollaborationContext {
  doc: Y.Doc;
  persistence: IndexeddbPersistence;
}

export function createCollaborationContext(
  documentId: string,
): CollaborationContext {
  const doc = new Y.Doc();

  const persistence = new IndexeddbPersistence(documentId, doc);

  return {
    doc,
    persistence,
  };
}
