export interface User {
  email: string;
  password: string;
  // Add other user properties as needed
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  candidateLogin: (userData: User) => void;
  logout: () => void;
  loading: boolean;
  candidateUser: any; // Adjust type as necessary
}
