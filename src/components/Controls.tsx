import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const Controls = () => {
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop controls */}
      <div className="hidden sm:flex justify-end p-4 gap-6">
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-md border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400 transition"
        >
          Logout
        </button>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-2 flex justify-around items-center sm:hidden">
        <button
          onClick={toggleDarkMode}
          className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-300"
        >
          {darkMode ? "☀️" : "🌙"}
          <span>{darkMode ? "Light" : "Dark"}</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-sm text-red-600 dark:text-red-400"
        >
          🚪
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default Controls;
