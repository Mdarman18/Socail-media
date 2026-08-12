import axios from "axios";
export const authUrl = axios.create({
  baseURL: "http://localhost:4400/api/user",
  withCredentials: true,
});
export const profileUrl = axios.create({
  baseURL: "http://localhost:4400/api/profile",
  withCredentials: true,
});

export const postUrl = axios.create({
  baseURL: "http://localhost:4400/api/post",
  withCredentials: true,
});

export const messageUrl = axios.create({
  baseURL: "http://localhost:4400/api/message",
  withCredentials: true,
});

// import axios from "axios";

// const API_URL = "https://socail-media-4.onrender.com";

// export const authUrl = axios.create({
//   baseURL: `${API_URL}/api/user`,
//   withCredentials: true,
// });

// export const profileUrl = axios.create({
//   baseURL: `${API_URL}/api/profile`,
//   withCredentials: true,
// });

// export const postUrl = axios.create({
//   baseURL: `${API_URL}/api/post`,
//   withCredentials: true,
// });

// export const messageUrl = axios.create({
//   baseURL: `${API_URL}/api/message`,
//   withCredentials: true,
// });
