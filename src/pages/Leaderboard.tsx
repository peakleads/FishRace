import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/Layout";
import { Loader, Trophy, Scale, Ruler } from "lucide-react";
import { Link } from "react-router-dom";

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string;
  value: number;
  rank: number;
}

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<
    "weight" | "length" | "count" | "competitions"
  >("weight");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase.from("catches").select(
        `
        user_id,
        users:user_id(username, avatar_url),
        ${activeTab === "weight" ? "weight_kg" : activeTab === "length" ? "length_cm" : "id"}
      `
      );

      const { data, error } = await query;

      if (error) throw error;

      let processed: LeaderboardEntry[] = [];

      if (activeTab === "count") {
        const grouped = (data || []).reduce(
          (acc: any, catch_: any) => {
            const uid = catch_.user_id;
            if (!acc[uid]) {
              acc[uid] = {
                user_id: uid,
                username: catch_.users.username,
                avatar_url: catch_.users.avatar_url,
                value: 0,
              };
            }
            acc[uid].value += 1;
            return acc;
          },
          {}
        );

        processed = Object.values(grouped)
          .sort((a: any, b: any) => b.value - a.value)
          .map((entry: any, idx: number) => ({
            ...entry,
            rank: idx + 1,
          }));
      } else {
        const grouped = (data || []).reduce(
          (acc: any, catch_: any) => {
            const uid = catch_.user_id;
            const value =
              activeTab === "weight" ? catch_.weight_kg : catch_.length_cm;
            if (!acc[uid]) {
              acc[uid] = {
                user_id: uid,
                username: catch_.users.username,
                avatar_url: catch_.users.avatar_url,
                value: 0,
              };
            }
            acc[uid].value = Math.max(acc[uid].value, value);
            return acc;
          },
          {}
        );

        processed = Object.values(grouped)
          .sort((a: any, b: any) => b.value - a.value)
          .map((entry: any, idx: number) => ({
            ...entry,
            rank: idx + 1,
          }));
      }

      setLeaderboard(processed);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "weight" as const, label: "Heaviest", icon: Scale },
    { id: "length" as const, label: "Longest", icon: Ruler },
    { id: "count" as const, label: "Most Catches", icon: Trophy },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Leaderboards</h1>
        <p className="text-slate-400 mb-6">Compete and climb the ranks</p>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size={32} className="text-cyan-400 animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
            <p className="text-slate-400">No data yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 20).map((entry) => (
              <Link
                key={entry.user_id}
                to={`/profile/${entry.user_id}`}
                className="block"
              >
                <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-lg p-4 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {entry.rank}
                    </div>
                    <img
                      src={entry.avatar_url}
                      alt={entry.username}
                      className="w-12 h-12 rounded-full bg-slate-700"
                    />
                    <div>
                      <p className="font-semibold text-slate-100">
                        {entry.username}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-cyan-400">
                      {activeTab === "count"
                        ? entry.value
                        : `${entry.value.toFixed(2)} ${activeTab === "weight" ? "kg" : "cm"}`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
