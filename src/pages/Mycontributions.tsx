import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Contribution {
  id: string;
  name: string;
  contributed: number;
  expected: number;
}

const MyContributions = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserContributions = async () => {
      // Get logged-in user info
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in, redirect to login
        window.location.href = "/login";
        return;
      }

      // Fetch contributions for the current user only
      const { data, error } = await supabase
        .from("contributions")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching contributions:", error.message);
        setContributions([]);
      } else {
        setContributions(data || []);
      }

      setLoading(false);
    };

    fetchUserContributions();
  }, []);

  if (loading) return <p>Loading your contributions...</p>;

  if (contributions.length === 0)
    return <p>No contributions found for your account.</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">My Contributions</h1>
      {contributions.map(({ id, name, contributed, expected }) => (
        <div key={id} className="mb-4 p-4 border rounded">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Contributed:</strong> {contributed.toLocaleString()}</p>
          <p><strong>Expected:</strong> {expected.toLocaleString()}</p>
          <p><strong>Remaining:</strong> {(expected - contributed).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default MyContributions;
