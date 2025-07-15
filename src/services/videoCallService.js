import axios from 'axios';
import config from '../config';
import authService from './authService';

// Create an axios instance for video calls
const videoCallService = (() => {
  const apiClient = axios.create({
    baseURL: config.API_URL + '/video-sessions',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Setup axios interceptors for authentication
  apiClient.interceptors.request.use(
    (config) => {
      const token = authService.getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log(`[VideoCallService] Adding token to ${config.url}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return {
    // Get a Stream Video token for the current user
    async getStreamToken() {
      try {
        // Try POST first (common for token endpoints)
        try {
          console.log('Attempting to get token via POST');
          const response = await apiClient.post('/token/');
          if (response.data && response.data.token) {
            console.log('Successfully got token via POST');
            return response.data.token;
          }
          throw new Error('Invalid token response from POST');
        } catch (postError) {
          // If we get a 405 Method Not Allowed, try GET instead
          if (postError.response && postError.response.status === 405) {
            console.log('POST method not allowed, trying GET instead');
            const getResponse = await apiClient.get('/token/');
            if (getResponse.data && getResponse.data.token) {
              console.log('Successfully got token via GET');
              return getResponse.data.token;
            }
            throw new Error('Invalid token response from GET');
          } else {
            // If not a 405 error, rethrow the original error
            throw postError;
          }
        }
      } catch (error) {
        console.error('Error getting Stream token:', error);
        throw error;
      }
    },

    // Create a video call room
    async createRoom(sessionId, options = {}) {
      try {
        const response = await apiClient.post('/create/', { 
          session_id: sessionId,
          name: options.name || `Session-${sessionId}`
        });
        return response.data;
      } catch (error) {
        console.error('Error creating room:', error);
        throw error;
      }
    },

    // Join a video call room as a participant
    async joinRoom(sessionId) {
      try {
        const response = await apiClient.post(`/join/${sessionId}/`);
        return response.data;
      } catch (error) {
        console.error(`Error joining room for session ${sessionId}:`, error);
        throw error;
      }
    },

    // Get room status
    async getRoomStatus(sessionId) {
      try {
        const response = await apiClient.get(`/status/${sessionId}/`);
        return response.data;
      } catch (error) {
        console.error(`Error getting room status for session ${sessionId}:`, error);
        throw error;
      }
    },

    // End a room
    async endRoom(sessionId) {
      try {
        const response = await apiClient.post(`/end/${sessionId}/`);
        return response.data;
      } catch (error) {
        console.error(`Error ending room for session ${sessionId}:`, error);
        throw error;
      }
    },

    // Get active video sessions
    async getActiveVideoSessions() {
      try {
        const response = await apiClient.get('/active/');
        // The backend returns either an array directly or a data.sessions object
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data && response.data.sessions) {
          return response.data.sessions;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error getting active video sessions:', error);
        // Return empty array instead of throwing to avoid breaking UI
        if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 405)) {
          console.log('Authentication or method issue with video sessions');
          return [];
        }
        throw error;
      }
    }
  };
})();

export default videoCallService; 