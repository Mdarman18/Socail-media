import { postUrl } from "../api/Axios";

// Sabhi posts fetch karne ke liye
export const getAllPosts = async () => {
  const res = await postUrl.get("/allpost");
  return res.data.posts;
};

// Post ko like karne ke liye
export const likePostApi = async (id) => {
  const res = await postUrl.post(`/like/${id}`);
  return res.data.post;
};

// Post ko dislike karne ke liye
export const dislikePostApi = async (id) => {
  const res = await postUrl.post(`/dislike/${id}`);
  return res.data.post;
};
