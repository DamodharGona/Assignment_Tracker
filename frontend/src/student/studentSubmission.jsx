import React, {useContext, useEffect, useState} from "react";
import {addSubmission} from "./studentAPI.jsx";
import studentAuth from "../studentAuthContext.jsx";
import {useLocation, useNavigate} from "react-router-dom";

export default function StudentSubmission() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const {token} = useContext(studentAuth);
    const [responseData, setResponseData] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const assignmentData = location.state || {};
    const assignment_id = assignmentData.assignment_id || assignmentData.id;

    useEffect(() => {
        console.log("received assignment id is :", assignment_id);
        console.log("received token is :", token);
    }, [assignment_id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!content.trim()) {
            setResponseData({
                success: false,
                message: "Please enter content before submitting"
            });
            setLoading(false);
            return;
        }

        const submittedAt = Date.now();
        const response = await addSubmission({content, submittedAt, assignment_id, token});

        if (response.success) {
            setContent("");
            setTimeout(() => {
                navigate(-1);
            }, 1000);
        }

        setResponseData(response);
        setLoading(false);
    }

    return (
        <div className="flex justify-center items-center inset-0 fixed bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-xl font-bold text-black mb-4">Submit Assignment</h2>

                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <label className="font-medium text-black mb-2">Enter your submission content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="h-60 px-4 py-3 outline-none border border-black rounded-md text-black resize-none"
                        placeholder="Write your assignment content here..."
                        required
                    />

                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 border border-black p-3 bg-amber-200 text-black rounded-md ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-300'
                            }`}
                        >
                            {loading ? 'Submitting...' : 'Submit Assignment'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 border border-gray-400 text-gray-600 rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {responseData.message && (
                    <div className={`mt-4 p-3 rounded text-sm ${
                        responseData.success
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                    }`}>
                        {responseData.message}
                    </div>
                )}
            </div>
        </div>
    );
}
