// src/layouts/GuestLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer"; // Aapka Footer component
import GuestNavbar from "./GuestNavbar";

export default function GuestLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <GuestNavbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
