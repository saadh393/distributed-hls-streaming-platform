import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { List, Upload, Video } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { useApp } from "../context/app-context";
import LoginButton from "./login-btn";
import UserProfile from "./user-profile";

export function Sidebar({ onTabChange }) {
  const { user } = useApp();
  let location = useLocation();
  const activeTab = location.pathname;

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground">VideoHub</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to={"/"}>
          <Button
            variant={activeTab === "/" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              activeTab === "/"
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            onClick={() => onTabChange("videos")}
          >
            <Video className="h-4 w-4" />
            Videos
          </Button>
        </NavLink>

        <NavLink to={"/add-video"}>
          <Button
            variant={activeTab === "/add-video" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              activeTab === "/add-video"
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Upload className="h-4 w-4" />
            Add Video
          </Button>
        </NavLink>

        <NavLink to={"/manage-videos"}>
          <Button
            variant={activeTab === "/manage-videos" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              activeTab === "/manage-videos"
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <List className="h-4 w-4" />
            Manage Video
          </Button>
        </NavLink>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">{user ? <UserProfile /> : <LoginButton />}</div>
    </div>
  );
}
