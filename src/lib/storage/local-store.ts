/**
 * A tiny "external store" on top of localStorage.
 *
 * localStorage is the browser's small key–value notebook: it survives page
 * reloads, belongs to this site only, and never leaves the device.
 *
 * React components cannot simply read it during rendering — the server has no
 * localStorage, and React must be told when the value changes. The pattern for
 * that is `useSyncExternalStore`, which needs three things from us:
 *   subscribe(listener)  – call the listener whenever the value changes
 *   getSnapshot()        – the current value (the SAME object if nothing changed)
 *   getServerSnapshot()  – what to use while rendering on the server
 */
export interface LocalStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (value: T) => void;
  update: (updater: (current: T) => T) => void;
}

export function createLocalStore<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): LocalStore<T> {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue: T = fallback;

  function read(): T {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return cachedValue; // storage blocked: keep working from memory
    }
    if (raw === cachedRaw) return cachedValue; // unchanged → return the same object
    cachedRaw = raw;
    try {
      const parsed: unknown = raw === null ? fallback : JSON.parse(raw);
      cachedValue = isValid(parsed) ? parsed : fallback;
    } catch {
      cachedValue = fallback; // corrupted JSON → start clean instead of crashing
    }
    return cachedValue;
  }

  function emit() {
    listeners.forEach((listener) => listener());
  }

  function set(value: T) {
    const raw = JSON.stringify(value);
    cachedRaw = raw;
    cachedValue = value;
    try {
      window.localStorage.setItem(key, raw);
    } catch {
      // Storage full or blocked: the value still lives in memory for this visit.
    }
    emit();
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      // The "storage" event fires when ANOTHER tab changes localStorage.
      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot: read,
    getServerSnapshot: () => fallback,
    set,
    update: (updater) => set(updater(read())),
  };
}
