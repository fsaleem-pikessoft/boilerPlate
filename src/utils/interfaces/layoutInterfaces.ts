import { ReactNode } from "react";

export interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export interface UnauthenticatedLayoutProps {
  children: ReactNode;
}

export interface RootLayoutProps {
  children: React.ReactNode;
}
