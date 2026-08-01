// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="main-layout-wrapper">
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
