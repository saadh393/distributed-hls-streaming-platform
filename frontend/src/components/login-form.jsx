import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/app-context";
import { postJson } from "../lib/api";

function ErrorMessage({ msg }) {
  if (!msg) {
    return null;
  }
  return <span className="text-xs text-red-500">{msg}</span>;
}

export function LoginForm({ className, ...props }) {
  const [error, setError] = useState({});
  const { setUserData } = useApp();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email) {
      return showError({ email: "You must provide your email" });
    }

    if (!password) {
      return showError({ password: "You must provide your password" });
    }

    try {
      const payload = { email, password };
      const data = await postJson("/auth/login", payload);

      setUserData(data);
      navigate("/");
    } catch (error) {
      if (error?.fieldErrors) {
        showError(error?.fieldErrors);
      }

      showError({ general: error.message });
    }
  }

  function showError(obj) {
    setError((e) => ({
      ...e,
      ...obj,
    }));

    setTimeout(() => {
      setError({});
    }, 4000);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" />
                <ErrorMessage msg={error?.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required />
                <ErrorMessage msg={error?.password} />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <ErrorMessage msg={error?.general} />
            </div>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
