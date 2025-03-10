"use client";

import Header from "@/components/Header";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <Header />
      <TaskForm />
      <TaskList />
    </main>
  );
}
