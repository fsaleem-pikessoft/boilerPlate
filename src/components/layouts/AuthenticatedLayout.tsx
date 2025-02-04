import { useState } from "react";
import Sidebar from "../common/sidebar";
import { AuthenticatedLayoutProps } from "../../utils/interfaces/layoutInterfaces";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/authSlice";
import Header from "../common/header";

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const { user } = useSelector(selectAuth);
  const [collapsed, setCollapsed] = useState(false);

  console.log("Current user state:", user);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen">
      {user && (
        <div className="relative z-10 bg-white">
          <Sidebar />
        </div>
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        {user && <Header toggleSidebar={toggleSidebar} />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
