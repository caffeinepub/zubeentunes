import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ListMusic, Music, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { PlaylistInfo } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreatePlaylist,
  useDeletePlaylist,
  useFavorites,
  useMyPlaylists,
  usePlaylistSongs,
  useRemoveFromPlaylist,
} from "../hooks/useQueries";
import { formatDuration, getAlbumGradient } from "../lib/songColors";

interface PlaylistsPageProps {
  onLoginRequired: () => void;
}

function PlaylistDetail({
  playlist,
  onBack,
}: {
  playlist: PlaylistInfo;
  onBack: () => void;
  onLoginRequired: () => void;
}) {
  const { data: songs = [], isLoading } = usePlaylistSongs(playlist.id);
  useFavorites(); // preload favorites
  const removeFromPlaylist = useRemoveFromPlaylist();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          data-ocid="playlist.button"
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {playlist.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {Number(playlist.songCount)} songs
          </p>
        </div>
      </div>

      {isLoading ? (
        <div data-ocid="playlist.loading_state" className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <div data-ocid="playlist.empty_state" className="text-center py-16">
          <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">This playlist is empty.</p>
          <p className="text-muted-foreground text-sm mt-1">
            Add songs using the + icon on any song card.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {songs.map((song, i) => (
            <motion.div
              key={song.id.toString()}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              data-ocid={`playlist.item.${i + 1}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-1 border border-border hover:border-border/80 group"
            >
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0"
                style={{ background: getAlbumGradient(song.album) }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {song.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {song.album} · {formatDuration(song.durationSeconds)}
                </p>
              </div>
              <button
                type="button"
                data-ocid={`playlist.delete_button.${i + 1}`}
                onClick={() =>
                  removeFromPlaylist.mutate(
                    { playlistId: playlist.id, songId: song.id },
                    { onError: () => toast.error("Failed to remove song") },
                  )
                }
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-surface-2 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PlaylistsPage({ onLoginRequired }: PlaylistsPageProps) {
  const { identity } = useInternetIdentity();
  const { data: playlists = [], isLoading } = useMyPlaylists();
  const createPlaylist = useCreatePlaylist();
  const deletePlaylist = useDeletePlaylist();
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistInfo | null>(
    null,
  );

  const handleCreate = () => {
    if (!newName.trim()) return;
    createPlaylist.mutate(newName.trim(), {
      onSuccess: () => {
        toast.success(`Playlist "${newName}" created!`);
        setNewName("");
        setCreateOpen(false);
      },
      onError: () => toast.error("Failed to create playlist"),
    });
  };

  if (!identity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-surface-1 flex items-center justify-center">
          <ListMusic className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Your Playlists</h2>
        <p className="text-muted-foreground text-sm text-center max-w-xs">
          Sign in to create and manage your personal playlists.
        </p>
        <Button
          type="button"
          data-ocid="playlists.primary_button"
          onClick={onLoginRequired}
          className="bg-primary text-white"
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (selectedPlaylist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 pt-8">
        <PlaylistDetail
          playlist={selectedPlaylist}
          onBack={() => setSelectedPlaylist(null)}
          onLoginRequired={onLoginRequired}
        />
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
          Your Playlists
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {isLoading
            ? "Loading..."
            : `${playlists.length} playlist${playlists.length !== 1 ? "s" : ""}`}
        </p>
      </motion.div>

      <div className="flex justify-end mb-6">
        <Button
          type="button"
          data-ocid="playlists.primary_button"
          onClick={() => setCreateOpen(true)}
          className="bg-primary text-white hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-1" /> New Playlist
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="playlists.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div data-ocid="playlists.empty_state" className="text-center py-16">
          <ListMusic className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No playlists yet.</p>
          <p className="text-muted-foreground text-sm mt-1">
            Create your first playlist to get started.
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((pl, i) => (
              <motion.div
                key={pl.id.toString()}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`playlists.item.${i + 1}`}
                className="bg-surface-1 border border-border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors group"
                onClick={() => setSelectedPlaylist(pl)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedPlaylist(pl)}
                // biome-ignore lint/a11y/useSemanticElements: motion.div needs animation
                role="button"
                tabIndex={0}
              >
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <ListMusic className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {pl.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Number(pl.songCount)} songs
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`playlists.delete_button.${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist.mutate(pl.id, {
                      onSuccess: () => toast.success(`Deleted "${pl.name}"`),
                      onError: () => toast.error("Failed to delete"),
                    });
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Create playlist dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o);
          if (!o) setNewName("");
        }}
      >
        <DialogContent
          data-ocid="playlists.dialog"
          className="sm:max-w-sm bg-popover border-border"
        >
          <DialogHeader>
            <DialogTitle>New Playlist</DialogTitle>
          </DialogHeader>
          <Input
            data-ocid="playlists.input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Playlist name"
            className="bg-input border-border"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <DialogFooter>
            <Button
              type="button"
              data-ocid="playlists.cancel_button"
              variant="ghost"
              onClick={() => {
                setCreateOpen(false);
                setNewName("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="playlists.submit_button"
              onClick={handleCreate}
              disabled={!newName.trim() || createPlaylist.isPending}
              className="bg-primary text-white"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
