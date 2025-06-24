export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "app/_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.BfY-Ih9V.js",app:"_app/immutable/entry/app.BgfBdmFI.js",imports:["_app/immutable/entry/start.BfY-Ih9V.js","_app/immutable/chunks/RyhAlbCv.js","_app/immutable/chunks/OCvk_b1L.js","_app/immutable/chunks/DEKD-Z9P.js","_app/immutable/chunks/sk6szpZY.js","_app/immutable/entry/app.BgfBdmFI.js","_app/immutable/chunks/Cijui7Gs.js","_app/immutable/chunks/OCvk_b1L.js","_app/immutable/chunks/DTsu6dRg.js","_app/immutable/chunks/ix9Nyvcl.js","_app/immutable/chunks/BNqjdZ_7.js","_app/immutable/chunks/BhIy6N6e.js","_app/immutable/chunks/Dm4ZGYXq.js","_app/immutable/chunks/BNkdMAJn.js","_app/immutable/chunks/B7STdJWE.js","_app/immutable/chunks/sk6szpZY.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/4.js'))
		],
		routes: [
			{
				id: "/sverdle",
				pattern: /^\/sverdle\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set(["/app/","/app/about","/app/sverdle/how-to-play","/app/test-globe","/app/world-map"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
