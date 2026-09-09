import { verifyMe } from "./Axios";

export const getNotifications = async (page = 1, limit = 20) => {
  const response = await verifyMe.get("/api/notifications", {
    params: { page, limit },
  });
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await verifyMe.patch(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await verifyMe.patch("/api/notifications/read-all");
  return response.data;
};
