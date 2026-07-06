// import api from "@/services/api";
// import { buildOperations } from "./operation";
// import { SyncOperation } from "./sync.types";

// export async function pushOperations(
//   documentId: string,
//   operations: SyncOperation[],
// ) {
//   if (operations.length === 0) {
//     return null;
//   }

//   const response = await api.post(`/sync/${documentId}/push`, {
//     clientId: "web-client",
//     operations: buildOperations(operations),
//   });

//   return response.data.data;
// }


// import axios from "axios";
// import { PushRequest, SyncOperation } from "./sync.types";

// const API_URL = "http://localhost:5000/api";

// export async function pushOperations(
//   documentId: string,
//   operations: SyncOperation[],
// ) {
//   const accessToken = localStorage.getItem("accessToken");

//   const body: PushRequest = {
//     clientId: "web-client",
//     operations,
//   };

//   const response = await axios.post(
//     `${API_URL}/sync/${documentId}/push`,
//     body,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   );

//   return response.data.data;
// }

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

  const response = await api.post(
    `/sync/${documentId}/push`,
    body,
  );

  return response.data.data;
}
