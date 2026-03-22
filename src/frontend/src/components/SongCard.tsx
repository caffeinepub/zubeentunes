import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heart, ListPlus, Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { PlaylistInfo, Song } from "../backend.d";
import { usePlayer } from "../contexts/PlayerContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddFavorite,
  useAddToPlaylist,
  useCreatePlaylist,
  useMyPlaylists,
  useRemoveFavorite,
} from "../hooks/useQueries";
import { formatDuration, getAlbumGradient } from "../lib/songColors";

interface SongCardProps {
  song: Song;
  queue: Song[];
  isFavorite: boolean;
  index: number;
  onLoginRequired: () => void;
}

export function SongCard({
  song,
  queue,
  isFavorite,
  index,
  onLoginRequired,
}: SongCardProps) {
  const { playSong, currentSong } = usePlayer();
  const { identity } = useInternetIdentity();
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const addToPlaylist = useAddToPlaylist();
  const createPlaylist = useCreatePlaylist();
  const { data: playlists = [] } = useMyPlaylists();
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const isPlaying = currentSong?.id === song.id;
  const gradient = getAlbumGradient(song.album);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!identity) {
      onLoginRequired();
      return;
    }
    if (isFavorite) {
      removeFav.mutate(song.id, {
        onError: () => toast.error("Failed to remove favorite"),
      });
    } else {
      addFav.mutate(song.id, {
        onError: () => toast.error("Failed to add favorite"),
      });
    }
  };

  const handleAddToPlaylist = (playlist: PlaylistInfo) => {
    addToPlaylist.mutate(
      { playlistId: playlist.id, songId: song.id },
      {
        onSuccess: () => {
          toast.success(`Added to "${playlist.name}"`);
          setPlaylistOpen(false);
        },
        onError: () => toast.error("Failed to add to playlist"),
      },
    );
  };

  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim()) return;
    createPlaylist.mutate(newPlaylistName.trim(), {
      onSuccess: (id) => {
        addToPlaylist.mutate(
          { playlistId: id, songId: song.id },
          { onSuccess: () => toast.success(`Added to "${newPlaylistName}"`) },
        );
        setNewPlaylistName("");
        setShowCreate(false);
        setPlaylistOpen(false);
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      data-ocid={`song.item.${index + 1}`}
      className={`group relative rounded-lg overflow-hidden bg-surface-1 border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer hover:shadow-card ${
        isPlaying ? "ring-1 ring-primary/60 border-primary/60" : ""
      }`}
      onClick={() => playSong(song, queue)}
      onKeyDown={(e) => e.key === "Enter" && playSong(song, queue)}
      // biome-ignore lint/a11y/useSemanticElements: motion.div needs to be interactive
      role="button"
      tabIndex={0}
    >
      {/* Album Art */}
      <div
        className="aspect-square w-full relative"
        style={{ background: gradient }}
      >
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="flex gap-1 items-end">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-orange rounded-sm"
                  style={{
                    height: `${12 + i * 6}px`,
                    animation: `pulse ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <button
            type="button"
            data-ocid={`song.button.${index + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              playSong(song, queue);
            }}
            className="w-10 h-10 rounded-full bg-orange flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-foreground truncate">
          {song.title}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {song.album}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {formatDuration(song.durationSeconds)}
          </span>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation handler on non-interactive container */}
          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Add to playlist */}
            <Popover
              open={playlistOpen}
              onOpenChange={(o) => {
                if (o && !identity) {
                  onLoginRequired();
                  return;
                }
                setPlaylistOpen(o);
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  data-ocid={`song.open_modal_button.${index + 1}`}
                  className="p-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Add to playlist"
                >
                  <ListPlus className="w-3.5 h-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                data-ocid="song.popover"
                className="w-52 p-2 bg-popover border-border"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs font-semibold text-muted-foreground px-1 mb-1">
                  Add to playlist
                </p>
                {playlists.length === 0 && !showCreate && (
                  <p className="text-xs text-muted-foreground px-1 py-1">
                    No playlists yet
                  </p>
                )}
                {playlists.map((pl) => (
                  <button
                    type="button"
                    key={pl.id.toString()}
                    onClick={() => handleAddToPlaylist(pl)}
                    className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-surface-2 text-foreground transition-colors"
                  >
                    {pl.name}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({Number(pl.songCount)})
                    </span>
                  </button>
                ))}
                {showCreate ? (
                  <div className="flex gap-1 mt-1">
                    <Input
                      data-ocid="song.input"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="Playlist name"
                      className="h-7 text-xs bg-input"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCreateAndAdd()
                      }
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={handleCreateAndAdd}
                    >
                      +
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-surface-2 text-primary transition-colors mt-1"
                  >
                    + New playlist
                  </button>
                )}
              </PopoverContent>
            </Popover>

            {/* Favorite */}
            <button
              type="button"
              data-ocid={`song.toggle.${index + 1}`}
              onClick={handleFavorite}
              className={`p-1 rounded hover:bg-surface-2 transition-colors ${
                isFavorite
                  ? "text-orange"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={isFavorite ? "Remove favorite" : "Add favorite"}
            >
              <Heart
                className={`w-3.5 h-3.5 ${isFavorite ? "fill-orange" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
