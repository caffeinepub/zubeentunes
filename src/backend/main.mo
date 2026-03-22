import AccessControl "./authorization/access-control";
import MixinAuthorization "./authorization/MixinAuthorization";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

actor {

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Song = {
    id : Nat;
    title : Text;
    album : Text;
    releaseDate : Text;
    durationSeconds : Nat;
  };

  public type PlaylistInfo = {
    id : Nat;
    name : Text;
    songCount : Nat;
  };

  type Playlist = { id : Nat; name : Text; songIds : [Nat] };

  let catalog : [Song] = [
    { id = 1; title = "Mur Prithibi"; album = "Maya"; releaseDate = "2002"; durationSeconds = 285 },
    { id = 2; title = "Rati Bator Tara"; album = "Maya"; releaseDate = "2002"; durationSeconds = 312 },
    { id = 3; title = "Aai"; album = "Maya"; releaseDate = "2002"; durationSeconds = 270 },
    { id = 4; title = "Tumar Baabe"; album = "Maya"; releaseDate = "2002"; durationSeconds = 298 },
    { id = 5; title = "Nishitha"; album = "Maya"; releaseDate = "2002"; durationSeconds = 265 },
    { id = 6; title = "Aakashot Uki Mare"; album = "Maya"; releaseDate = "2002"; durationSeconds = 240 },
    { id = 7; title = "Phool Bagi"; album = "Maya"; releaseDate = "2002"; durationSeconds = 305 },
    { id = 8; title = "Poth"; album = "Poth"; releaseDate = "2004"; durationSeconds = 320 },
    { id = 9; title = "Tumi Mor Jiwanar"; album = "Poth"; releaseDate = "2004"; durationSeconds = 290 },
    { id = 10; title = "Bhalobasa"; album = "Poth"; releaseDate = "2004"; durationSeconds = 275 },
    { id = 11; title = "Sonar Pinjor"; album = "Poth"; releaseDate = "2004"; durationSeconds = 310 },
    { id = 12; title = "Dhemalite"; album = "Poth"; releaseDate = "2004"; durationSeconds = 260 },
    { id = 13; title = "Mone Pore"; album = "Poth"; releaseDate = "2004"; durationSeconds = 280 },
    { id = 14; title = "Uruka"; album = "Uruka"; releaseDate = "2006"; durationSeconds = 295 },
    { id = 15; title = "Bihu Aahi Gol"; album = "Uruka"; releaseDate = "2006"; durationSeconds = 240 },
    { id = 16; title = "Nupuror Dhwani"; album = "Uruka"; releaseDate = "2006"; durationSeconds = 315 },
    { id = 17; title = "Suwali Phool"; album = "Uruka"; releaseDate = "2006"; durationSeconds = 285 },
    { id = 18; title = "Tomar Mone"; album = "Uruka"; releaseDate = "2006"; durationSeconds = 270 },
    { id = 19; title = "Bondhu Mor"; album = "Uruka"; releaseDate = "2006"; durationSeconds = 300 },
    { id = 20; title = "Tumi Kar"; album = "Tumi Kar"; releaseDate = "2008"; durationSeconds = 330 },
    { id = 21; title = "Akou Boha Aahi"; album = "Tumi Kar"; releaseDate = "2008"; durationSeconds = 285 },
    { id = 22; title = "Nil Aakash"; album = "Tumi Kar"; releaseDate = "2008"; durationSeconds = 295 },
    { id = 23; title = "Moromor Gaan"; album = "Tumi Kar"; releaseDate = "2008"; durationSeconds = 260 },
    { id = 24; title = "Bihugeet"; album = "Tumi Kar"; releaseDate = "2008"; durationSeconds = 275 },
    { id = 25; title = "Kahaniyo"; album = "Tumi Kar"; releaseDate = "2008"; durationSeconds = 310 },
    { id = 26; title = "Unison"; album = "Unison"; releaseDate = "2010"; durationSeconds = 320 },
    { id = 27; title = "Jiwanar Gaan"; album = "Unison"; releaseDate = "2010"; durationSeconds = 290 },
    { id = 28; title = "Dil Mein"; album = "Unison"; releaseDate = "2010"; durationSeconds = 265 },
    { id = 29; title = "Xopun"; album = "Unison"; releaseDate = "2010"; durationSeconds = 300 },
    { id = 30; title = "Lahe Lahe"; album = "Unison"; releaseDate = "2010"; durationSeconds = 285 },
    { id = 31; title = "Mon Jai"; album = "Singles"; releaseDate = "2012"; durationSeconds = 250 },
    { id = 32; title = "Prithibi"; album = "Singles"; releaseDate = "2013"; durationSeconds = 275 },
    { id = 33; title = "Bhalobasi"; album = "Singles"; releaseDate = "2015"; durationSeconds = 260 },
    { id = 34; title = "Tara Bhori Rati"; album = "Singles"; releaseDate = "2016"; durationSeconds = 295 },
    { id = 35; title = "Dhemali"; album = "Singles"; releaseDate = "2018"; durationSeconds = 240 }
  ];

  var favoritesMap = Map.empty<Principal, [Nat]>();
  var playlistsMap = Map.empty<Principal, [Playlist]>();
  var nextPlaylistId : Nat = 1;

  func hasNat(arr : [Nat], n : Nat) : Bool {
    for (x in arr.vals()) { if (x == n) return true };
    false;
  };

  func appendNat(arr : [Nat], n : Nat) : [Nat] {
    arr.concat([n]);
  };

  func filterNat(arr : [Nat], keep : Nat -> Bool) : [Nat] {
    arr.filter(keep);
  };

  // ---- Song queries ----

  public query func getAllSongs() : async [Song] {
    catalog;
  };

  public query func searchSongs(term : Text) : async [Song] {
    let t = term.toLower();
    catalog.filter(func(s : Song) : Bool {
      s.title.toLower().contains(#text t) or s.album.toLower().contains(#text t);
    });
  };

  public query func getSongsByAlbum(albumName : Text) : async [Song] {
    catalog.filter(func(s : Song) : Bool { s.album == albumName });
  };

  public query func getAlbums() : async [Text] {
    var seen = Map.empty<Text, Bool>();
    var result : [Text] = [];
    for (s in catalog.vals()) {
      if (seen.get(s.album) == null) {
        seen.add(s.album, true);
        result := result.concat([s.album]);
      };
    };
    result;
  };

  // ---- Favorites ----

  public shared ({ caller }) func addFavorite(songId : Nat) : async () {
    let current = switch (favoritesMap.get(caller)) { case (?ids) ids; case null [] };
    if (not hasNat(current, songId)) {
      favoritesMap.add(caller, appendNat(current, songId));
    };
  };

  public shared ({ caller }) func removeFavorite(songId : Nat) : async () {
    let current = switch (favoritesMap.get(caller)) { case (?ids) ids; case null [] };
    favoritesMap.add(caller, filterNat(current, func(id : Nat) : Bool { id != songId }));
  };

  public shared query ({ caller }) func getFavorites() : async [Nat] {
    switch (favoritesMap.get(caller)) { case (?ids) ids; case null [] };
  };

  // ---- Playlists ----

  public shared ({ caller }) func createPlaylist(name : Text) : async Nat {
    let current = switch (playlistsMap.get(caller)) { case (?ps) ps; case null [] };
    let id = nextPlaylistId;
    nextPlaylistId += 1;
    playlistsMap.add(caller, current.concat([{ id; name; songIds = [] }]));
    id;
  };

  public shared ({ caller }) func deletePlaylist(playlistId : Nat) : async () {
    let current = switch (playlistsMap.get(caller)) { case (?ps) ps; case null [] };
    playlistsMap.add(caller, current.filter(func(pl : Playlist) : Bool { pl.id != playlistId }));
  };

  public shared ({ caller }) func addToPlaylist(playlistId : Nat, songId : Nat) : async () {
    let current = switch (playlistsMap.get(caller)) { case (?ps) ps; case null [] };
    playlistsMap.add(caller, current.map(func(pl : Playlist) : Playlist {
      if (pl.id == playlistId and not hasNat(pl.songIds, songId)) {
        { id = pl.id; name = pl.name; songIds = appendNat(pl.songIds, songId) };
      } else pl;
    }));
  };

  public shared ({ caller }) func removeFromPlaylist(playlistId : Nat, songId : Nat) : async () {
    let current = switch (playlistsMap.get(caller)) { case (?ps) ps; case null [] };
    playlistsMap.add(caller, current.map(func(pl : Playlist) : Playlist {
      if (pl.id == playlistId) {
        { id = pl.id; name = pl.name; songIds = filterNat(pl.songIds, func(id : Nat) : Bool { id != songId }) };
      } else pl;
    }));
  };

  public shared query ({ caller }) func getMyPlaylists() : async [PlaylistInfo] {
    let current = switch (playlistsMap.get(caller)) { case (?ps) ps; case null [] };
    current.map(func(pl : Playlist) : PlaylistInfo {
      { id = pl.id; name = pl.name; songCount = pl.songIds.size() };
    });
  };

  public shared query ({ caller }) func getPlaylistSongs(playlistId : Nat) : async [Song] {
    let current = switch (playlistsMap.get(caller)) { case (?ps) ps; case null [] };
    var songIds : [Nat] = [];
    for (pl in current.vals()) {
      if (pl.id == playlistId) { songIds := pl.songIds };
    };
    catalog.filter(func(s : Song) : Bool { hasNat(songIds, s.id) });
  };

};
