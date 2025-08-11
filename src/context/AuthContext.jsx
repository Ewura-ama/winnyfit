import { useState, useEffect } from 'react';
import axios from 'axios';



export default function useAuth(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/me/`, {
            headers: { Authorization: `Token ${token}` },
          });
          setUser(response.data);
        }
      } catch (err) {
        setError({ message: err.message || 'An error occurred' });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  
  const logout = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        console.error('No token found'); // Log error if token is not found
        alert('No token found. Please log in again.');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/me`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`, // Include token in the Authorization header
          },
        }
      );

      console.log('Sign out response:', response); // Log response for debugging
      localStorage.removeItem('token'); // Remove token from local storage
      navigate('/signin'); // Redirect to sign-in page
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Signout error:', error.response?.data || error.message);
        alert('Failed to log out. Please try again.');
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };
  return { user, logout, loading, error };
};


