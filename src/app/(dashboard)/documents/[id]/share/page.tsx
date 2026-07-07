"use client";

import { useState } from "react";
import api from "@/services/api";
import Button from "@/components/ui/Button";

interface Props {
  documentId: string;
  onClose: () => void;
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
  documentId,
  onClose,
}: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);

  const [collaborators, setCollaborators] = useState<
    Collaborator[]
  >([]);

  async function loadCollaborators() {
    const res = await api.get(
      `/documents/${documentId}/collaborators`
    );

    setCollaborators(res.data.data);
  }

  async function handleShare() {
    if (!email) return;

    try {
      setLoading(true);

      await api.post(
        `/documents/${documentId}/collaborators`,
        {
          email,
          role,
        }
      );

      setEmail("");

      await loadCollaborators();

      alert("Shared successfully");
    } catch (err) {
      console.error(err);
      alert("Share failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[500px] rounded-xl bg-white p-6 shadow-xl">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Share Document
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="mt-6 space-y-4">

          <input
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded border p-3"
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="w-full rounded border p-3"
          >
            <option value="editor">
              Editor
            </option>

            <option value="viewer">
              Viewer
            </option>
          </select>

          <Button
            loading={loading}
            onClick={handleShare}
            className="w-full"
          >
            Share
          </Button>
        </div>

        <hr className="my-6" />

        <h3 className="mb-3 font-semibold">
          Collaborators
        </h3>

        <div className="space-y-3 max-h-60 overflow-auto">
          {collaborators.map((item) => (
            <div
              key={item.user.id}
              className="flex items-center justify-between rounded border p-3"
            >
              <div>
                <div className="font-medium">
                  {item.user.name}
                </div>

                <div className="text-sm text-gray-500">
                  {item.user.email}
                </div>
              </div>

              <span className="rounded bg-gray-100 px-3 py-1 text-sm">
                {item.role}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}