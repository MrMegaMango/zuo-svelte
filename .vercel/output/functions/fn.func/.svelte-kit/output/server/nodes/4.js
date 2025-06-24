import * as universal from '../entries/pages/sverdle/_page.js';
import * as server from '../entries/pages/sverdle/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sverdle/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/sverdle/+page.js";
export { server };
export const server_id = "src/routes/sverdle/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.SSylubm3.js","_app/immutable/chunks/BhIy6N6e.js","_app/immutable/chunks/OCvk_b1L.js","_app/immutable/chunks/DTsu6dRg.js","_app/immutable/chunks/ix9Nyvcl.js","_app/immutable/chunks/BNqjdZ_7.js","_app/immutable/chunks/Dm4ZGYXq.js","_app/immutable/chunks/C7ZtyHhz.js","_app/immutable/chunks/BUa8iJmo.js","_app/immutable/chunks/BNkdMAJn.js","_app/immutable/chunks/RyhAlbCv.js","_app/immutable/chunks/DEKD-Z9P.js","_app/immutable/chunks/sk6szpZY.js"];
export const stylesheets = ["_app/immutable/assets/4.yeGN9jlM.css"];
export const fonts = [];
