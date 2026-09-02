import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";
import { educationData } from "../data/data";
import { profileUrl } from "../api/Axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../store/CreateSlice";

export default function EditProfile({ edit, setEdit }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [image, setImage] = useState(null);

  const [imagePreview, setImagePreview] = useState(user?.img || "");

  const [formData, setFormData] = useState({
    nickname: user?.nickname || "",
    bio: user?.bio || "",
    location: user?.location || "",
    education: user?.education || "",
  });

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!edit) return null;

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Image Upload & Live Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setImagePreview(URL.createObjectURL(file));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submitted Profile Data:", formData);
    const data = new FormData();

    data.append("nickname", formData.nickname);
    data.append("bio", formData.bio);
    data.append("education", formData.education);
    data.append("location", formData.location);

    if (image) {
      data.append("img", image);
    }
    try {
      const res = await profileUrl.post("/edit", data);
      toast.success(res.data.message);
      dispatch(loginSuccess(res.data.user));

      setEdit(false);
    } catch (error) {}
  };
  // 14 Important Places List
  const places = [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Goa",
    "Jaipur",
    "Agra",
    "Kerala",
    "Varanasi",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Shimla",
    "Manali",
    "Rishikesh",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-5">
      {/* Modal */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Edit Profile
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Update your profile information
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEdit(false)}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-600"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-y-auto"
        >
          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column (Avatar Upload) */}
              <div className="flex flex-col items-center md:w-1/3 shrink-0">
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-violet-200 shadow-sm"
                />
                <div className="mt-4">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <label
                    htmlFor="profileImage"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium cursor-pointer hover:bg-violet-700 active:scale-95 transition-all duration-200 shadow-sm"
                  >
                    <FaCamera />
                    Change Photo
                  </label>
                </div>
              </div>

              {/* Right Column (Form Inputs Grid) */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nickname Input */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="nickname"
                      className="text-xs font-medium text-gray-600 px-1"
                    >
                      Nickname
                    </label>
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      placeholder="Enter nickname"
                      className="border border-gray-300 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                  </div>

                  {/* Education Dropdown Box */}
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center px-1">
                      <label
                        htmlFor="education"
                        className="text-xs font-medium text-gray-600"
                      >
                        Education
                      </label>
                      <span className="bg-violet-100 text-violet-700 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                        {educationData.length} Options
                      </span>
                    </div>

                    <select
                      name="education"
                      id="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer truncate transition-all"
                    >
                      <option value="" disabled>
                        Select Education
                      </option>
                      {educationData.map((item) => (
                        <option key={item.id} value={item.degree}>
                          {item.degree}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Select Box */}
                  <div className="flex flex-col gap-1 w-full md:col-span-2">
                    <div className="flex justify-between items-center px-1">
                      <label
                        htmlFor="location"
                        className="text-xs font-medium text-gray-600"
                      >
                        Location
                      </label>
                      <span className="bg-violet-100 text-violet-700 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                        {places.length} Places Available
                      </span>
                    </div>

                    <select
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer transition-all"
                    >
                      <option value="" disabled>
                        Select Location
                      </option>
                      {places.map((place, index) => (
                        <option key={index} value={place}>
                          {place}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bio Textarea */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="bio"
                    className="text-xs font-medium text-gray-600 px-1"
                  >
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-4 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-auto shrink-0">
            <button
              type="button"
              onClick={() => setEdit(false)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 active:scale-95 transition-all shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
