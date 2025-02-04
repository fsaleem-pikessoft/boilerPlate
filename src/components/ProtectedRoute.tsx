import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ComponentType } from "react";
import { ProtectedRouteProps } from "../utils/interfaces/protectedRouteInterfaces";

const ProtectedRoute = <P extends ProtectedRouteProps>(
  WrappedComponent: ComponentType<P>,
) => {
  const ProtectedRouteComponent = (props: P) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace("/login");
      }
    }, [user, router]);

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedRouteComponent;
};

export default ProtectedRoute;
