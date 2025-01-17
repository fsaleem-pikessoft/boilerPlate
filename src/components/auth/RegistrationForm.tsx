import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button, Card, CircularProgress } from "@mui/material";
import Container from "@mui/material/Container";
import { setUserDetail } from "../../redux/slices/organizationRegistrationSlice";
import NavBar from "../common/Navbar";
import { checkEmail } from "../../api/registrationApi";
import { CheckEmailData, UserData } from "../../utils/interfaces/userRegisterInterfaces";


const RegistrationForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateCheckEmail, } = useMutation({
    mutationFn: (data: CheckEmailData) => checkEmail(data),
    onSuccess: () => {
      setIsLoading(false);
      router.push("/auth/companyRegistration");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formElements = e.target as HTMLFormElement;
    const userData: UserData = {
      firstName: formElements?.firstName?.value,
      lastName: formElements?.lastName?.value,
      email: formElements?.email?.value,
      password: formElements?.password?.value,
    };
    setIsLoading(true);
    dispatch(setUserDetail(userData));

    const confirmPassword = formElements?.confirmPassword?.value;

    if (userData?.password !== confirmPassword) {
      toast.error("Passwords do not match!");
    } else {
      const data = {
        email: formElements?.email?.value,
      };

      mutateCheckEmail(data);
    }
  };

  return (
    <>
      <NavBar />

      <Container className="flex justify-center items-center min-h-[calc(100vh-64px)] mx-auto my-8 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row text-white rounded-none max-w-[1009px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden w-full">
          <Card
            className="flex flex-col w-full lg:w-[716px] h-auto lg:h-[800px]"
            style={{ backgroundColor: "#2563EB" }}
          >
            <div className="flex relative flex-col items-start px-6 lg:px-20 py-10 lg:py-16 w-full min-h-[400px] lg:min-h-[802px] bg-blue-600">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/78c184a81ccddaf930ac6dd667ffe2b84435771dfa6dd899cbfe8b37b2f3e5f9?placeholderIfAbsent=true&apiKey=0269c34153da4c15a607eb955665b5ab"
                alt=""
                className="object-cover absolute inset-0 size-full opacity-50"
              />
              <h1 className="relative text-[63px] sm:text-4xl lg:text-6xl text-white font-semibold tracking-tighter leading-tight lg:leading-[66px]">
                Welcome to our community
              </h1>
              <p className="relative mt-5 text-base lg:text-lg leading-7 lg:leading-8 text-slate-300 w-full lg:w-[430px]">
                Clarity gives you the blocks & components you need to create
                a truly professional website.
              </p>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/878201bf52f32b61124218dab5c6be792693d6610f1d775d8eec1c8049ee5303?placeholderIfAbsent=true&apiKey=0269c34153da4c15a607eb955665b5ab"
                alt=""
                className="object-contain mt-10 lg:mt-60 max-w-full aspect-[6.67] w-[147px]"
              />
              <blockquote className="relative mt-6 lg:mt-8 text-lg lg:text-xl leading-7 lg:leading-9 text-white">
                We love VirtuHire! Our HR were using it for their projects, some
                already knew what kind of design they want
              </blockquote>
              <div className="flex relative gap-4 items-start mt-6 lg:mt-7 text-sm leading-loose text-slate-300">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/c98cf91abd2e2cc79679016e4cf0f02abf02d3ae8aaf756c60e8eafd9adacd9a?placeholderIfAbsent=true&apiKey=0269c34153da4c15a607eb955665b5ab"
                  alt=""
                  className="object-contain shrink-0 self-start aspect-square rounded-[158px] w-[45px]"
                />
                <p className="self-end mt-4 lg:mt-6 basis-auto">
                  Co-Founder, Design.co
                </p>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col w-full lg:w-[516px] h-auto lg:h-[800px] px-4 lg:px-0 py-8 lg:py-0 overflow-y-auto">
            <header className="flex flex-col text-center pt-4 lg:pt-14 w-full">
              <h1 className="text-2xl font-semibold text-zinc-950">
                Create an account
              </h1>
              <p className="pt-2 w-full text-sm text-zinc-500">
                Enter your email below to create your account
              </p>
            </header>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col self-center w-full max-w-[355px] text-sm leading-none"
            >
              <div className="flex flex-col mt-4 w-full">
                <label className="block text-[14px] font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  required
                  className="self-stretch py-2 mt-2 px-3 w-full bg-white rounded-md border border-solid border-slate-300"
                />
              </div>
              <div className="flex flex-col mt-4 w-full">
                <label className="block text-[14px] font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  required
                  className="self-stretch py-2 mt-2 px-3 w-full bg-white rounded-md border border-solid border-slate-300"
                />
              </div>
              <div className="flex flex-col mt-4 w-full">
                <label className="block text-[14px] font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  required
                  className="self-stretch py-2 mt-2 px-3 w-full bg-white rounded-md border border-solid border-slate-300"
                />
              </div>
              <div className="block text-[14px] font-medium text-gray-700 flex flex-col mt-4 w-full">
                <label className="block text-[14px] font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  className="self-stretch py-2 mt-2 px-3 w-full bg-white rounded-md border border-solid border-slate-300"
                />
              </div>
              <div className="flex flex-col mt-4 w-full">
                <label className="block text-[14px] font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                  className="self-stretch py-2 mt-2 px-3 w-full bg-white rounded-md border border-solid border-slate-300"
                />
              </div>
              <div className="flex flex-col pt-6 w-full">
                <Button
                  type="submit"
                  className="flex justify-center items-center px-4 py-2.5 w-full bg-blue-600 rounded-md min-h-[36px] text-sm font-medium text-neutral-50"
                  sx={{
                    backgroundColor: "#2563EB",
                    color: "white",
                    "&:hover": { backgroundColor: "#1e40af" },
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} className="text-white" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default RegistrationForm;
