import React, { useEffect } from "react";
import { PostSection } from "./PostSection";
import { persistor } from "../../store/store";
import Search from "../../components/Search";

const Home = () => {
  // Dummy stories data — baad mein API se aayega

  const stories = [
    { id: 1, name: "Your Story", isOwn: true },
    { id: 2, name: "Rahul", avatar: "" },
    { id: 3, name: "Priya", avatar: "" },
    { id: 4, name: "Aman", avatar: "" },
    { id: 5, name: "Simran", avatar: "" },
  ];

  return (
    <div className="min-h-screen w-full  ">
      {" "}
      <Search />
      <div className="mx-4 w-full max-w-full px-3 sm:px-4 md:px-0">
        {/* Story Section */}
        {/* <div className="z-20 hidden sm:block w-full -mx-3 border-b border-gray-200  px-3 py-3 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90 sm:-mx-4 sm:px-4 sm:py-4 md:mx-0 md:rounded-xl md:border md:px-4">
          <div className=" flex gap-3 overflow-x-auto sm:gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="flex shrink-0 flex-col items-center gap-1"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16 ${
                    story.isOwn
                      ? "border-2 border-dashed border-gray-300 dark:border-gray-600"
                      : "bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5"
                  }`}
                >
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                    {story.isOwn ? (
                      <span className="text-2xl text-gray-400">+</span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-500">
                        {story.name[0]}
                      </span>
                    )}
                  </div>
                </div>
                <span className="max-w-15 truncate text-[11px] text-gray-600 dark:text-gray-300 sm:text-xs">
                  {story.name}
                </span>
              </div>
            ))}
          </div>
        </div> */}

        {/* Post Section */}
        <div className="py-4 sm:py-6">
          <PostSection />
        </div>
      </div>
    </div>
  );
};

export default Home;
