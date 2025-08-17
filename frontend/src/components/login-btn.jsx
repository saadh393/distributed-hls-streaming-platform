import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";
import { NavLink } from "react-router";

export default function LoginButton() {
  return (
    <NavLink to={"/login"}>
      <Button
        variant={"ghost"}
        className={cn(
          "w-full justify-start  gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <LogIn className="h-4 w-4" />
        Login
      </Button>
    </NavLink>
  );
}
