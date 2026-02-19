// Simple in-memory + localStorage cache for annotations
const CACHE_KEY = 'telomere_annotations_cache';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export class AnnotationCache {
  constructor() {
    this.memory = new Map();
  }

  get(rsid) {
    if (this.memory.has(rsid)) return this.memory.get(rsid);
    // Try localStorage in browser
    if (typeof localStorage !== 'undefined') {
      try {
        const cached = localStorage.getItem(`${CACHE_KEY}:${rsid}`);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            this.memory.set(rsid, data);
            return data;
          }
        }
      } catch {}
    }
    return null;
  }

  set(rsid, data) {
    this.memory.set(rsid, data);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`${CACHE_KEY}:${rsid}`, JSON.stringify({ data, timestamp: Date.now() }));
      } catch {} // localStorage full
    }
  }

  async batchGet(rsids) {
    const cached = new Map();
    const uncached = [];
    for (const rsid of rsids) {
      const hit = this.get(rsid);
      if (hit) cached.set(rsid, hit);
      else uncached.push(rsid);
    }
    return { cached, uncached };
  }

  batchSet(entries) {
    for (const [rsid, data] of entries) {
      this.set(rsid, data);
    }
  }
}
