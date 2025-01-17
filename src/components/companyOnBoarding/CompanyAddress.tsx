import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { FormControl, TextField } from "@mui/material";
import { setCompanyAdress } from "../../redux/slices/organizationRegistrationSlice";
import { COMPANY_ADDRESS_SCREEN } from "../../utils/constants";
import { OrganizationRegistrationState } from "../../utils/interfaces/companyOnbordindInterfaces";



const CompanyAddress: React.FC = () => {
  const dispatch = useDispatch();
  
  const { companyAdress } = useSelector(
    (state: { organizationRegistration: OrganizationRegistrationState }) => state.organizationRegistration
  );

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCompanyAdress(e?.target?.value));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{xs:12}} className="text-left ml-[80px]">
          <span className="font-extrabold text-xl text-headingColor">
            {COMPANY_ADDRESS_SCREEN.heading}
          </span>
        </Grid>
        <Grid size={{xs:12}} className="text-left ml-[80px]">
          <p className="font-medium text-lg text-paragraphColor">
            {COMPANY_ADDRESS_SCREEN.paragraph}
          </p>
        </Grid>
        <Grid size={{xs:12}} className="text-left ml-[80px]">
          <FormControl sx={{ m: 1, width: 300 }} variant="outlined">
            <TextField
              id="country-textfield"
              onChange={handleAddressChange}
              label="Address"
              value={companyAdress}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyAddress;