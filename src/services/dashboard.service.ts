import api from "@/services/api";

export async function getDashboard() {
  const res = await api.get("/dashboard");

  return res.data.data;
}
