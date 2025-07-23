import React, {useContext, useEffect, useState} from "react";
import {FaUserCircle, FaPlusCircle, FaFileAlt, FaUser, FaClock, FaClipboardList} from "react-icons/fa";
import {useLocation, useNavigate} from "react-router-dom";
import teacherAuth from "../teacherAuthContex.jsx";
import {getSubmissions} from "./teacherAPI.jsx";

function TeacherHomePage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const {token, isAuthenticated, logout} = useContext(teacherAuth);
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [submissionsLoaded, setSubmissionLoaded] = useState(false);
    const location = useLocation();
    const teacherData = location.state || {}
    const teacher_email = teacherData.teacher_email;

    useEffect(() => {
        console.log("TeacherHomePage - Token:", token ? "Present" : "None");
        console.log("TeacherHomePage - Authenticated:", isAuthenticated);

        const checkAuth = setTimeout(() => {
            if (!token || !isAuthenticated) {
                console.log("No authentication found, redirecting to login");
                setError("Please login to access teacher dashboard");
                setTimeout(() => {
                    navigate('/teacherLogin');
                }, 2000);
            } else {
                setLoading(false);
            }
        }, 200);

        return () => clearTimeout(checkAuth);
    }, [token, isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/teacherLogin');
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-lg text-black">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <p className="text-red-600 mb-6 text-lg">{error}</p>
                    <button
                        onClick={() => navigate('/teacherLogin')}
                        className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmission = async () => {
        setSubmissionLoaded(true);
        const response = await getSubmissions(token);
        if(response.success){
            setSubmissions(response.submissions);
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Fixed Header */}
            <div className="flex p-4 justify-between items-center bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-black">Teacher Dashboard</h1>
                    {teacher_email && (
                        <span className="ml-3 text-black bg-yellow-100 px-3 py-1 rounded-full text-sm border border-yellow-300">
                            {teacher_email}
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                        Logout
                    </button>
                    <div className="hover:cursor-pointer p-1 hover:bg-yellow-100 rounded-full transition-colors">
                        <FaUserCircle size={36} className="text-black"/>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex p-4 gap-4 bg-white border-b shadow-sm sticky top-20 z-10">
                <button
                    onClick={() => navigate("/teacherTaskForm")}
                    className="flex items-center justify-center gap-3 flex-1 max-w-xs bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors text-lg font-medium shadow-md hover:shadow-lg border border-yellow-500"
                >
                    <FaPlusCircle size={20} />
                    Create Assignment
                </button>
                <button
                    onClick={handleSubmission}
                    className="flex items-center justify-center gap-3 flex-1 max-w-xs bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors text-lg font-medium shadow-md hover:shadow-lg border border-yellow-500"
                >
                    <FaClipboardList size={20} />
                    View Submissions
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {submissionsLoaded && (
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                            <FaFileAlt className="text-yellow-500" />
                            Student Submissions
                        </h2>
                        {submissions.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-yellow-200">
                                <FaFileAlt className="text-yellow-400 text-6xl mb-4 mx-auto" />
                                <p className="text-black text-lg font-medium">No submissions present</p>
                                <p className="text-gray-600 text-sm mt-2">Submissions will appear here once students start submitting their work.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {submissions.map((submission) => (
                                    <div key={submission.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-yellow-200">
                                        <div className="p-6 border-l-4 border-yellow-500">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-lg font-semibold text-black">
                                                    {submission.assignment_name}
                                                </h3>
                                                <span className="bg-yellow-100 text-black px-3 py-1 rounded-full text-sm font-medium border border-yellow-300">
                                                    Submitted
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                                                <div className="flex items-center gap-2">
                                                    <FaUser className="text-yellow-500" />
                                                    <span className="font-medium">Student:</span>
                                                    <span>{submission.student_name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-yellow-500" />
                                                    <span className="font-medium">Submitted:</span>
                                                    <span>{new Date(submission.submitted_at).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeacherHomePage;
