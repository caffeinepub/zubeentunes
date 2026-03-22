import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import type { Song } from "../backend.d";
import { SongCard } from "../components/SongCard";
import { useAlbums, useAllSongs, useFavorites } from "../hooks/useQueries";

type SortOption = "az" | "za" | "newest" | "oldest";

interface ExplorePageProps {
  onLoginRequired: () => void;
}

export function ExplorePage({ onLoginRequired }: ExplorePageProps) {
  const { data: songs = [], isLoading: songsLoading } = useAllSongs();
  const { data: albums = [] } = useAlbums();
  const { data: favorites = [] } = useFavorites();
  const [search, setSearch] = useState("");
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("az");

  const toggleAlbum = useCallback((album: string) => {
    setSelectedAlbums((prev) =>
      prev.includes(album) ? prev.filter((a) => a !== album) : [...prev, album],
    );
  }, []);

  const favSet = useMemo(
    () => new Set(favorites.map((id) => id.toString())),
    [favorites],
  );

  const filtered = useMemo(() => {
    let result: Song[] = [...songs];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.album.toLowerCase().includes(q),
      );
    }
    if (selectedAlbums.length > 0) {
      result = result.filter((s) => selectedAlbums.includes(s.album));
    }
    switch (sort) {
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        result.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
        break;
      case "oldest":
        result.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
        break;
    }
    return result;
  }, [songs, search, selectedAlbums, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-10"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Explore Songs
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {songs.length > 0
            ? `${songs.length} songs from Zubeen Garg's discography`
            : "Loading discography..."}
        </p>
      </motion.div>

      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="explore.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs, albums…"
            className="pl-9 bg-input border-border rounded-full h-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex-shrink-0">
            Sort by
          </span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger
              data-ocid="explore.select"
              className="h-9 w-32 bg-input border-border rounded-full text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="az">A → Z</SelectItem>
              <SelectItem value="za">Z → A</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Album filters */}
      {albums.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1">
              <ChevronDown className="w-3 h-3" /> Filter by album
            </span>
            {albums.map((album) => (
              <button
                type="button"
                key={album}
                data-ocid="explore.tab"
                onClick={() => toggleAlbum(album)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedAlbums.includes(album)
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-1 border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {album}
              </button>
            ))}
          </div>
          {/* Active filter chips */}
          {selectedAlbums.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {selectedAlbums.map((album) => (
                <Badge
                  key={album}
                  variant="secondary"
                  className="rounded-full bg-primary/20 text-primary border-primary/30 text-xs cursor-pointer hover:bg-primary/30 transition-colors"
                  onClick={() => toggleAlbum(album)}
                >
                  {album} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              <button
                type="button"
                onClick={() => setSelectedAlbums([])}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Songs grid */}
      {songsLoading ? (
        <div
          data-ocid="explore.loading_state"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
            <div key={i} className="rounded-lg overflow-hidden bg-surface-1">
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div data-ocid="explore.empty_state" className="text-center py-16">
          <p className="text-muted-foreground">No songs found.</p>
          {(search || selectedAlbums.length > 0) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedAlbums([]);
              }}
              className="text-primary text-sm mt-2 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((song, i) => (
            <SongCard
              key={song.id.toString()}
              song={song}
              queue={filtered}
              isFavorite={favSet.has(song.id.toString())}
              index={i}
              onLoginRequired={onLoginRequired}
            />
          ))}
        </div>
      )}
    </div>
  );
}
