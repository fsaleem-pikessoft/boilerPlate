import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { FormControl, TextField } from "@mui/material";
import { setNewHire } from "../../redux/slices/organizationRegistrationSlice";
import { NEW_HIRE_SCREEN } from "../../utils/constants";
import { OrganizationRegistrationState } from "../../utils/interfaces/companyOnbordindInterfaces";

const HiresPerYear: React.FC = () => {
  const dispatch = useDispatch();

  const { newHire } = useSelector(
    (state: { organizationRegistration: OrganizationRegistrationState }) =>
      state.organizationRegistration
  );

  const handleNewHireChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      dispatch(setNewHire(parseInt(value, 10)));
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <span className="font-extrabold text-xl text-headingColor">
            {NEW_HIRE_SCREEN?.heading}
          </span>
        </Grid>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <p className="font-medium text-lg text-paragraphColor">
            {NEW_HIRE_SCREEN?.paragraph}
          </p>
        </Grid>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <FormControl sx={{ m: 1, width: 300 }} variant="outlined">
            <TextField
              id="new-hire-textfield"
              type="number"
              value={newHire}
              onChange={handleNewHireChange}
              label="Number of new hires in a year?"
            />
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HiresPerYear;
