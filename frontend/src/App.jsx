import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import BackgroundWaves from "./components/Layout/BackgroundWaves";
import MainLayout from "./components/Layout/MainLayout";
import AuthLayout from "./components/Layout/AuthLayout";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import LibraryPage from "./components/Library/LibraryPage";
import ProfilePage from "./components/Profile/ProfilePage";
import PodcastCreateForm from "./components/Podcast/PodcastCreateForm";
import PodcastDetails from "./components/Podcast/PodcastDetails";
import EpisodeCreateForm from "./components/Episode/EpisodeCreateForm";
import WelcomePage from './components/WelcomePage';
import GlobalPodcasts from './components/Podcast/GlobalPodcasts';
import AboutTeam from './components/Profile/AboutTeam';
import { UserProvider } from './components/UserContext.jsx';
import { PlayerProvider } from './components/Layout/PlayerContext.jsx';
import SearchPage from './components/SearchPage';
import UsersModal from './components/Layout/UsersModal';
import { useContext, useEffect } from 'react';
import { UserContext } from './components/UserContext.jsx';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';

function App() {
	const { isModerator } = useContext(UserContext);

	function ModeratorRedirect() {
		const navigate = useNavigate();
		const location = useLocation();
		useEffect(() => {
			if (isModerator && location.pathname === '/') 
				navigate('/users', { replace: true });
		}, [isModerator, location.pathname, navigate]);
		return null;
	}

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
		<UserProvider>
		<PlayerProvider>
		<Router>
		<BackgroundWaves />
		<ModeratorRedirect />
		<div style={{ position: 'relative', zIndex: 1 }}>
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
			<Route path="/" element={<AuthLayout><WelcomePage /></AuthLayout>} />
			{!isModerator && <Route path="/library" element={<MainLayout><LibraryPage /></MainLayout>} />}
			{!isModerator && <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />}
			{!isModerator && <Route path="/podcast/create" element={<MainLayout><PodcastCreateForm onSubmit={data => alert(JSON.stringify(data))} /></MainLayout>} />}
			{!isModerator && <Route path="/podcast/:id" element={<MainLayout><PodcastDetails /></MainLayout>} />}
			{!isModerator && <Route path="/podcast/:podcastId/episode/create" element={<MainLayout><EpisodeCreateForm onSubmit={data => alert(JSON.stringify(data))} /></MainLayout>} />}
			{!isModerator && <Route path="/global" element={<MainLayout><GlobalPodcasts /></MainLayout>} />}
			{!isModerator && <Route path="/about" element={<MainLayout><AboutTeam /></MainLayout>} />}
			<Route path="/searchpage" element={<MainLayout><SearchPage /></MainLayout>} />
			<Route path="/users" element={<MainLayout><UsersModal asPage={true} /></MainLayout>} />
			{/* 404 */}
			<Route path="*" element={<div style={{textAlign: 'center', marginTop: '3rem'}}>Сторінка не знайдена</div>} />
			</Routes>
		</div>
		</Router>
		</PlayerProvider>
		</UserProvider>
		</ErrorBoundary>
	);
}

export default App;
