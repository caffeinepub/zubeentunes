import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Song } from "../backend.d";

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  progress: number;
  currentIndex: number;
}

interface PlayerContextValue extends PlayerState {
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  setProgress: (p: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    queue: [],
    isPlaying: false,
    progress: 0,
    currentIndex: -1,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopProgress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startProgress = useCallback(() => {
    stopProgress();
    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev.isPlaying) return prev;
        const next = Math.min(
          prev.progress +
            100 / (Number(prev.currentSong?.durationSeconds ?? 180) * 10),
          100,
        );
        return { ...prev, progress: next };
      });
    }, 100);
  }, [stopProgress]);

  const playSong = useCallback((song: Song, queue?: Song[]) => {
    const q = queue ?? [song];
    const idx = q.findIndex((s) => s.id === song.id);
    setState({
      currentSong: song,
      queue: q,
      isPlaying: true,
      progress: 0,
      currentIndex: idx >= 0 ? idx : 0,
    });
  }, []);

  const togglePlay = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const playNext = useCallback(() => {
    setState((prev) => {
      if (prev.queue.length === 0) return prev;
      const nextIdx = (prev.currentIndex + 1) % prev.queue.length;
      return {
        ...prev,
        currentSong: prev.queue[nextIdx],
        currentIndex: nextIdx,
        progress: 0,
      };
    });
  }, []);

  const playPrev = useCallback(() => {
    setState((prev) => {
      if (prev.queue.length === 0) return prev;
      const prevIdx =
        (prev.currentIndex - 1 + prev.queue.length) % prev.queue.length;
      return {
        ...prev,
        currentSong: prev.queue[prevIdx],
        currentIndex: prevIdx,
        progress: 0,
      };
    });
  }, []);

  const setProgress = useCallback((p: number) => {
    setState((prev) => ({ ...prev, progress: p }));
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: state.currentSong intentionally triggers restart
  useEffect(() => {
    if (state.isPlaying) {
      startProgress();
    } else {
      stopProgress();
    }
    return stopProgress;
  }, [state.isPlaying, state.currentSong, startProgress, stopProgress]);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        playSong,
        togglePlay,
        playNext,
        playPrev,
        setProgress,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
