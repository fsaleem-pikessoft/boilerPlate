export interface User {
  first_name: string;
  last_name: string;
  email: string;
  organizationId?: string;
}

export interface AuthContextType {
  user: User | null;
  candidateUser: null;
  login: (userData: User) => void;
  candidateLogin: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}
