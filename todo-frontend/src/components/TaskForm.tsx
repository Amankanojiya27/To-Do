"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "@/types/task";

const API_URL = "http://localhost:5000/api";

export default function TaskForm({
  refreshTasks,
  editTask,
  setEditTask,
}: {
  refreshTasks: () => void;
  editTask: Task | null;
  setEditTask: (task: Task | null) => void;
}) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setText(editTask.text);
    }
  }, [editTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editTask) {
        await axios.patch(`${API_URL}/updateTask/${editTask._id}`, { title, text });
        setEditTask(null);
      } else {
        await axios.post(`${API_URL}/addTask`, { title, text });
      }
      setTitle("");
      setText("");
      refreshTasks();
    } catch (error) {
      console.error("Error adding/updating task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-md max-w-md mx-auto my-6">
      <input
        type="text"
        placeholder="Title"
        className="w-full border-b p-2 outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Take a note..."
        className="w-full border-b p-2 outline-none mt-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className={`mt-4 w-full py-2 rounded-md ${
          editTask ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
        } text-white`}
      >
        {editTask ? "Update Note" : "Add Note"}
      </button>
    </form>
  );
}
