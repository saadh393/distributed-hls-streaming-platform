import { LoginForm } from "@/components/login-form";
import { useNavigate } from "react-router";
import { useApp } from "../context/app-context";

export default function LoginPage() {
  const { user } = useApp();
  const navigate = useNavigate();

  if (user?.name) {
    navigate("/?msg=You are already Logged in");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
