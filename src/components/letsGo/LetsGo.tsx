import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Card, CircularProgress } from "@mui/material";
import { LETSGO_SCREEN } from "../../utils/constants";

const LetsGo: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push("/company-onboarding");
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid size={{ xs: 12, sm: 10, md: 8, lg: 6 }}>
          <Card
            style={{ backgroundColor: "rgba(134, 194, 234, 0.09)" }}
            className="w-full max-w-[1000px] p-[15px] mt-[100px]"
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <span
                  className="font-extrabold text-[45px] text-headingColor"
                  style={{
                    fontSize: window.innerWidth < 600 ? "20px" : "45px",
                  }}
                >
                  {LETSGO_SCREEN.heading}
                </span>
              </Grid>
              <Grid size={{ xs: 12 }} className="text-right">
                <button
                  className="bg-primary text-white w-[250px] h-[43px] rounded-lg"
                  style={{ cursor: "pointer" }}
                  onClick={handleClick}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Let's go"
                  )}
                </button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LetsGo;
