import { useEffect, useRef } from "react";

/**
 * This is an Ink friendly version of useWhatChanged
 * https://github.com/simbathesailor/use-what-changed
 */
export const useWhatChanged = (vals: unknown[], names?: string) => {
  const valRef = useRef(vals);

  useEffect(() => {
    const changes = vals.map((v, i) => v !== valRef.current[i]);
    if (changes.some((c) => c)) {
      const changedNames = names
        ? names.split(",")
        : vals.map((_, i) => `val${i}`);
      const changed = changes
        .map((c, i) => (c ? changedNames[i] || `val${i}` : null))
        .filter((c) => c)
        .join(", ");
      process.stderr.write(`Changed: ${changed}\n`);
      valRef.current = vals;
    }
  });
};
