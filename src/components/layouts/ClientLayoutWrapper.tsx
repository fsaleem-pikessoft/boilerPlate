"use client";

import { FC } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AuthenticatedLayout from "./AuthenticatedLayout";
import UnauthenticatedLayout from "./UnauthenticatedLayout";
import { usePathname } from "next/navigation";
import { ClientLayoutWrapperProps } from "../../utils/interfaces/layoutInterfaces";

const ClientLayoutWrapper: FC<ClientLayoutWrapperProps> = ({ children }) => {
  const { user, candidateUser } = useAuth();
  const pathname = usePathname();

  if (user?.email) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }

  if (pathname === "/auth/signup") {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <div className="flex-grow">{children}</div>
      </div>
    );
  }

  return <UnauthenticatedLayout>{children}</UnauthenticatedLayout>;
};

export default ClientLayoutWrapper;
