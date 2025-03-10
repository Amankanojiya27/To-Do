"use client";

import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

export default function TaskList() {
  const [tasks, setTasks] = useState([
    { title: "Sample Task 1", text: "This is an example note." },
  ]);

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {tasks.map((task, index) => (
        <div key={index} className="bg-white p-4 shadow-md rounded-md relative">
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <p className="text-gray-600 mt-2">{task.text}</p>
          <div className="absolute top-2 right-2 flex gap-2">
            <button className="text-blue-500 hover:text-blue-700">
              <FaRegEdit size={20} />
            </button>
            <button onClick={() => deleteTask(index)} className="text-red-500 hover:text-red-700">
              <MdOutlineDelete size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
