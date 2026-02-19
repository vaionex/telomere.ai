import { writable, derived } from 'svelte/store';

export const rawSnps = writable(new Map());
export const fileMetadata = writable(null);
export const isLoaded = derived(rawSnps, $s => $s.size > 0);
