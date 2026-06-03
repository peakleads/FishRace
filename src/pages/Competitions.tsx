import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Loader, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface Competition {
  id: string;
  name: string;
  description: string;
  species: string;
  start_date: string;
  end_date: string;
  scoring_method: string;
  is_public: boolean;
  creator_id: string;
  users: {
    username: string;
  };
  member_count?: number;
}

export function Competitions() {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    species: "",
    scoring_method: "weight",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("competitions")
        .select(
          `
          id,
          name,
          description,
          species,
          start_date,
          end_date,
          scoring_method,
          is_public,
          creator_id,
          users:creator_id(username),
          competition_members(id)
        `
        )
        .order("start_date", { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map((c: any) => ({
        ...c,
        member_count: c.competition_members?.length || 0,
      }));

      setCompetitions(formatted);
    } catch (err) {
      console.error("Error fetching competitions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompetition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from("competitions").insert([
        {
          creator_id: user.id,
          name: formData.name,
          description: formData.description,
          species: formData.species,
          scoring_method: formData.scoring_method,
          start_date: formData.start_date,
          end_date: formData.end_date,
        },
      ]);

      if (error) throw error;

      setFormData({
        name: "",
        description: "",
        species: "",
        scoring_method: "weight",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
      setShowCreateForm(false);
      fetchCompetitions();
    } catch (err: any) {
      console.error("Error creating competition:", err);
    }
  };

  const handleJoinCompetition = async (competitionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("competition_members")
        .insert([
          {
            competition_id: competitionId,
            user_id: user.id,
          },
        ]);

      if (error && error.code !== "23505") throw error;
      fetchCompetitions();
    } catch (err) {
      console.error("Error joining competition:", err);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Races</h1>
            <p className="text-slate-400">Join or create fishing competitions</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            <Plus size={20} />
            Create Race
          </button>
        </div>

        {showCreateForm && (
          <form
            onSubmit={handleCreateCompetition}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Race Name
              </label>
              <input
                type="text"
                placeholder="Summer Pike Challenge"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Target Species
                </label>
                <input
                  type="text"
                  placeholder="Pike, Trout, Bass..."
                  value={formData.species}
                  onChange={(e) =>
                    setFormData({ ...formData, species: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Scoring Method
                </label>
                <select
                  value={formData.scoring_method}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scoring_method: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="weight">Heaviest</option>
                  <option value="length">Longest</option>
                  <option value="count">Most Catches</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Description
              </label>
              <textarea
                placeholder="Tell others about your race..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Create Race
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 bg-slate-800 text-slate-200 font-semibold py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size={32} className="text-cyan-400 animate-spin" />
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
            <p className="text-slate-400">No races yet</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {competitions.map((comp) => (
              <Link key={comp.id} to={`/competition/${comp.id}`} className="block">
                <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-lg p-5 transition-colors h-full flex flex-col">
                  <h3 className="text-lg font-bold text-cyan-400 mb-1">
                    {comp.name}
                  </h3>
                  {comp.species && (
                    <p className="text-sm text-slate-400 mb-2">
                      Target: <span className="text-slate-300">{comp.species}</span>
                    </p>
                  )}
                  <p className="text-slate-400 text-sm mb-3 flex-1">
                    {comp.description}
                  </p>
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <p className="text-xs text-slate-500">
                      By{" "}
                      <span className="text-slate-300">
                        {comp.users.username}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {comp.member_count} members •{" "}
                      {new Date(comp.start_date).toLocaleDateString()} -{" "}
                      {new Date(comp.end_date).toLocaleDateString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleJoinCompetition(comp.id);
                      }}
                      className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                      Join
                    </button>
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
