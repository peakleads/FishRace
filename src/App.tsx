import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "lucide-react";

import { Login } from "@/pages/Login";
import { SignUp } from "@/pages/SignUp";
import { Feed } from "@/pages/Feed";
import { UploadCatch } from "@/pages/UploadCatch";
import { Leaderboard } from "@/pages/Leaderboard";
import { Competitions } from "@/pages/Competitions";
import { Profile } from "@/pages/Profile";
import { Map } from "@/pages/Map";
import { Achievements } from "@/pages/Achievements";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size={32} className="text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size={32} className="text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignUp />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadCatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/competitions"
          element={
            <ProtectedRoute>
              <Competitions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/competition/:id"
          element={
            <ProtectedRoute>
              <Competitions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catch/:id"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
