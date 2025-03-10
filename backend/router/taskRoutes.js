import express from "express";
import { addTask, getAllTasks, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

// Route: Add a new task
router.post("/addTask", addTask);

// Route: Get all tasks
router.get("/getAllTasks", getAllTasks);

// Route: Update a task (PATCH is better for partial updates)
router.patch("/updateTask/:id", updateTask);

// Route: Delete a task
router.delete("/deleteTask/:id", deleteTask);

export default router;
