import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.CsujluNI.js","_app/immutable/chunks/Cijui7Gs.js","_app/immutable/chunks/BhIy6N6e.js","_app/immutable/chunks/OCvk_b1L.js","_app/immutable/chunks/ix9Nyvcl.js","_app/immutable/chunks/sk6szpZY.js","_app/immutable/chunks/C6By3Q4M.js","_app/immutable/chunks/BUa8iJmo.js","_app/immutable/chunks/CNwYbvBH.js","_app/immutable/chunks/DsDEqLD6.js","_app/immutable/chunks/RyhAlbCv.js","_app/immutable/chunks/DEKD-Z9P.js"];
export const stylesheets = ["_app/immutable/assets/0.B3FY0s_n.css"];
export const fonts = ["_app/immutable/assets/fira-mono-cyrillic-ext-400-normal.B04YIrm4.woff2","_app/immutable/assets/fira-mono-cyrillic-ext-400-normal.0xXfcOOq.woff","_app/immutable/assets/fira-mono-cyrillic-400-normal.36-45Uyg.woff2","_app/immutable/assets/fira-mono-cyrillic-400-normal.Dq7SlH2J.woff","_app/immutable/assets/fira-mono-greek-ext-400-normal.CsqI23CO.woff2","_app/immutable/assets/fira-mono-greek-ext-400-normal.BEhC8Nsh.woff","_app/immutable/assets/fira-mono-greek-400-normal.C3zng6O6.woff2","_app/immutable/assets/fira-mono-greek-400-normal.DUeQbRz0.woff","_app/immutable/assets/fira-mono-latin-ext-400-normal.D6XfiR-_.woff2","_app/immutable/assets/fira-mono-latin-ext-400-normal.lWlD_NAB.woff","_app/immutable/assets/fira-mono-latin-400-normal.DKjLVgQi.woff2","_app/immutable/assets/fira-mono-latin-400-normal.g4W12wf9.woff"];
