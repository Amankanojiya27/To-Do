import express from "express";
import cors from "cors";
import connectDB from "./config/db.js"; 
import taskRoutes from "./router/taskRoutes.js"; 

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Connect to Database
connectDB();

// Routes
app.use("/api", taskRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}/api`);
});
