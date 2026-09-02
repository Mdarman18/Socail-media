import React from "react";
import { PostSection } from "./PostSection";
import Search from "../../components/Search";

const Home = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4400";
  console.log(API_URL);

  return (
    <div className="min-h-screen w-full bg-surface-background text-on-surface font-body-md text-body-md antialiased selection:bg-primary-container selection:text-white">
      <div className="py-4 sm:py-6">
        <PostSection />
      </div>
    </div>
  );
};
export default Home;
