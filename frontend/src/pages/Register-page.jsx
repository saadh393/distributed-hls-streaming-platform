import { useNavigate } from "react-router";
import RegisterForm from "../components/register-form";
import { useApp } from "../context/app-context";

export default function RegisterPage() {
  const { user } = useApp();
  const navigate = useNavigate();

  if (user?.name) {
    navigate("/?msg=You are already Logged in");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
