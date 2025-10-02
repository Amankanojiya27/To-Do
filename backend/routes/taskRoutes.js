import express from "express";
import {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getTaskById,
  toggleTaskCompletion,
  getTaskStats
} from "../controllers/taskController.js";

const router = express.Router();

// Task CRUD routes
router.post("/addTask", addTask);
router.get("/getAllTasks", getAllTasks);
router.get("/getTask/:id", getTaskById);
router.patch("/updateTask/:id", updateTask);
router.delete("/deleteTask/:id", deleteTask);

// Additional utility routes
router.patch("/toggleTaskCompletion/:id", toggleTaskCompletion);
router.get("/getTaskStats", getTaskStats);

export default router;