"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "@/types/task";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FiCalendar, FiTag, FiX } from "react-icons/fi";
import { API_URL } from "@/api";

const categories = ["Personal", "Work", "Shopping", "Health", "Finance", "Other"];
const priorities = ["Low", "Medium", "High"];

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
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setText(editTask.text);
      setCategory(editTask.category || "Personal");
      setPriority(editTask.priority || "Medium");
      setDueDate(editTask.dueDate || "");
    }
  }, [editTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editTask) {
        await axios.patch(`${API_URL}/updateTask/${editTask._id}`, {
          title,
          text,
          category,
          priority,
          dueDate,
        });
        toast.success("Task updated successfully!");
        setEditTask(null);
      } else {
        await axios.post(`${API_URL}/addTask`, {
          title,
          text,
          category,
          priority,
          dueDate,
          completed: false,
        });
        toast.success("Task added successfully!");
      }
      setTitle("");
      setText("");
      setCategory("Personal");
      setPriority("Medium");
      setDueDate("");
      refreshTasks();
    } catch (error) {
      console.error("Error adding/updating task:", error);
      toast.error("Failed to save task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditTask(null);
    setTitle("");
    setText("");
    setCategory("Personal");
    setPriority("Medium");
    setDueDate("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto transition-colors duration-300"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white transition-colors duration-300">
          {editTask ? "Edit Task" : "Create New Task"}
        </h2>
        {editTask && (
          <button
            onClick={handleCancel}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <FiX size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Task title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-500 dark:text-gray-400" />
            <input
              type="date"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <textarea
            placeholder="Task description..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none transition-colors duration-300"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <FiTag className="text-gray-500 dark:text-gray-400" />
            <select
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri}>
                  Priority: {pri}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded-lg font-medium text-white transition-all duration-300 ${
                editTask
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span>{editTask ? "Update Task" : "Create Task"}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}