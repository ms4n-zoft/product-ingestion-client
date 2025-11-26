import { useEffect, useCallback } from "react";

interface UseKeyboardShortcutsProps {
  onApprove?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  enabled?: boolean;
}

/**
 * Hook to handle keyboard shortcuts for review workflow
 * Ignores shortcuts when user is typing in input fields to prevent conflicts
 */
const useKeyboardShortcuts = ({
  onApprove,
  onNext,
  onPrevious,
  enabled = true,
}: UseKeyboardShortcutsProps): null => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        !enabled ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case " ": // Space
        case "enter":
          event.preventDefault();
          onApprove?.();
          break;
        case "j":
        case "arrowdown":
          event.preventDefault();
          onNext?.();
          break;
        case "k":
        case "arrowup":
          event.preventDefault();
          onPrevious?.();
          break;
        default:
          break;
      }
    },
    [enabled, onApprove, onNext, onPrevious]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [enabled, handleKeyPress]);

  return null;
};

export default useKeyboardShortcuts;
