import React, { useEffect } from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid2";
import { THANKS_SCREEN } from "../../../utils/constants";
import Cookies from "js-cookie";

const InterviewCompleted = () => {
  useEffect(() => {
    return () => {
      Cookies.remove("token");
    };
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Grid size={{ xs: 12 }} className="text-center mt-[20px]">
          <p className="font-semibold text-lg">
            Thank You for Submitting Your Interview!
          </p>

          <p className="text-sm w-[50%] text-center m-auto">
            We have successfully received your interview submission. Our team
            will review it and get back to you shortly. Thank you for your time
            and effort!{" "}
          </p>
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
    </Grid>
  );
};
export default InterviewCompleted;
