import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated pike silhouette background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="pikeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          {/* Pike body - stylized side view */}
          <path
            d="M 200 400 Q 400 350 600 380 Q 750 400 850 400 L 900 380 L 850 400 L 900 420 Q 750 400 600 420 Q 400 450 200 400 Z"
            fill="url(#pikeGradient2)"
          />
          {/* Pike head - pointed snout */}
          <path d="M 200 380 L 150 400 L 200 420 Z" fill="url(#pikeGradient2)" />
          {/* Dorsal fin */}
          <path d="M 500 380 L 480 320 L 520 380 Z" fill="url(#pikeGradient2)" opacity="0.7" />
          {/* Tail fin */}
          <path d="M 900 380 L 950 360 L 950 400 L 950 440 L 950 420 Z" fill="url(#pikeGradient2)" opacity="0.7" />
        </svg>
      </div>

      {/* Animated water ripple effect */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/5 to-transparent animate-pulse pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 animate-bounce">
            <div className="text-6xl">🎣</div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 mb-2">
            FishRace
          </h1>
          <p className="text-lg text-slate-300 font-semibold">Hook Your Competition</p>
          <p className="text-slate-400 text-sm mt-1">Welcome Back, Angler</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 space-y-4 shadow-2xl shadow-cyan-500/10"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-gap-2">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Email
            </label>
            <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 rounded-xl px-4 py-3 transition-colors focus-within:border-cyan-500 focus-within:bg-slate-800">
              <Mail size={20} className="text-cyan-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-transparent flex-1 outline-none text-slate-100 placeholder-slate-500 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Password
            </label>
            <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 rounded-xl px-4 py-3 transition-colors focus-within:border-cyan-500 focus-within:bg-slate-800">
              <Lock size={20} className="text-cyan-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent flex-1 outline-none text-slate-100 placeholder-slate-500 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all disabled:opacity-50 transform hover:scale-105 active:scale-95"
          >
            {loading ? "Casting line..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-slate-400 mt-6">
            New to FishRace?{" "}
            <a href="/signup" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
              Create Account
            </a>
          </p>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 space-y-2">
          <p>🎯 Catch, Compete, Dominate</p>
          <p>⚡ Lightning-fast leaderboards</p>
          <p>🏆 Prove you're the best angler</p>
        </div>
      </div>
    </div>
  );
}
