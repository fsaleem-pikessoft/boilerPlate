import api from "../../utils/axiosMiddleware";
import { CheckEmailData } from "../../utils/interfaces/userRegisterInterfaces";
import { CompanyRegistrationData } from "../../utils/interfaces/companyRegistrationInterfaces";

export const checkEmail = (data: CheckEmailData) =>
  api.post("auth/check-email", data);

export const registerOrganization = (data: CompanyRegistrationData) => {
  return api.post("auth/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
