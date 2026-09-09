import { verifyMe } from "./Axios";

export const searchContent = async (query, options = {}) => {
  const response = await verifyMe.get("/api/search", {
    params: {
      q: query,
      page: options.page || 1,
      limit: options.limit || 20,
      type: options.type || "all",
      subject: options.subject,
      solved: options.solved,
    },
  });
  const result = response.data;
  const posts = result.data?.posts || [];

  return {
    ...result,
    data: {
      users: (result.data?.users || []).map((user) => ({
        ...user,
        id: user._id,
        name: user.username,
      })),
      doubts: posts
        .filter((post) => post.status === "doubt")
        .map((post) => ({ ...post, id: post._id, title: post.questionTitle })),
      posts: posts
        .filter((post) => post.status !== "doubt" && post.status !== "resource")
        .map((post) => ({
          ...post,
          id: post._id,
          content: post.caption || post.description,
        })),
      resources: posts
        .filter((post) => post.status === "resource")
        .map((post) => ({
          ...post,
          id: post._id,
          title: post.caption || post.description,
        })),
      communities: (result.data?.communities || []).map((community) => ({
        ...community,
        id: community._id,
      })),
    },
  };
};
