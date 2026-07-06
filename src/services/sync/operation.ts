import { SyncOperation } from "./sync.types";

export function buildOperations(operations: SyncOperation[]) {
  return operations.map((operation) => ({
    opId: operation.id,
    type: operation.type,
    payload: operation.payload,
    baseVersion: operation.payload.version ?? 0,
    lamportClock: Date.now(),
    clientId: "web-client",
  }));
}
