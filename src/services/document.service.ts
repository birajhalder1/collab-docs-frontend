import api from "./api";

export const getCollaborators = async (documentId: string) => {
  const res = await api.get(`/documents/${documentId}/collaborators`);

  return res.data.data;
};

export const shareDocument = async (
  documentId: string,
  email: string,
  role: string,
) => {
  const res = await api.post(`/documents/${documentId}/collaborators`, {
    email,
    role,
  });

  return res.data.data;
};

export const removeCollaborator = async (
  documentId: string,
  userId: string,
) => {
  await api.delete(`/documents/${documentId}/collaborators/${userId}`);
};
