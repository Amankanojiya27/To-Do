import mongoose from "mongoose";
const connectDB = async () => {
  try { await
    mongoose.connect("mongodb://localhost:27017/todoapp");
    console.log("MongoDB Connectred");
  } catch (error) {
    console.error("DataBase Connection Error", error);
  }
};
export default connectDB;
