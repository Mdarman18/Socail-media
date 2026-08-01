import { FaUser, FaLock } from "react-icons/fa";
import SocialIcons from "./SocialIcons";

const Login = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center px-8 sm:px-14">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Login
      </h2>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>

        <div className="text-center">
          <a href="#" className="text-xs text-gray-400 hover:text-indigo-500">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 cursor-pointer hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-md transition-colors"
        >
          Login
        </button>
      </form>

      <SocialIcons />
    </div>
  );
};

export default Login;