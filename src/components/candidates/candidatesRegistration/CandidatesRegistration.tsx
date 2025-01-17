import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CandidateRegisterData } from "../../../utils/interfaces/candidatesRegistrationInterface";
import { candidateRegister } from "../../../api/candidatesRegistrationApi";
import Cookies from "js-cookie";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

const CandidatesRegistration = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.questionRecords.userId);
  const [formData, setFormData] = useState<CandidateRegisterData>({
    first_name: "",
    last_name: "",
    email: "",
    jobId: 0,
  });
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // Track checkbox state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const isFormValid = () => {
    return (
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      isCheckboxChecked
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { mutate: registerCandidate } = useMutation({
    mutationFn: (data: CandidateRegisterData) => candidateRegister(data),
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      setIsLoading(false);
      router.push(`/candidates/otp-verification/${id}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    Cookies.set("email", formData.email);

    formData.jobId = Number(userId);

    setIsLoading(true);
    registerCandidate(formData);
  };

  return (
    <div style={{ width: "70%" }}>
      <Grid container spacing={2}>
        <Grid size={{sm:12,xs:12,md:5,lg:5,xl:5}}>
          <Card className="w-full max-w-md mt-10 shadow-lg">
            <CardContent>
              <h1 className="text-2xl text-headingColor font-bold mb-4">
                Application Form
              </h1>
              <p className="text-paragraphColor mb-6">
                Please fill out the fields below to apply for this position.
              </p>
              <form className="space-y-4">
                <div>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    required
                    name="first_name"
                    onChange={handleChange}
                    InputProps={{ "aria-label": "First Name" }}
                  />
                </div>
                <div>
                  <TextField
                    label="Last Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    name="last_name"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    type="email"
                    name="email"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    required
                    className="ml-2 mr-2"
                    checked={isCheckboxChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label className="text-paragraphColor font-bold text-sm ">
                    I have read and accept the{" "}
                    <span className="text-primary" onClick={handleOpen}>
                      Privacy Policy
                    </span>
                  </label>
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      backgroundColor: isFormValid() ? "#F36B24" : "#B0B0B0",
                      color: "#ffffff",
                    }}
                    fullWidth
                    disabled={!isFormValid() || isLoading}
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} className="text-white" />
                    ) : (
                      "Register"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            display: { xs: "none", sm: "none",md: "flex", lg: "flex", xl: "flex" },
            justifyContent: "center",
          }}
          size={{sm:12,xs:12,md:7,lg:7,xl:7}}
        >
          <Image
            src="/images/registration-image.png"
            alt="VirtuHire"
            className="mt-10 mb-2"
            width={400}
            height={700}
            style={{ objectFit: "contain" }}
          />
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Privacy Policy</DialogTitle>
        <div className="p-4">
          <p>Your privacy policy text goes here. Please read it carefully.</p>
        </div>
        <div className="dialog-footer">
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default CandidatesRegistration;
