// import { useState, ChangeEvent, FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { toast } from "react-toastify";
// import { FormControlLabel, Checkbox } from "@mui/material";
// import { Button, Card, CircularProgress } from "@mui/material";
// import Container from "@mui/material/Container";
// import axios from "../../../utils/axiosMiddleware";
// import { useAuth } from "../../../contexts/AuthContext";
// import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
// import { FormData } from "../../../utils/interfaces/signUpInterfaces";

// const SignUpForm = () => {
//   const router = useRouter();

//   const { user } = useAuth();

//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

//   const [formData, setFormData] = useState<FormData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState<string>("");

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));

//     const updatedFormData = {
//       ...formData,
//       [name]: value,
//     };
//     setIsSubmitDisabled(!updatedFormData.email || !updatedFormData.password);
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     if (formData?.password !== formData?.confirmPassword) {
//       toast.error("Passwords do not match");
//       setIsLoading(false);
//       return;
//     }

//     const requestBody = {
//       email: formData?.email,
//       firstName: formData?.firstName,
//       lastName: formData?.lastName,
//       userSettings: {
//         isTwoFactorAuth: true,
//       },
//     };

//     try {
//       const response = await axios.post(`auth/register`, requestBody);
//       toast.success(response?.data?.message);
//       setIsLoading(false);
//       router.push("/auth/login");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "An error occurred during registration"
//       );
//       setIsLoading(false);
//     }
//   };

//   if (user?.email) {
//     return <LoadingSpinner isVisible={true} />;
//   }

//   return (
//     <>
//       <Container className="flex justify-center items-center min-h-[calc(100vh-64px)] mx-auto my-8 px-4 lg:px-8">
//         <div className="flex flex-col lg:flex-row text-white rounded-none max-w-[1009px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden w-full">
//           <Card
//             className="flex flex-col w-full lg:w-[600px] h-auto lg:h-[600px]"
//             style={{ backgroundColor: "#2563EB" }}
//           >
//             <div className="flex relative flex-col items-start px-6 lg:px-20 py-10 lg:py-16 w-full min-h-[400px] lg:min-h-[802px] bg-blue-600">
//               <img
//                 loading="lazy"
//                 src="https://cdn.builder.io/api/v1/image/assets/TEMP/78c184a81ccddaf930ac6dd667ffe2b84435771dfa6dd899cbfe8b37b2f3e5f9?placeholderIfAbsent=true&apiKey=0269c34153da4c15a607eb955665b5ab"
//                 alt=""
//                 className="object-cover absolute inset-0 h-[600px] w-[600px] opacity-1000"
//               />
//               <h1 className="relative text-3xl sm:text-4xl lg:text-[50px] text-white font-semibold tracking-tighter leading-tight lg:leading-[50px]">
//                 Welcome to our community
//               </h1>
//               <p className="relative mt-1 text-base lg:text-[13px] leading-7 lg:leading-6 text-slate-300 w-full lg:w-[430px]">
//                 Clarity gives you the blocks & components you <br /> need to
//                 create a truly professional website.
//               </p>
//               <img
//                 loading="lazy"
//                 src="https://cdn.builder.io/api/v1/image/assets/TEMP/878201bf52f32b61124218dab5c6be792693d6610f1d775d8eec1c8049ee5303?placeholderIfAbsent=true&apiKey=0269c34153da4c15a607eb955665b5ab"
//                 alt=""
//                 className="object-contain mt-2 lg:mt-20 max-w-full aspect-[6.67] w-[147px]"
//               />
//               <blockquote className="relative mt-6 lg:mt-6 text-[13px] lg:text-xl leading-7 lg:leading-7 text-white">
//                 "We love VirtuHire! Our HR were using it for their projects,
//                 so we already knew what kind of design they want."
//               </blockquote>
//               <div className="flex relative gap-4 items-start mt-6 lg:mt-7 text-sm leading-loose text-slate-300">
//                 <img
//                   loading="lazy"
//                   src="https://cdn.builder.io/api/v1/image/assets/TEMP/c98cf91abd2e2cc79679016e4cf0f02abf02d3ae8aaf756c60e8eafd9adacd9a?placeholderIfAbsent=true&apiKey=0269c34153da4c15a607eb955665b5ab"
//                   alt=""
//                   className="object-contain shrink-0 self-start aspect-square rounded-[158px] w-[45px]"
//                 />
//                 <p className="self-end mt-2 lg:mt-6 basis-auto">
//                   Co-Founder, Design.co
//                 </p>
//               </div>
//             </div>
//           </Card>

//           <Card className="flex flex-col w-full lg:w-[630px] h-auto lg:h-[600px] px-4 lg:px-0 py-8 lg:py-0 overflow-y-auto ">
//             <header className="flex flex-col pt-4 lg:pt-14 flex flex-col self-center w-full max-w-[355px] text-sm leading-none">
//               <h1 className="text-2xl text-[30px] font-semibold text-zinc-950">
//                 Join Clarity
//               </h1>
//               <p className="pt-2 w-full text-sm text-zinc-500">
//                 Clarity gives you the blocks and components you <br /> need to
//                 create a truly professional website.
//               </p>
//             </header>

//             <form
//               onSubmit={handleSubmit}
//               className="flex flex-col self-center w-full max-w-[355px] text-sm leading-none"
//             >
//               <div className="flex flex-col mt-6 w-full">
//                 <label className="font-bold text-slate-900">Full name</label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData?.firstName}
//                   onChange={handleChange}
//                   placeholder="Enter full name"
//                   required
//                   className="self-stretch py-3 mt-3 px-3 w-full bg-white rounded-md border border-solid border-slate-300"
//                 />
//               </div>
//               <div className="flex flex-col mt-4 w-full">
//                 <label className="font-bold text-slate-900">Email address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData?.email}
//                   onChange={handleChange}
//                   placeholder="Enter email"
//                   required
//                   className="self-stretch py-3 mt-3 px-3 w-full bg-white rounded-md border border-solid border-slate-300"
//                 />
//               </div>
//               <div className="flex flex-col mt-4 w-full">
//                 <label className="font-bold text-slate-900">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData?.password}
//                   onChange={handleChange}
//                   placeholder="Enter password"
//                   required
//                   className="self-stretch py-3 mt-3 px-3 w-full bg-white rounded-md border border-solid border-slate-300"
//                 />
//               </div>

//               <div className="flex justify-between items-center my-4">
//                 <FormControlLabel
//                   control={<Checkbox defaultChecked />}
//                   label="Remember me"
//                 />
//                 <Link href="/auth/forgotPassword" passHref>
//                   <span className="text-blue-600 font-semibold hover:underline">
//                     Forgot password?
//                   </span>
//                 </Link>
//               </div>

//               <Button
//                 type="submit"
//                 sx={{
//                   backgroundColor:
//                     isLoading || isSubmitDisabled ? "#E5E7EB" : "#2563EB",
//                   color: isLoading || isSubmitDisabled ? "#dcdee0" : "white",
//                   "&:hover": {
//                     backgroundColor:
//                       isLoading || isSubmitDisabled ? "#E5E7EB" : "#2563EB",
//                   },
//                 }}
//                 disabled={isLoading || isSubmitDisabled}
//                 fullWidth
//                 variant="contained"
//                 size="large"
//               >
//                 {isLoading ? <CircularProgress size={25} color="inherit" /> : "Create Account"}
//               </Button>

//               <div className="mt-6">
//                 <p className="text-sm font-normal text-slate-500">
//                   Already have an account?{" "}
//                   <Link href="/auth/login" passHref>
//                     <span className="text-blue-600 font-semibold hover:underline">
//                       Log in
//                     </span>
//                   </Link>
//                 </p>
//               </div>
//             </form>
//           </Card>
//         </div>
//       </Container>
//     </>
//   );
// };

// export default SignUpForm;
