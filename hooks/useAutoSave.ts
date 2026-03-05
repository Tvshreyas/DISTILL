"use client";

import { useEffect, useRef, useCallback } from "react";

export function useAutoSave(
  value: string,
  onSave: (value: string) => void,
  delayMs: number = 3000
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(value);
  const valueRef = useRef(value);
  const onSaveRef = useRef(onSave);

  // Sync refs via effect (React 19 disallows ref writes during render)
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const save = useCallback(() => {
    if (valueRef.current !== lastSavedRef.current && valueRef.current.trim().length > 0) {
      lastSavedRef.current = valueRef.current;
      onSaveRef.current(valueRef.current);
    }
  }, []);

  useEffect(() => {
    if (value === lastSavedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(save, delayMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, save, delayMs]);

  // Save immediately on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (lastSavedRef.current !== valueRef.current && valueRef.current.trim().length > 0) {
        onSaveRef.current(valueRef.current);
      }
    };
  }, []);
}
