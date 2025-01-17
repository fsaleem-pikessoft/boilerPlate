export interface UserDetail {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }
  
   export interface RegistrationState {
    userDetail: UserDetail | null;
  }
  
  export interface CompanyRegistrationData {
    companyName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    role: string; 
    imageFile?: File;
  }