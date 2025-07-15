import config from '../config';

/**
 * Generate a Stream token using Base64 encoding
 * This is a browser-compatible approach for development
 * In production, tokens should be generated on the server
 * 
 * @param {string} userId - User ID to generate token for 
 * @returns {string} JWT token
 */
export const generateStreamToken = (userId) => {
  try {
    // Create a header (specifying algorithm and token type)
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    // Create the payload with the user_id
    const payload = {
      user_id: userId
    };

    // Encode header and payload to base64
    const base64UrlEncode = (obj) => {
      const json = JSON.stringify(obj);
      const base64 = btoa(json); // browser's btoa function
      return base64
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    };

    // Create the components of the token
    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);
    
    // For development, we'll use a simplified token
    // Note: This is NOT secure and should be replaced with proper signing in production
    // Use backend endpoint to generate tokens in production
    const signature = 'development_signature';
    const encodedSignature = base64UrlEncode(signature);
    
    // Construct the JWT token
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  } catch (error) {
    console.error('Error generating Stream token:', error);
    return null;
  }
};

/**
 * Get a token from config or generate one for development
 * @param {string} userId - User ID
 * @returns {string} Token
 */
export const getDevStreamToken = (userId) => {
  // If we have a token in config, use that
  if (config.VIDEO_CALL.STREAM_TOKEN) {
    return config.VIDEO_CALL.STREAM_TOKEN;
  }
  
  // Otherwise generate a token
  return generateStreamToken(userId || 'user-1');
}; 