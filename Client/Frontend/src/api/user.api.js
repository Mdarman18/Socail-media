import { authUrl } from "../api/Axios"; 

export const registerUser = async (signupInputs) => {
  try {
    const response = await authUrl.post("/signin", signupInputs); 
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong!";
    throw new Error(errorMessage);
  }
};
export const loginUser = async (loginInputs) => {
  try {
    const response = await authUrl.post("/login", loginInputs);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong!";
    throw new Error(errorMessage);
  }
};
