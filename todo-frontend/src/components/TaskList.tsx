"use client";

import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import { Task } from "@/types/task";

const API_URL = "http://localhost:5000/api";

export default function TaskList({
  tasks = [],
  refreshTasks,
  handleEdit,
}: {
  tasks: Task[];
  refreshTasks: () => void;
  handleEdit: (task: Task) => void;
}) {
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/deleteTask/${id}`);
      refreshTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 shadow-md rounded-md relative">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p className="text-gray-600 mt-2">{task.text}</p>
            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={() => handleEdit(task)}>
                <FaRegEdit size={20} className="text-blue-500 hover:text-blue-700" />
              </button>
              <button onClick={() => handleDelete(task._id)} className="text-red-500 hover:text-red-700">
                <MdOutlineDelete size={20} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center col-span-3 text-gray-500">No tasks available</p>
      )}
    </div>
  );
}
