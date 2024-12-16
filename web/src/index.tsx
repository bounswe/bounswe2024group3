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
import { QuizPage } from "./pages/QuizPage";
import UserPage from "./pages/UserPage";
import ListPlaylistsPage from "./pages/ListPlaylistsPage"; 
import PlaylistDetailPage from "./pages/PlaylistDetailPage";
import MapPageWithRadius from "./pages/MapPage";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
        <BrowserRouter>
          <UserProvider>
            <Layout>
              <Routes>
                <Route path= "/"    element={<FeedPage/>} />,
                <Route path= "/quiz"    element={<QuizPage/>} />,
                <Route path="/feed" element={<FeedPage />} />
                <Route path="track/:spotifyId" element={<PostPage type="track" />} />
                <Route path="artist/:spotifyId" element={<PostPage type="artist" />} />
                <Route path="album/:spotifyId" element={<PostPage type="album" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/request-reset" element={<ResetRequestPage />} />
                <Route path="/reset" element={<ResetPasswordPage />} />
                <Route path="/search/:query" element={<SearchPage />} />
                <Route path="/profile" element={<UserPage />} />
                <Route path="/user/:user" element={<UserPage />} />
                <Route path="/view-playlist" element={<ListPlaylistsPage />} />
                <Route path="/view-playlist/:id" element={<PlaylistDetailPage />} />
                <Route path="/map" element={<MapPageWithRadius />} />

              
              </Routes>
            </Layout>
          </UserProvider>




    </BrowserRouter>

  </React.StrictMode>
);
