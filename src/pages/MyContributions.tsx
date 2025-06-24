import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Contribution {
  id: number;
  name: string;
  contributed: number;
  expected: number;
}

const MyContributions = () => {
  const [data, setData] = useState<Contribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login"; // Redirect if not logged in
        return;
      }

      const { data, error } = await supabase
        .from("contributions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error.message);
        setData(null);
      } else {
        setData(data);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) return <p className="text-center p-4">Loading...</p>;

  if (!data) return <p className="text-center p-4">No data found.</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">My Contributions</h1>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Contributed:</strong> {data.contributed.toLocaleString()}</p>
      <p><strong>Expected:</strong> {data.expected.toLocaleString()}</p>
    </div>
  );
};

export default MyContributions;
