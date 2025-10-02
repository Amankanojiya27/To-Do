"use client";

import { useState } from "react";
import { FaRegEdit, FaCheck } from "react-icons/fa";
import { MdOutlineDelete, MdOutlinePending } from "react-icons/md";
import axios from "axios";
import { Task } from "@/types/task";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { API_URL } from "@/api";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Personal":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Work":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "Shopping":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
    case "Health":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Finance":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default function TaskList({
  tasks = [],
  refreshTasks,
  handleEdit,
}: {
  tasks: Task[];
  refreshTasks: () => void;
  handleEdit: (task: Task) => void;
}) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await axios.delete(`${API_URL}/deleteTask/${id}`);
      toast.success("Task deleted successfully!");
      refreshTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    setIsToggling(task._id);
    try {
      await axios.patch(`${API_URL}/updateTask/${task._id}`, {
        completed: !task.completed,
      });
      toast.success(
        task.completed ? "Task marked as pending!" : "Task completed!"
      );
      refreshTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    } finally {
      setIsToggling(null);
    }
  };

  const formatDueDate = (dateString: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.log("error",error)
      return dateString;
    }
  };

  const isOverdue = (dateString: string) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
                task.completed ? "opacity-75" : ""
              }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3
                    className={`text-lg font-semibold transition-colors duration-300 ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-800 dark:text-white"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <button
                    onClick={() => handleToggleComplete(task)}
                    disabled={isToggling === task._id}
                    className={`p-1 rounded-full transition-colors duration-300 ${
                      task.completed
                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                        : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                    }`}
                    aria-label={task.completed ? "Mark as pending" : "Mark as complete"}
                  >
                    {isToggling === task._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                    ) : task.completed ? (
                      <FaCheck size={16} />
                    ) : (
                      <MdOutlinePending size={16} />
                    )}
                  </button>
                </div>

                <p
                  className={`text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300 ${
                    task.completed ? "line-through" : ""
                  }`}
                >
                  {task.text}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${getPriorityColor(
                      task.priority || "Medium"
                    )}`}
                  >
                    {task.priority || "Medium"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${getCategoryColor(
                      task.category || "Other"
                    )}`}
                  >
                    {task.category || "Other"}
                  </span>
                  {task.dueDate && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                        isOverdue(task.dueDate) && !task.completed
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {formatDueDate(task.dueDate)}
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800 transition-colors duration-300"
                    aria-label="Edit task"
                  >
                    <FaRegEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    disabled={isDeleting === task._id}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800 transition-colors duration-300"
                    aria-label="Delete task"
                  >
                    {isDeleting === task._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                    ) : (
                      <MdOutlineDelete size={16} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-12"
          >
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4 transition-colors duration-300">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              No tasks found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md transition-colors duration-300">
              Create your first task to get started with managing your to-do list.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}