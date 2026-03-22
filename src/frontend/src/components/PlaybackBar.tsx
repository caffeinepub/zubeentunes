import { Slider } from "@/components/ui/slider";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { formatDuration, getAlbumGradient } from "../lib/songColors";

export function PlaybackBar() {
  const { currentSong, isPlaying, progress, togglePlay, playNext, playPrev } =
    usePlayer();
  const [volume, setVolume] = useState([75]);

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          data-ocid="player.panel"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(900px,calc(100vw-2rem))] z-50"
        >
          <div className="bg-surface-2 border border-border rounded-2xl px-4 py-3 shadow-card flex items-center gap-4 backdrop-blur-sm">
            {/* Album art + info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0"
                style={{ background: getAlbumGradient(currentSong.album) }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {currentSong.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentSong.album}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-1 flex-1 max-w-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  data-ocid="player.button"
                  onClick={playPrev}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  data-ocid="player.toggle"
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-orange flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 text-white fill-white" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                  )}
                </button>
                <button
                  type="button"
                  data-ocid="player.button"
                  onClick={playNext}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
              {/* Progress bar */}
              <div className="w-full flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-7 text-right">
                  {formatDuration(
                    Math.floor(
                      (Number(currentSong.durationSeconds) * progress) / 100,
                    ),
                  )}
                </span>
                <div className="flex-1 h-1 bg-surface-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground w-7">
                  {formatDuration(currentSong.durationSeconds)}
                </span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-20"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
