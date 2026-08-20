import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { profileUrl } from "../api/Axios";

const Suggest = () => {
  const [showAll, setShowAll] = useState(false);
  const [user, setUser] = useState([]);
  const handleGetUser = async () => {
    try {
      const res = await profileUrl.get("/getSuggestion");

      setUser(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetUser();
  }, []);
  console.log(user);

  //   const users = [
  //     {
  //       id: 1,
  //       name: "John Doe",
  //       username: "@johndoe",
  //       image: "https://i.pravatar.cc/100?img=12",
  //     },
  //     {
  //       id: 2,
  //       name: "Alex Smith",
  //       username: "@alexsmith",
  //       image: "https://i.pravatar.cc/100?img=13",
  //     },
  //     {
  //       id: 3,
  //       name: "Sarah Wilson",
  //       username: "@sarahwilson",
  //       image: "https://i.pravatar.cc/100?img=14",
  //     },
  //     {
  //       id: 4,
  //       name: "David Brown",
  //       username: "@davidbrown",
  //       image: "https://i.pravatar.cc/100?img=15",
  //     },
  //     {
  //       id: 5,
  //       name: "Emma Watson",
  //       username: "@emmawatson",
  //       image: "https://i.pravatar.cc/100?img=16",
  //     },
  //     {
  //       id: 6,
  //       name: "Mike Johnson",
  //       username: "@mikejohnson",
  //       image: "https://i.pravatar.cc/100?img=17",
  //     },
  //   ];

  const visibleUsers = showAll ? user : user.slice(0, 3);

  return (
    <div className="w-full max-w-sm   rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <FaUserCircle className="text-xl text-gray-500" />

        <h1 className="flex-1 text-md font-light text-gray-800">Suggested</h1>

        <button className="text-sm font-medium text-blue-500 hover:text-blue-600">
          View All
        </button>
      </div>

      {/* Users */}
      <div className="space-y-4">
        {visibleUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            {/* Profile Image */}
            <img
              src={user.img}
              alt={user.name}
              className="h-11 w-11 cursor-pointer rounded-full object-cover"
            />

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-800">
                {user.name}
              </h2>

              <p className="text-xs text-gray-500">{user.username}</p>
            </div>

            {/* Follow Button */}
            <button className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
              <FaPlus className="text-xs" />
              <span>Follow</span>
            </button>
          </div>
        ))}
      </div>

      {/* Down / Up Arrow */}
      {user.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mx-auto mt-5 flex cursor-pointer items-center justify-center rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
        >
          {showAll ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      )}
    </div>
  );
};

export default Suggest;
