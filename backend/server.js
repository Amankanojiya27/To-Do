import express from "express";
import connectDB from "./config/db.js"; 
import taskRoutes from "./router/taskRoutes.js"; 

const app = express();

app.use(express.json());

connectDB();

app.use("/api", taskRoutes);

const port = 5000;

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));