"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { v4 as uuid } from "uuid";

import Button from "@/components/ui/Button";
import { useDocumentStore } from "@/store/document.store";
import api from "@/services/api";

export default function CreateDocumentButton() {
  const router = useRouter();

  const createDocument = useDocumentStore((state) => state.createDocument);

  const handleCreate = async () => {
    const res = await api.post("/documents", {
      title: "Untitled Document",
    });

    const id = res.data.data.id;
    const now = Date.now();

    await createDocument({
      id,
      title: "Untitled Document",
      content: "",
      ownerId: "demo-user",
      version: 1,
      createdAt: now,
      updatedAt: now,
      deleted: false,
      synced: false,
    });

    router.push(`/documents/${id}`);
  };

  return (
    <Button onClick={handleCreate}>
      <Plus size={18} className="mr-2 inline" />
      New Document
    </Button>
  );
}
