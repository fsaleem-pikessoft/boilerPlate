import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { FormControl, TextField } from "@mui/material";
import { setCompanyName, setCompanyNameError } from "../../redux/slices/organizationRegistrationSlice";
import { checkCompanyName } from "../../api/organizationRegistrationApi";
import { COMPANY_NAME_SCREEN } from "../../utils/constants";
import { CompanyNameRequest } from "../../utils/interfaces/companyOnbordindInterfaces";

 

interface ErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
}

interface OrganizationRegistrationState {
  companyName: string;
}

const CompanyName: React.FC = () => {
  const dispatch = useDispatch();
  const { companyName } = useSelector(
    (state: { organizationRegistration: OrganizationRegistrationState }) => state.organizationRegistration
  );
  const [error, setError] = useState<string>("");

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: mutateCheckCompanyName } = useMutation({
    mutationFn: (data: CompanyNameRequest) => checkCompanyName(data),
    onSuccess: () => {
      setError("");
      dispatch(setCompanyNameError(false));
    },
    onError: (error: ErrorResponse) => {
      setError(error?.response?.data?.message || "An error occurred");
      dispatch(setCompanyNameError(true));
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value;
    dispatch(setCompanyName(newValue));

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      const data: CompanyNameRequest = { organizationName: newValue };
      mutateCheckCompanyName(data);
    }, 1000);
  };


  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <span className="font-extrabold text-xl text-headingColor">
            {COMPANY_NAME_SCREEN?.heading}
          </span>
        </Grid>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <p className="font-medium text-lg text-paragraphColor">
            {COMPANY_NAME_SCREEN?.paragraph}
          </p>
        </Grid>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <FormControl sx={{ m: 1, width: 300 }} variant="outlined">
            <TextField
              id="company-name-textfield"
              value={companyName}
              onChange={handleChange}
              label="Company Name"
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyName;
