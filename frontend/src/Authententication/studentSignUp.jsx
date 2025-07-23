import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {AddStudent} from "../student/studentAPI.jsx";
import studentAuth from "../studentAuthContext.jsx";

function StudentSignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [responseData, setResponseData] = useState({});
    const navigate = useNavigate();
    const {login} = useContext(studentAuth);

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        const response = await AddStudent({name, email, password});

        if (response.success) {
            //  Auto-login after successful signup
            if (response.token) {
                login(response.token, response.student);
                navigate('/studentHomePage', { state: { student_email: response.student.email}}); // Redirect to home page
            } else {
                // If no token in signup response, redirect to login
                setResponseData({
                    success: true,
                    message: "Account created successfully! Please login."
                });
                setTimeout(() => {
                    navigate('/studentLogin');
                }, 2000); // Redirect after 2 seconds
            }
        } else {
            setResponseData(response);
        }

        setName('');
        setEmail('');
        setPassword('');
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md border border-amber-200">
                <h1 className="text-2xl font-bold text-black mb-6 text-center">Student Sign Up</h1>
                <form onSubmit={handleOnSubmit} className="flex flex-col space-y-4">
                    <div>
                        <label className="block text-black font-medium mb-2">Name</label>
                        <input
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            type='text'
                            className="w-full outline-none border border-black rounded-lg px-4 py-3 text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-black font-medium mb-2">Email address</label>
                        <input
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            type='email'
                            className="w-full outline-none border border-black rounded-lg px-4 py-3 text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-black font-medium mb-2">Password</label>
                        <input
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            type='password'
                            className="w-full outline-none border border-black rounded-lg px-4 py-3 text-black"
                            required
                        />
                    </div>
                    <button
                        type='submit'
                        className="w-full mt-6 bg-amber-400 hover:bg-amber-500 border-2 border-amber-500 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Sign up
                    </button>
                </form>
                <div className="flex text-sm justify-center mt-6 text-black">
                    <p>Already have an account?</p>
                    <p
                        onClick={()=> navigate("/studentLogin")}
                        className="ml-1 text-amber-600 hover:text-amber-800 cursor-pointer hover:underline font-medium"
                    >
                        Sign in
                    </p>
                </div>
                {responseData.message && (
                    <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium ${
                        responseData.success
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                        {responseData.message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentSignUp;
