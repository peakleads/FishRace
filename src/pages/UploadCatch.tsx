import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Camera, MapPin, AlertCircle, CheckCircle } from "lucide-react";

export function UploadCatch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    species: "",
    weight_kg: "",
    length_cm: "",
    notes: "",
    location_privacy: "public",
    caught_date: new Date().toISOString().split("T")[0],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !imageFile) {
      setError("Please select an image");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const fileName = `${user.id}/${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("catch-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("catch-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl.publicUrl;
      }

      const { error: insertError } = await supabase.from("catches").insert([
        {
          user_id: user.id,
          species: formData.species,
          weight_kg: parseFloat(formData.weight_kg),
          length_cm: parseFloat(formData.length_cm),
          image_url: imageUrl,
          notes: formData.notes,
          location_privacy: formData.location_privacy,
          caught_at: new Date(formData.caught_date).toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to upload catch");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-4 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              Catch uploaded!
            </h2>
            <p className="text-slate-400">Redirecting to feed...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Upload Catch</h1>
        <p className="text-slate-400 mb-6">Share your fish with the community</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-gap-2">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-slate-200 mb-4">
              <span className="flex items-center gap-2">
                <Camera size={18} />
                Photo of your catch
              </span>
            </label>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-slate-700 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500/50 transition-colors">
                <div className="space-y-2">
                  <Camera size={32} className="mx-auto text-slate-400" />
                  <p className="text-slate-300">
                    Click to select or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Species
              </label>
              <input
                type="text"
                placeholder="e.g., Pike, Trout, Bass"
                value={formData.species}
                onChange={(e) =>
                  setFormData({ ...formData, species: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Date Caught
              </label>
              <input
                type="date"
                value={formData.caught_date}
                onChange={(e) =>
                  setFormData({ ...formData, caught_date: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={formData.weight_kg}
                onChange={(e) =>
                  setFormData({ ...formData, weight_kg: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Length (cm)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={formData.length_cm}
                onChange={(e) =>
                  setFormData({ ...formData, length_cm: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Notes
            </label>
            <textarea
              placeholder="Add details about your catch..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
              <MapPin size={18} />
              Location Privacy
            </label>
            <select
              value={formData.location_privacy}
              onChange={(e) =>
                setFormData({ ...formData, location_privacy: e.target.value })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="private">Private (not visible)</option>
              <option value="friends">Friends Only</option>
              <option value="public">Public</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !imageFile}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Catch"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
