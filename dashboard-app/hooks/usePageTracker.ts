"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * Hook that tracks page visits and time spent on each page.
 * Sends audit logs to the server when a page is opened and when the user leaves.
 */
export function usePageTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const startTimeRef = useRef<number>(Date.now());
  const lastPathRef = useRef<string>(pathname);

  useEffect(() => {
    // Don't track if not logged in
    if (!session?.user?.id) return;

    const sendLog = (sahifa: string, davomiyligi?: number) => {
      // Use sendBeacon for reliability during page unload
      const data = JSON.stringify({
        sahifa,
        davomiyligi,
        turi: "SAHIFA_OCHISH",
        amal: davomiyligi ? `Sahifadan chiqdi (${davomiyligi}s)` : "Sahifani ochdi",
      });

      // Use fetch for normal logs, sendBeacon for unload
      if (davomiyligi !== undefined) {
        navigator.sendBeacon("/api/audit/log", data);
      } else {
        fetch("/api/audit/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
        }).catch(() => {}); // Silently ignore errors
      }
    };

    // Log page open
    sendLog(pathname);
    startTimeRef.current = Date.now();
    lastPathRef.current = pathname;

    // Log time spent when leaving
    const handleBeforeUnload = () => {
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      sendLog(lastPathRef.current, seconds);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Log time spent when navigating to a different page
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (seconds > 0) {
        sendLog(lastPathRef.current, seconds);
      }
    };
  }, [pathname, session?.user?.id]);
}
