import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import MyContributions from "./pages/MyContributions";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminView"; // Admin dashboard component

import MainLayout from "./layouts/MainLayout"; // Layout with UserHeader

import { supabase } from "@/lib/supabaseClient";

const queryClient = new QueryClient();

// AdminRoute protects routes for admins only
const AdminRoute = ({ children }: { children: ReactNode }) => {
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/my-contributions" element={<MainLayout><MyContributions /></MainLayout>} />

          {/* Protected admin route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
