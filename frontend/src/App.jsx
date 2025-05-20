import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import AuthLayout from "./components/Layout/AuthLayout";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import LibraryPage from "./components/Library/LibraryPage";
import ProfilePage from "./components/Profile/ProfilePage";
import PodcastList from "./components/Podcast/PodcastList";
import PodcastCreateForm from "./components/Podcast/PodcastCreateForm";
import PodcastDetails from "./components/Podcast/PodcastDetails";
import EpisodeCreateForm from "./components/Episode/EpisodeCreateForm";
import SearchPage from "./components/Search/SearchPage";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={
          <AuthLayout>
            <LoginForm onSubmit={data => alert(JSON.stringify(data))} />
          </AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout>
            <RegisterForm onSubmit={data => alert(JSON.stringify(data))} />
          </AuthLayout>
        } />

        <Route path="/" element={<MainLayout><PodcastList /></MainLayout>} />
        <Route path="/library" element={<MainLayout><LibraryPage /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
        <Route path="/podcast/create" element={<MainLayout><PodcastCreateForm onSubmit={data => alert(JSON.stringify(data))} /></MainLayout>} />
        <Route path="/podcast/:id" element={<MainLayout><PodcastDetails /></MainLayout>} />
        <Route path="/episode/create/:podcastId" element={<MainLayout><EpisodeCreateForm onSubmit={data => alert(JSON.stringify(data))} /></MainLayout>} />

        {/* 404 */}
        <Route path="*" element={<div style={{textAlign: 'center', marginTop: '3rem'}}>Сторінка не знайдена</div>} />
      </Routes>
    </Router>
  );
}

export default App;
