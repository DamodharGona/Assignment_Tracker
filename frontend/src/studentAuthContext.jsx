import React, { createContext, useState, useEffect } from 'react';

const studentAuth = createContext();

export const StudentAuthProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [student, setStudent] = useState(null);

    //  check if token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;

        console.log("=== STUDENT TOKEN DEBUG ===");
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
            console.error("Student token decode error:", error);
            return true;
        }
    };

    // Load token from localStorage on app start
    useEffect(() => {
        const savedToken = localStorage.getItem('studentToken');
        console.log("Loading student token from localStorage:", savedToken ? "Token found" : "No token");

        if (savedToken) {
            // Check if token is expired
            if (isTokenExpired(savedToken)) {
                console.log("Saved student token is expired, logging out");
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
                    console.log("Student token expired, auto-logging out");
                    logout();
                }
            }, 60000);

            return () => clearInterval(interval);
        }
    }, [token, isAuthenticated]);

    const login = (authToken, studentData = null) => {
        console.log("StudentAuth: Storing token:", authToken ? "Token received" : "No token");
        setToken(authToken);
        setIsAuthenticated(true);
        setStudent(studentData);
        localStorage.setItem('studentToken', authToken);

        setTimeout(() => {
            console.log("Token stored and context updated");
        }, 0);
    };

    const logout = () => {
        console.log("StudentAuth: Logging out");
        setToken('');
        setIsAuthenticated(false);
        setStudent(null);
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData'); // Clear student data if stored
    };

    return (
        <studentAuth.Provider value={{
            token,
            isAuthenticated,
            student,
            login,
            logout
        }}>
            {children}
        </studentAuth.Provider>
    );
};

export default studentAuth;
