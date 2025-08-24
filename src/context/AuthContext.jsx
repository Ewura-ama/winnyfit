import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/me/`,
            { headers: { Authorization: `Token ${token}` } }
          );
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

  const logout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }
    localStorage.removeItem('token');
    setUser(null);
    navigate('/signin');
  };

  return { user, setUser, logout, loading, error };
}
