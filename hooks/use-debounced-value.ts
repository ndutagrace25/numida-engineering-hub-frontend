"use client";

import { useEffect, useState } from "react";

/** Returns `value`, delayed by `delayMs` of no further changes — for
 * throttling search-as-you-type requests. */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
