import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const UserHeader: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
      </div>
    </header>
  );
};

export default UserHeader;
