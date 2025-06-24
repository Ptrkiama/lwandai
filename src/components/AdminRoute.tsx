import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error || !profile?.is_admin) {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }

      setLoading(false);
    }

    checkAdmin();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;
