import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4400";

export const authUrl = axios.create({
  baseURL: `${API_URL}/api/user`,
  withCredentials: true,
});

export const profileUrl = axios.create({
  baseURL: `${API_URL}/api/profile`,
  withCredentials: true,
});

export const postUrl = axios.create({
  baseURL: `${API_URL}/api/post`,
  withCredentials: true,
});

export const messageUrl = axios.create({
  baseURL: `${API_URL}/api/message`,
  withCredentials: true,
});

export const communityUrl = axios.create({
  baseURL: `${API_URL}/api/community`,
  withCredentials: true,
});

export const verifyMe = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
});
