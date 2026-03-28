"use client";
import { useEffect, useRef } from "react";
export function useAutoSave(
  value: string,
  onSave: (value: string) => void,
  delayMs: number = 2000,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastSavedRef = useRef(value);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (value === lastSavedRef.current) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onSave(value);
      lastSavedRef.current = value;
    }, delayMs);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delayMs, onSave]);
}
