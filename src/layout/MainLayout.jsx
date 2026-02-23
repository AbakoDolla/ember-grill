// layouts/MainLayout.jsx
import Navbar from "@/components/Navbar";
import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

// Lazy load FireParticles to improve performance
const FireParticles = lazy(() => import("@/components/FireParticles"));

export default function MainLayout() {
  return (
    <>
      <Suspense fallback={
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-t from-orange-500/5 to-red-500/5" />
        </div>
      }>
        <FireParticles />
      </Suspense>
      <Navbar />
      <div className="pt-24 sm:pt-28 md:pt-32">
        <Outlet />
      </div>
    </>
  );
}
