import Task from "../model/taskModel.js";

// Add Task
const addTask = async (req, res) => {
  try {
    const { title, text } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const task = new Task({ title, text, status: false });
    await task.save();

    return res.status(201).json({
      success: true,
      message: "Task added successfully",
      data: task,
    });
  } catch (error) {
    console.error("❌ Error in addTask:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json({ success: true, data: tasks });  // ✅ Return structured JSON
  } catch (error) {
    console.error("❌ Error in getAllTasks:", error);
    return res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { title, text, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    // Ensure `status` is boolean
    if (status !== undefined && typeof status !== "boolean") {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, text, status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("❌ Error in updateTask:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in deleteTask:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addTask, getAllTasks, updateTask, deleteTask };
