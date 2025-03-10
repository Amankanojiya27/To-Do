import express from "express";
import { addTask, deleteTask, getAllTasks, updateTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/tasks", addTask);
router.get("/tasks", getAllTasks);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
