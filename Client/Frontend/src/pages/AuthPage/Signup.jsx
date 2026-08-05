import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import SocialIcons from "./SocialIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSignInput,
  loginSuccess,
  SetSigninInput,
} from "../../store/CreateSlice";
import { authUrl } from "../../api/Axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigte = useNavigate();
  // ===== Redux Setup --------==========
  const dispatch = useDispatch();

  const signinInputs = useSelector((state) => state.auth.SigninInput);

  const handleChange = (e) => {
    dispatch(
      SetSigninInput({
        field: e.target.name,
        value: e.target.value,
      }),
    );
  };

  // ========---- Request send to backend -----================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await authUrl.post("/signin", signinInputs);
      dispatch(clearSignInput());
      toast.success(res.data.message);
      dispatch(loginSuccess(res.data.user));
      dispatch(clearSignInput());
      navigte("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-8 sm:px-14">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Registration
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. arman123"
            name="username"
            value={signinInputs.username}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>

        <div className="relative">
          <input
            type="email"
            placeholder="name@example.com"
            name="email"
            value={signinInputs.email}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="e.g. MyPass123"
            name="password"
            value={signinInputs.password}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-md transition-colors mt-2"
        >
          Register
        </button>
      </form>
      <SocialIcons />
    </div>
  );
};

export default Signup;
