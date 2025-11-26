import { useMemo } from "react";
import Fuse from "fuse.js";

/**
 * Reusable hook for fuzzy searching with Fuse.js
 * @param {Array} items - Items to search through
 * @param {string} query - Search query
 * @param {Object} options - Fuse.js configuration options
 * @returns {Array} Filtered and limited results
 */
export default function useFuzzySearch(items, query, options = {}) {
  const {
    keys = [],
    threshold = 0.3,
    limit = 50,
    ...fuseOptions
  } = options;

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys,
      threshold,
      includeScore: true,
      ...fuseOptions,
    });
  }, [items, keys, threshold, JSON.stringify(fuseOptions)]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, limit);
    }

    const searchResults = fuse.search(query);
    return searchResults.map(result => result.item).slice(0, limit);
  }, [query, fuse, items, limit]);

  return results;
}
