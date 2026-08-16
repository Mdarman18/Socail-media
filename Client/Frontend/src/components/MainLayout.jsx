import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <>
      <div className="flex  min-h-screen">
        <Navbar />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
