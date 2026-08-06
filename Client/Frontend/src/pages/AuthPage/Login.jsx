import { FaUser, FaLock } from "react-icons/fa";
import SocialIcons from "./SocialIcons";
import {
  clearLoginInput,
  loginSuccess,
  SetlogininInput,
} from "../../store/CreateSlice";
import { useDispatch, useSelector } from "react-redux";
import { authUrl } from "../../api/Axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Login = () => {
  const navigte = useNavigate();
  // ======-----State mangement using redux toolkit -----==========
  const dispatch = useDispatch();
  const loginInputs = useSelector((state) => state.auth.loginInput);

  const handleChange = (e) => {
    dispatch(SetlogininInput({ field: e.target.name, value: e.target.value }));
  };

  // ========---- Request send to backend -----================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authUrl.post("/login", loginInputs);
      toast.success(res.data.message);
      dispatch(clearLoginInput());
      dispatch(loginSuccess(res.data.user));

      navigte("/");
    } catch (error) {
      dispatch(clearLoginInput());
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };
  useEffect(() => {
    dispatch(clearLoginInput());
  }, []);
  return (
    <div className="w-full h-full flex flex-col justify-center px-8 sm:px-14">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Login
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="email"
            placeholder="name@example.com"
            name="email"
            value={loginInputs.email}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="e.g. MyPass123"
            name="password"
            value={loginInputs.password}
            onChange={handleChange}
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
          Signin
        </button>
      </form>

      <SocialIcons />
    </div>
  );
};

export default Login;
