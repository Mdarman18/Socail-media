import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import SocialIcons from "./SocialIcons";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/CreateSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../Service/userService";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state for form inputs
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(formData);

      toast.success(data.message);
      dispatch(loginSuccess(data.user));
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Component mount hone par form clear karne ke liye
  useEffect(() => {
    setFormData({ username: "", email: "", password: "" });
  }, []);

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
            value={formData.username}
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
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>

        {/* Password Field with Hide/Show Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="e.g. MyPass123"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {/* Lock icon ko left thoda shift kiya ya toggle icon ko right position kiya taaki overlap na ho */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer hover:text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
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
