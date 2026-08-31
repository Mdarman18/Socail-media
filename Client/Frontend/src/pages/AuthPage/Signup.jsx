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

  // 1. Loading state add kiya gaya hai
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 2. Request shuru hote hi loading true karein

    try {
      const data = await registerUser(formData);

      toast.success(data.message);
      dispatch(loginSuccess(data.user));
      // Navigate homepage par ho raha hai, component unmount hoga isliye loading reset ki zaroorat nahi hai
    } catch (error) {
      toast.error(error.message);
      setLoading(false); // 3. Error aane par loading band karein
    }
    // Note: Agar success hone par navigate nahi karte, toh yahan bhi finally block mein setLoading(false) lagana padta.
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
            disabled={loading} // Loading ke waqt input disable
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
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
            disabled={loading} // Loading ke waqt input disable
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
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
            disabled={loading} // Loading ke waqt input disable
            className="w-full bg-gray-100 rounded-md py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer hover:text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* 4. Button par loading check aur UI changes */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white text-sm font-medium py-2.5 rounded-md transition-colors mt-2 flex items-center justify-center ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              {/* CSS Spinner */}
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Registering...
            </span>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <SocialIcons />
    </div>
  );
};

export default Signup;
