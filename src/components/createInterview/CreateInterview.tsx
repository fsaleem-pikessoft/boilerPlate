import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import { AxiosError } from "axios";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createInterview } from "../../api/jobsApi";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface InterviewData {
  title: string;
  salary: number;
  department: string;
  introUrl: string;
  branchId: number;
  description: string;
  resumeStatus: string;
  status: string;
  startDate: string;
  endDate: string;
  industryId: number;
}

const steps = [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }];

const CreateInterview: React.FC = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const stepOne = useSelector(
    (state: RootState) => state.createInterview.stepOne
  );
  const stepTwo = useSelector(
    (state: RootState) => state.createInterview.stepTwo
  );
  const stepThree = useSelector(
    (state: RootState) => state.createInterview.stepThree
  );

  const { mutate: mutateCreateInterview } = useMutation({
    mutationFn: (interviewData: InterviewData) =>
      createInterview(interviewData),
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      setIsLoading(false);
      router.push("/active-interviews");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "An error occurred");
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !stepOne.title ||
      !stepOne.salary ||
      !stepOne.department ||
      !stepTwo.jobStatus ||
      !stepTwo.branchValue ||
      !stepTwo.resumeStatus ||
      !stepTwo.industryId ||
      !stepTwo.startDate ||
      !stepTwo.endDate ||
      !stepThree.description
    ) {
      toast.error("Please fill all fields before submitting.");
      return;
    }
    const salary = Number(stepOne.salary);
    const industryId = Number(stepTwo.industryId);

    const interviewData: InterviewData = {
      title: stepOne.title,
      salary: salary || null,
      department: stepOne.department,
      introUrl: "",
      branchId: stepTwo.branchValue,
      description: stepThree.description,
      resumeStatus: stepTwo.resumeStatus,
      status: stepTwo.jobStatus,
      startDate: new Date(stepTwo.startDate).toISOString(),
      endDate: new Date(stepTwo.endDate).toISOString(),
      industryId: industryId || null,
    };
    setIsLoading(true);
    mutateCreateInterview(interviewData);
  };

  const handleNext = () => {
    console.log("Current Active Step:", activeStep);
    console.log("Step One Data:", stepOne);

    if (activeStep === 0) {
      if (!stepOne.title || !stepOne.salary || !stepOne.department) {
        toast.error("Please fill all fields in Step One.");
        return;
      }
    }

    if (activeStep === 1) {
      if (
        !stepTwo.jobStatus ||
        !stepTwo.branchValue ||
        !stepTwo.resumeStatus ||
        !stepTwo.industryId ||
        !stepTwo.startDate ||
        !stepTwo.endDate
      ) {
        toast.error("Please fill all fields in Step Two.");
        return;
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep === 1) {
      if (!stepOne.title || !stepOne.salary || !stepOne.department) {
        toast.error("Please fill all fields in Step One before going back.");
        return;
      }
    } else if (activeStep === 2) {
      if (
        !stepTwo.jobStatus ||
        !stepTwo.branchValue ||
        !stepTwo.resumeStatus ||
        !stepTwo.industryId ||
        !stepTwo.startDate ||
        !stepTwo.endDate
      ) {
        toast.error("Please fill all fields in Step Two before going back.");
        return;
      }
    }
  };

  return (
    <form className="m-[50px]" onSubmit={handleSubmit}>
      <Stepper activeStep={activeStep}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && <StepOne />}
      {activeStep === 1 && <StepTwo />}
      {activeStep === 2 && <StepThree />}
      <div className="mt-10">
        <Grid container spacing={2}>
          <Grid size={6}>
            <Button
              type="button"
              sx={{
                border: "1px solid black",
                color: "white",
                width: "170px",
                backgroundColor: "#0F416F",
              }}
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
          </Grid>
          {activeStep !== 2 && (
            <Grid size={6} sx={{ textAlignLast: "right" }}>
              <Button
                type="button"
                sx={{
                  border: "1px solid black",
                  color: "white",
                  width: "170px",
                  backgroundColor: "#0F416F",
                }}
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                Next
              </Button>
            </Grid>
          )}
          {activeStep === steps.length - 1 && (
            <Grid size={6} sx={{ textAlignLast: "right" }}>
              <Button
                type="submit"
                sx={{
                  border: "1px solid black",
                  color: "white",
                  width: "170px",
                  backgroundColor: "#F36B24",
                }}
              >
                Submit
              </Button>
            </Grid>
          )}
        </Grid>
      </div>
    </form>
  );
};

export default CreateInterview;
