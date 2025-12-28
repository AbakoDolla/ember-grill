// layouts/MainLayout.jsx
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="pt-32">
        <Outlet />
      </div>
    </>
  );
}
