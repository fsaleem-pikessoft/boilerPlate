import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Stack } from "@mui/material";
import { Button, CircularProgress } from "@mui/material";
import Input from "../common/Input";
import Container from "@mui/material/Container";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import Image from "next/image";
import PasswordValidator from "../../utils/formValidators/passwordValidator";
import { FormData } from "../../utils/interfaces/signUpInterfaces";
import axios from "../../utils/axiosMiddleware";
import { toast } from "react-toastify";

const SignUpForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
  });

  if (user?.email) {
    return <LoadingSpinner isVisible={true} />;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setIsSubmitDisabled(!updatedFormData.email || !updatedFormData.password);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(isValidPassword);
    if (!isValidPassword) {
      toast.error("Password does not meet the requirements");
      setIsLoading(false);
      return;
    }
    const requestBody = {
      email: formData?.email,
      fullName: formData?.fullName,
      password: formData?.password,
      role: "organization_admin",
      userSettings: {
        isTwoFactorAuth: true,
      },
    };

    try {
      // Using a Mock API to simulate the registration process
      // const response = await axios.post(`https://asdasd.free.beeceptor.com`, requestBody);
      const response = await axios.post(`auth/register`, requestBody);
      toast.success(response?.data?.message);
      setIsLoading(false);
      router.push("/auth/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during registration"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center bg-white">
      {/* Left Section */}
      <Container
        sx={{
          width: "100vw",

          display: "flex",
          flexDirection: "column",
          gap: 2,
          mx: "auto",
          my: "auto",
          pt: 8,
          borderRadius: 2,
          "@media (min-width: 960px)": {
            width: "30vw",
          },
        }}
        className="  rounded-lg"
      >
        <h3 className="text-lg font-bold  text-left">Signup to VirtuHire</h3>
        <h3 className="text-lg font-bold  text-left">
          Get started for free, <br /> No credit card required
        </h3>
        <h3 className="text-2xl font-bold text-left">
          Let's <span className="text-[#F36B24]">Sign you up</span>, <br />
          your meal awaits
        </h3>
        <p className="text-sm font-medium text-left text-zinc-500 mb-2">
          If you already have an account <br />
          please{" "}
          <a href="/auth/login" className="text-[#F36B24]">
            Signin here
          </a>
        </p>

        <form onSubmit={handleSubmit} className="h-full bg-white">
          <Stack direction="column" spacing={3}>
            <div className="space-y-1">
              <label
                htmlFor="fullName"
                className="block text-[14px] font-medium text-gray-700"
              >
                Full name
              </label>
              <Input
                id="fullName"
                type="text"
                required
                name="fullName"
                autoComplete="off"
                placeholder="Enter full name"
                size="small"
                className="focus:border-[1px] focus:border-blue-500 w-full bg-[#EBEBEB]"
                startIcon={null}
                endIcon={null}
                inputRef={null}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-[14px] font-medium text-gray-700"
              >
                Work Email Address
              </label>
              <Input
                id="email"
                type="email"
                required
                name="email"
                autoComplete="off"
                placeholder="Enter email"
                size="small"
                className="focus:border-[1px] focus:border-blue-500 w-full bg-[#EBEBEB]"
                startIcon={null}
                endIcon={null}
                inputRef={null}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-[14px] font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                name="password"
                value={formData?.password}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Password"
                size="small"
                className="mb-2 focus:border-[0.5px] w-full bg-[#EBEBEB] rounded-lg"
                startIcon={null}
                endIcon={null}
                inputRef={null}
              />

              {formData?.password && formData?.password.length > 0 && (
                <PasswordValidator
                  password={formData?.password}
                  isValidHook={setIsValidPassword}
                />
              )}
            </div>
          </Stack>

          <div className="flex   justify-between w-full my-4 mt-6 h-full">
            <Button
              type="submit"
              size="large"
              className="w-full font-bold h-12"
              sx={{
                backgroundColor: "#0F416F",
                color: (theme) =>
                  isLoading || isSubmitDisabled
                    ? theme.palette.grey[400]
                    : "white",
                "&:disabled": {
                  backgroundColor: "#0F416F",
                  color: "#e8f2fc",
                },
              }}
              disabled={isLoading || isSubmitDisabled}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-zinc-500 mt-6 mb-10">
            By clicking continue, you agree to <br /> our{" "}
            <a
              href="https://ui.shadcn.com/terms"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="https://ui.shadcn.com/privacy"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </Container>

      {/* Right Section */}
      <div className="hidden md:flex w-[70vw] relative rounded-lg h-full bg-white">
        <Image
          src="/images/signup-image-no-text.png"
          alt="VirtuHire Login Image"
          layout="fill"
          objectFit="cover"
          className="rounded-none"
        />
        <div className="absolute lg:inset-8 flex items-end justify-start">
          <Image
            src="/images/testimonials-with-logo.png"
            alt="VirtuHire Login Image"
            height={600}
            width={600}
            className="text-white text-slate-700 mt-4 lg:mt-0 lg:text-white text-sm lg:text-4xl px-4 py-2 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
