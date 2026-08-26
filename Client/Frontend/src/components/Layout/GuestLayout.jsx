// src/layouts/GuestLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer"; // Aapka Footer component
import Navbar from "../GuestNavbar";

export default function GuestLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
