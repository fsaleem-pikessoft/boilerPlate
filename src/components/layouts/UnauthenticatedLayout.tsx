import Image from "next/image";
import { UnauthenticatedLayoutProps } from "../../utils/interfaces/layoutInterfaces";

const UnauthenticatedLayout = ({ children }: UnauthenticatedLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center flex-grow">
        {children}
      </div>
    </div>
  );
};

export default UnauthenticatedLayout;
