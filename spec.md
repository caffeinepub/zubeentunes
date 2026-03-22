# ZubeenTunes

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Song browser with a catalog of Zubeen Garg songs (sample data: ~40 songs across several albums)
- Search by song title or album name
- Filter by album, sort by title/release date
- Favorite songs (per user)
- Playlists: create, name, add/remove songs (per user)
- User authentication (login/signup) so each person has their own favorites and playlists
- Persistent bottom playback bar showing currently selected song

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend (Motoko)
   - Song data type: id, title, album, releaseDate, durationSeconds
   - Seed ~40 sample Zubeen Garg songs across known albums (Maya, Poth, Uruka, Tumi Kar, etc.)
   - Query: list all songs, search songs by keyword, filter by album, get all albums
   - Favorites: add/remove favorite, get favorites for caller
   - Playlists: create playlist, delete playlist, add song to playlist, remove song from playlist, list playlists for caller, get playlist songs
   - Authorization integration for user identity

2. Frontend
   - Header with nav: Home, Explore Songs, Playlists; Favorites button; Login/Signup
   - Song grid with search, album filter, sort controls
   - Song cards: title, album, release date, duration, favorite toggle, add-to-playlist button
   - Playlists page: list playlists, create new, view songs in a playlist
   - Favorites page: list favorited songs
   - Bottom playback bar: shows selected song title/album, basic transport UI (no actual audio)
   - Auth modal for login/signup
