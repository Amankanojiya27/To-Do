// types/task.ts
export interface Task {
  _id: string;
  title: string;
  text: string;
  category?: string;
  priority?: string;
  dueDate?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}