import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { CircularProgress, Stack } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Input from "../common/Input";
import Button from "../common/Button";
import axios from "../../utils/axiosMiddleware";
import { useAuth } from "../../contexts/AuthContext";
import { HEADER } from "../../utils/common";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const OTPVerificationForm = ({
  fromCandidateRegister,
}: {
  fromCandidateRegister?: boolean;
}) => {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState<string>("");
  const otpRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const { login, candidateLogin } = useAuth();
  let { id } = useParams();
  const email = Cookies.get("email");

  const uuId =useSelector((state: RootState) => state.questionRecords.uuId);

  useEffect(() => {
    otpRef.current?.focus();
  }, []);

  const handleApiCall = async (endpoint: string, payload: object) => {
    try {
      const response = await axios.post(endpoint, payload);
      return response?.data;
    } catch (error: any) {
      throw error?.response?.data?.message || "An error occurred";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = fromCandidateRegister
      ? "candidates/verification"
      : "auth/verify-otp/login_otp";
    const payload = { email, otp: otpCode };
    try {
      const data = await handleApiCall(endpoint, payload);
      if (data?.access_token) {
        if (fromCandidateRegister) {
          Cookies.set("token", data?.access_token);
          toast.success("Registered successfully");
          router.push(`/candidates/questions/${uuId}`);
          candidateLogin(data?.user);
        } else {
          Cookies.set("token", data?.access_token);
          login(data?.user);
          toast.success("Login successfully");
          const redirectUrl =
            data?.user?.organizationId == null
              ? "/lets-go"
              : "/company-details";
          router.push(redirectUrl);
        }
      }
    } catch (error) {
      toast.error(`Error during OTP verification: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (resendDisabled) return;
      setResendDisabled(true);
      const endpoint = fromCandidateRegister
        ? "candidates/re-send/otp"
        : "auth/resend-otp/login";
      const payload = { email };
      try {
        const response = await handleApiCall(endpoint, payload);
        if (response?.message) {
          toast.success(response?.message);
        }
      } catch (error: any) {
        toast.error(error || "An error occurred");
      } finally {
        setTimeout(() => setResendDisabled(false), 50000);
      }
    },
    [resendDisabled, fromCandidateRegister, email]
  );

  return (
    <div className="w-full h-full items-center justify-center flex">
      <div className="w-full md:w-[70%] lg:w-[60%] lg:p-0 bg-black md:p-6 mx-auto flex flex-col md:flex-row max-w-3xl bg-transparent md:bg-white md:rounded-lg md:shadow-lg overflow-hidden">
        <div className="hidden lg:flex lg:w-[900px] items-center justify-center bg-primary">
          <div className="flex relative flex-col px-14 pt-24 pb-24 w-full h-full max-md:px-5">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/108255c79b3ae39caa199dd6e34b3e5ce8b00091101116548ef69a40ac226519?placeholderIfAbsent=true&apiKey=0269c34153da4c15a607eb955665b5ab"
              alt="Background"
              className="object-cover absolute inset-0 w-full h-full"
            />
            <h2 className="relative self-start text-5xl font-semibold tracking-tighter leading-none text-white max-md:text-4xl">
              QUICK TIP #1
            </h2>
            <p className="relative mt-2 text-[11px] leading-5 text-slate-300">
              Focus on skills and cultural fit—choose candidates who align with
              your team's values and have the right expertise for the role.
            </p>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8 lg:w-[700px]">
          <div className="flex justify-center mb-2">
            <Image
              src={HEADER?.logo}
              alt="VirtuHire Logo"
              width={150}
              height={100}
              className="w-auto h-auto"
            />
          </div>
          <h4 className="text-[24px] md:text-[24px] font-semibold mb-2 text-center md:text-left">
            Verify {!fromCandidateRegister && "Login"}
          </h4>
          <p className="text-gray-600 text-[10px] mb-2 md:text-left">
            Please enter the code sent to your registered email address.
          </p>
          <form onSubmit={handleSubmit} className="w-full">
            <Stack direction="column" spacing={2}>
              <label
                htmlFor="otp"
                className="block text-[15px] font-semibold text-gray-700"
              >
                OTP
              </label>
              <Input
                inputRef={otpRef}
                type={showOtp ? "text" : "password"}
                required
                autoComplete="off"
                placeholder="Enter OTP code..."
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,4}$/.test(value)) {
                    setOtpCode(value);
                  }
                }}
                size="small"
                startIcon={null}
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="focus:outline-none"
                  >
                    {showOtp ? <Visibility /> : <VisibilityOff />}
                  </button>
                }
                className="focus:border-[0.5px] w-full"
                disabled={isLoading}
              />
            </Stack>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                className={`text-sm font-bold ${
                  resendDisabled ? "text-gray-400" : "text-primary"
                }`}
                onClick={handleResendCode}
                disabled={resendDisabled}
                style={{
                  padding: 0,
                  minWidth: 0,
                  textTransform: "none",
                }}
              >
                {resendDisabled ? "Wait to resend" : "Re-Send Code"}
              </button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-[31px] w-[105px]"
                sx={{ backgroundColor: "#F36B24", color: "#fff" }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Verify"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationForm;
