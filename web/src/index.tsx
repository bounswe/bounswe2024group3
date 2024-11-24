import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PostPage from "./pages/PostPage";
import { SearchPage } from "./pages/SearchPage";
import { UserProvider } from "./providers/UserContext";
import ResetRequestPage from "./pages/ResetRequestPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { FeedPage } from "./pages/FeedPage";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
        <BrowserRouter>
          <UserProvider>
            <Layout>
              <Routes>
                <Route path= "/"    element={<App/>} />,
                <Route path="/feed" element={<FeedPage />} />
                <Route path="track/:spotifyId" element={<PostPage type="track" />} />
                <Route path="playlist/:spotifyId" element={<PostPage type="playlist" />} />
                <Route path="album/:spotifyId" element={<PostPage type="album" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/request-reset" element={<ResetRequestPage />} />
                <Route path="/reset" element={<ResetPasswordPage />} />
                <Route path="/search/:query" element={<SearchPage />} />
                
              </Routes>
            </Layout>
          </UserProvider>




    </BrowserRouter>

  </React.StrictMode>
);
