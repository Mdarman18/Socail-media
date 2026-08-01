import { Typewriter } from "react-simple-typewriter";

const WelcomePanel = ({
  title,
  subtitle,
  buttonText,
  onToggle,
  roundedClass,
}) => {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center text-center px-8 bg-indigo-400 text-white ${roundedClass}`}
    >
      <h2 className="text-2xl font-bold mb-2">
        <Typewriter
          words={[title]}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={100}
          deleteSpeed={100}
          delaySpeed={2000}
        />
      </h2>
      <p className="text-sm text-indigo-100 mb-5">{subtitle}</p>
      <button
        type="button"
        onClick={onToggle}
        className="border border-white text-white text-sm font-medium px-8 py-2 rounded-md hover:bg-white hover:text-indigo-500 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default WelcomePanel;
