import api from "../../utils/axiosMiddleware";

export const getAllBranches = () => api.get("/branches");
