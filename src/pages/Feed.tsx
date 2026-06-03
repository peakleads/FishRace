import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/Layout";
import { CatchCard } from "@/components/CatchCard";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "lucide-react";

interface Catch {
  id: string;
  user_id: string;
  species: string;
  weight_kg: number;
  length_cm: number;
  image_url: string;
  caught_at: string;
  users: {
    username: string;
    avatar_url: string;
  };
  likes_count?: number;
  comments_count?: number;
  liked?: boolean;
}

export function Feed() {
  const { user } = useAuth();
  const [catches, setCatches] = useState<Catch[]>([]);
  const [likedCatches, setLikedCatches] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchCatches();
  }, [user]);

  const fetchCatches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
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
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedCatches = (data || []).map((c: any) => ({
        ...c,
        likes_count: c.likes?.length || 0,
        liked: c.likes?.some((l: any) => l.user_id === user?.id),
      }));

      setCatches(formattedCatches);

      const likedSet = new Set(
        formattedCatches
          .filter((c: any) => c.liked)
          .map((c: any) => c.id)
      );
      setLikedCatches(likedSet);
    } catch (err) {
      console.error("Error fetching catches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (catchId: string) => {
    if (!user) return;

    try {
      if (likedCatches.has(catchId)) {
        await supabase
          .from("likes")
          .delete()
          .eq("catch_id", catchId)
          .eq("user_id", user.id);
        likedCatches.delete(catchId);
      } else {
        await supabase.from("likes").insert([
          {
            catch_id: catchId,
            user_id: user.id,
          },
        ]);
        likedCatches.add(catchId);
      }
      setLikedCatches(new Set(likedCatches));
      fetchCatches();
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Feed</h1>
        <p className="text-slate-400 mb-6">
          Latest catches from the community
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size={32} className="text-cyan-400 animate-spin" />
          </div>
        ) : catches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No catches yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid gap-4">
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
