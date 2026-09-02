import { communityUrl } from "../api/Axios";

// 1. Nayi Community Create karna
export const createCommunityService = async (communityData) => {
  try {
    const response = await communityUrl.post("/create", communityData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Community create karne mein error aayi!",
      }
    );
  }
};

// 2. Saari Communities Fetch karna
export const getAllCommunitiesService = async () => {
  try {
    const response = await communityUrl.get("/all");
    console.log("res.data.....", response.data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Communities fetch karne mein error aayi!",
      }
    );
  }
};

export const joinCommunityService = async (communityId) => {
  try {
    const response = await communityUrl.post(`/join/${communityId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Community join karne mein error aayi!",
      }
    );
  }
};

// 4. Kisi specific Community ke andar ki Posts fetch karna
export const getCommunityPostsService = async (communityId) => {
  try {
    const response = await communityUrl.get(`/${communityId}/posts`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Community posts fetch karne mein error aayi!",
      }
    );
  }
};
