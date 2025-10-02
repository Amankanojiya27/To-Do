"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center">
        <motion.div
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src="/notes-keep.png"
            width={40}
            height={40}
            alt="logo"
            className="mr-3"
          />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          TaskKeeper
        </h1>
      </div>
      
      {mounted && (
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <FiSun size={20} className="text-yellow-500" />
          ) : (
            <FiMoon size={20} className="text-blue-600" />
          )}
        </button>
      )}
    </header>
  );
}