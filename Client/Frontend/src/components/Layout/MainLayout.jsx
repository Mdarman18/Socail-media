import React from "react";
import { Outlet } from "react-router-dom";
import MobileNavbar from "../Navbar/MobileNavbar";
import Sidebar from "../Navbar/Side";
import Footer from "../Footer";
import TopNavbar from "../Navbar/Topbar";
import SearchModal from "../../common/Search";
import BottomNav from "../Navbar/Bottom";

export default function AppLayout() {
  return (
    <div className="min-h-screen  text-ink dark:text-slate-100 flex flex-col selection:bg-brand-100 selection:text-brand-600">
      <MobileNavbar />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
          <TopNavbar />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-5xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
        <BottomNav />
      </div>
      <SearchModal />
    </div>
  );
}
