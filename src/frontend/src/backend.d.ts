import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Song {
    id: bigint;
    title: string;
    album: string;
    releaseDate: string;
    durationSeconds: bigint;
}
export interface PlaylistInfo {
    id: bigint;
    name: string;
    songCount: bigint;
}
export type UserRole = { admin: null } | { user: null } | { guest: null };
export interface backendInterface {
    getAllSongs(): Promise<Song[]>;
    searchSongs(term: string): Promise<Song[]>;
    getSongsByAlbum(albumName: string): Promise<Song[]>;
    getAlbums(): Promise<string[]>;
    addFavorite(songId: bigint): Promise<void>;
    removeFavorite(songId: bigint): Promise<void>;
    getFavorites(): Promise<bigint[]>;
    createPlaylist(name: string): Promise<bigint>;
    deletePlaylist(playlistId: bigint): Promise<void>;
    addToPlaylist(playlistId: bigint, songId: bigint): Promise<void>;
    removeFromPlaylist(playlistId: bigint, songId: bigint): Promise<void>;
    getMyPlaylists(): Promise<PlaylistInfo[]>;
    getPlaylistSongs(playlistId: bigint): Promise<Song[]>;
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
}
