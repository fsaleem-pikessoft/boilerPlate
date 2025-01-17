import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, CircularProgress, Stack } from "@mui/material";
import axios from "../../utils/axiosMiddleware";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Input from "../common/Input";
import Container from "@mui/material/Container";
const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    emailRef?.current?.focus();
  }, []);

  const validateEmail = (input = false) => {
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

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      return response.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An error occurred during login"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail()) {
      const loginResult = await loginUser(email, password);
      if (loginResult?.message) {
        router.push("/auth/otpVerification");
        Cookies.set("email", email);
        toast.success(loginResult?.message);
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Container className="min-h-screen flex items-center md:justify-center p-4">
      <div className="w-full flex flex-col gap-4 max-w-md  rounded-lg  p-10">
        <h3 className="text-lg font-bold mb-2 text-left">Login to VirtuHire</h3>

        <h3 className="text-lg font-bold mb-2 text-left">
          Get started for free, <br /> No credit card requires
        </h3>

        <h3 className="text-2xl font-bold mb-2 text-left">
          Let's <span className="text-[#F36B24]"> Sign you in</span>, <br />
          your meal awaits
        </h3>
        <p className="text-sm font-medium text-left text-zinc-500 mb-2">
          If you don't have an account <br /> please{" "}
          <a href="/auth/signup" className="text-[#F36B24]">
            Sign up here
          </a>
        </p>

        <form onSubmit={handleSubmit}>
          {!isEmailValid && (
            <p className="text-red-500 text-sm mb-2 ">
              Please enter a valid email
            </p>
          )}
          <Stack direction="column" spacing={3}>
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-[14px] font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                inputRef={emailRef}
                type="email"
                required
                autoComplete="off"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
                size="small"
                startIcon={null}
                endIcon={null}
                className="focus:border-[1px] focus:border-blue-500 w-full bg-[#EBEBEB]  "
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
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-[14px] font-medium text-gray-700 "
              >
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="off"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                size="small"
                startIcon={null}
                inputRef={null}
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
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </button>
                }
                className="mb-2 focus:border-[0.5px] w-full  bg-[#EBEBEB]  rounded-lg "
              />
            </div>
          </Stack>

          <a
            href="/auth/forgotPassword"
            className="text-sm text-gray-700 hover:underline"
          >
            Forgot Password
          </a>

          <div className="flex justify-between w-full my-4 mt-6">
            <Button
              type="submit"
              size="large"
              className="w-full font-bold h-12"
              sx={{ backgroundColor: "#0F416F", color: "white" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Sign In"
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
      </div>
      <div className="hidden md:block relative w-full rounded-lg p-10">
        <Image
          src="/images/virtuhire-logo-trimmed.png"
          alt="VirtuHire Login Image"
          width={959}
          height={640}
          className="rounded-lg"
        />
        <div className="absolute lg:inset-32 flex items-end justify-start">
          <p className="text-white text-slate-700 mt-4 lg:mt-0 lg:text-white text-sm lg:text-4xl  px-4 py-2 rounded-lg ">
            The most productive way to evaluate qualified potential job
            candidates
          </p>
        </div>
      </div>
    </Container>
  );
};

export default LoginForm;
