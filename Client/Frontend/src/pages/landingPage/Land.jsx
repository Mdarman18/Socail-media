import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiCompass, FiInfo, FiX } from "react-icons/fi";
import studySharpImage from "../../assets/logo.png";
import Main from "./Main";
import Features from "./Features";
import Footer from "../../components/Footer";

const Land = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Navbar */}

      <Main />
      <Features />
    </div>
  );
};

export default Land;
