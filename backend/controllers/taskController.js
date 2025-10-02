// import Task from "../model/taskModel.js";

// // Add Task
// const addTask = async (req, res) => {
//   try {
//     const { title, text } = req.body;

//     if (!title || title.trim() === "") {
//       return res.status(400).json({ success: false, message: "Title is required" });
//     }

//     const task = new Task({ title, text, status: false });
//     await task.save();

//     return res.status(201).json({
//       success: true,
//       message: "Task added successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error("❌ Error in addTask:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // Get All Tasks
// const getAllTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find();
//     return res.status(200).json({ success: true, data: tasks });  // ✅ Return structured JSON
//   } catch (error) {
//     console.error("❌ Error in getAllTasks:", error);
//     return res.status(500).json({ success: false, message: "Error fetching tasks" });
//   }
// };

// // Update Task
// const updateTask = async (req, res) => {
//   try {
//     const { title, text, status } = req.body;

//     if (!title || title.trim() === "") {
//       return res.status(400).json({ success: false, message: "Title is required" });
//     }

//     // Ensure `status` is boolean
//     if (status !== undefined && typeof status !== "boolean") {
//       return res.status(400).json({ success: false, message: "Invalid status value" });
//     }

//     const task = await Task.findByIdAndUpdate(
//       req.params.id,
//       { title, text, status },
//       { new: true, runValidators: true }
//     );

//     if (!task) {
//       return res.status(404).json({ success: false, message: "Task not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Task updated successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error("❌ Error in updateTask:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // Delete Task
// const deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);

//     if (!task) {
//       return res.status(404).json({ success: false, message: "Task not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Task deleted successfully",
//     });
//   } catch (error) {
//     console.error("❌ Error in deleteTask:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export { addTask, getAllTasks, updateTask, deleteTask };


import Task from "../model/taskModel.js";

// Add Task
const addTask = async (req, res) => {
  try {
    const { title, text, category, priority, dueDate, completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    // Create task with all possible fields
    const taskData = {
      title: title.trim(),
      text: text ? text.trim() : "",
      category: category || "Personal",
      priority: priority || "Medium",
      completed: completed || false
    };

    // Only add dueDate if it's provided and valid
    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid due date format" });
      }
      taskData.dueDate = parsedDate;
    }

    const task = new Task(taskData);
    await task.save();

    return res.status(201).json({
      success: true,
      message: "Task added successfully",
      data: task,
    });
  } catch (error) {
    console.error("❌ Error in addTask:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors 
      });
    }
    
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Tasks with filtering and sorting
const getAllTasks = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sortBy = "createdAt", 
      sortOrder = "desc",
      category,
      priority,
      completed,
      search 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (completed !== undefined) filter.completed = completed === "true";
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { text: { $regex: search, $options: "i" } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const tasks = await Task.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const count = await Task.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        current: page,
        limit
      }
    });
  } catch (error) {
    console.error("❌ Error in getAllTasks:", error);
    return res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
};

// Get Task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("❌ Error in getTaskById:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { title, text, completed, category, priority, dueDate } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    // Build update object with only provided fields
    const updateData = {
      title: title.trim(),
      text: text ? text.trim() : ""
    };

    // Only include fields that were provided in the request
    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ success: false, message: "Invalid completed value" });
      }
      updateData.completed = completed;
    }
    
    if (category) updateData.category = category;
    if (priority) updateData.priority = priority;
    
    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === "") {
        updateData.dueDate = null;
      } else {
        const parsedDate = new Date(dueDate);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ success: false, message: "Invalid due date format" });
        }
        updateData.dueDate = parsedDate;
      }
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
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
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors 
      });
    }
    
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

// Toggle Task Completion Status
const toggleTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    return res.status(200).json({
      success: true,
      message: `Task marked as ${task.completed ? "completed" : "pending"}`,
      data: task,
    });
  } catch (error) {
    console.error("❌ Error in toggleTaskCompletion:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Task Statistics
const getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const pendingTasks = totalTasks - completedTasks;
    
    // Group by category
    const tasksByCategory = await Task.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Group by priority
    const tasksByPriority = await Task.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      completed: false
    });

    return res.status(200).json({
      success: true,
      data: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        overdue: overdueTasks,
        byCategory: tasksByCategory,
        byPriority: tasksByPriority
      }
    });
  } catch (error) {
    console.error("❌ Error in getTaskStats:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { 
  addTask, 
  getAllTasks, 
  getTaskById,
  updateTask, 
  deleteTask, 
  toggleTaskCompletion,
  getTaskStats 
};