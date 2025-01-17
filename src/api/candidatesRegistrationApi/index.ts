import api from "../../utils/axiosMiddleware";
import { CandidateRegisterData } from "../../utils/interfaces/candidatesRegistrationInterface";

export const candidateRegister = (data: CandidateRegisterData) =>
  api.post("candidates/register", data);

export const CandidateUploadResume = (data) => {
  return api.post("candidates/upload-resume", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
