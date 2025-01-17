import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { AxiosError } from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Chip } from "@mui/material";
import { setIndustry } from "../../redux/slices/organizationRegistrationSlice";
import { organizationIndustries } from "../../api/organizationRegistrationApi";
import { INDUSTRY_SCREEN } from "../../utils/constants";
import { toast } from "react-toastify";
import { OrganizationRegistrationState } from "../../utils/interfaces/companyOnbordindInterfaces";

interface Industry {
  id: number;
  name: string;
}


const Industry: React.FC = () => {
  const dispatch = useDispatch();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const { industry } = useSelector(
    (state: { organizationRegistration: OrganizationRegistrationState }) =>
      state.organizationRegistration
  );

  const { mutate: mutateIndustries } = useMutation({
    mutationFn: organizationIndustries,
    onSuccess: (res) => {     
      setIndustries(res?.data?.records || []);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const handleToggleIndustry = (id: number) => {
    const selectedIndustries = industry || [];
    const updatedSelection = selectedIndustries.includes(id)
      ? selectedIndustries.filter((industryId) => industryId !== id)
      : [...selectedIndustries, id];
    dispatch(setIndustry(updatedSelection));
  };

  useEffect(() => {
    mutateIndustries();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <span className="font-extrabold text-xl text-headingColor">
            {INDUSTRY_SCREEN?.heading}
          </span>
        </Grid>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <p className="font-medium text-lg text-paragraphColor">
            {INDUSTRY_SCREEN?.paragraph}
          </p>
        </Grid>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          {industries.map(({ id, name }, index) => (
            <Chip
              key={id}
              label={name}
              onClick={() => handleToggleIndustry(id)}
              style={{
                margin: "4px",
                backgroundColor: industry.includes(id) ? "#F0F5FA" : "#FFFFFF",
                border: industry.includes(id)
                  ? "2px solid #F36B24"
                  : "1px solid #00000040",
                borderRadius: "4px",
              }}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Industry;
