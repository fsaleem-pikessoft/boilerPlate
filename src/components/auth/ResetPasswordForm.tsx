"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import Input from "../common/Input";
import Button from "../common/Button";
import { CircularProgress, Stack } from "@mui/material";
import { toast } from "react-toastify";
import axios from "../../utils/axiosMiddleware";

interface ResetPasswordProps {
  token: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsSubmitDisabled(
      !(password && confirmPassword && password === confirmPassword)
    );
  }, [password, confirmPassword]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsLoading(true);
    if (password === confirmPassword) {
      const requestBody = {
        password: password,
        token: token,
      };

      try {
        const response = await axios.post("auth/reset-password", requestBody);
        toast.success(response?.data?.message);
        setIsLoading(false);
        router.push("/auth/login");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        setIsLoading(false);
      }
    } else {
      toast.error("Passwords do not match");
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e?.target?.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e?.target?.value);

  return (
    <div className="p-4 mx-auto flex flex-col md:flex-row w-full md:w-[80%] lg:w-[60%] max-w-4xl bg-transparent md:bg-white md:rounded-lg md:shadow-lg overflow-hidden">
      <div className="hidden lg:flex lg:flex-[0.45] items-center justify-center p-6">
        <Image
          src="/images/authentication/login-splash.png"
          alt="Login splash"
          width={300}
          height={250}
          className="w-auto"
        />
      </div>

      <div className="p-6 md:p-8 lg:flex-[0.55] w-full">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/virtuhire-logo-trimmed.png"
            alt="VirtuHire Logo"
            width={120}
            height={100}
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">Set Password</h1>

        <form onSubmit={handleSubmit} className="w-full">
          <Stack direction="column" spacing={2}>
            <Input
              inputRef={passwordRef}
              type={showPassword ? "text" : "password"}
              required
              autoComplete="off"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              startIcon={<Lock />}
              size="small"
              sx={{
                "& .MuiInputAdornment-root:first-of-type .MuiSvgIcon-root": {
                  transition: "fill 0.3s",
                },
                "&:focus-within .MuiInputAdornment-root:first-of-type .MuiSvgIcon-root":
                  {
                    fill: "rgb(59, 130, 246)",
                  },
              }}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                  disabled={isLoading} // Disable the button while loading
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </button>
              }
              className="mb-2 focus:border-[0.5px]"
            />
            <Input
              inputRef={confirmPasswordRef}
              type={showConfirmPassword ? "text" : "password"}
              required
              autoComplete="off"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              startIcon={<Lock />}
              size="small"
              sx={{
                "& .MuiInputAdornment-root:first-of-type .MuiSvgIcon-root": {
                  transition: "fill 0.3s",
                },
                "&:focus-within .MuiInputAdornment-root:first-of-type .MuiSvgIcon-root":
                  {
                    fill: "rgb(59, 130, 246)",
                  },
              }}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                  disabled={isLoading} // Disable the button while loading
                >
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </button>
              }
              className="mb-2 focus:border-[0.5px]"
            />
          </Stack>

          <div className="flex justify-between items-center my-4 float-right">
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

export default ResetPassword;
