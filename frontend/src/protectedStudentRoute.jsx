import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import studentAuth from './studentAuthContext.jsx';

const ProtectedStudentRoute = ({ children }) => {
    const { token, isAuthenticated } = useContext(studentAuth);

    if (!token || !isAuthenticated) {
        return <Navigate to="/studentLogin" replace />;
    }

    return children;
};

export default ProtectedStudentRoute;
