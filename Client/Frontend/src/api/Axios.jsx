import axios from "axios";
export const authUrl = axios.create({
  baseURL: "http://localhost:4400/api/user",
  withCredentials: true,
});
export const profileUrl = axios.create({
  baseURL: "http://localhost:4400/api/profile",
  withCredentials: true,
});
