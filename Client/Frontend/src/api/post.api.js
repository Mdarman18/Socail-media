import { postUrl } from "../api/Axios";

// Sabhi posts fetch karne ke liye
export const getAllPosts = async (page = 1, limit = 20) => {
  const res = await postUrl.get("/allpost", { params: { page, limit } });
  return res.data.posts;
};
// =======------ Post add krne ke liye --===============
export const addPost = async (postData) => {
  const formData = new FormData();
  formData.append("status", postData.status || "");
  formData.append("description", postData.description || "");
  formData.append("questionTitle", postData.questionTitle || "");
  formData.append("questionExplanation", postData.questionExplanation || "");
  formData.append("subject", postData.subject || "");
  formData.append("codeDetails", postData.codeDetails || "");
  formData.append("codeType", postData.codeType || "");
  formData.append("caption", postData.caption || "");

  // Agar image select ki hai toh 'img' field me append karein
  if (postData.rawImage) {
    formData.append("img", postData.rawImage);
  }

  // Agar resource/PDF select ki hai toh 'pdf' field me append karein
  if (postData.rawPdfFile) {
    formData.append("pdf", postData.rawPdfFile);
  }

  const response = await postUrl.post("/addpost", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
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
