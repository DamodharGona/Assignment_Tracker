import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {studentLogin} from "../student/studentAPI.jsx";
import studentAuth from "../studentAuthContext.jsx";

function StudentLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseData, setResponseData] = useState({});
    const {login} = useContext(studentAuth);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await studentLogin({email, password});
        console.log("toke from the response is: ",response.token);
        if(response.success) {
            login(response.token);
            setTimeout(() => {
                navigate('/studentHomePage', { state: { student_email: response.student.email}});
            }, 100);
        }

        setResponseData(response);
        setEmail('');
        setPassword('');
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md border border-amber-200">
                <h1 className="text-2xl font-bold text-black mb-6 text-center">Student Login</h1>
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
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
                        Login
                    </button>
                </form>
                <div className="flex text-sm justify-center mt-6 text-black">
                    <p>Don't have an account?</p>
                    <p
                        onClick={()=> navigate("/studentSignUp")}
                        className="ml-1 text-amber-600 hover:text-amber-800 cursor-pointer hover:underline font-medium"
                    >
                        Sign up
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

export default StudentLogin;
