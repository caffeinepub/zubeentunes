import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PlaylistInfo, Song, backendInterface } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Cast to the full interface from backend.d.ts since backend.ts generates an empty stub
function getBackend(actor: unknown): backendInterface {
  return actor as backendInterface;
}

export function useAllSongs() {
  const { actor, isFetching } = useActor();
  return useQuery<Song[]>({
    queryKey: ["songs", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return getBackend(actor).getAllSongs();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAlbums() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["albums"],
    queryFn: async () => {
      if (!actor) return [];
      return getBackend(actor).getAlbums();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFavorites() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<bigint[]>({
    queryKey: ["favorites", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return getBackend(actor).getFavorites();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (songId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return getBackend(actor).addFavorite(songId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (songId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return getBackend(actor).removeFavorite(songId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useMyPlaylists() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<PlaylistInfo[]>({
    queryKey: ["playlists", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return getBackend(actor).getMyPlaylists();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function usePlaylistSongs(playlistId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Song[]>({
    queryKey: ["playlist-songs", playlistId?.toString()],
    queryFn: async () => {
      if (!actor || playlistId === null) return [];
      return getBackend(actor).getPlaylistSongs(playlistId);
    },
    enabled: !!actor && !isFetching && playlistId !== null,
  });
}

export function useCreatePlaylist() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return getBackend(actor).createPlaylist(name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["playlists"] }),
  });
}

export function useDeletePlaylist() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (playlistId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return getBackend(actor).deletePlaylist(playlistId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["playlists"] }),
  });
}

export function useAddToPlaylist() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playlistId,
      songId,
    }: { playlistId: bigint; songId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return getBackend(actor).addToPlaylist(playlistId, songId);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ["playlist-songs", vars.playlistId.toString()],
      }),
  });
}

export function useRemoveFromPlaylist() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playlistId,
      songId,
    }: { playlistId: bigint; songId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return getBackend(actor).removeFromPlaylist(playlistId, songId);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["playlist-songs", vars.playlistId.toString()],
      });
      qc.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}
