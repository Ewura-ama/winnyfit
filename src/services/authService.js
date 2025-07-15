import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:8000/api/';

// Create axios instance with proper config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, // Do NOT include credentials (cookies) - we use JWT tokens instead
    timeout: 30000, // 30 seconds timeout
});

// Debug request details in development
axiosInstance.interceptors.request.use(
    request => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Starting Request:', request.method, request.url);
            console.log('Request Data:', request.data);
        }
        return request;
    },
    error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Debug response details in development
axiosInstance.interceptors.response.use(
    response => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Response:', response.status, response.data);
        }
        return response;
    },
    error => {
        if (process.env.NODE_ENV === 'development') {
            console.error('Response Error:', error.response ? {
                status: error.response.status,
                data: error.response.data
            } : error.message);
        }
        return Promise.reject(error);
    }
);

// Set up request interceptor for authentication
const setupAxiosInterceptors = (token) => {
    // Safely clear existing interceptors
    try {
        if (axiosInstance.interceptors.request.handlers && axiosInstance.interceptors.request.handlers.length > 0) {
            axiosInstance.interceptors.request.handlers.forEach((handler, i) => {
                axiosInstance.interceptors.request.eject(handler.id);
            });
        }
        
        if (axiosInstance.interceptors.response.handlers && axiosInstance.interceptors.response.handlers.length > 0) {
            axiosInstance.interceptors.response.handlers.forEach((handler, i) => {
                axiosInstance.interceptors.response.eject(handler.id);
            });
        }
    } catch (error) {
        console.warn('Error clearing existing interceptors:', error);
    }
    
    console.log('Setting up auth interceptors with token:', token ? 'token present' : 'no token');
    
    axiosInstance.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
                
                if (process.env.NODE_ENV === 'development') {
                    console.log(`Adding auth token to ${config.method.toUpperCase()} ${config.url}`);
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor to handle token refresh
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            // If no response, it's a network error
            if (!error.response) {
                console.error('Network error - no response received');
                return Promise.reject(error);
            }
            
            const originalRequest = error.config;

            // If error is 401 and we haven't tried to refresh token yet
            if (error.response.status === 401 && !originalRequest._retry) {
                console.log('401 error detected, attempting token refresh');
                originalRequest._retry = true;
                
                try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user && user.refresh) {
                        console.log('Refresh token available, attempting refresh');
                        const refreshResponse = await axios.post(`${API_URL}auth/token/refresh/`, {
                            refresh: user.refresh
                        });
                        
                        const { access } = refreshResponse.data;
                        console.log('Token refresh successful');
                        
                        // Update token in storage
                        const updatedUser = {
                            ...user,
                            access
                        };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        
                        // Set the new token for the original request
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;
                        
                        // Update the interceptors with the new token
                        setupAxiosInterceptors(access);
                        
                        // Retry the original request
                        return axios(originalRequest);
                    } else {
                        console.error('No refresh token available, cannot refresh authentication');
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // Force logout if refresh fails
                    localStorage.removeItem('user');
                    window.location.href = '/signin';
                    return Promise.reject(refreshError);
                }
            }
            
            return Promise.reject(error);
        }
    );
};

const authService = {
    setupAxiosInterceptors: () => {
        const user = authService.getCurrentUser();
        let token = null;
        
        if (user) {
            // Try different token locations based on the structure we've seen
            if (user.access) {
                // Direct access token
                token = user.access;
            } else if (user.user && user.user.access) {
                // Nested access token
                token = user.user.access;
            } else if (user.token) {
                // Legacy format
                token = user.token;
            }
            
            if (token) {
                console.log('Setting up axios interceptors with token:', token.substring(0, 10) + '...');
                setupAxiosInterceptors(token);
            } else {
                console.warn('No access token found in user object:', Object.keys(user));
            }
        }
    },
    
    register: async (userData) => {
        try {
            const response = await axiosInstance.post('auth/register/', userData);
            
            if (response.data.access) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setupAxiosInterceptors(response.data.access);
            }
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw {
                    message: 'Cannot connect to the server. Please check your internet connection.'
                };
            }
            
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                
                if (typeof errorData === 'string') {
                    throw { message: errorData };
                } else if (errorData.email) {
                    throw { message: errorData.email[0] };
                } else if (errorData.password) {
                    throw { message: errorData.password[0] };
                } else if (errorData.detail) {
                    throw { message: errorData.detail };
                } else if (errorData.non_field_errors) {
                    throw { message: errorData.non_field_errors[0] };
                }
            }
            
            throw {
                message: 'Registration failed. Please try again later.'
            };
        }
    },

    login: async (email, password) => {
        try {
            console.log(`Attempting to login user with email: ${email}`);
            
            // Debug the request being made
            console.log('Starting Request: post auth/login/');
            console.log('Request Data:', { email, password });
            
            // Fix URL to avoid duplicate slashes - API_URL already has trailing slash
            const response = await axiosInstance.post('auth/login/', { email, password });
            console.log('Login API response received:', {
                status: response.status,
                hasAccess: !!response.data.access,
                hasRefresh: !!response.data.refresh,
                userData: response.data.user ? 'present' : 'missing'
            });
            
            const userData = {
                ...response.data,
                email: email
            };
            
            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Set up axios interceptors with the token
            if (userData.access) {
                console.log('Setting up axios interceptors with token:', userData.access.substring(0, 10) + '...');
                setupAxiosInterceptors(userData.access);
            } else {
                console.warn('No access token in response - auth interceptors not set up');
            }
            
            // Return the user data with token
            console.log('Login successful, returning user data');
            return userData;
        } catch (error) {
            console.error('Login failed:', error);
            
            if (error.response) {
                console.error('Login error details:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
            }
            
            // Throw a more informative error
            const errorMessage = error.response?.data?.detail || 
                                error.response?.data?.non_field_errors?.[0] || 
                                'Login failed. Please check your credentials.';
            throw new Error(errorMessage);
        }
    },

    logout: () => {
        const user = authService.getCurrentUser();
        if (user?.refresh) {
            // No need to wait for this request to complete
            axiosInstance.post('auth/logout/', { refresh: user.refresh })
                .catch(error => console.error('Logout error:', error));
        }
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        
        try {
            const userData = JSON.parse(userStr);
            
            // Log token structure for debugging (first few chars only for security)
            if (userData) {
                const tokenStructure = {
                    hasDirectAccess: !!userData.access,
                    hasNestedAccess: !!(userData.user && userData.user.access),
                    hasRefresh: !!userData.refresh,
                    hasNestedRefresh: !!(userData.user && userData.user.refresh),
                    userFields: Object.keys(userData),
                    nestedUserFields: userData.user ? Object.keys(userData.user) : 'none'
                };
                
                console.log('User token structure:', tokenStructure);
                
                // Check if token is expired
                const token = userData.access || userData.user?.access;
                if (token) {
                    try {
                        const tokenParts = token.split('.');
                        if (tokenParts.length === 3) {
                            const payload = JSON.parse(atob(tokenParts[1]));
                            const exp = payload.exp;
                            const now = Math.floor(Date.now() / 1000);
                            
                            if (exp && exp < now) {
                                console.log('Token is expired, attempting refresh');
                                authService.refreshToken(userData);
                                // Return current user data, refresh will update it in background
                            }
                        }
                    } catch (e) {
                        console.error('Error checking token expiry:', e);
                    }
                }
            }
            
            return userData;
        } catch (e) {
            console.error('Error parsing user data from localStorage:', e);
            localStorage.removeItem('user');
            return null;
        }
    },

    getToken: () => {
        const user = authService.getCurrentUser();
        if (!user) return null;
        
        // Try different token locations based on structure
        if (user.access) {
            return user.access;
        } else if (user.user && user.user.access) {
            return user.user.access;
        } else if (user.token) {
            return user.token;
        }
        
        return null;
    },

    updateProfile: async (userData) => {
        try {
            const response = await axiosInstance.put('auth/profile/', userData);
            
            // Update user in storage with new profile data
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                const updatedUser = {
                    ...currentUser,
                    user: {
                        ...currentUser.user,
                        ...response.data
                    }
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            
            return response.data;
        } catch (error) {
            throw {
                message: error.response?.data?.detail || 
                         'Failed to update profile. Please try again.'
            };
        }
    },

    changePassword: async (oldPassword, newPassword) => {
        try {
            const response = await axiosInstance.put('auth/change-password/', {
                old_password: oldPassword,
                new_password: newPassword
            });
            return response.data;
        } catch (error) {
            throw {
                message: error.response?.data?.detail || 
                         error.response?.data?.old_password?.[0] || 
                         error.response?.data?.new_password?.[0] || 
                         'Failed to change password. Please try again.'
            };
        }
    },

    requestPasswordReset: async (email) => {
        try {
            await axiosInstance.post('auth/password-reset/', { email });
            return { message: 'Password reset link has been sent to your email' };
        } catch (error) {
            throw {
                message: error.response?.data?.detail || 
                         error.response?.data?.email?.[0] || 
                         'Failed to request password reset. Please try again.'
            };
        }
    },

    resetPassword: async (token, password) => {
        try {
            await axiosInstance.post('auth/password-reset/confirm/', {
                token,
                password
            });
            return { message: 'Password has been reset successfully' };
        } catch (error) {
            throw {
                message: error.response?.data?.detail || 
                         error.response?.data?.token?.[0] || 
                         error.response?.data?.password?.[0] || 
                         'Failed to reset password. Please try again.'
            };
        }
    },

    refreshToken: async (userData) => {
        try {
            if (!userData) return null;
            
            const refreshToken = userData.refresh || userData.user?.refresh;
            if (!refreshToken) {
                console.error('No refresh token available');
                return null;
            }
            
            console.log('Attempting to refresh token...');
            
            const response = await axios.post(`${API_URL}auth/token/refresh/`, {
                refresh: refreshToken
            });
            
            if (response.data && response.data.access) {
                console.log('Token refresh successful');
                
                // Update token in user data
                let updatedUserData;
                
                if (userData.access) {
                    // Token is directly on user object
                    updatedUserData = {
                        ...userData,
                        access: response.data.access
                    };
                } else if (userData.user && userData.user.access) {
                    // Token is nested in user.access
                    updatedUserData = {
                        ...userData,
                        user: {
                            ...userData.user,
                            access: response.data.access
                        }
                    };
                }
                
                // Save updated user data
                localStorage.setItem('user', JSON.stringify(updatedUserData));
                
                // Update axios interceptors with new token
                setupAxiosInterceptors(response.data.access);
                
                return updatedUserData;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            if (error.response && error.response.status === 401) {
                // Clear user data if refresh fails with 401
                console.log('Refresh token invalid, logging out user');
                localStorage.removeItem('user');
                window.location.href = '/signin';
            }
            return null;
        }
    }
};

export default authService; 