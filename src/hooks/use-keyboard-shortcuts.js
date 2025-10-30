import { useEffect, useCallback } from "react";

/**
 * Hook to handle keyboard shortcuts for review workflow
 * @param {Object} options - Configuration options
 * @param {Function} options.onApprove - Callback when Space/Enter is pressed
 * @param {Function} options.onNext - Callback when J or ArrowDown is pressed
 * @param {Function} options.onPrevious - Callback when K or ArrowUp is pressed
 * @param {boolean} options.enabled - Whether shortcuts are enabled
 */
const useKeyboardShortcuts = ({
  onApprove,
  onNext,
  onPrevious,
  enabled = true,
}) => {
  const handleKeyPress = useCallback(
    (event) => {
      // Ignore if typing in input/textarea or if disabled
      if (
        !enabled ||
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
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
