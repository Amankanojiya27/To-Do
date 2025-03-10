"use client";

import { useState } from "react";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !text) return;
    
    console.log({ title, text });

    setTitle("");
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-md max-w-md mx-auto my-6">
      <input
        type="text"
        placeholder="Title"
        className="w-full border-b p-2 outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Take a note..."
        className="w-full border-b p-2 outline-none mt-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600">
        Add Note
      </button>
    </form>
  );
}
