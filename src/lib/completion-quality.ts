import { CompletionQuality, CompletionQualityInfo } from "@/types";

export const QUALITY_LEVELS = {
  high: {
    threshold: 50,
    label: "High Completion",
    color: "success",
  },
  medium: {
    threshold: 35,
    label: "Medium Completion",
    color: "warning",
  },
  low: {
    threshold: 0,
    label: "Low Completion",
    color: "destructive",
  },
} as const;

/**
 * Maps a completion percentage to its quality level
 * @param percentage - Completion percentage (0-100)
 * @returns CompletionQualityInfo object with level, label, and percentage
 */
export function getCompletionQuality(
  percentage: number
): CompletionQualityInfo {
  let level: CompletionQuality;

  if (percentage > 50) {
    level = "high";
  } else if (percentage >= 35) {
    level = "medium";
  } else {
    level = "low";
  }

  return {
    level,
    label: QUALITY_LEVELS[level].label,
    percentage,
  };
}

/**
 * Returns the appropriate badge variant for a quality level
 * Used for consistent styling across the application
 * - High: Green (success variant)
 * - Medium: Yellow (warning variant) 
 * - Low: Red (destructive variant)
 */
export function getQualityBadgeVariant(
  quality: CompletionQuality
): "success" | "warning" | "destructive" | "outline" {
  switch (quality) {
    case "high":
      return "success"; // Green
    case "medium":
      return "warning"; // Yellow
    case "low":
      return "destructive"; // Red
    default:
      return "outline";
  }
}

/**
 * Returns a color class for quality level indicators
 */
export function getQualityColor(quality: CompletionQuality): string {
  return QUALITY_LEVELS[quality].color;
}
