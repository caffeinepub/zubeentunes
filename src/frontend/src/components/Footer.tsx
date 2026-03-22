import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="border-t border-border mt-8 py-6 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="hover:text-foreground transition-colors cursor-pointer">
            About
          </span>
          <span className="hover:text-foreground transition-colors cursor-pointer">
            Contact
          </span>
          <span className="hover:text-foreground transition-colors cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-foreground transition-colors cursor-pointer">
            Terms
          </span>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          © {year}. Built with{" "}
          <Heart className="w-3 h-3 text-orange fill-orange" /> using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
