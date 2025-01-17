import Image from "next/image";
import Grid from "@mui/material/Grid2";
import { Avatar } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { HEADER } from "../../utils/common";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b sticky top-0 z-50 rounded-lg">
      <Grid container spacing={2}>
        <Grid
          size={{ xs: 2, md: 2 }}
          className="justify-items-end mt-2 mb-2 ml-[65px] sm:ml-[50px] md:ml-0"
        >
          <Avatar src={HEADER?.profileLogo} sx={{ width: 86, height: 86 }} />
        </Grid>
        <Grid size={{ xs: 8, md: 4 }} className="mt-2">
          <Grid size={{ xs: 12, md: 12 }} className="mt-2">
            <span className="font-bold">
              {HEADER.heading} {user?.first_name} {user?.last_name}
            </span>
          </Grid>
          <Grid size={{ xs: 12, md: 12 }} className="mt-2">
            <p className="font-normal">{HEADER.paragraph}</p>
          </Grid>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }} className="text-center">
          <input
            type="text"
            placeholder="Type Here..."
            className="border rounded p-2 mt-7"
          />
          <button className="bg-primary text-white rounded p-2 mt-7 mb-2">
            Search
          </button>
        </Grid>
        <Grid size={{ xs: 6, md: 2 }} className="text-center">
          <Image
            src={HEADER?.logo}
            alt="VirtuHire"
            width={170}
            height={50}
            className="mt-7 mb-2"
          />
        </Grid>
      </Grid>
    </header>
  );
};

export default Header;
