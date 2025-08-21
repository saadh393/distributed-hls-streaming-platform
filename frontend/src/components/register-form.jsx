import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useMe from "../hooks/useMe";
import { postJson } from "../lib/api";
import { registrationSchema } from "../validation/registrationSchema";
import { Button } from "./ui/button";

export default function RegisterForm({ className, ...props }) {
  const { setUserData } = useMe();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting, isValid, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(registrationSchema), // Zod স্কিমা চালাবে
    mode: "onBlur", // blur-এ ফিল্ড চেক
    reValidateMode: "onChange", // চেঞ্জে আবার চেক
  });

  const [serverError, setServerError] = useState("");
  const [emailState, setEmailState] = useState("idle"); // idle | checking | ok | taken | error

  // Email পরিবর্তনে অটো-চেক (optional UX)
  const email = watch("email");
  useEffect(() => {
    setEmailState("idle");
  }, [email]);

  async function onSubmit(values) {
    setServerError("");

    // Zod transform + refine already ran via resolver.
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      const data = await postJson("/auth/register", payload);
      reset(); // form clear
      setUserData(data);
      navigate("/");
    } catch (err) {
      if (err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([name, message]) => setError(name, { type: "server", message }));
      }
      setServerError(err.message || "Something went wrong.");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Enter your account informations to create account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate aria-describedby="form-err">
            <div className="flex flex-col gap-6">
              {serverError && (
                <div id="form-err" role="alert" style={{ color: "#b00020", marginBottom: 12 }}>
                  {serverError}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="name">First name</Label>
                <Input id="name" {...register("name")} autoComplete="given-name" disabled={isSubmitting} />
                {errors.name && (
                  <div role="alert" className="text-xs text-red-500">
                    {errors.name.message}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  {...register("email")}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <div role="alert" className="text-xs text-red-500">
                    {errors.email.message}
                  </div>
                )}
                {emailState !== "idle" && (
                  <div aria-live="polite" style={{ fontSize: 12, marginTop: 4 }}>
                    {emailState === "checking" && "Checking availability…"}
                    {emailState === "ok" && "Looks good!"}
                    {emailState === "taken" && "Already registered."}
                    {emailState === "error" && "Could not verify email right now."}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <div role="alert" className="text-xs text-red-500">
                    {errors.password.message}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && (
                  <div role="alert" className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 16 }}>
                <Button
                  type="submit"
                  className={"w-full disabled:opacity-55"}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting ? "true" : "false"}
                >
                  {isSubmitting ? "Creating account…" : "Create account"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
