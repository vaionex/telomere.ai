import { writable, derived } from 'svelte/store';

export const annotations = writable(new Map());
export const annotationProgress = writable({ processed: 0, total: 0, percent: 0 });
export const isAnnotating = writable(false);

export const annotatedCount = derived(annotations, $a => $a.size);

// Merge annotations with our curated SNP database for richer results
export const enrichedFindings = derived([annotations], ([$annotations]) => {
  // This will be used by report pages to show both curated + API-enriched data
  return $annotations;
});
