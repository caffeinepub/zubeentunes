const ALBUM_COLORS: Record<string, [string, string]> = {};

const PALETTES: [string, string][] = [
  ["oklch(0.45 0.2 256)", "oklch(0.3 0.15 270)"],
  ["oklch(0.55 0.2 30)", "oklch(0.35 0.18 50)"],
  ["oklch(0.5 0.18 160)", "oklch(0.32 0.15 180)"],
  ["oklch(0.52 0.2 300)", "oklch(0.34 0.18 320)"],
  ["oklch(0.58 0.18 62)", "oklch(0.38 0.16 80)"],
  ["oklch(0.48 0.2 220)", "oklch(0.3 0.16 240)"],
  ["oklch(0.5 0.22 340)", "oklch(0.32 0.18 20)"],
  ["oklch(0.54 0.19 130)", "oklch(0.36 0.15 150)"],
];

let paletteIndex = 0;

export function getAlbumGradient(album: string): string {
  if (!ALBUM_COLORS[album]) {
    const [from, to] = PALETTES[paletteIndex % PALETTES.length];
    ALBUM_COLORS[album] = [from, to];
    paletteIndex++;
  }
  const [from, to] = ALBUM_COLORS[album];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

export function formatDuration(seconds: bigint | number): string {
  const s = Number(seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, "0")}`;
}
