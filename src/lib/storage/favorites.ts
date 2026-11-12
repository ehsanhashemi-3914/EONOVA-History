"use client";

/**
 * Favorites — saved entities, events and people, kept in this browser only.
 */
import { useCallback, useSyncExternalStore } from "react";
import { createLocalStore } from "./local-store";

export type FavoriteType = "entity" | "event" | "person";

/** Stored as "type:id" strings, e.g. "entity:achaemenid-empire". */
export type FavoriteKey = `${FavoriteType}:${string}`;

export const FAVORITES_STORAGE_KEY = "eonova-favorites";

const EMPTY: FavoriteKey[] = [];

function isFavoriteList(value: unknown): value is FavoriteKey[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && /^(entity|event|person):[a-z0-9-]+$/.test(item))
  );
}

export const favoritesStore = createLocalStore<FavoriteKey[]>(FAVORITES_STORAGE_KEY, EMPTY, isFavoriteList);

export function favoriteKey(type: FavoriteType, id: string): FavoriteKey {
  return `${type}:${id}`;
}

export function parseFavoriteKey(key: FavoriteKey): { type: FavoriteType; id: string } {
  const separator = key.indexOf(":");
  return { type: key.slice(0, separator) as FavoriteType, id: key.slice(separator + 1) };
}

/** Pure helper: add the key if missing, remove it if present. */
export function toggleInList(list: readonly FavoriteKey[], key: FavoriteKey): FavoriteKey[] {
  return list.includes(key) ? list.filter((item) => item !== key) : [...list, key];
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot,
  );

  const toggle = useCallback((type: FavoriteType, id: string) => {
    favoritesStore.update((current) => toggleInList(current, favoriteKey(type, id)));
  }, []);

  const clear = useCallback(() => favoritesStore.set([]), []);

  const has = useCallback((type: FavoriteType, id: string) => favorites.includes(favoriteKey(type, id)), [favorites]);

  return { favorites, toggle, clear, has };
}
