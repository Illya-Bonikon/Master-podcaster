import axios from 'axios';


const API_URL = 'https://4479-91-235-225-85.ngrok-free.app';

// --- AUTH ---
export const registerAPI = (data) => {
  	return axios.post(`${API_URL}/auth/register`, data);
};
export const login = (data) => {
  	return axios.post(`${API_URL}/auth/login`, data);
};

// --- PUBLIC PODCASTS ---
export const getPublicPodcasts = () => {
  	return axios.get(`${API_URL}/podcasts/public`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
};
export const searchPodcasts = (query) => {
  	return axios.get(`${API_URL}/podcasts/search`, { params: { query } });
};

// --- PODCASTS (JWT) ---
export const getPodcastById = (id, token ) => {
		return axios.get(`${API_URL}/podcasts/${id}`, { headers: { Authorization: `Bearer ${token}` ,  'ngrok-skip-browser-warning': 'true' }});
  };
export const createPodcast = (data, token) => {
  	return axios.post(`${API_URL}/podcasts`, data, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true'  } });
};
export const updatePodcast = (id, data, token) => {
  	return axios.patch(`${API_URL}/podcasts/${id}`, data, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true'  } });
};
export const deletePodcast = (id, token) => {
  	return axios.delete(`${API_URL}/podcasts/${id}`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true'  } });
};

// --- EPISODES ---
export const createEpisode = (podcastId, data, token) => {
  	return axios.post(`${API_URL}/podcasts/${podcastId}/episodes`, data, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true'  } });
};
export const getEpisodes = (podcastId, token) => {
	
	return axios.get(`${API_URL}/podcasts/${podcastId}/episodes`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true'  } });
};
export const getEpisode = (id) => {
  	return axios.get(`${API_URL}/episodes/${id}`);
};

// --- USERS ---
export const getMe = (token) => {
  	return axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true'  } });
};
export const updateMe = (data, token) => {
  	return axios.patch(`${API_URL}/users`, data, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true'  } });
};
export const getMyPodcasts = (token) => {
  	return axios.get(`${API_URL}/users/podcasts`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
}; 
export const getUsers = (token) => {
	return axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
};

// --- MEDIA PATH ---
export const getImageUrl = (mediaPath, token) => {
	return axios.get(`${API_URL}/${mediaPath}`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
};
export const getAudioUrl = (mediaPath, token) => {
	return axios.get(`${API_URL}/${mediaPath}`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
};
export { API_URL };
