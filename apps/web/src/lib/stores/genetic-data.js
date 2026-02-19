import { writable, derived } from 'svelte/store';

/**
 * Multi-genome data store
 * Supports up to 6 loaded genomes for family comparison
 */

// Colors assigned to each genome slot
export const GENOME_COLORS = ['#00E5CC', '#8B5CF6', '#F59E0B', '#10B981', '#F43F5E', '#6366F1'];
export const GENOME_COLOR_NAMES = ['cyan', 'violet', 'amber', 'green', 'rose'];

// All loaded genomes: { id, name, color, snps: Map, metadata: {} }
export const genomes = writable([]);

// Currently active genome index
export const activeGenomeIndex = writable(0);

// Derived: the active genome object
export const activeGenome = derived(
  [genomes, activeGenomeIndex],
  ([$genomes, $idx]) => $genomes[$idx] || null
);

// Derived: active genome's SNPs (backward compatible with old rawSnps usage)
export const rawSnps = derived(
  activeGenome,
  ($g) => $g?.snps || new Map()
);

// Derived: active genome's metadata
export const fileMetadata = derived(
  activeGenome,
  ($g) => $g?.metadata || null
);

// Derived: is any genome loaded?
export const isLoaded = derived(genomes, ($g) => $g.length > 0);

// Derived: is compare mode possible?
export const canCompare = derived(genomes, ($g) => $g.length >= 2);

// Compare mode toggle
export const compareMode = writable(false);

/**
 * Add a new genome to the store
 * @param {string} name - Display name ("Me", "Mom", etc.)
 * @param {Map} snps - Parsed SNP map
 * @param {object} metadata - File metadata
 * @returns {number} index of the new genome
 */
export function addGenome(name, snps, metadata) {
  let idx;
  genomes.update($g => {
    if ($g.length >= 6) return $g; // max 6
    idx = $g.length;
    return [...$g, {
      id: crypto.randomUUID(),
      name,
      color: GENOME_COLORS[idx],
      colorName: GENOME_COLOR_NAMES[idx],
      snps,
      metadata,
    }];
  });
  activeGenomeIndex.set(idx);
  return idx;
}

/**
 * Remove a genome by index
 */
export function removeGenome(index) {
  genomes.update($g => {
    const updated = $g.filter((_, i) => i !== index);
    return updated;
  });
  activeGenomeIndex.update($idx => {
    if ($idx >= index && $idx > 0) return $idx - 1;
    return $idx;
  });
}

/**
 * Rename a genome
 */
export function renameGenome(index, newName) {
  genomes.update($g => {
    const updated = [...$g];
    if (updated[index]) updated[index] = { ...updated[index], name: newName };
    return updated;
  });
}

/**
 * Switch active genome
 */
export function setActiveGenome(index) {
  activeGenomeIndex.set(index);
}

/**
 * Clear all genomes (reset)
 */
export function clearAll() {
  genomes.set([]);
  activeGenomeIndex.set(0);
  compareMode.set(false);
}
