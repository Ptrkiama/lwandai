import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const UserHeader: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserName() {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setUserName(null);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      setUserName(profile?.full_name || user.email);
      setLoading(false);
    }

    fetchUserName();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) fetchUserName();
        else setUserName(null);
      }
    );

    return () => subscription?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      setIsDarkMode(saved === "true");
    } else {
      const hour = new Date().getHours();
      setIsDarkMode(hour < 6 || hour >= 18);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark-mode-transition");
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return null;

  return (
    <header className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 shadow-md px-6 py-4 mb-8 rounded-b-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Lwandai Friends Association
          </h1>
          {userName && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {userName}
            </p>
          )}
        </div>

        <div className="mt-4 sm:mt-0 flex gap-3">
          <button
            onClick={() => {
              const newMode = !isDarkMode;
              setIsDarkMode(newMode);
              localStorage.setItem("darkMode", String(newMode));
            }}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 dark:text-white"
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
