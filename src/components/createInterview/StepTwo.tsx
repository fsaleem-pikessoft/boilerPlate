import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { updateStepTwo } from "../../redux/slices/createInterviewSlice";
import { RootState } from "../../redux/store";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { organizationIndustries } from "../../api/organizationRegistrationApi";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getAllBranches } from "../../api/branchesApi";

interface Branch {
  id: number;
  branchName: string;
}

interface Industry {
  id: number;
  name: string;
}


const StepTwo: React.FC= () => {
  const dispatch = useDispatch();
  const [getBranches, setBranches] = useState<Branch[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const stepTwo = useSelector((state: RootState) => state.createInterview.stepTwo);
  const { jobStatus, resumeStatus, startDate, endDate, industryId } = useSelector(
    (state: RootState) => state.createInterview.stepTwo
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

  const { mutate: mutateGetAllBranches } = useMutation({
    mutationFn: getAllBranches,
    onSuccess: (res) => {
      setBranches(res?.data?.records || []);    
      dispatch(updateStepTwo({ field:"branchValue", value:res?.data?.records?.[0]?.id || 0}));
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  useEffect(() => {
    mutateGetAllBranches();
    mutateIndustries();
  }, [mutateGetAllBranches,mutateIndustries]);

  const handleInputChange = (field: string, value: any) => {
    if (!value) {
      toast.error("All fields are required in Step Two.");
      return; 
    }
    dispatch(updateStepTwo({ field, value }));
  };  

  return (
    <div className="mt-10">
      <Grid container spacing={2}>      
        <Grid size={6}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="status">Job Status</InputLabel>
            <Select
              labelId="status"
              label="Job Status"
              value={jobStatus}
              onChange={(e) => handleInputChange("jobStatus", e.target.value)}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="close">Close</MenuItem>
            </Select>
          </FormControl>
        </Grid>
       
        <Grid size={6}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="branches-label">Branches</InputLabel>
            <Select
              labelId="branches-label"
              label="Branches"
              value={stepTwo?.branchValue}
              onChange={(e) => handleInputChange("branchValue", e?.target?.value)}
            >
              {getBranches.map((branch) => (
                <MenuItem key={branch?.id} value={branch?.id}>
                  {branch?.branchName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
     
        <Grid size={6}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="resume-status">Resume Status</InputLabel>
            <Select
              labelId="resume-status"
              label="Resume Status"
              value={resumeStatus}
              onChange={(e) => handleInputChange("resumeStatus", e?.target?.value)}
            >
              <MenuItem value="required">Required</MenuItem>
              <MenuItem value="optional">Optional</MenuItem>
              <MenuItem value="not-applicable">Not Applicable</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid size={6}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="industries-label">Industries</InputLabel>
            <Select
              labelId="industries-label"
              label="Industries"
              value={industryId || ""}
              onChange={(e) => handleInputChange("industryId", e?.target?.value)}
            >
              {industries.map(({ id, name }) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
       
        <Grid size={6}>
          <LocalizationProvider    dateAdapter={AdapterDayjs}>
            <DatePicker
            sx={{width:"100%"}}
              label="Start Date"              
              value={startDate ? dayjs(startDate) : null}
              minDate={dayjs()}
              onChange={(date) => handleInputChange("startDate", date?.toISOString() || null)}             
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid size={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
            sx={{width:"100%"}}
              label="End Date"
              value={endDate ? dayjs(endDate) : null}
              minDate={dayjs()}
              onChange={(date) => handleInputChange("endDate", date?.toISOString() || null)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </div>
  );
};

export default StepTwo;