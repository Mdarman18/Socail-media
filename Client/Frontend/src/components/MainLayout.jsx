import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Search from "./Search";

export default function MainLayout() {
  return (
    <>
      <div className="flex flex-col sm:flex-row min-h-screen">

        <Navbar />

        <main className="flex-1 ">
          <Search/>
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}
