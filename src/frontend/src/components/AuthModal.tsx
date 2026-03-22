import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Music2 } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, isLoggingIn, isLoginSuccess, identity } =
    useInternetIdentity();

  useEffect(() => {
    if (isLoginSuccess && identity) {
      onClose();
    }
  }, [isLoginSuccess, identity, onClose]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="auth.dialog"
        className="sm:max-w-sm bg-popover border-border"
      >
        <DialogHeader className="items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-2">
            <Music2 className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Sign in to ZubeenTunes
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Sign in to save favorites and create playlists.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <Button
            data-ocid="auth.primary_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
              </>
            ) : (
              "Continue with Internet Identity"
            )}
          </Button>
          <Button
            data-ocid="auth.cancel_button"
            variant="ghost"
            onClick={onClose}
            className="w-full text-muted-foreground"
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
