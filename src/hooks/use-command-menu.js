import { useState, useEffect } from "react";

/**
 * Hook to manage command menu state and keyboard shortcuts
 * Handles Cmd+K, Ctrl+K, and / shortcuts
 */
export default function useCommandMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return [open, setOpen];
}
