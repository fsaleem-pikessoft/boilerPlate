import api from "../../utils/axiosMiddleware";
import { OrganizationRegistrationPayload } from "../../utils/interfaces/companyOnbordindInterfaces";
import { CompanyNameRequest } from "../../utils/interfaces/companyOnbordindInterfaces";

export const organizationRegistration = (
  data: OrganizationRegistrationPayload
) => api.post("/organizations", data);

export const checkCompanyName = (data: CompanyNameRequest) =>
  api.post("/organizations/check-organization", data);

export const organizationCountries = () => api.get("/organizations/countries");

export const organizationIndustries = () => api.get("/industries");
