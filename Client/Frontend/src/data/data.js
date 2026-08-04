// data/NavbarData.jsx
import {
  FaHome,
  FaUser,
  FaEnvelope,
  FaSearch,
  FaHeadphones,
  FaBookmark,
  FaArrowCircleDown,
} from "react-icons/fa";
import { MdOutlineMenu } from "react-icons/md";

export const NavbarData = [
  {
    text: "HOME",
    path: "/",
    Icon: FaHome,
  },
  {
    text: "FOCUS ROOM",
    path: "/room",
    Icon: FaHeadphones,
  },
  {
    text: "SEARCH",
    path: "/search",
    Icon: FaSearch,
  },

  {
    text: "MESSAGES",
    path: "/messages",
    Icon: FaEnvelope,
  },
  {
    text: "BOOKMARK",
    path: "/bookmark",
    Icon: FaBookmark,
  },
  {
    text: "PROFILE",
    path: "/profile",
    Icon: FaUser,
  },
  {
    text: "MORE",
    path: "/more",
    Icon: MdOutlineMenu,
  },
];
