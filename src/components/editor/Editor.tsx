"use client";

import { useEffect, useState } from "react";
import { useDocumentStore } from "@/store/document.store";
import { DocumentEntity } from "@/types/document";

interface EditorProps {
  document: DocumentEntity;
}

export default function Editor({ document }: EditorProps) {
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [status, setStatus] = useState("Saved");

  useEffect(() => {
    const timer = setTimeout(async () => {
      await updateDocument(document.id, {
        title,
        content,
      });

      setStatus("Saved locally");
    }, 500);

    return () => clearTimeout(timer);
  }, [title, content, document.id, updateDocument]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{status}</span>

        <span className="text-sm text-slate-400">
          Version {document.version}
        </span>
      </div>

      <input
        value={title}
        onChange={(e) => {
          setStatus("Saving...");
          setTitle(e.target.value);
        }}
        placeholder="Document title"
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-3xl font-bold outline-none"
      />

      <textarea
        value={content}
        onChange={(e) => {
          setStatus("Saving...");
          setContent(e.target.value);
        }}
        placeholder="Start writing..."
        className="min-h-150 w-full rounded-lg border border-slate-300 p-4 outline-none"
      />
    </div>
  );
}
