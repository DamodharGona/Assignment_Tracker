import React, {useContext, useEffect, useState} from "react";
import {FaUserCircle, FaClipboardList, FaCalendarAlt, FaFileAlt, FaUser} from "react-icons/fa";
import {showAssignments} from "./studentAPI.jsx";
import studentAuth from "../studentAuthContext.jsx";
import {useLocation, useNavigate} from "react-router-dom";

function StudentHomePage() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const {token, isAuthenticated, logout} = useContext(studentAuth);
    const navigate = useNavigate();
    const location = useLocation();
    const studentData = location.state || {}
    const student_email = studentData.student_email

    useEffect(() => {
        console.log("StudentHomePage - Token:", token ? "Present" : "None");
        console.log("StudentHomePage - Authenticated:", isAuthenticated);

        const checkAuth = setTimeout(() => {
            if (token && isAuthenticated) {
                getAssignments();
            } else if (!token && !isAuthenticated) {
                console.log("No authentication found, redirecting to login");
                setError("Please login to view assignments");
                setLoading(false);
                setTimeout(() => {
                    navigate('/studentLogin');
                }, 2000);
            }
        }, 100);

        return () => clearTimeout(checkAuth);
    }, [token, isAuthenticated, navigate]);


    const getAssignments = async () => {
        console.log("Fetching assignments with token:", token ? "Token exists" : "No token");
        setLoading(true);

        const response = await showAssignments(token);

        if(response.success){
            setAssignments(response.message);
            setError("");
        } else {
            setError(response.message);
            console.error("Failed to fetch assignments:", response.message);
        }
        setLoading(false);
    }

    const handleCardClick = (id,submitted) => {
        console.log("Card clicked", id);
        if(submitted){
            alert("Already submitted");
        }else{
            navigate("/studentSubmission", { state: { assignment_id: id } });
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/studentLogin');
    }

    // Show loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-lg text-black">Loading assignments...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <p className="text-red-600 mb-6 text-lg">{error}</p>
                    <button
                        onClick={() => navigate('/studentLogin')}
                        className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Fixed Header */}
            <div className="flex p-4 justify-between items-center bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-black">Student Dashboard</h1>
                    {student_email && (
                        <span className="ml-3 text-black bg-yellow-100 px-3 py-1 rounded-full text-sm border border-yellow-300">
                            {student_email}
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

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                        <FaClipboardList className="text-yellow-500" />
                        Your Assignments
                    </h2>

                    {assignments.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-yellow-200">
                            <FaFileAlt className="text-yellow-400 text-6xl mb-4 mx-auto" />
                            <p className="text-black text-lg font-medium">No assignments found.</p>
                            <p className="text-gray-600 text-sm mt-2">Check back later for new assignments.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {assignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-yellow-200 cursor-pointer"
                                    onClick={() => handleCardClick(assignment.id, assignment.submitted)}
                                >
                                    <div className="p-6 border-l-4 border-yellow-500">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-1">Title:</p>
                                                <h3 className="text-lg font-semibold text-black">{assignment.title}</h3>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                                assignment.submitted
                                                    ? 'bg-green-100 text-green-800 border-green-300'
                                                    : 'bg-yellow-100 text-black border-yellow-300'
                                            }`}>
                                                {assignment.submitted ? 'Submitted' : 'Pending'}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-600 mb-1">Description:</p>
                                            <p className="text-black">{assignment.description}</p>
                                        </div>

                                        <div className="mb-4 flex items-center gap-2">
                                            <FaUser className="text-yellow-500" />
                                            <span className="text-sm font-medium text-gray-600">Created by:</span>
                                            <span className="text-black font-medium">{assignment.created_by}</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-yellow-500" />
                                                <span className="font-medium">Due:</span>
                                                <span>{new Date(assignment.due_date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className="text-yellow-600 hover:text-yellow-800 font-medium">
                                                    {assignment.submitted ? 'View Submission' : 'Click to Submit'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentHomePage;
