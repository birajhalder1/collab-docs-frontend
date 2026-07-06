"use client";

import { use, useEffect, useState } from "react";
import { socket } from "@/services/socket/socket";
import TipTapEditor from "@/components/editor/TipTapEditor";
import SaveStatus from "@/components/editor/EditorStatus";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useDocumentStore } from "@/store/document.store";
import { DocumentEntity } from "@/types/document";
import { useDebounce } from "@/hooks/useDebounce";

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

  // Load document
  useEffect(() => {
    async function load() {
      const doc = await getDocument(id);

      if (!doc) return;

      setDocument(doc);
      setTitle(doc.title);
      setContent(doc.content);
    }

    load();
  }, [id, getDocument]);

  // Typing Status
  useEffect(() => {
    if (!document) return;

    if (title !== document.title || content !== document.content) {
      setStatus("typing");
    }
  }, [title, content, document]);

  // Auto Save
  useEffect(() => {
    if (!document) return;

    if (
      debouncedTitle === document.title &&
      debouncedContent === document.content
    ) {
      return;
    }

    const save = async () => {
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
    };

    save();
  }, [debouncedTitle, debouncedContent, document, updateDocument]);

  useEffect(() => {
    if (!document) return;

    socket.emit("join-document", {
      documentId: document.id,
    });

    socket.on("joined", (data) => {
      console.log("Joined document", data);
    });

    socket.on("error", (err) => {
      console.error(err);
    });

    return () => {
      socket.emit("leave-document");

      socket.off("joined");
      socket.off("error");
    };
  }, [document]);

  if (!document) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-1">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              if (title.trim() === "") {
                setTitle("Untitled Document");
              }
            }}
            placeholder="Untitled Document"
            className="w-full bg-transparent text-3xl font-bold outline-none"
          />
        </div>

        <SaveStatus status={status} />
      </div>

      <TipTapEditor content={content} onChange={setContent} />
    </div>
  );
}
