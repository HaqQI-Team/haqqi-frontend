import { useEffect, useRef } from "react";
import { useRouter } from "../router/useRouter";
import { useAuth } from "../hooks/useAuth";

function parseAccessTokenFromHash(hash) {
  if (!hash || hash.length < 2) {
    return null;
  }

  const params = new URLSearchParams(hash.slice(1)); // strip leading "#"
  const token = params.get("accessToken");

  return token && token.trim() ? token.trim() : null;
}

export default function GoogleCallbackPage() {
  const { navigate } = useRouter();
  const { completeGoogleLogin } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function run() {
      const accessToken = parseAccessTokenFromHash(window.location.hash);

      // scrub token from the URL immediately, regardless of outcome
      window.history.replaceState({}, "", window.location.pathname);

      if (!accessToken) {
        navigate("/login?error=google_login_failed");
        return;
      }

      try {
        await completeGoogleLogin(accessToken);
        navigate("/complaints");
      } catch {
        navigate("/login?error=google_login_failed");
      }
    }

    run();
  }, [completeGoogleLogin, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#fbf7f5] dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-900/10 border-t-red-900 dark:border-red-300/10 dark:border-t-red-500"></div>
        <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Signing you in…</p>
      </div>
    </div>
  );
}
