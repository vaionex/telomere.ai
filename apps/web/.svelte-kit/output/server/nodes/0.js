

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": false,
  "ssr": false
};
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.DWW2LYOH.js","_app/immutable/chunks/DXC3ax9b.js","_app/immutable/chunks/mFslsiFm.js","_app/immutable/chunks/C1VlIKkJ.js","_app/immutable/chunks/D-9SZUtk.js","_app/immutable/chunks/hB9PhI9p.js"];
export const stylesheets = ["_app/immutable/assets/0.B5Urh39c.css"];
export const fonts = [];
