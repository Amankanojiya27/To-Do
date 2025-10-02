// import mongoose from "mongoose";

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   text: { type: String },
//   completed: { type: Boolean, default: false },
// }, { timestamps: true });

// const Task = mongoose.model("Task", taskSchema);
// export default Task;

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  text: { 
    type: String, 
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  category: {
    type: String,
    enum: ["Personal", "Work", "Shopping", "Health", "Finance", "Other"],
    default: "Personal"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: "Due date must be in the future"
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted due date
taskSchema.virtual("formattedDueDate").get(function() {
  if (!this.dueDate) return null;
  return this.dueDate.toISOString().split('T')[0];
});

// Virtual for overdue status
taskSchema.virtual("isOverdue").get(function() {
  if (!this.dueDate || this.completed) return false;
  return this.dueDate < new Date();
});

// Pre-save middleware to ensure consistent data
taskSchema.pre("save", function(next) {
  // Trim whitespace from title and text
  if (this.title) this.title = this.title.trim();
  if (this.text) this.text = this.text.trim();
  next();
});

// Index for better query performance
taskSchema.index({ completed: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;