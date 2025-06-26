import { useState, lazy, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";

// Lazy load Lucide icons using React.lazy
const Mail = lazy(() => import("lucide-react").then((mod) => ({ default: mod.Mail })));
const Lock = lazy(() => import("lucide-react").then((mod) => ({ default: mod.Lock })));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      localStorage.setItem("token", data.session.access_token);
      window.location.href = "/";
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url('/loo.webp')` }}
    >
      <div className="bg-white/70 dark:bg-black/60 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-10 w-full max-w-sm sm:max-w-md">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6">
          <span className="text-blue-600">Lwandai Friends</span>{" "}
          <span className="text-orange-600">ASSOCIATION</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Suspense fallback={<div className="absolute left-3 top-3.5 w-5 h-5 bg-gray-300 rounded" />}>
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </Suspense>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Suspense fallback={<div className="absolute left-3 top-3.5 w-5 h-5 bg-gray-300 rounded" />}>
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </Suspense>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-full transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-sm text-blue-700 mt-4 space-x-2">
            <a href="#" className="hover:underline">Forgot Username</a>
            <span>|</span>
            <a href="#" className="hover:underline">Forgot Password</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
