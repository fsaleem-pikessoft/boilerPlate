import api from "../../utils/axiosMiddleware";

export const getUserDetail = () => api.get("/auth/me");
