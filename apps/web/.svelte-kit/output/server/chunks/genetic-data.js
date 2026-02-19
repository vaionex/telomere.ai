import { d as derived, w as writable } from "./index2.js";
const rawSnps = writable(/* @__PURE__ */ new Map());
const fileMetadata = writable(null);
const isLoaded = derived(rawSnps, ($s) => $s.size > 0);
export {
  fileMetadata as f,
  isLoaded as i,
  rawSnps as r
};
