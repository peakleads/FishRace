import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { CatchCard } from "@/components/CatchCard";
import { useAuth } from "@/hooks/useAuth";

interface ProfileStats {
  total_catches: number;
  biggest_weight: number;
  biggest_length: number;
  favorite_species: string;
}

export function Profile() {
  const { userId: paramUserId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const userId = paramUserId || currentUser?.id;

  const [profile, setProfile] = useState<any>(null);
  const [catches, setCatches] = useState<any[]>([]);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedCatches, setLikedCatches] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) {
      if (!currentUser) navigate("/login");
      return;
    }
    fetchProfile();
  }, [userId, currentUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: catchData, error: catchError } = await supabase
        .from("catches")
        .select(
          `
          id,
          user_id,
          species,
          weight_kg,
          length_cm,
          image_url,
          caught_at,
          users:user_id(username, avatar_url),
          likes(id)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (catchError) throw catchError;

      const formattedCatches = (catchData || []).map((c: any) => ({
        ...c,
        likes_count: c.likes?.length || 0,
        liked: c.likes?.some((l: any) => l.user_id === currentUser?.id),
      }));

      setCatches(formattedCatches);

      const likedSet = new Set(
        formattedCatches.filter((c: any) => c.liked).map((c: any) => c.id)
      );
      setLikedCatches(likedSet);

      if (catchData && catchData.length > 0) {
        const weights = catchData.map((c: any) => c.weight_kg);
        const lengths = catchData.map((c: any) => c.length_cm);

        setStats({
          total_catches: catchData.length,
          biggest_weight: Math.max(...weights),
          biggest_length: Math.max(...lengths),
          favorite_species: catchData[0].species,
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (catchId: string) => {
    if (!currentUser) return;

    try {
      if (likedCatches.has(catchId)) {
        await supabase
          .from("likes")
          .delete()
          .eq("catch_id", catchId)
          .eq("user_id", currentUser.id);
        likedCatches.delete(catchId);
      } else {
        await supabase.from("likes").insert([
          {
            catch_id: catchId,
            user_id: currentUser.id,
          },
        ]);
        likedCatches.add(catchId);
      }
      setLikedCatches(new Set(likedCatches));
      fetchProfile();
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loader size={32} className="text-cyan-400 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4 text-center py-12">
          <p className="text-slate-400">Profile not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-24 h-24 rounded-full bg-slate-700"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                {profile.username}
              </h1>
              {profile.bio && (
                <p className="text-slate-400 mb-4">{profile.bio}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats && (
                  <>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 uppercase">
                        Total Catches
                      </p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {stats.total_catches}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 uppercase">
                        Biggest Fish
                      </p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {stats.biggest_weight.toFixed(1)}kg
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 uppercase">
                        Longest Fish
                      </p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {stats.biggest_length.toFixed(1)}cm
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 uppercase">
                        Favorite
                      </p>
                      <p className="text-lg font-bold text-cyan-400">
                        {stats.favorite_species}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-100 mb-4">Recent Catches</h2>

        {catches.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
            <p className="text-slate-400">No catches yet</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {catches.map((c) => (
              <CatchCard
                key={c.id}
                id={c.id}
                userAvatar={c.users.avatar_url}
                username={c.users.username}
                userId={c.user_id}
                species={c.species}
                weight={c.weight_kg}
                length={c.length_cm}
                image={c.image_url}
                likes={c.likes_count || 0}
                comments={0}
                liked={likedCatches.has(c.id)}
                onLike={() => handleLike(c.id)}
                caughtAt={new Date(c.caught_at).toLocaleDateString()}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
