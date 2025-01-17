import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { toast } from "react-toastify";
import axios from "../../utils/axiosMiddleware";
import {
  BuildingOfficeIcon,
  Cog6ToothIcon,
  XMarkIcon,
  UserIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import {
  CreditCard,
  HistoryOutlined,
  PieChartOutline,
  SupportOutlined,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { HEADER } from "../../utils/common";


interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const [activeLink, setActiveLink] = useState("");

  const handleLogout = async () => {
    try {
      const response = await axios.post("auth/logout");
      toast.success(response?.data?.message);
      logout();
    } catch (error) {
      toast.error(error?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md shadow-md md:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-64 bg-white border-r h-screen flex flex-col transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="p-4 flex justify-between items-center">
          <Avatar
            src="/images/company_logo.svg"
            sx={{ width: 56, height: 56 }}
          />
          {isOpen && (
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-md"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        <nav className=" flex-grow m-[8px]">
          <SidebarLink
            href="/personalInfo"
            icon={<UserIcon className="w-5 h-5" />}
            text="Personal Info"
            active={activeLink === "personalInfo"}
            onClick={() => setActiveLink("personalInfo")}
          />
          <SidebarLink
            href="/company-details"
            icon={<BuildingOfficeIcon className="w-5 h-5" />}
            text="Company details"
            active={activeLink === "companyDetail"}
            onClick={() => setActiveLink("companyDetail")}
          />
          <SidebarLink
            href="/create-interview"
            icon={<ComputerDesktopIcon className="w-5 h-5" />}
            text="Create Interview"
            active={activeLink === "createInterview"}
            onClick={() => setActiveLink("createInterview")}
          />
          <SidebarLink
            href="/active-interviews"
            icon={<ClipboardDocumentListIcon className="w-5 h-5" />}
            text="All Active Interviews"
            active={activeLink === "activeInterviews"}
            onClick={() => setActiveLink("activeInterviews")}
          />
          <SidebarLink
            href="/billingHistory"
            icon={<HistoryOutlined className="w-5 h-5" />}
            text="Billing History"
            active={activeLink === "billingHistory"}
            onClick={() => setActiveLink("billingHistory")}
          />
          <SidebarLink
            href="/activePlan"
            icon={<CreditCard className="w-5 h-5" />}
            text="Active Plan"
            active={activeLink === "activePlan"}
            onClick={() => setActiveLink("activePlan")}
          />
          <SidebarLink
            href="/reports"
            icon={<PieChartOutline className="w-5 h-5" />}
            text="Reports"
            active={activeLink === "reports"}
            onClick={() => setActiveLink("reports")}
          />
          <SidebarLink
            href="/support"
            icon={<SupportOutlined className="w-5 h-5" />}
            text="Support"
            active={activeLink === "support"}
            onClick={() => setActiveLink("support")}
          />
          <SidebarLink
            href="/integrations"
            icon={<Cog6ToothIcon className="w-5 h-5" />}
            text="Integrations"
            active={activeLink === "integrations"}
            onClick={() => setActiveLink("integrations")}
          />
        </nav>

        <div className="p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase ">
            Profile
          </p>
          <div className="flex items-center">
            <Image
              src={HEADER?.profileLogo}
              alt="John Doe"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-0 w-full text-gray-600 flex items-center justify-center py-2 hover:bg-gray-100 rounded-md transition duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: any;
  text: string;
  active: boolean;
  onClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  text,
  active,
  onClick,
}) => (
  <Link
    href={href}
    className={`flex items-center px-4 py-3 text-sm rounded-md mb-2 transition duration-300 ${
      active ? "bg-blue-100" : "bg-[#F0F5FA] mt-2 hover:bg-[#E0E8F0]"
    }`}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    {text}
  </Link>
);

export default Sidebar;
