import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state

    // Function to check authentication status on app load
    const checkAuth = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/auth/check`, {
                withCredentials: true, // Include cookies
            });

            if (response.status === 200) {
                setIsAuthenticated(true); // User is authenticated
                setUnauthorized(false);
            } else {
                setIsAuthenticated(false); // User is not authenticated
                setUnauthorized(true);
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            setIsAuthenticated(false); // User is not authenticated
            setUnauthorized(true);
        } finally {
            setLoading(false); // Set loading to false after the check
        }
    };

    // Call checkAuth when the app loads
    useEffect(() => {
        checkAuth();
    }, []);

    const login = () => {
        setIsAuthenticated(true);
        setUnauthorized(false);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUnauthorized(true);
    };

    const handleUnauthorized = () => {
        setIsAuthenticated(false);
        setUnauthorized(true);
    };

    // Provide the context values to the application
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                unauthorized,
                login,
                logout,
                handleUnauthorized,
                loading, // Expose loading state
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};