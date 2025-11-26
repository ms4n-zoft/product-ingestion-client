import { useMemo } from "react";
import Fuse, { IFuseOptions } from "fuse.js";

interface UseFuzzySearchOptions<T> extends IFuseOptions<T> {
  keys?: string[];
  threshold?: number;
  limit?: number;
}

/**
 * Reusable hook for fuzzy searching with Fuse.js
 * @param items - Items to search through
 * @param query - Search query
 * @param options - Fuse.js configuration options
 * @returns Filtered and limited results
 */
export default function useFuzzySearch<T>(
  items: T[],
  query: string,
  options: UseFuzzySearchOptions<T> = {}
): T[] {
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
    return searchResults.map((result) => result.item).slice(0, limit);
  }, [query, fuse, items, limit]);

  return results;
}
