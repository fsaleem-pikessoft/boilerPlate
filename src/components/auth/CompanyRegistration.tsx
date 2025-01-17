import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Card,
  TextField,
  FormControl,
  FormGroup,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { registerOrganization } from "../../api/registrationApi";
import { toast } from "react-toastify";
import Button from "../common/Button";
import { CompanyRegistrationData, RegistrationState } from "../../utils/interfaces/companyRegistrationInterfaces";


const CompanyRegistration = () => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const { userDetail } = useSelector((state: { registrationRegistration: RegistrationState }) => state.registrationRegistration);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    mutate: mutateRegisterOrganization,
  } = useMutation({
    mutationFn: (data: CompanyRegistrationData) => registerOrganization(data),
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      router.push("/auth/login");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err?.response?.data?.message || "An error occurred.");
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const form = e?.target as HTMLFormElement;

    const companyData: CompanyRegistrationData = {
      companyName: form?.companyName?.value,
      address: form?.address?.value,
      city: form?.city?.value,
      state: form?.state?.value,
      country: form?.country?.value,
      zipCode: form?.zipCode?.value,
      email: userDetail?.email || "",
      first_name: userDetail?.firstName || "",
      last_name: userDetail?.lastName || "",
      password: userDetail?.password || "",
      role: "super_admin",
      imageFile: imageFile || undefined,
    };

    setIsLoading(true);

    mutateRegisterOrganization(companyData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files ? e?.target?.files[0] : null;
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen m-4">
      <Card className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mx-auto">
        <div className="flex justify-center mb-2">
          <Image
            src="/images/virtuhire-logo-trimmed.png"
            alt="VirtuHire Logo"
            width={40}
            height={40}
          />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-center">Company Registration</h3>
        <FormControl component="form" onSubmit={handleSubmit} className="w-[400px]">
          <FormGroup>
            <TextField
              label="Company Name"
              name="companyName"
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="Address"
              name="address"
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="City"
              name="city"
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="State/Province"
              name="state"
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="Country"
              name="country"
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="Postal/Zipcode"
              name="zipCode"
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <label className="block mb-4">
              <span className="sr-only">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-600"
                onChange={handleFileChange}
                required
              />
            </label>
            <Button type="submit" fullWidth className="w-[100px]">
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Sign Up"
              )}
            </Button>
          </FormGroup>
        </FormControl>
      </Card>
    </div>
  );
};

export default CompanyRegistration;
