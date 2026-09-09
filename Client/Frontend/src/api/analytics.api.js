import { verifyMe } from "./Axios";

export const getMyAnalytics = async () =>
  (await verifyMe.get("/api/analytics/me")).data;
export const getMyAchievements = async () =>
  (await verifyMe.get("/api/achievements/me")).data;
