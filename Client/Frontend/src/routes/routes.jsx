import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import GuestLayout from "../components/Layout/GuestLayout";
import ProtectedRoute from "./Protectedroute";
import GuestRoutes from "./Guestroutes";

// --- Loading Spinner Component for Suspense Fallback ---
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-surface-darkCard">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      <p className="text-sm font-medium text-gray-500 animate-pulse">
        Loading StudySharp...
      </p>
    </div>
  </div>
);

// --- Lazy Loaded Pages ---
const Home = lazy(() => import("../pages/Home/Home"));
const Profile = lazy(() => import("../pages/Profile"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const Message = lazy(() => import("../pages/Message"));
const Demo = lazy(() => import("../pages/Home/demo"));
const Comment = lazy(() => import("../pages/Home/Comment"));

// Capital C rakha hai component naming rule ke mutabiq
const Community = lazy(() => import("../pages/community/Community"));

const Land = lazy(() => import("../pages/landingPage/Land"));
const Features = lazy(() => import("../pages/landingPage/Features"));
const AppLanding = lazy(() => import("../pages/landingPage/App"));
const About = lazy(() => import("../pages/landingPage/components/About"));
const AuthPage = lazy(() => import("../pages/AuthPage/Auth"));

export const routes = createBrowserRouter([
  // 1. Protected Routes (Login ke baad wale pages)
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "userProfile/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <UserProfile />
              </Suspense>
            ),
          },
          {
            path: "messages",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Message />
              </Suspense>
            ),
          },
          // Naya Community Route add kar diya gaya hai
          {
            path: "communities",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Community />
              </Suspense>
            ),
          },
          {
            path: "demo",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Demo />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  // 2. Guest Routes (Public Pages)
  {
    element: <GuestRoutes />,
    children: [
      {
        element: <GuestLayout />,
        children: [
          {
            path: "overview/study",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Land />
              </Suspense>
            ),
          },
          {
            path: "how-it-works",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AppLanding />
              </Suspense>
            ),
          },
          {
            path: "about",
            element: (
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthPage />
          </Suspense>
        ),
      },
    ],
  },
]);
