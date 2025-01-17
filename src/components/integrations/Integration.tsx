import  React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Avatar, Card } from "@mui/material";
import {
  INTEGRATION_SCREEN,
  INTEGRATION_BAMBOOHR,
  INTEGRATION_GREENHOUSE,
  INTEGRATION_WORKPLACE,
  INTEGRATION_WORKDAY,
  INTEGRATION_SLACK,
  INTEGRATION_CALANDELY,
} from "../../utils/constants";

const Integrations: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, margin: "15px" }}>
      <Grid container spacing={2} className="mt-[30px] mb-[30px]">
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 7, xl: 7 }} className="text-center">
          <span className="font-semibold text-lg">{INTEGRATION_SCREEN.heading}</span>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5, xl: 5 }}></Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} sx={{ justifyContent: { xs: "center", md: "end", lg: "end", xl: "end" }, display: "flex" }}>
          <Card className="w-[200px] p-[15px] rounded" sx={{ boxShadow: 6 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Avatar
                  src={INTEGRATION_BAMBOOHR?.logo}
                  sx={{ width: 70 }}
                  variant="square"
                  imgProps={{ style: { objectFit: "contain" } }}
                />
              </Grid>
              <Grid size={12}>
                <span className="font-semibold text-primary ">{INTEGRATION_BAMBOOHR?.heading}</span>
              </Grid>
              <Grid size={12} className="mt-[-14px]">
                <p className="text-xs">{INTEGRATION_BAMBOOHR?.paragraph}</p>
              </Grid>
            </Grid>
          </Card>
        </Grid>
       
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2, xl: 2 }} sx={{ justifyContent: { xs: "center" }, display: "flex" }}>
          <Card className="w-[200px] p-[15px]" sx={{ boxShadow: 6 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Avatar src={INTEGRATION_GREENHOUSE?.logo} variant="square" />
              </Grid>
              <Grid size={12}>
                <span className="font-semibold text-primary ">{INTEGRATION_GREENHOUSE?.heading}</span>
              </Grid>
              <Grid size={12} className="mt-[-14px]">
                <p className="text-xs">{INTEGRATION_GREENHOUSE?.paragraph}</p>
              </Grid>
            </Grid>
          </Card>
        </Grid>
       
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} className="justify-items-start" sx={{ justifyContent: { xs: "center", md: "start" }, display: "flex" }}>
          <Card className="w-[200px] p-[15px]" sx={{ boxShadow: 6 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Avatar src={INTEGRATION_WORKPLACE?.logo} variant="square" />
              </Grid>
              <Grid size={12}>
                <span className="font-semibold text-primary ">{INTEGRATION_WORKPLACE?.heading}</span>
              </Grid>
              <Grid size={12} className="mt-[-14px]">
                <p className="text-xs">{INTEGRATION_WORKPLACE?.paragraph}</p>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} sx={{ justifyContent: { xs: "center", md: "end", lg: "end", xl: "end" }, display: "flex" }}>
          <Card className="w-[200px] p-[15px]" sx={{ boxShadow: 6, display: "flex", flexDirection: "column", height: "100%" }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Avatar
                  src={INTEGRATION_WORKDAY.logo}
                  sx={{ width: 70 }}
                  variant="square"
                  imgProps={{ style: { objectFit: "contain" } }}
                />
              </Grid>
              <Grid size={12}>
                <span className="font-semibold text-primary ">{INTEGRATION_WORKDAY?.heading}</span>
              </Grid>
              <Grid size={12} className="mt-[-14px]">
                <p className="text-xs">{INTEGRATION_WORKDAY?.paragraph}</p>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2, xl: 2 }} sx={{ justifyContent: { xs: "center" }, display: "flex" }}>
          <Card className="w-[200px] p-[15px]" sx={{ boxShadow: 6, display: "flex", flexDirection: "column", height: "100%" }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Avatar src={INTEGRATION_SLACK?.logo} variant="square" />
              </Grid>
              <Grid size={12}>
                <span className="font-semibold text-primary ">{INTEGRATION_SLACK?.heading}</span>
              </Grid>
              <Grid size={12} className="mt-[-14px]">
                <p className="text-xs">{INTEGRATION_SLACK?.paragraph}</p>
              </Grid>
            </Grid>
          </Card>
        </Grid>
   
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} sx={{ justifyContent: { xs: "center", md: "start" }, display: "flex" }}>
          <Card className="w-[200px] p-[15px]" sx={{ boxShadow: 6, display: "flex", flexDirection: "column", height: "100%" }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Avatar
                  src={INTEGRATION_CALANDELY?.logo}
                  sx={{ width: 70 }}
                  variant="square"
                  imgProps={{ style: { objectFit: "contain" } }}
                />
              </Grid>
              <Grid size={12}>
                <span className="font-semibold text-primary ">{INTEGRATION_CALANDELY?.heading}</span>
              </Grid>
              <Grid size={12} className="mt-[-14px]">
                <p className="text-xs">{INTEGRATION_CALANDELY?.paragraph}</p>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Integrations;
