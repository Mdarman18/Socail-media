// data/NavbarData.jsx
import {
  FaHome,
  FaUser,
  FaEnvelope,
  FaSearch,
  FaHeadphones,
  FaBookmark,
  FaArrowCircleDown,
  FaCheckSquare,
  FaUsers,
  FaEdit,
  FaChartArea,
} from "react-icons/fa";
import { MdOutlineMenu } from "react-icons/md";

export const NavbarData = [
  {
    text: "HOME",
    path: "/",
    Icon: FaHome,
  },
  {
    text: "DASHBOARDS",
    path: "/search",
    Icon: FaChartArea,
  },

  {
    text: "FOCUS ROOM",
    path: "/room",
    Icon: FaHeadphones,
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

export const educationData = [
  // --- School Level ---
  { id: 1, degree: "10th (Secondary School)" },
  { id: 2, degree: "11th (PCM / JEE)" },
  { id: 3, degree: "11th (PCB / NEET)" },
  { id: 4, degree: "11th (Commerce)" },
  { id: 5, degree: "11th (Arts / Humanities)" },
  { id: 6, degree: "12th (PCM / JEE)" },
  { id: 7, degree: "12th (PCB / NEET)" },
  { id: 8, degree: "12th (Commerce)" },
  { id: 9, degree: "12th (Arts / Humanities)" },

  // --- Computer Applications & IT ---
  { id: 10, degree: "BCA (Bachelor of Computer Applications)" },
  { id: 11, degree: "B.Sc (Computer Science)" },
  { id: 12, degree: "B.Sc (Information Technology)" },

  // --- Engineering / B.Tech Branches ---
  { id: 13, degree: "B.Tech (CSE - Computer Science & Engineering)" },
  { id: 14, degree: "B.Tech (AI & Machine Learning)" },
  { id: 15, degree: "B.Tech (Data Science)" },
  { id: 16, degree: "B.Tech (ECE - Electronics & Communication)" },
  { id: 17, degree: "B.Tech (EEE - Electrical & Electronics)" },
  { id: 18, degree: "B.Tech (ME - Mechanical Engineering)" },
  { id: 19, degree: "B.Tech (CE - Civil Engineering)" },
  { id: 20, degree: "B.Tech (IT - Information Technology)" },
  { id: 21, degree: "B.Tech (Chemical Engineering)" },
  { id: 22, degree: "B.Tech (Biotechnology)" },
  { id: 23, degree: "B.Tech (Aerospace Engineering)" },

  // --- Medical & Healthcare (NEET Stream) ---
  { id: 24, degree: "MBBS (Bachelor of Medicine & Bachelor of Surgery)" },
  { id: 25, degree: "BDS (Bachelor of Dental Surgery)" },
  { id: 26, degree: "BAMS (Ayurvedic Medicine & Surgery)" },
  { id: 27, degree: "BHMS (Homeopathic Medicine & Surgery)" },
  { id: 28, degree: "B.Pharm (Bachelor of Pharmacy)" },
  { id: 29, degree: "B.Sc (Nursing)" },
  { id: 30, degree: "BPT (Bachelor of Physiotherapy)" },

  // --- Management, Commerce & Arts (UG) ---
  { id: 31, degree: "BBA (Bachelor of Business Administration)" },
  { id: 32, degree: "B.Com (General / Honours)" },
  { id: 33, degree: "B.Sc (General Science)" },
  { id: 34, degree: "BA (Bachelor of Arts)" },
  { id: 35, degree: "B.Des (Bachelor of Design)" },

  // --- Post Graduate / Master's Level ---
  { id: 36, degree: "MCA (Master of Computer Applications)" },
  { id: 37, degree: "M.Tech (CSE - Computer Science)" },
  { id: 38, degree: "M.Tech (AI & Data Science)" },
];
import pic1 from "../assets/myself3.jpeg";
import pic2 from "../assets/saiyad.PNG";
import pic3 from "../assets/firdoush.PNG";
import pic4 from "../assets/nasir.PNG";
export const images = [pic1, pic2, pic3, pic4];
import doubt from "../assets/doubt.png";
import { FiMessageCircle } from "react-icons/fi";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import answer from "../assets/arman.png";
import message from "../assets/message.png";
import follow from "../assets/follow.png";
import place from "../assets/place.png";
// ========----------features section =========
export const featurePage = [
  {
    logo: BsFillPatchQuestionFill,
    text: "Ask Doubt",
    para: "Ask your doubts and get clear explanations easily.",
    img: doubt,

    iconBg: "bg-blue-500",
    iconColor: "text-white",
    cardBg: "bg-blue-950/40",
  },

  {
    logo: FaCheckSquare,
    text: "Solve Doubt",
    para: "Get accurate and easy-to-understand solutions.",
    img: answer,

    iconBg: "bg-green-500",
    iconColor: "text-white",
    cardBg: "bg-green-950/40",
  },
  {
    logo: FaUsers,
    text: "Connect",
    para: "Follow students, teacher, and learners with similar interests.",
    img: follow,

    iconBg: "bg-amber-400",
    iconColor: "text-white",
    cardBg: "bg-purple-950/40",
  },

  {
    logo: FiMessageCircle,
    text: "Message",
    para: "Connect and communicate with other learners.",
    img: message,

    iconBg: "bg-red-400",
    iconColor: "text-white",
    cardBg: "bg-purple-950/40",
  },
  {
    logo: FaEdit,
    text: "Blogs and Articles",
    para: "Write ans share blogs,articles and study resources",
    img: place,

    iconBg: "bg-blue-400",
    iconColor: "text-gray",
    cardBg: "bg-purple-950/40",
  },
];
