import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { FormControl, TextField } from "@mui/material";
import { setBranchName } from "../../redux/slices/organizationRegistrationSlice";
import { BRANCH_NAME_SCREEN } from "../../utils/constants";
import { OrganizationRegistrationState } from "../../utils/interfaces/companyOnbordindInterfaces";

const Department: React.FC = () => {
  const dispatch = useDispatch();

  const { branchName } = useSelector(
    (state: { organizationRegistration: OrganizationRegistrationState }) =>
      state.organizationRegistration
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBranchName(e.target.value));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <span className="font-extrabold text-xl text-headingColor">
            {BRANCH_NAME_SCREEN?.heading}
          </span>
        </Grid>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <p className="font-medium text-lg text-paragraphColor">
            {BRANCH_NAME_SCREEN?.paragraph}
          </p>
        </Grid>
        <Grid size={{ xs: 12 }} className="text-left ml-[80px]">
          <FormControl sx={{ m: 1, width: 300 }} variant="outlined">
            <TextField
              id="branch-name-textfield"
              onChange={handleChange}
              value={branchName}
              label="Branch Name"
            />
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Department;
