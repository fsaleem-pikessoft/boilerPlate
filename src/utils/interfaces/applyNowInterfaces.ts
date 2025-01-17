export interface Creator {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    otp: string;
    salt: string;
    last_login: string | null;
    is_active: boolean;
    is_two_factor_auth: boolean;
    token: string | null;
    access_token: string;
    refresh_token: string;
    date_joined: string;
    created_at: string;
    updated_at: string;
    preferred_language: string | null;
    client_id: string | null;
    tenant_id: string | null;
    last_invited: string | null;
    organizationId: number;
    branchId: number | null;
  }
  
  export interface Updater extends Creator {}
  
  export interface Branch {
    id: number;
    branchName: string;
    branchStatus: string;
    tags: string | null;
    website: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    organizationId: number;
  }
  
  export interface Job {
    id: number;
    title: string;
    salary: number;
    department: string;
    introUrl: string;
    description: string;
    resumeStatus: string;
    status: string;
    startDate: string;
    endDate: string;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
    branchId: number;
    organizationId: number;
    industryId: number;
    creator: Creator;
    updater: Updater;
    branch: Branch;
  }
  