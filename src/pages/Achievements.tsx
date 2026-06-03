import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Loader, Trophy, Target, TrendingUp } from "lucide-react";

export function Achievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const achievementsList = [
    {
      key: "first_catch",
      name: "First Cast",
      description: "Upload your first catch",
      icon: "🎣",
    },
    {
      key: "five_kg",
      name: "Heavy Hitter",
      description: "Catch a 5kg fish",
      icon: "⚖️",
    },
    {
      key: "ten_kg",
      name: "Monster Fish",
      description: "Catch a 10kg fish",
      icon: "🐳",
    },
    {
      key: "meter_fish",
      name: "A Meter Long",
      description: "Catch a 1m fish",
      icon: "📏",
    },
    {
      key: "hundred_catches",
      name: "Century Club",
      description: "100 total catches",
      icon: "💯",
    },
    {
      key: "ten_competitions",
      name: "Racer",
      description: "Join 10 competitions",
      icon: "🏁",
    },
  ];

  useEffect(() => {
    if (!user) return;
    fetchAchievements();
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("achievements")
        .select("achievement_key")
        .eq("user_id", user?.id);

      if (error) throw error;

      setAchievements(data || []);
    } catch (err) {
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  const earnedKeys = new Set(achievements.map((a) => a.achievement_key));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Achievements</h1>
        <p className="text-slate-400 mb-6">Unlock badges and milestones</p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size={32} className="text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievementsList.map((achievement) => (
              <div
                key={achievement.key}
                className={`border rounded-lg p-6 text-center transition-all ${
                  earnedKeys.has(achievement.key)
                    ? "bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/50"
                    : "bg-slate-900 border-slate-800 opacity-50"
                }`}
              >
                <div className="text-5xl mb-3">{achievement.icon}</div>
                <h3 className="font-bold text-slate-100 mb-1">
                  {achievement.name}
                </h3>
                <p className="text-sm text-slate-400">{achievement.description}</p>
                {earnedKeys.has(achievement.key) && (
                  <div className="mt-3 inline-block">
                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
                      Unlocked
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
