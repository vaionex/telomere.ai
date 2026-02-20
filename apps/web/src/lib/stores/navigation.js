import { writable } from 'svelte/store';
export const activeSection = writable('overview');
export const searchQuery = writable('');
