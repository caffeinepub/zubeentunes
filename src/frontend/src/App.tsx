import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { PlaybackBar } from "./components/PlaybackBar";
import { PlayerProvider } from "./contexts/PlayerContext";
import { ExplorePage } from "./pages/ExplorePage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { PlaylistsPage } from "./pages/PlaylistsPage";

type View = "explore" | "playlists" | "favorites";

export default function App() {
  const [view, setView] = useState<View>("explore");
  const [authOpen, setAuthOpen] = useState(false);

  const handleLoginRequired = () => setAuthOpen(true);

  return (
    <PlayerProvider>
      <div className="min-h-screen flex flex-col">
        <Header
          view={view}
          onViewChange={setView}
          onLoginClick={handleLoginRequired}
        />
        <main className="flex-1">
          {view === "explore" && (
            <ExplorePage onLoginRequired={handleLoginRequired} />
          )}
          {view === "playlists" && (
            <PlaylistsPage onLoginRequired={handleLoginRequired} />
          )}
          {view === "favorites" && (
            <FavoritesPage onLoginRequired={handleLoginRequired} />
          )}
        </main>
        <Footer />
        <PlaybackBar />
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        <Toaster />
      </div>
    </PlayerProvider>
  );
}
