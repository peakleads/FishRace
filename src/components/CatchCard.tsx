import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

interface CatchCardProps {
  id: string;
  userAvatar: string;
  username: string;
  userId: string;
  species: string;
  weight: number;
  length: number;
  image: string;
  likes: number;
  comments: number;
  liked?: boolean;
  onLike?: () => void;
  caughtAt: string;
}

export function CatchCard({
  id,
  userAvatar,
  username,
  userId,
  species,
  weight,
  length,
  image,
  likes,
  comments,
  liked,
  onLike,
  caughtAt,
}: CatchCardProps) {
  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 hover:border-slate-700 transition-colors">
      <Link to={`/catch/${id}`}>
        <div className="aspect-square overflow-hidden bg-slate-800">
          <img
            src={image}
            alt={species}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/profile/${userId}`}>
          <div className="flex items-center gap-3 mb-3 hover:opacity-75 transition-opacity">
            <img
              src={userAvatar}
              alt={username}
              className="w-10 h-10 rounded-full bg-slate-700"
            />
            <span className="font-semibold text-slate-100">{username}</span>
          </div>
        </Link>

        <div className="mb-3">
          <h3 className="text-lg font-bold text-cyan-400">{species}</h3>
          <p className="text-sm text-slate-400">
            {weight}kg • {length}cm
          </p>
          <p className="text-xs text-slate-500 mt-1">{caughtAt}</p>
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-slate-800">
          <button
            onClick={onLike}
            className={`flex items-center gap-1 transition-colors ${
              liked
                ? "text-red-500 hover:text-red-400"
                : "text-slate-400 hover:text-red-500"
            }`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            <span className="text-sm">{likes}</span>
          </button>
          <button className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors">
            <MessageCircle size={18} />
            <span className="text-sm">{comments}</span>
          </button>
          <button className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors ml-auto">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
