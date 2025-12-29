// layouts/MainLayout.jsx
import Navbar from "@/components/Navbar";
import FireParticles from "@/components/FireParticles";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <FireParticles />
      <Navbar />
      <div className="pt-24 sm:pt-28 md:pt-32">
        <Outlet />
      </div>
    </>
  );
}
