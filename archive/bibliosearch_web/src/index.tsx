import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";

import "./index.css";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserProvider } from "./providers/UserContest";
import { SearchPage } from "./pages/SearchPage";
import { FeedPage } from "./pages/FeedPage";
import { BookPage } from "./pages/BookPage";
import { SearchUserPage } from "./pages/SearchUserPage";     
import Profile from "./pages/Profile";
import UserProfile from './pages/UserProfile';

        
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/search_users/:query" element={<SearchUserPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/get_book/" element={<BookPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user_profile/:id" element={<UserProfile />} />
          </Routes>
        </Layout>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
