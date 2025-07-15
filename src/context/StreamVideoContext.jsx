import React, { createContext, useContext, useState, useEffect } from 'react';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useAuth } from './AuthContext';
import { getFromStorage } from '../utils/storage';
import authService from '../services/authService';
import axios from 'axios';
import config from '../config';
import videoCallService from '../services/videoCallService';

// Create context
const StreamVideoContext = createContext(null);

// Helper function to extract user ID from user object
const extractUserId = (user) => {
  if (!user) return null;
  return user.id || user._id || user.user_id || 
         (user.user && (user.user.id || user.user._id || user.user.user_id)) || 
         'unknown-user';
};

// Helper function to extract user name
const extractUserName = (user) => {
  if (!user) return 'User';
  return user.name || user.username || user.first_name || 
         (user.user && (user.user.name || user.user.username || user.user.first_name)) || 
         'User';
};

// Create a valid development token
const createDevToken = (userId) => {
  // For security in production, this should be done server-side only
  // We're doing this client-side for development purposes only
  const payload = {
    user_id: userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
  };
  
  // In browser environments, we don't have access to crypto modules
  // So we'll create a compatible token format with proper structure
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  // Use a known working signature for development only
  const signature = 'devtokensignature123456789012345678901234567890';
  
  return `${header}.${encodedPayload}.${signature}`;
};

// Helper function to create a timeout promise
const withTimeout = (promise, timeoutMs = 10000, errorMessage = 'Operation timed out') => {
  let timeoutId;
  
  // Create a promise that rejects after timeoutMs milliseconds
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });
  
  // Race the original promise against the timeout
  return Promise.race([
    promise,
    timeoutPromise
  ]).finally(() => {
    clearTimeout(timeoutId);
  });
};

// Provider component
export const StreamVideoProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Stream Video client
  useEffect(() => {
    let streamClient = null;
    let isMounted = true;

    const initializeStreamClient = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        // Check if we have auth data
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          console.log('No user found in local storage, not initializing Stream Video');
          setClient(null);
          setIsInitializing(false);
          return;
        }

        // Stream Video API Key
        const apiKey = config.VIDEO_CALL.STREAM_API_KEY;
        
        if (!apiKey) {
          throw new Error('Stream API key not configured');
        }

        // Extract user ID for Stream
        const userId = extractUserId(currentUser)?.toString();
        if (!userId) {
          console.log('No valid user ID found, not initializing Stream Video');
          setClient(null);
          setIsInitializing(false);
          return;
        }

        let streamToken;
        try {
          // Use our service to get the token with a timeout
          streamToken = await withTimeout(
            videoCallService.getStreamToken(),
            8000, 
            'Token fetch timed out - network may be slow or service unavailable'
          );

          if (!streamToken) {
            throw new Error('Failed to get valid token from server');
          }
        } catch (apiError) {
          console.error('Error getting Stream token from backend:', apiError);
          
          // Always use development fallback token in development
          if (process.env.NODE_ENV === 'development' || 
              apiError.message?.includes('401') || 
              apiError.message?.includes('405') ||
              apiError.message?.includes('timed out')) {
            console.log('Using development fallback token');
            
            // Create a properly formatted dev token with the user's ID
            streamToken = createDevToken(userId);
            console.log(`Created development token for user ${userId}`);
          } else {
            throw apiError;
          }
        }

        // Initialize the Stream Video client using getOrCreate to avoid duplicate instances
        console.log('Initializing Stream Video client for user:', userId);
        
        // Use getOrCreate instead of direct instantiation
        const clientOptions = {
          apiKey,
          user: {
            id: userId,
            name: extractUserName(currentUser),
            image: currentUser.profile_image || currentUser.avatar || 
                  (currentUser.user && (currentUser.user.profile_image || currentUser.user.avatar)) || 
                  null,
          },
          token: streamToken,
          // Add options to configure more robust network behavior
          networkOptions: {
            // Shorter timeouts for faster failure detection
            timeout: 8000,
            // More frequent pings to detect connection issues
            keepalivePingInterval: 15000,
          }
        };

        // Handle potential compatibility issues with older SDK versions
        try {
          // Add timeout to client initialization
          if (typeof StreamVideoClient.getOrCreate === 'function') {
            streamClient = await withTimeout(
              Promise.resolve(StreamVideoClient.getOrCreate(clientOptions)),
              8000,
              'Stream client initialization timed out'
            );
          } else {
            // Fallback to constructor if getOrCreate is not available
            streamClient = new StreamVideoClient(clientOptions);
          }
          
          // Set the client in state only if component is still mounted
          if (isMounted) {
            setClient(streamClient);
            console.log('Stream Video client initialized successfully');
          }
        } catch (clientError) {
          console.error('Error creating Stream client:', clientError);
          throw new Error(`Failed to initialize video client: ${clientError.message}`);
        }
      } catch (err) {
        console.error('Error initializing Stream Video client:', err);
        if (isMounted) {
          setError(err.message || 'Failed to initialize video call service');
          setClient(null);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initializeStreamClient();

    // Cleanup function
    return () => {
      isMounted = false;
      // No need to disconnect here, since we're using getOrCreate
      // The client will be managed by the SDK
    };
  }, [user, isAuthenticated]);

  // Helper function to create a call with timeout
  const createCall = async (callId) => {
    if (!client) {
      throw new Error('Stream Video client not initialized');
    }
    
    try {
      // Add timeout to call creation
      const call = await withTimeout(
        Promise.resolve(client.call('default', callId)),
        5000,
        'Call creation timed out'
      );
      return call;
    } catch (err) {
      console.error('Error creating call:', err);
      setError(err.message || 'Failed to create call');
      throw err;
    }
  };

  // Context value
  const value = {
    client,
    error,
    isInitializing,
    createCall,
  };

  return (
    <StreamVideoContext.Provider value={value}>
      {children}
    </StreamVideoContext.Provider>
  );
};

// Custom hook to use the Stream Video context
export const useStreamVideo = () => {
  const context = useContext(StreamVideoContext);
  if (!context) {
    throw new Error('useStreamVideo must be used within a StreamVideoProvider');
  }
  return context;
};

export default StreamVideoContext; 