import axios from "axios";
export const authUrl = axios.create({
  baseURL: "http://localhost:4400/api/user",
  withCredentials: true,
});
