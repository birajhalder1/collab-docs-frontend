"use client";

import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/db/db";

import CreateDocumentButton from "@/components/documents/CreateDocumentButton";
import DocumentCard from "@/components/documents/DocumentCard";
import { pullAllDocuments } from "@/services/sync/full-sync.service";

export default function DocumentsPage() {
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        // console.log("Fetching documents from server...");
        await pullAllDocuments(); 
        // console.log("Documents synced successfully.");
      } catch (err) {
        console.error("Failed to sync documents", err);
      }
    }; 

    loadDocuments();
  }, []);

  const documents = useLiveQuery(async () => {
    return db.documents
      .orderBy("updatedAt")
      .reverse()
      .filter((doc) => !doc.deleted)
      .toArray();
  }, []);

  if (!documents) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-slate-500">
            All documents are stored locally first.
          </p>
        </div>

        <CreateDocumentButton />
      </div>

      {documents.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-16 text-center">
          No Documents
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
}
