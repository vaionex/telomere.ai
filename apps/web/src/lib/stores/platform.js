import { writable } from 'svelte/store';

/** True when running inside Tauri desktop app */
export const isTauri = writable(false);

if (typeof window !== 'undefined') {
  isTauri.set(!!window.__TAURI_INTERNALS__);
}
