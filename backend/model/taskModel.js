import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title:{type:String, required:true},
    status:{type:Boolean, default:false},
    createAt:{type:Date, default:Date.now}
});
const Task = mongoose.model("Task", taskSchema)
export default Task;