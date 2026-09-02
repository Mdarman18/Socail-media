import React from "react";
import { PostSection } from "./PostSection";
import Search from "../../components/Search";

const Home = () => {

  return (
    <div className="min-h-screen w-full bg-surface-background text-on-surface font-body-md text-body-md antialiased selection:bg-primary-container selection:text-white">
      <div className="py-4 sm:py-6">
        <PostSection />
      </div>
    </div>
  );
};
export default Home;
