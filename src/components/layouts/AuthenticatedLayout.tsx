import { useState } from "react";
import Sidebar from "../common/sidebar";
import Header from "../common/header";
import { AuthenticatedLayoutProps } from "../../utils/interfaces/layoutInterfaces";
import { useAuth } from "../../contexts/AuthContext";

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {user?.email && (
        <div className="relative z-20">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        {user?.email && (
          <div className="relative z-10">
            <Header toggleSidebar={toggleSidebar} />
          </div>
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
