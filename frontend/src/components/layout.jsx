import { Outlet } from "react-router";
import { Sidebar } from "./sidebar";

export default function Layout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
