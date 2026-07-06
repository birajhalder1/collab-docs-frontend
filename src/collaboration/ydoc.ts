import * as Y from "yjs";

export function createYDoc(documentId: string) {
  const doc = new Y.Doc();
  const text = doc.getText(documentId);

  return {
    doc,
    text,
  };
}
