import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PostPage from "./pages/PostPage";
import ResetRequestPage from "./pages/ResetRequestPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
        <BrowserRouter>

            <Layout>
              <Routes>
                <Route path= "/"    element={<App/>} />,
                <Route path="track/:spotifyId" element={<PostPage type="track" />} />
                <Route path="playlist/:spotifyId" element={<PostPage type="playlist" />} />
                <Route path="album/:spotifyId" element={<PostPage type="album" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/request-reset" element={<ResetRequestPage />} />
                <Route path="/reset" element={<ResetPasswordPage />} />
              </Routes>

            </Layout>



    </BrowserRouter>

  </React.StrictMode>
);
