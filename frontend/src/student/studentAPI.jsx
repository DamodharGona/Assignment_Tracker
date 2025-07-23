import axios from "axios";


async function AddStudent({ name, email, password}) {
    try {
        const response = await axios.post("http://127.0.0.1:5000/student/signUp", {
            name,
            email,
            password,
            role: "student",
        })
        return {
            success: true,
            token: response.data.token,
            student: response.data.student,
            message: response.data?.message || "Student created successfully", // Changed 'data' to 'message'
        }
    } catch (e) {
        if (e.response && e.response.status === 409) {
            return {
                success: false,
                message: e.response.data?.message,
            }

        }
        return {
            success: false,
            message: "something went wrong",
        }
    }
}

async function studentLogin({ email, password }) {
    try{
        const response = await axios.post("http://127.0.0.1:5000/student/login", {
            email,
            password,
            role: "student",
        })
        return {
            success: true,
            token: response.data.token,
            message: response.data.message,
            student: response.data.student,
        }
    }catch (e) {
        if (e.response && e.response.status === 404) {
            return {
                success: false,
                message: e.response.data?.message,
            }
        }
        return {
            success: false,
            message: "something went wrong",
        }
    }

}

const addSubmission = async ({content, submittedAt, assignment_id, token}) => {
    console.log("received student token", token);
    try{
        const response = await axios.post("http://127.0.0.1:5000/student/submission", {
            content,
            submittedAt,
            assignment_id: assignment_id,
        },{
            headers:{
                "Authorization": `Bearer ${token}`,
            }
        })
        return {
            success: true,
            message: response.data.message || "submission added successfully",
        }
    }catch (e) {
        if (e.response && e.response.status === 404) {
            return {
                success: false,
                message: e.response.data?.message,

            }
        }
        return {
            success: false,
            message: "something went wrong",
        }
    }
}

const showAssignments = async (token) => {
    try{
        const response = await axios.get("http://127.0.0.1:5000/student/assignments",{
            headers:{
                "Authorization": `Bearer ${token}`,
            }
        });
        return {
            success: true,
            message: response.data.assignments,
        }
    }catch (e){
        return {
            success: false,
            message: "something went wrong",
        }
    }
}

export { AddStudent, studentLogin, addSubmission, showAssignments };