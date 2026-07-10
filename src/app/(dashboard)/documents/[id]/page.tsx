"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { socket } from "@/services/socket/socket";
import { useDocumentStore } from "@/store/document.store";
import { DocumentEntity } from "@/types/document";
import { useDebounce } from "@/hooks/useDebounce";

import TipTapEditor from "@/components/editor/TipTapEditor";
import SaveStatus from "@/components/editor/EditorStatus";
import { mergeDocument } from "@/services/sync/merge.service";
import { pullDocument } from "@/services/sync/pull.service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DocumentPage({ params }: PageProps) {
  const { id } = use(params);

  const getDocument = useDocumentStore((state) => state.getDocument);
  const updateDocument = useDocumentStore((state) => state.updateDocument);

  const [document, setDocument] = useState<DocumentEntity | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const debouncedTitle = useDebounce(title, 700);
  const debouncedContent = useDebounce(content, 700);

  const [status, setStatus] = useState<
    "typing" | "saving" | "saved" | "syncing" | "synced" | "offline"
  >("saved");

  // ---------------------------
  // Load document
  // ---------------------------
  useEffect(() => {
    async function load() {
      const doc = await getDocument(id);
      console.log("doc-----------", doc);

      if (!doc) return;

      setDocument(doc);
      setTitle(doc.title);
      setContent(doc.content);
    }

    load();
  }, [id, getDocument]);

  const isEditable = document?.role === "owner" || document?.role === "editor";

  useEffect(() => {
    if (!document) return;

    if (
      isEditable &&
      (title !== document.title || content !== document.content)
    ) {
      setStatus("typing");
    }
  }, [title, content, document, isEditable]);

  useEffect(() => {
    if (!document) return;

    if (!isEditable) return;

    if (
      debouncedTitle === document.title &&
      debouncedContent === document.content
    ) {
      return;
    }

    const save = async () => {
      try {
        setStatus("saving");

        await updateDocument(document.id, {
          title: debouncedTitle,
          content: debouncedContent,
          updatedAt: Date.now(),
        });

        setDocument({
          ...document,
          title: debouncedTitle,
          content: debouncedContent,
          updatedAt: Date.now(),
        });

        setStatus("saved");
      } catch (err) {
        console.error(err);
      }
    };

    save();
  }, [debouncedTitle, debouncedContent, document, updateDocument, isEditable]);

  useEffect(() => {
    console.log("load-----------------", document);

    if (!document) return;

    socket.emit("join-document", {
      documentId: document.id,
    });

    socket.on("joined", (data) => {
      console.log("Joined", data);
    });

    socket.on("document-updated", async () => {
      if (!document) return;

      console.log("Remote update");
      const latest = await pullDocument(document.id, document.version);
      if (!latest) return;

      await mergeDocument(latest);
      const updated = await getDocument(document.id);
      if (!updated) return;

      setDocument(updated);
      setTitle(updated.title);
      setContent(updated.content);
    });

    socket.on("error", (err) => {
      console.error(err);
    });

    return () => {
      socket.emit("leave-document");
      socket.off("document-updated");
      socket.off("joined");
      socket.off("error");
    };
  }, [document]);

  if (!document) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/documents">
          <ArrowLeft />
        </Link>

        <div className="flex-1">
          <input
            value={title}
            readOnly={!isEditable}
            disabled={!isEditable}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              if (title.trim() === "") {
                setTitle("Untitled Document");
              }
            }}
            placeholder="Untitled Document"
            className={`w-full bg-transparent text-3xl font-bold outline-none ${
              !isEditable ? "cursor-not-allowed text-gray-500" : ""
            }`}
          />
        </div>

        <SaveStatus status={status} />
      </div>

      {!isEditable && (
        <div className="rounded-md bg-yellow-100 p-3 text-sm text-yellow-700">
          You have <strong>Viewer</strong> access. This document is read-only.
        </div>
      )}

      <TipTapEditor
        content={content}
        onChange={setContent}
        editable={isEditable}
      />
    </div>
  );
}
