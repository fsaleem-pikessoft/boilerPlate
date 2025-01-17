import React from "react";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid2";
import { Card } from "@mui/material";
import Image from "next/image";
import VideocamIcon from "@mui/icons-material/Videocam";
import { THANKS_SCREEN } from "../../utils/constants";

const Thanks = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/createInterview");
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 8 }}>
        <Grid size={{ xs: 12 }} className="text-center mt-[20px]">
          <p className="font-semibold text-lg">{THANKS_SCREEN.heading}</p>
        </Grid>
        <Grid>
          <Image
            src={THANKS_SCREEN.logo}
            alt="VirtuHire"
            layout="responsive"
            width={1000}
            height={500}
            className="mt-7 object-contain"
          />
        </Grid>
      </Grid>
      <Grid size={{ xs: 4 }} className="justify-items-center">
        <Card
          className="p-[20px] mt-[170px] m-[20px]"
          style={{ backgroundColor: "rgba(243, 107, 36, 0.25)" }}
        >
          <button
            className="flex items-center bg-white text-black p-2 rounded"
            style={{ borderRadius: "20px" }}
            onClick={handleClick}
          >
            <VideocamIcon className="text-black ml-2" />
            <span className="ml-2">Create an Interview</span>
            <span
              className="material-icons text-white rounded-full px-2 ml-2"
              style={{ backgroundColor: "rgba(243, 107, 36, 1)" }}
            >
              star
            </span>
          </button>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Thanks;
