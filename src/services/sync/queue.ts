// import { db } from "@/db/db";
// import { v4 as uuid } from "uuid";

// export async function enqueueOperation(
//   type: "create" | "update" | "delete",
//   documentId: string,
//   payload: unknown,
// ) {
//   await db.syncQueue.add({
//     id: uuid(),
//     type,
//     documentId,
//     payload,
//     createdAt: Date.now(),
//     retryCount: 0,
//   });
// }


import { db } from "@/db/db";
import { v4 as uuid } from "uuid";

const CLIENT_ID = "web-client";

export async function enqueueOperation(
  type: "create" | "update" | "delete",
  documentId: string,
  payload: unknown,
  baseVersion = 0,
) {
  const now = Date.now();

  await db.syncQueue.add({
    opId: crypto.randomUUID(),
    // opId: uuid(),
    clientId: CLIENT_ID,

    documentId,
    type,
    payload,

    baseVersion,
    lamportClock: now,

    createdAt: now,
    retryCount: 0,
  });
}