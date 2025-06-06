import axios from 'axios';
import {
  login,
  registerAPI,
  getPublicPodcasts,
  getPodcastById,
  createPodcast,
  updatePodcast,
  deletePodcast,
  createEpisode,
  getEpisodes,
  getMe,
  updateMe,
  getMyPodcasts,
  getImageUrl,
  getAudioUrl,
  uploadAudio
} from '../api';
jest.mock('axios');

describe('API Tests', () => {
  const mockToken = 'test-token';
  const mockData = { email: 'test@test.com', password: 'password123' };
  const mockPodcastData = { title: 'Test Podcast', description: 'Test Description' };
  const mockEpisodeData = { title: 'Test Episode', description: 'Test Description' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth API', () => {
    test('login success', async () => {
      const mockResponse = { data: { token: 'test-token', id: 1 } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await login(mockData);
      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), mockData);
    });

    test('login failure', async () => {
      const mockError = new Error('Invalid credentials');
      axios.post.mockRejectedValueOnce(mockError);

      await expect(login(mockData)).rejects.toThrow('Invalid credentials');
    });

    test('register success', async () => {
      const mockResponse = { data: { id: 1 } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await registerAPI(mockData);
      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/auth/register'), mockData);
    });
  });

  describe('Podcasts API', () => {
    test('getPublicPodcasts success', async () => {
      const mockResponse = { data: [{ id: 1, title: 'Test Podcast' }] };
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await getPublicPodcasts();
      expect(result).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/podcasts/public'), expect.any(Object));
    });

    test('getPodcastById success', async () => {
      const mockResponse = { data: { id: 1, title: 'Test Podcast' } };
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await getPodcastById(1, mockToken);
      expect(result).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/podcasts/1'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`
          })
        })
      );
    });

    test('createPodcast success', async () => {
      const mockResponse = { data: { id: 1 } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await createPodcast(mockPodcastData, mockToken);
      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/podcasts'),
        mockPodcastData,
        expect.any(Object)
      );
    });
  });

  describe('Episodes API', () => {
    test('createEpisode success', async () => {
      const mockResponse = { data: { id: 1 } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await createEpisode(1, mockEpisodeData, mockToken);
      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/podcasts/1/episodes'),
        mockEpisodeData,
        expect.any(Object)
      );
    });

    test('getEpisodes success', async () => {
      const mockResponse = { data: [{ id: 1, title: 'Test Episode' }] };
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await getEpisodes(1, mockToken);
      expect(result).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/podcasts/1/episodes'),
        expect.any(Object)
      );
    });
  });

  describe('User API', () => {
    test('getMe success', async () => {
      const mockResponse = { data: { id: 1, email: 'test@test.com' } };
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await getMe(mockToken);
      expect(result).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.any(Object)
      );
    });

    test('updateMe success', async () => {
      const mockResponse = { data: { id: 1, email: 'updated@test.com' } };
      axios.patch.mockResolvedValueOnce(mockResponse);

      const result = await updateMe({ email: 'updated@test.com' }, mockToken);
      expect(result).toEqual(mockResponse);
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        { email: 'updated@test.com' },
        expect.any(Object)
      );
    });
  });

  describe('Media API', () => {
    test('getImageUrl formats correctly', () => {
      const testCases = [
        { input: 'media/image/test.jpg', expected: expect.stringContaining('/media/image/test.jpg') },
        { input: 'image/test.jpg', expected: expect.stringContaining('/media/image/test.jpg') },
        { input: '/media/image/test.jpg', expected: expect.stringContaining('/media/image/test.jpg') },
        { input: '/image/test.jpg', expected: expect.stringContaining('/media/image/test.jpg') },
        { input: 'test.jpg', expected: expect.stringContaining('/media/image/test.jpg') }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(getImageUrl(input)).toEqual(expected);
      });
    });

    test('uploadAudio success', async () => {
      const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mp3' });
      const mockResponse = { data: { url: 'test-url' } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await uploadAudio(mockFile, mockToken);
      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/media/audio/upload'),
        expect.any(FormData),
        expect.any(Object)
      );
    });
  });
}); 