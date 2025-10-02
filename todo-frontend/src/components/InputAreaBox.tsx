"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete, MdOutlineSystemUpdateAlt } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import {Task} from "@/types/task"
import { API_URL } from "@/api";

// interface Task {
//   _id: string;
//   title: string;
//   text: string;
// }

export default function InputAreaBox() {
  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  // 🔹 Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(`${API_URL}/getAllTasks`);
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 Add or Update Task
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputTitle.trim() || !inputText.trim()) return;

    try {
      if (isEditing && editId) {
        await axios.patch(`${API_URL}/updateTask/${editId}`, { title: inputTitle, text: inputText });
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post<Task>(`${API_URL}/addTask`, { title: inputTitle, text: inputText });
      }
      setInputTitle("");
      setInputText("");
      fetchTasks(); // ✅ Refresh task list after action
    } catch (error) {
      console.error("Error adding/updating task:", error);
    }
  };

  // 🔹 Edit Task
  const handleEdit = (id: string, title: string, text: string) => {
    console.log("Editing Task:", id, title, text); // ✅ Debug log
    setInputTitle(title);
    setInputText(text);
    setIsEditing(true);
    setEditId(id);
  };

  // 🔹 Delete Task
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/deleteTask/${id}`);
      fetchTasks(); // ✅ Refresh task list after delete
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* 🔹 Input Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-lg w-full max-w-lg">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded-md text-lg focus:outline-none mb-2"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
        />
        <textarea
          placeholder="Take a note..."
          className="w-full border p-2 rounded-md text-lg focus:outline-none mb-2"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button className="bg-orange-500 text-white rounded-full p-3 flex justify-center items-center mx-auto shadow-lg">
          {isEditing ? <MdOutlineSystemUpdateAlt className="text-2xl" /> : <IoMdAddCircleOutline className="text-2xl" />}
        </button>
      </form>

      {/* 🔹 Task List */}
      <div className="flex flex-wrap gap-4 mt-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white shadow-md p-4 rounded-md max-w-sm">
            <h1 className="text-lg font-semibold">{task.title}</h1>
            <p className="text-gray-600">{task.text}</p>
            <div className="flex justify-between items-center mt-2">
              <button onClick={() => handleEdit(task._id, task.title, task.text)}>
                <FaRegEdit className="text-blue-500 text-xl" />
              </button>
              <button onClick={() => handleDelete(task._id)}>
                <MdOutlineDelete className="text-red-500 text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
