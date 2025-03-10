"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task } from "@/types/task";

const API_URL = "http://localhost:5000/api";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get<{ success: boolean; data: Task[] }>(`${API_URL}/getAllTasks`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setTasks(response.data.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to set task for editing
  const handleEdit = (task: Task) => {
    setEditTask(task);
  };

  return (
    <div className="container mx-auto p-6">
      <TaskForm refreshTasks={fetchTasks} editTask={editTask} setEditTask={setEditTask} />
      <TaskList tasks={tasks} refreshTasks={fetchTasks} handleEdit={handleEdit} />
    </div>
  );
}
