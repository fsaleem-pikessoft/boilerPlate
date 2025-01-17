import api from "../../utils/axiosMiddleware";
import { CompanyDetails } from "../../utils/interfaces/companyDetailInterface";

export const getCompanyDetail = () =>
  api.get("/organizations/organization-details");

export const updateCompany = (id: number, data: CompanyDetails) =>
  api.patch(`/organizations/${id}`, data);
