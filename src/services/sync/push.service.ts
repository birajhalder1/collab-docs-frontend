import api from "@/services/api";
import { PushRequest, SyncOperation } from "./sync.types";

export async function pushOperations(
  documentId: string,
  operations: SyncOperation[],
) {
  const body: PushRequest = {
    clientId: "web-client",
    operations,
  };

  const response = await api.post(`/sync/${documentId}/push`, body);
  return response.data.data;
}
