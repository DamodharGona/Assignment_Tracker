import React, {useContext, useState} from "react";
import {addAssignment} from "./teacherAPI.jsx";
import teacherAuth from "../teacherAuthContex.jsx";
import {useNavigate} from "react-router-dom";

function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [responseData, setResponseData] = useState({});
  const [loading, setLoading] = useState(false);
  const { token } = useContext(teacherAuth);
  const navigate = useNavigate();

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!title || !description || !dueDate ) {
      setResponseData({
        success: false,
        message: "Please fill in all fields"
      });
      setLoading(false);
      return;
    }

    console.log("Title", title);
    console.log("Description", description);
    console.log("DueDate", dueDate);
    console.log("Token", token);

    const response = await addAssignment({ title, description, dueDate, token });

    if(response.success){
      console.log("Success", response);
      setTitle("");
      setDescription("");
      setDueDate("");
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }

    setResponseData(response);
    setLoading(false);
  };

  return (
      <div className="flex justify-center items-center inset-0 fixed bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96"> {/* ✅ Better styling */}
          <h2 className="text-xl font-bold mb-4">Create New Assignment</h2>

          <form className="flex flex-col" onSubmit={handleOnSubmit}>
            <label className="font-medium">Enter the title of the task</label>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-2 py-1 outline-none border border-black rounded-md"
                required
            />

            <label className="mt-3 font-medium">Enter the description of the task</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-24 px-2 py-1 outline-none border border-black rounded-md resize-none"
                required
            />

            <label className="mt-3 font-medium">Enter the due date for the submission</label>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="outline-none border px-2 py-1 border-black rounded-md"
                min={new Date().toISOString().split('T')[0]} // ✅ Prevent past dates
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
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>

              <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-3 border border-gray-400 text-gray-600 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>

          {responseData.message && (
              <p className={`flex mt-3 p-2 text-sm rounded ${
                  responseData.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {responseData.message}
              </p>
          )}
        </div>
      </div>
  );
}

export default TaskForm;
