import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";

import "./index.css";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserProvider } from "./providers/UserContest";

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
          </Routes>
        </Layout>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
