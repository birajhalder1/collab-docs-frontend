"use client";

import { useEffect, useState } from "react";
import {
  getCollaborators,
  shareDocument,
  removeCollaborator,
} from "@/services/document.service";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  documentId: string;
}

interface Collaborator {
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: string;
}

export default function ShareDialog({
  open,
  onClose,
  documentId,
}: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [members, setMembers] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadCollaborators();
    }
  }, [open]);

  const loadCollaborators = async () => {
    try {
      const data = await getCollaborators(documentId);
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (!email.trim()) {
      alert("Please enter an email.");
      return;
    }

    try {
      setLoading(true);

      await shareDocument(documentId, email, role);

      setEmail("");

      await loadCollaborators();

      alert("Collaborator added.");
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to share document.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove collaborator?")) return;

    try {
      await removeCollaborator(documentId, userId);
      await loadCollaborators();
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-40 bg-black/40" />
      {/* <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} /> */}

      {/* Dialog */}
      <div className=" fixed left-1/2 top-1/2 z-50 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto md:max-w-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Share Document</h2>

          <button onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>

        {/* Email */}
        <div className="space-y-4">
          <input
            className="w-full rounded-md border p-3"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border p-3"
          >
            <option value="editor">Editor</option>

            <option value="viewer">Viewer</option>
          </select>

          <button
            onClick={handleShare}
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-3 text-white hover:bg-blue-700"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

        {/* Collaborators */}
        <div className="mt-8">
          <h3 className="mb-3 font-semibold">Collaborators</h3>

          {members.length === 0 && (
            <p className="text-gray-500">No collaborators</p>
          )}

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.user.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{member.user.name}</p>

                  <p className="text-sm text-gray-500">{member.user.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs capitalize">
                    {member.role}
                  </span>

                  {member.role !== "owner" && (
                    <button
                      onClick={() => handleRemove(member.user.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
