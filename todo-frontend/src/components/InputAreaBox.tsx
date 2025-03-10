"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete, MdOutlineSystemUpdateAlt } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Task } from "@/types/task";

const API_URL = "http://localhost:5000/api/tasks";

export default function InputAreaBox() {
  const [inputTitle, setInputTitle] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<{ data: Task[] }>(API_URL);
        setTasks(response.data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Add or Update Task
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputTitle.trim()) return;

    try {
      if (isEditing && editId) {
        // Update Task
        await axios.put(`${API_URL}/${editId}`, { title: inputTitle });
        setTasks((prev) =>
          prev.map((task) =>
            task._id === editId ? { ...task, title: inputTitle } : task
          )
        );
        setIsEditing(false);
        setEditId(null);
      } else {
        // Add Task
        const response = await axios.post<Task>(API_URL, { title: inputTitle });
        setTasks([...tasks, response.data]);
      }
      setInputTitle("");
    } catch (error) {
      console.error("Error adding/updating task:", error);
    }
  };

  // Edit Task
  const handleEdit = (id: string, title: string) => {
    setInputTitle(title);
    setIsEditing(true);
    setEditId(id);
  };

  // Delete Task
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-4 rounded-lg w-full max-w-lg"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded-md text-lg focus:outline-none mb-2"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
        />
        <button className="bg-orange-500 text-white rounded-full p-3 flex justify-center items-center mx-auto shadow-lg">
          {isEditing ? (
            <MdOutlineSystemUpdateAlt className="text-2xl" />
          ) : (
            <IoMdAddCircleOutline className="text-2xl" />
          )}
        </button>
      </form>

      <div className="flex flex-wrap gap-4 mt-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white shadow-md p-4 rounded-md max-w-sm"
          >
            <h1 className="text-lg font-semibold">{task.title}</h1>
            <div className="flex justify-between items-center mt-2">
              <button onClick={() => handleEdit(task._id, task.title)}>
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
