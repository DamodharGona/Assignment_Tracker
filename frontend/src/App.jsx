import React from 'react';
import TeacherHomePage from "./teacher/teacherHomePage.jsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import TaskForm from "./teacher/taskForm.jsx";
import StudentHomePage from "./student/studentHomePage.jsx";
import { StudentAuthProvider } from "./studentAuthContext.jsx";
import { TeacherAuthProvider } from "./teacherAuthContex.jsx";
import TeacherLogin from "../src/Authententication/teacherLogin.jsx";
import TeacherSignUp from "../src/Authententication/teacherSignUp.jsx";
import HomePage from "./homePage.jsx";
import StudentLogin from "../src/Authententication/studenLogin.jsx";
import StudentSignUp from "../src/Authententication/studentSignUp.jsx";
import StudentSubmission from "./student/studentSubmission.jsx";
import ProtectedStudentRoute from "./ProtectedStudentRoute.jsx";
import ProtectedTeacherRoute from "./ProtectedTeacherRoute.jsx";

function App() {
    const router = createBrowserRouter([
        // Public routes
        {path: '/', element: <HomePage />},
        {path: "/studentLogin", element: <StudentLogin />},
        {path: "/studentSignUp", element: <StudentSignUp/>},
        {path: "/teacherLogin", element: <TeacherLogin/>},
        {path: "/teacherSignUp", element: <TeacherSignUp/>},

        // Protected  Routes
        {
            path: '/studentHomePage',
            element: (
                <ProtectedStudentRoute>
                    <StudentHomePage/>
                </ProtectedStudentRoute>
            )
        },
        {
            path: '/studentSubmission',
            element: (
                <ProtectedStudentRoute>
                    <StudentSubmission/>
                </ProtectedStudentRoute>
            )
        },


        {
            path: "/teacherHomePage",
            element: (
                <ProtectedTeacherRoute>
                    <TeacherHomePage/>
                </ProtectedTeacherRoute>
            )
        },
        {
            path: "/teacherTaskForm",
            element: (
                <ProtectedTeacherRoute>
                    <TaskForm/>
                </ProtectedTeacherRoute>
            )
        }
    ]);

    return (
        <TeacherAuthProvider>
            <StudentAuthProvider>
                <RouterProvider router={router}/>
            </StudentAuthProvider>
        </TeacherAuthProvider>
    )
}

export default App
