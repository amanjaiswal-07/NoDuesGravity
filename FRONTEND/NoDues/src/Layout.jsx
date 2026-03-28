import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";

function getRoleFromPath(pathname) {
  // pathname examples: "/medical/pending", "/library", "/accounts/approved"
  const first = pathname.split("/").filter(Boolean)[0]; // "medical"
  return first || "";
}

export default function Layout() {
  const { pathname } = useLocation();
  const role = getRoleFromPath(pathname);

  // For login page or unknown routes, you can hide header
  const showHeader = role && role !== "";

  return (
    <div className="min-h-screen bg-neutral-900">
      {showHeader ? <Header role={role} /> : null}

      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
