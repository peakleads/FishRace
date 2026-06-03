import { Home, Trophy, Zap, Map, User, LogOut, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { path: "/", label: "Feed", icon: Home },
    { path: "/competitions", label: "Races", icon: Trophy },
    { path: "/leaderboard", label: "Boards", icon: Zap },
    { path: "/map", label: "Map", icon: Map },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 md:relative md:w-64 md:h-screen md:border-r md:border-t-0 md:flex md:flex-col">
      <div className="hidden md:flex md:flex-col md:h-full md:justify-between">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            FishRace
          </h1>
        </div>
        <div className="flex-1 space-y-2 px-4">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link to="/upload">
            <button className="w-full flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              <Plus size={18} />
              Upload
            </button>
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-2 text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="md:hidden flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <button
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "text-cyan-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <item.icon size={24} />
            </button>
          </Link>
        ))}
        <Link to="/upload">
          <button className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
            <Plus size={24} />
          </button>
        </Link>
      </div>
    </nav>
  );
}
