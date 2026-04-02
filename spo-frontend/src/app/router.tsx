import Layout from "./Layout.tsx";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../page/HomePage.tsx";
import PlaylistDetailPage from "../page/PlaylistDetailPage.tsx";
import NotFound from "../page/NotFound.tsx";
import CommunityHome from "../page/CommunityHome.tsx";
import SectionPage from "../features/home/pages/SectionPage/SectionPage.tsx";
import LoginPage from "../features/auth/pages/LoginPage.tsx";
import ProfilePage from "../page/ProfilePage.tsx";
import SignupPage from "../features/auth/pages/SignupPage.tsx";
import SearchPage from "../page/SearchPage.tsx";
import DailyTrackPage from "../page/DailyTrackPage.tsx";
import ProfileSectionPage from "../features/profile/pages/ProfileSectionPage.tsx";
import BalanceGamePage from "../page/BalanceGamePage.tsx";
import BalanceGameResultPage from "../features/profile/pages/BalanceGameResultPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/me/taste-profile/",
    children: [
      {
        path: ":id",
        element: <BalanceGamePage />,
      },
      {
        path: "result",
        element: <BalanceGameResultPage />,
      },
    ],
  },

  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "detail/:source/:id",
        element: <PlaylistDetailPage />,
      },
      {
        path: "community",
        element: <CommunityHome />,
      },
      {
        path: "section/:id",
        element: <SectionPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "me/:id",
        element: <ProfileSectionPage />,
      },
      {
        path: "search/:id",
        element: <SearchPage />,
      },
      {
        path: "today",
        element: <DailyTrackPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
