import { IndexeddbPersistence } from "y-indexeddb";
import * as Y from "yjs";

export function enableOfflinePersistence(documentId: string, doc: Y.Doc) {
  return new IndexeddbPersistence(documentId, doc);
}
