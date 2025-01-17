import React from "react";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useDispatch, useSelector } from "react-redux";
import { updateStepOne } from "../../redux/slices/createInterviewSlice";
import { RootState } from "../../redux/store";

const StepOne: React.FC = () => {
  const dispatch = useDispatch();
  const { title, salary, department } = useSelector((state: RootState) => state.createInterview.stepOne);

  const handleInputChange = (field: string, value: string) => {  
    dispatch(updateStepOne({ field, value }));
  };

  return (
    <div className="mt-10">
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            type="number"
            label="Salary"
            value={salary}
            onChange={(e) => handleInputChange("salary", e.target.value)}
            required
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Department"
            value={department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            required
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default StepOne;
