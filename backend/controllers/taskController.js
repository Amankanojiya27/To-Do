import Task from "../model/taskModel.js";

// Add task
const addTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = new Task({ title, status: false });
    await task.save();
    res.status(201).json({ message: "Task added successfully", data: task });
  } catch (error) {
    console.error("Error in addTask:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found", data: [] });
    }

    res.status(200).json({ message: "Data fetched successfully", data: tasks });
  } catch (error) {
    console.error("Error in getAllTasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { title, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", data: task });
  } catch (error) {
    console.error("Error in updateTask:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTask:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { addTask, getAllTasks, updateTask, deleteTask };
