import { LoginForm } from "@/app/components/auth/login-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
