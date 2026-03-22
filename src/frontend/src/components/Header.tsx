import { Button } from "@/components/ui/button";
import { Heart, LogIn, LogOut, Music2 } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type View = "explore" | "playlists" | "favorites";

interface HeaderProps {
  view: View;
  onViewChange: (v: View) => void;
  onLoginClick: () => void;
}

export function Header({ view, onViewChange, onLoginClick }: HeaderProps) {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const navLinks: { label: string; value: View }[] = [
    { label: "Explore Songs", value: "explore" },
    { label: "Playlists", value: "playlists" },
    { label: "Favorites", value: "favorites" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface-1/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        {/* Brand */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => onViewChange("explore")}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-foreground tracking-tight">
            Zubeen<span className="text-orange">Tunes</span>
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.value}
              data-ocid={`nav.${link.value}.link`}
              onClick={() => onViewChange(link.value)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                view === link.value
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2 ml-auto">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                data-ocid="nav.favorites.link"
                onClick={() => onViewChange("favorites")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-orange hover:bg-surface-2 transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Favorites</span>
              </button>
              <Button
                type="button"
                data-ocid="nav.button"
                variant="ghost"
                size="sm"
                onClick={clear}
                className="text-muted-foreground hover:text-foreground"
                disabled={isInitializing}
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button
              type="button"
              data-ocid="nav.primary_button"
              size="sm"
              onClick={onLoginClick}
              disabled={isInitializing}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <LogIn className="w-4 h-4 mr-1" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
