import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography, Stepper, Step, StepLabel, CircularProgress } from "@mui/material";
import { organizationRegistration } from "../../api/organizationRegistrationApi";
import { setCompanyNameError } from "../../redux/slices/organizationRegistrationSlice";
import CompanyLocation from "./CompanyLocation";
import CompanyAddress from "./CompanyAddress";
import CompanyName from "./CompanyName";
import Industry from "./Industry";
import CompanySize from "./CompanySize";
import HiresPerYear from "./HiresPerYear";
import Department from "./Department";
import { OrganizationRegistrationState, OrganizationRegistrationPayload } from "../../utils/interfaces/companyOnbordindInterfaces";
interface RootState {
  organizationRegistration: OrganizationRegistrationState;
}

interface StepType {
  label: string;
  content: React.ReactNode;
}


const steps: StepType[] = [
  { label: "Location", content: <CompanyLocation /> },
  { label: "Address", content: <CompanyAddress /> },
  { label: "Company Name", content: <CompanyName /> },
  { label: "Industry", content: <Industry /> },
  { label: "Company Size", content: <CompanySize /> },
  { label: "Number of new hires", content: <HiresPerYear /> },
  { label: "Branch", content: <Department /> },
];

const CompanyOnBoarding: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    companyAdress,
    companyName,
    country,
    employeeRange,
    industry,
    branchName,
    newHire,
    companyNameError,
  } = useSelector((state: RootState) => state.organizationRegistration);

  const { mutate: mutateRegisterOrganization } =
    useMutation({
      mutationFn: (data: OrganizationRegistrationPayload) => organizationRegistration(data),
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        setIsLoading(false);
        router.push("/company-details");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        toast.error(error?.response?.data?.message || "An error occurred");
        setIsLoading(false);
      },
    });

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, steps.length - 1)
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    dispatch(setCompanyNameError(false));
  };

  const handleSkip = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, steps.length - 1)
    );
  };

  const createPayload = () => ({
    organizationName: companyName,
    address: companyAdress,
    country: country,
    employeeRange: employeeRange,
    newHire: newHire,
    industryIds: industry,
    branchName: branchName,
  });

  const handleFinish = () => {
    const data = createPayload();
    setIsLoading(true);
    mutateRegisterOrganization(data);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} className="mt-12">
          <Stepper color="red" activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step
                key={step.label}
                style={{ color: "red" }}
                sx={{
                  "& .MuiStepIcon-root": {
                    color: index === activeStep + 1 ? "#F36B24" : "#F36B24",
                  },
                }}
              >
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className="mt-4 text-center" style={{ minHeight: "200px" }}>
            <Typography>{steps[activeStep]?.content}</Typography>
            <Grid container spacing={2} className="mt-20 mb-20" justifyContent="center">
              <Grid size={{ xs: 2 }}>
                <button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className="text-paragraphColor p-2"
                >
                  Back
                </button>
              </Grid>
              <Grid size={{ xs: 8 }} className="text-right">
                <button
                  onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
                  disabled={isLoading || companyNameError}
                  className={`w-[200px] h-[40px] text-white rounded ${isLoading || companyNameError ? 'bg-gray-300' : 'bg-secondary'}`}
                >
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : activeStep === steps.length - 1 ? (
                    "Finish"
                  ) : (
                    "Next"
                  )}
                </button>
              </Grid>
              {activeStep < steps.length - 1 && (
                <Grid size={{ xs: 2 }}>
                  <button
                    onClick={handleSkip}
                    className="text-paragraphColor p-2"
                    disabled={companyNameError}
                  >
                    Skip
                  </button>
                </Grid>
              )}
            </Grid>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyOnBoarding;
