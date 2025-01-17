import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { setEmployeeRange } from "../../redux/slices/organizationRegistrationSlice";
import { COMPANY_SIZE_SCREEN } from "../../utils/constants";
import { OrganizationRegistrationState } from "../../utils/interfaces/companyOnbordindInterfaces";
const CompanySize: React.FC = () => {
  const dispatch = useDispatch();
  

  const countries: string[] = ["0-10", "10-20", "20-50", "50-100"];

 
  const { employeeRange } = useSelector(
    (state: { organizationRegistration: OrganizationRegistrationState }) => state.organizationRegistration
  );

  
  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event?.target?.value;
    dispatch(setEmployeeRange(value));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{xs:12}} className="text-left ml-[80px]">
          <span className="font-extrabold text-xl text-headingColor">
            {COMPANY_SIZE_SCREEN?.heading}
          </span>
        </Grid>
        <Grid size={{xs:12}} className="text-left ml-[80px]">
          <p className="font-medium text-lg text-paragraphColor">
            {COMPANY_SIZE_SCREEN?.paragraph}
          </p>
        </Grid>
        <Grid size={{xs:12}} className="text-left ml-[80px]">
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="companySize-select-label">Company Size</InputLabel>
            <Select
              labelId="companySize-select-label"
              id="companySize-select"
              label="Company Size"
              value={employeeRange}
              onChange={handleChange}
            >
              {countries.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanySize;
