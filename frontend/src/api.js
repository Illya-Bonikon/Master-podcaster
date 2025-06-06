import axios from 'axios';


const API_URL = 'https://cc11-91-235-225-85.ngrok-free.app';

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
export const updatePodcast = (id,  token) => {
  	return axios.patch(`${API_URL}/podcasts/${id}`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true'  } });
};
export const deletePodcast = (id, token) => {
  	return axios.delete(`${API_URL}/podcasts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
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
export const getImageUrl = (mediaPath) => {
	if (!mediaPath) return '';
	if (mediaPath.startsWith('media/'))
		return `${API_URL}/${mediaPath}`;
	
	if (mediaPath.startsWith('image/'))
		return `${API_URL}/media/${mediaPath}`;

	if (mediaPath.startsWith('/media/'))
		return `${API_URL}${mediaPath}`;
	
	if (mediaPath.startsWith('/image/'))
		return `${API_URL}/media${mediaPath}`;

	return `${API_URL}/media/image/${mediaPath}`;
};

export const getAudioUrl = (mediaPath) => {
	if (!mediaPath) return '';
	if (mediaPath.startsWith('media/')) 
		return `${API_URL}/${mediaPath}`;
	if (mediaPath.startsWith('audio/'))
		return `${API_URL}/media/${mediaPath}`;
	
	if (mediaPath.startsWith('/media/'))
		return `${API_URL}${mediaPath}`;
	
	if (mediaPath.startsWith('/audio/'))
		return `${API_URL}/media${mediaPath}`;
	

	return `${API_URL}/media/audio/${mediaPath}`;
};

export const fetchImageFile = (mediaPath) => {
	return axios.get(getImageUrl(mediaPath), { headers: { 'ngrok-skip-browser-warning': 'true' }, responseType: 'blob' });
};

export const fetchAudioFile = (mediaPath) => {
	return axios.get(getAudioUrl(mediaPath), { headers: { 'ngrok-skip-browser-warning': 'true' }, responseType: 'blob' });
};

export const getAllUsers = (token) => {
	return axios.get(`${API_URL}/users/all`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
};

export const deleteUser = (id, token) => {
	return axios.delete(`${API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
};

export const getAllPodcasts = (token) => {
	return axios.get(`${API_URL}/podcasts`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
};

export const getAllPodcastsAdmin = (token) => {
	return axios.get(`${API_URL}/users/podcasts/all`, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
};

export const uploadAudio = (file, token) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/media/audio/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'multipart/form-data',
    },
  });
};

export { API_URL };
