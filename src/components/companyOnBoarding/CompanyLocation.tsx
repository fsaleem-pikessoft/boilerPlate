import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { AxiosError } from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import { organizationCountries } from "../../api/organizationRegistrationApi";
import { setCountry } from "../../redux/slices/organizationRegistrationSlice";
import { COMPANY_LOCATION_SCREEN } from "../../utils/constants";
import { ToastContainer, toast } from "react-toastify";
import { OrganizationRegistrationState } from "../../utils/interfaces/companyOnbordindInterfaces";

const CompanyLocation: React.FC = () => {
  const dispatch = useDispatch();
  
  
  const [countries, setCountries] = useState<string[]>([]);
  
  
  const { country } = useSelector(
    (state: { organizationRegistration: OrganizationRegistrationState }) => state.organizationRegistration
  );

 
  const { mutate: mutateCountries } = useMutation({
    mutationFn: organizationCountries,
    onSuccess: (res) => {
      setCountries(res?.data?.countries || []);
      dispatch(setCountry(res?.data?.countries[0] || ""));
    },
    onError: (error: AxiosError<{ message: string }>)=> { 
      toast.error(error?.response?.data?.message || "An error occurred.");
    },
  });


  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event?.target?.value;
    dispatch(setCountry(value));
  };


  useEffect(() => {
    mutateCountries();
  }, [mutateCountries]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{xs:12}} className="text-left ml-[80px]">
          <span className="font-extrabold text-xl text-headingColor">
            {COMPANY_LOCATION_SCREEN?.heading}
          </span>
        </Grid>
        <Grid size={{xs:12}} className="text-left ml-[80px]">
          <p className="font-medium text-lg text-paragraphColor">
            {COMPANY_LOCATION_SCREEN?.paragraph}
          </p>
        </Grid>
        <Grid size={{xs:12}} className="text-left ml-[80px]">
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
              labelId="country-select-label"
              id="country-select"
              value={country}
              onChange={handleChange}
              input={<OutlinedInput label="Country" />}
            >
              {countries.map((name, index) => (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default CompanyLocation;
