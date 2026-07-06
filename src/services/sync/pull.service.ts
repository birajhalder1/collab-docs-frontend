import api from "@/services/api";
import { PullResponse } from "./sync.types";

export async function pullDocument(
  documentId: string,
  sinceVersion: number,
): Promise<PullResponse | null> {
  const response = await api.get(`/sync/${documentId}/pull`, {
    params: {
      sinceVersion,
    },
  });

  return response.data.data;
}
