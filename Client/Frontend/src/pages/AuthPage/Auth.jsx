import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import Signup from "./Signup";
import WelcomePanel from "./Welcome";


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center  p-4">
      {/* ---------- Desktop / tablet: sliding card ---------- */}
      <div className="hidden md:block relative w-full max-w-3xl h-120 rounded-4xl overflow-hidden shadow-2xl bg-white">
        {/* Form side */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full"
          animate={{ x: isLogin ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.5 }}
              className="w-full h-full"
            >
              {isLogin ? <Login /> : <Signup />}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Colored welcome side */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full"
          animate={{ x: isLogin ? "0%" : "100%" }}
          transition={{ type: "spring", stiffness: 80, damping: 32 }}
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="welcome-login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.5 }}
                className="w-full h-full"
              >
                <WelcomePanel
                  title="Hello, Welcome!"
                  subtitle="Don't have an account?"
                  buttonText="Register"
                  onToggle={() => setIsLogin(false)}
                  roundedClass="rounded-tr-[100px] rounded-br-[100px] rounded-tl-[32px] rounded-bl-[32px]"
                />
              </motion.div>
            ) : (
              <motion.div
                key="welcome-register"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.5 }}
                className="w-full h-full"
              >
                <WelcomePanel
                  title="Welcome Back!"
                  subtitle="Already have an account?"
                  buttonText="Login"
                  onToggle={() => setIsLogin(true)}
                  roundedClass="rounded-tl-[100px] rounded-bl-[100px] rounded-tr-[32px] rounded-br-[32px]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ---------- Mobile: stacked card ---------- */}
      <div className="md:hidden w-full max-w-sm rounded-[28px] overflow-hidden shadow-xl bg-white">
        <div className="h-56 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="mobile-welcome-login"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <WelcomePanel
                  title="Hello, Welcome!"
                  subtitle="Don't have an account?"
                  buttonText="Register"
                  onToggle={() => setIsLogin(false)}
                  roundedClass="rounded-b-[60px]"
                />
              </motion.div>
            ) : (
              <motion.div
                key="mobile-welcome-register"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <WelcomePanel
                  title="Welcome Back!"
                  subtitle="Already have an account?"
                  buttonText="Login"
                  onToggle={() => setIsLogin(true)}
                  roundedClass="rounded-b-[60px]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="py-6 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "mobile-login" : "mobile-register"}
              initial={{ opacity: 0, x: isLogin ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? -40 : 40 }}
              transition={{ duration: 0.35 }}
            >
              {isLogin ? <Login /> : <Signup />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;