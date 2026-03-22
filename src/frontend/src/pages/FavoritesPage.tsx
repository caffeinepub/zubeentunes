import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { SongCard } from "../components/SongCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllSongs, useFavorites } from "../hooks/useQueries";

interface FavoritesPageProps {
  onLoginRequired: () => void;
}

export function FavoritesPage({ onLoginRequired }: FavoritesPageProps) {
  const { identity } = useInternetIdentity();
  const { data: songs = [] } = useAllSongs();
  const { data: favorites = [], isLoading } = useFavorites();

  const favSet = useMemo(
    () => new Set(favorites.map((id) => id.toString())),
    [favorites],
  );
  const favSongs = useMemo(
    () => songs.filter((s) => favSet.has(s.id.toString())),
    [songs, favSet],
  );

  if (!identity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-surface-1 flex items-center justify-center">
          <Heart className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Your Favorites</h2>
        <p className="text-muted-foreground text-sm text-center max-w-xs">
          Sign in to save and view your favorite Zubeen Garg songs.
        </p>
        <Button
          data-ocid="favorites.primary_button"
          onClick={onLoginRequired}
          className="bg-primary text-white"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Your Favorites
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {isLoading ? "Loading..." : `${favSongs.length} songs you love`}
        </p>
      </motion.div>

      {!isLoading && favSongs.length === 0 ? (
        <div data-ocid="favorites.empty_state" className="text-center py-16">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No favorites yet.</p>
          <p className="text-muted-foreground text-sm mt-1">
            Tap the heart on any song to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favSongs.map((song, i) => (
            <SongCard
              key={song.id.toString()}
              song={song}
              queue={favSongs}
              isFavorite={true}
              index={i}
              onLoginRequired={onLoginRequired}
            />
          ))}
        </div>
      )}
    </div>
  );
}
