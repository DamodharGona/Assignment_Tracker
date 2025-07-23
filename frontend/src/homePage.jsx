import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

export default function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center px-4">

            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-md bg-black/30 z-10" onClick={() => setIsModalOpen(false)} />
            )}

            // so that it appears on top
            <header className="w-full flex justify-between items-center py-4 px-6 shadow-md fixed top-0 bg-white z-20 border-b border-amber-200">
                <h1 className="text-xl font-semibold text-black">Assignment Portal</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2 bg-amber-400 hover:bg-amber-500 border border-black text-black font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                    Login
                </button>
            </header>

            {/* Main content */}
            <main className="text-center mt-40 z-0">
                <h2 className="text-4xl font-bold mb-6 text-black">Welcome to the Assignment Portal</h2>
                <p className="text-gray-800 text-lg max-w-2xl mx-auto leading-relaxed">
                    Efficiently manage and submit assignments with our comprehensive platform designed for both students and teachers.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md border border-amber-200">
                        <FaChalkboardTeacher className="text-3xl mb-2 mx-auto text-amber-600" />
                        <p className="text-black font-medium">For Teachers</p>
                        <p className="text-sm text-gray-600">Create & manage assignments</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border border-amber-200">
                        <FaUserGraduate className="text-3xl mb-2 mx-auto text-amber-600" />
                        <p className="text-black font-medium">For Students</p>
                        <p className="text-sm text-gray-600">Submit & track progress</p>
                    </div>
                </div>
            </main>

            {/* popUp when clicked on login */}
            {isModalOpen && (
                <div className="fixed top-1/2 left-1/2 z-30 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-8 w-80 text-center border border-amber-200">
                    <h3 className="text-xl font-semibold mb-6 text-black">Choose Your Role</h3>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => navigate("/teacherLogin")}
                            className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-lg border border-black transition-all shadow-md hover:shadow-lg"
                        >
                            Teacher Login
                        </button>
                        <button
                            onClick={() => navigate("/studentLogin")}
                            className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-lg border border-black transition-all shadow-md hover:shadow-lg"
                        >
                            Student Login
                        </button>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-sm text-gray-600 hover:text-black hover:underline mt-2 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
