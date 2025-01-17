'use client';
import ResetPassword from "../../../../components/auth/ResetPasswordForm";
import { useParams } from "next/navigation";

const ResetPasswordPage = () => {
  const params = useParams();
  const token = params?.token?.toString() || "";

  return <ResetPassword token={token} />;
};

export default ResetPasswordPage;
