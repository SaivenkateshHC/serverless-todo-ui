import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [toast, setToast] = useState({
    type: "error",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    console.log(API_URL);
    try {
      // Use axios.get, no need to set headers for GET
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodoText) return;
    try {
      // Use axios.post, it automatically stringifies the body
      setLoading(true);
      await axios
        .post(API_URL, { name: newTodoText })
        .then((response) => {
          setLoading(false);
          setToast({
            type: "success",
            content: response?.data?.message || "Created successfully",
          });
        })
        .catch((e) => {
          setLoading(false);
          setToast({
            type: "error",
            content: "Something went wrong",
          });
        });
      setTimeout(() => {
        setToast({
          type: "error",
          content: "",
        });
      }, 2000);
      setNewTodoText("");
      fetchTodos();
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      // Use axios.delete
      setLoading(true);
      await axios
        .delete(`${API_URL}`, {
          data: { id: id },
        })
        .then((response) => {
          setLoading(false);
          setToast({
            type: "success",
            content: response?.data?.message || "deleted successfully",
          });
        })
        .catch((e) => {
          setLoading(false);
          setToast({
            type: "error",
            content: "Something went wrong",
          });
        });
      setTimeout(() => {
        setToast({
          type: "error",
          content: "",
        });
      }, 2000);
      fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="text-white text-center">
            <div className="w-16 h-16 border-4 border-white border-solid rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold">Request in progress...</h3>
          </div>
        </div>
      )}
      <div className="container mx-auto p-4 bg-white rounded-xl shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Serverless Todo List
        </h1>

        {toast.content.length > 0 && (
          <div className="fixed right-10 top-4 -translate-x-1/2 p-4 bg-gray-800 text-white rounded-lg shadow-xl transition-all duration-300 transform scale-100">
            <p className="font-semibold">{toast.content}</p>
          </div>
        )}

        {/* Input and Add Button */}
        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo..."
          />
          <button
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={handleAddTodo}
          >
            Add
          </button>
        </div>

        {/* To-Do List */}
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <span className="text-gray-700">{todo.name}</span>
              <button
                className="text-red-500 hover:text-red-700 transition duration-200"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
