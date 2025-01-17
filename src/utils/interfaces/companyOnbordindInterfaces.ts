export interface OrganizationRegistrationState {
    companyAdress: string;
  companyName: string;
  country: string;
  employeeRange: string;
  industry: number[];
  branchName: string;
  newHire: string;
  companyNameError: boolean;
  }

  export interface OrganizationRegistrationPayload {
    organizationName: string;
    address: string;
    country: string;
    employeeRange: string;
    newHire: string;
    industryIds: number[];
    branchName: string;
  }

export interface CompanyNameRequest {
    organizationName: string;
  }

