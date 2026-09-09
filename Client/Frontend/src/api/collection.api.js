import { verifyMe } from "./Axios";

export const getCollections = async () =>
  (await verifyMe.get("/api/collections")).data;
export const createCollection = async (name) =>
  (await verifyMe.post("/api/collections", { name })).data;
export const renameCollection = async (id, name) =>
  (await verifyMe.patch(`/api/collections/${id}`, { name })).data;
export const deleteCollection = async (id) =>
  (await verifyMe.delete(`/api/collections/${id}`)).data;
export const addPostToCollection = async (collectionId, postId) =>
  (await verifyMe.put(`/api/collections/${collectionId}/posts/${postId}`)).data;
export const removePostFromCollection = async (collectionId, postId) =>
  (await verifyMe.delete(`/api/collections/${collectionId}/posts/${postId}`))
    .data;
