
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import teacherAuth from './teacherAuthContex.jsx';

const ProtectedTeacherRoute = ({ children }) => {
    const { token, isAuthenticated } = useContext(teacherAuth);

    if (!token || !isAuthenticated) {
        return <Navigate to="/teacherLogin" replace />;
    }

    return children;
};

export default ProtectedTeacherRoute;
