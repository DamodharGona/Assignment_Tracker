import axios from "axios";


const AddTeacher = async ({ name, email, password}) => {
  try{
    const response = await axios.post("http://127.0.0.1:5000/teacher/signUp", {
      name,
      email,
      password,
      role: "teacher",
    })
    return {
      success: true,
      token: response.data.token,
      teacher: response.data.teacher,
      message: response.data?.message || "Teacher created successfully", // Changed 'data' to 'message'
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
};


 const teacherLogin = async ({ email, password }) => {
  try{
    const response = await axios.post("http://127.0.0.1:5000/teacher/login", {
      email,
      password,
      role: "teacher",
    })
    return {
      success: true,
      token: response.data.token,
      message: response.data.message,
      teacher: response.data.teacher,
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

};

// title = db.Column(db.String(100), nullable=False)
// description = db.Column(db.Text, nullable=False)
// due_date = db.Column(db.Date, nullable=False)



const addAssignment = async ({title, description, dueDate, token}) => {
 console.log("receive token", token);
  try{
    const response = await axios.post("http://127.0.0.1:5000/teacher/assignment", {
      title,
      description,
      dueDate,
    },{
      headers:{
        "Authorization": `Bearer ${token}`,
      }
    })
    return {
      success: true,
      message: response.data.message || "Assignment added successfully",
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

const getSubmissions = async (token) => {
  try {
    console.log("Getting submissions with token:", token ? "Present" : "None"); // ✅ Debug log

    if (!token) {
      return { success: false, message: "No token provided" };
    }

    const response = await axios.get("http://127.0.0.1:5000/student/submission", {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    return {
      success: true,
      message: response.data.message,
      submissions: response.data.submissions,
    };
  } catch (e) {
    console.error("API Error:", e.response?.data || e.message);
    return {
      success: false,
      message: e.response?.data?.message || "something went wrong"
    };
  }
}

export { AddTeacher , teacherLogin, addAssignment, getSubmissions };
