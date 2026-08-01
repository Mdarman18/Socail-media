import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const icons = [FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn];

const SocialIcons = () => {
  return (
    <div className="mt-5">
      <p className="text-center text-xs text-gray-400 mb-3">
        or login with social platforms
      </p>
      <div className="flex justify-center gap-3">
        {icons.map((Icon, i) => (
          <button
            key={i}
            type="button"
            className="w-9 h-9 cursor-pointer flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
          >
            <Icon size={14} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialIcons;