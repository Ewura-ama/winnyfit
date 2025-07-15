import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authInitialized, setAuthInitialized] = useState(false);

    // Initial auth setup - runs once on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                console.log('Initializing authentication state...');
                setLoading(true);
                
                // Check if user is logged in
                const savedUser = authService.getCurrentUser();
                
                if (savedUser) {
                    console.log('Found saved authentication data:', {
                        email: savedUser.user?.email || savedUser.email,
                        role: savedUser.user?.role || savedUser.role,
                        hasToken: !!savedUser.access || !!(savedUser.user && savedUser.user.access),
                        tokenExpiry: savedUser.token_expiry || 'unknown'
                    });
                    
                    // Set up axios interceptors with current token
                    authService.setupAxiosInterceptors();
                    
                    // Set the user in the context
                    setUser(savedUser);
                    
                    // Check if token needs refreshing (can be expanded based on your token expiry logic)
                    const tokenExpiryTime = savedUser.token_expiry ? new Date(savedUser.token_expiry) : null;
                    const now = new Date();
                    
                    if (tokenExpiryTime && tokenExpiryTime < now) {
                        console.log('Token expired, attempting refresh');
                        try {
                            await refreshToken();
                        } catch (refreshError) {
                            console.error('Token refresh failed during initialization:', refreshError);
                            // We still allow the user to continue with expired token
                            // The interceptor will handle refresh when needed
                        }
                    }
                } else {
                    console.log('No authenticated user found');
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
                setAuthInitialized(true);
                console.log('Authentication initialization complete');
            }
        };

        initializeAuth();
    }, []);

    // Handler for path restoration after login
    const restorePathAfterLogin = () => {
        const savedPath = sessionStorage.getItem('intendedPath');
        if (savedPath) {
            console.log(`Restoring path after login: ${savedPath}`);
            sessionStorage.removeItem('intendedPath');
            
            // Use window.location to ensure full page reload if needed
            // This ensures all components properly reinitialize with auth state
            if (window.location.pathname !== savedPath) {
                // If using hash router, we need to handle the hash part
                if (window.location.href.includes('#')) {
                    window.location.hash = `#${savedPath}`;
                } else {
                    window.location.pathname = savedPath;
                }
            }
        }
    };

    const clearError = () => setError(null);

    const login = async (emailOrUserData, password) => {
        setError(null);
        setLoading(true);
        try {
            // Handle both direct user object (for instructor login) and email/password login
            let userData;
            
            if (typeof emailOrUserData === 'object' && emailOrUserData !== null) {
                // Direct user object provided (used for instructor mock login)
                userData = emailOrUserData;
                
                // Store in localStorage to persist the session
                localStorage.setItem('user', JSON.stringify(userData));
                
                setUser(userData);
                
                // Restore intended path if available
                restorePathAfterLogin();
                
                return userData;
            } else {
                // Regular email/password login
                userData = await authService.login(emailOrUserData, password);
                setUser(userData);
                
                // Restore intended path if available
                restorePathAfterLogin();
                
                return userData;
            }
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setError(null);
        setLoading(true);
        try {
            const data = await authService.register(userData);
            setUser(data);
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        try {
            authService.logout();
            setUser(null);
            setError(null);
            
            // Force redirect to home page after logout for clean state
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            setError('Error during logout');
        }
    };

    const updateProfile = async (userData) => {
        setError(null);
        setLoading(true);
        try {
            const data = await authService.updateProfile(userData);
            setUser(prev => ({ ...prev, ...data }));
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const refreshToken = async () => {
        setError(null);
        try {
            // Get current user for the refresh token
            const currentUser = authService.getCurrentUser();
            if (!currentUser || !currentUser.refresh) {
                console.error('No refresh token available');
                return false;
            }
            
            // Try to refresh the token
            const response = await authService.refreshToken(currentUser.refresh);
            
            // Update the user in state with new token
            setUser(prev => ({
                ...prev,
                access: response.access,
                token_expiry: response.token_expiry || null
            }));
            
            // Update localStorage with new token
            const updatedUser = {
                ...currentUser,
                access: response.access,
                token_expiry: response.token_expiry || null
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            setError('Failed to refresh authentication. Please log in again.');
            return false;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        refreshToken,
        clearError,
        authInitialized
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    // if (!context) {
    //     throw new Error('useAuth must be used within an AuthProvider');
    // }
    return context;
}; 