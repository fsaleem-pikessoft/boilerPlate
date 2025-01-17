import api from "../../utils/axiosMiddleware";
import { InterviewData } from "../../utils/interfaces/creatInterviewInterfaces";

export const createInterview = (data: InterviewData) => api.post("/jobs", data);

export const getAllJobs = () => api.get("/jobs");

export const getJobDetail = (id:any) => api.get(`/jobs/summary/${id}`);

export const getJobsById = (id:any) => api.get(`/jobs/preview/${id}`);

export const interVierDetails = (id:any) => api.get(`interviews/questionnaire/${id}`);

export const candidateInterviewDetails = (data:any) => {
    return api.post("/interview-responses", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
};
       
