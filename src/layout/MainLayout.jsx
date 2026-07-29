import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

/** Shared public layout.
 * Pages own their vertical rhythm; keeping this wrapper neutral prevents the
 * former double top-spacing below the fixed navigation.
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
