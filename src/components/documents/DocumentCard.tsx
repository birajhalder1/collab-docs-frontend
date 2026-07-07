"use client";

import { useState } from "react";
import { DocumentEntity } from "@/types/document";
import { FileText, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import ShareDialog from "./ShareDialog";

interface DocumentCardProps {
  document: DocumentEntity;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const [openShare, setOpenShare] = useState(false);

  const preview =
    document.content.replace(/<[^>]+>/g, "").trim() || "Empty document";

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setOpenShare(true);
  };

  return (
    <>
      <Link href={`/documents/${document.id}`}>
        <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <FileText size={30} className="text-blue-600" />

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <Share2 size={18} />
              </button>

              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  document.synced
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {document.synced ? "Synced" : "Offline"}
              </span>
            </div>
          </div>

          <h2 className="mt-4 text-lg font-semibold">{document.title}</h2>

          <p className="mt-2 line-clamp-3 text-sm text-gray-500">{preview}</p>

          <div className="mt-4 flex items-center gap-2 text-gray-400">
            <Clock size={16} />
            Version {document.version}
          </div>
        </div>
      </Link>

      <ShareDialog
        open={openShare}
        onClose={() => setOpenShare(false)}
        documentId={document.id}
      />
    </>
  );
}
