import { Layout } from "@/components/Layout";

export function Map() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Catch Map</h1>
        <p className="text-slate-400 mb-6">Explore catches on the map</p>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
          <p className="text-slate-400">
            Map feature coming soon - display catch locations here
          </p>
        </div>
      </div>
    </Layout>
  );
}
