import React, { createContext, useState, useEffect } from 'react';

const teacherAuth = createContext();

export const TeacherAuthProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [teacher, setTeacher] = useState(null);

    // Function to check if token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;

        console.log("=== TOKEN DEBUG ===");
        console.log("Token:", token);
        console.log("Token parts:", token.split('.').length);

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Decoded payload:", payload);

            const currentTime = Date.now() / 1000;
            console.log("Current time:", currentTime);
            console.log("Token exp:", payload.exp);
            console.log("Is expired:", payload.exp < currentTime);

            return payload.exp < currentTime;
        } catch (error) {
            console.error("Token decode error:", error);
            return true;
        }
    };

    // Load token from localStorage on app start
    useEffect(() => {
        const savedToken = localStorage.getItem('teacherToken');
        console.log("Loading teacher token from localStorage:", savedToken ? "Token found" : "No token");

        if (savedToken) {
            // Check if token is expired
            if (isTokenExpired(savedToken)) {
                console.log("Saved token is expired, logging out");
                logout();
            } else {
                setToken(savedToken);
                setIsAuthenticated(true);
            }
        }
    }, []);

    // Check token expiry every minute
    useEffect(() => {
        if (token && isAuthenticated) {
            const interval = setInterval(() => {
                if (isTokenExpired(token)) {
                    console.log("Token expired, auto-logging out");
                    logout();
                }
            }, 60000); // Check every 1 minute

            return () => clearInterval(interval);
        }
    }, [token, isAuthenticated]);

    const login = (authToken, teacherData = null) => {
        console.log("TeacherAuth: Storing token:", authToken ? "Token received" : "No token");
        setToken(authToken);
        setIsAuthenticated(true);
        setTeacher(teacherData);
        localStorage.setItem('teacherToken', authToken);
    };

    const logout = () => {
        console.log("TeacherAuth: Logging out");
        setToken('');
        setIsAuthenticated(false);
        setTeacher(null);
        localStorage.removeItem('teacherToken');
        localStorage.removeItem('teacherData'); // Clear teacher data too if stored
    };

    return (
        <teacherAuth.Provider value={{
            token,
            isAuthenticated,
            teacher,
            login,
            logout
        }}>
            {children}
        </teacherAuth.Provider>
    );
};

export default teacherAuth;
