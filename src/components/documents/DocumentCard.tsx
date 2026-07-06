"use client";

import { DocumentEntity } from "@/types/document";
import { FileText, Clock } from "lucide-react";
import Link from "next/link";

interface DocumentCardProps {
  document: DocumentEntity;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const preview =
    document.content.replace(/<[^>]+>/g, "").trim() || "Empty document";
  return (
    <Link href={`/documents/${document.id}`}>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-start justify-between">
          <FileText className="text-blue-600" size={24} />

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              document.synced
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {document.synced ? "Synced" : "Offline"}
          </span>
        </div>

        <h2 className="mt-4 text-lg font-semibold">{document.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm text-slate-500">{preview}</p>
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
          <Clock size={16} />
          Version {document.version}
        </div>
      </div>
    </Link>
  );
}
