import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType, FC } from "react";

interface AuthContext {
  user: {
    email?: string;
  } | null;
}

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
): FC<P> => {
  const WithAuthComponent: FC<P> = (props) => {
    const { user } = useAuth() as AuthContext;
    const router = useRouter();

    useEffect(() => {
      if (!user?.email) {
        router.push("/auth/login");
      }
    }, [user, router]);

    if (!user?.email) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
