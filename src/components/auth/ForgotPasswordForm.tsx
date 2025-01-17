import { useState, useEffect, useRef, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Email } from "@mui/icons-material";
import Input from "../common/Input";
import Button from "../../components/common/Button";
import { CircularProgress, Stack } from "@mui/material";
import axios from "../../utils/axiosMiddleware";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    emailRef?.current?.focus();
  }, []);

  const validateEmail = (): boolean => {
    if (email === "") {
      setIsEmailValid(true);
      setIsSubmitDisabled(true);
      return false;
    } else {
      const pattern = /^[a-zA-Z0-9\.\-%+_]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
      const valid = pattern.test(email);
      setIsEmailValid(valid);
      setIsSubmitDisabled(!valid);
      return valid;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail()) {
      setIsLoading(false);
      return;
    }

    const requestBody = {
      email: email,
    };

    try {
      const response = await axios.post("auth/forgot-password", requestBody);
      toast.success("Password reset email sent");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 mx-auto flex flex-col md:flex-row w-full md:w-[70%] lg:w-[60%] max-w-3xl bg-transparent md:bg-white md:rounded-lg md:shadow-lg overflow-hidden">
      <div className="hidden lg:flex lg:flex-[0.45] items-center justify-center">
        <Image
          src="/images/authentication/forgot-password-splash.png"
          alt="Login splash"
          width={300}
          height={250}
          className="w-auto"
        />
      </div>

      <div className="p-6 md:p-8 flex-[0.55]">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/virtuhire-logo-trimmed.png"
            alt="VirtuHire Logo"
            width={120}
            height={100}
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Forgot Password</h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Enter your email address below to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="w-full">
          {!isEmailValid && (
            <p className="text-red-500 text-sm mb-2">
              Please enter a valid email
            </p>
          )}
          <Stack direction="column" spacing={2}>
            <Input
              inputRef={emailRef}
              type="email"
              required
              autoComplete="off"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              onBlur={validateEmail}
              onInput={validateEmail}
              startIcon={<Email />}
              endIcon={null}
              size="small"
              className="focus:border-[1px] focus:border-blue-500"
              sx={{
                "& .MuiInputAdornment-root:first-of-type .MuiSvgIcon-root": {
                  transition: "fill 0.3s",
                },
                "&:focus-within .MuiInputAdornment-root:first-of-type .MuiSvgIcon-root":
                  {
                    fill: "rgb(59, 130, 246)",
                  },
              }}
            />
          </Stack>

          <div className="flex justify-between items-center mt-6">
            <Link href="/auth/login" passHref>
              <span className="text-sm md:text-base font-bold hover:text-blue-500">
                Return to Sign-In
              </span>
            </Link>
            <Button type="submit" disabled={isSubmitDisabled || isLoading}>
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
