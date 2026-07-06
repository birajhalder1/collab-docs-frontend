import { syncDocuments } from "./sync.service";

export function startOnlineSync() {
  window.addEventListener("online", () => {
    console.log("Back online");
    syncDocuments();
  });
}