export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.C8G6gG85.js",app:"_app/immutable/entry/app.CKPK7dFG.js",imports:["_app/immutable/entry/start.C8G6gG85.js","_app/immutable/chunks/BtIAh8i3.js","_app/immutable/chunks/BdEKtkbX.js","_app/immutable/chunks/7s5DXyMG.js","_app/immutable/chunks/28SBeOU1.js","_app/immutable/entry/app.CKPK7dFG.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/BdEKtkbX.js","_app/immutable/chunks/BTM3LNtb.js","_app/immutable/chunks/C5AvKU7X.js","_app/immutable/chunks/C4UCJ5KW.js","_app/immutable/chunks/DJ2k6z27.js","_app/immutable/chunks/D-hzo_Mf.js","_app/immutable/chunks/DAKTqJSu.js","_app/immutable/chunks/DA4Aujfs.js","_app/immutable/chunks/CIZ277rQ.js","_app/immutable/chunks/28SBeOU1.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/3.js'))
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
		prerendered_routes: new Set(["/","/sverdle/how-to-play","/talk-to-me","/test-globe","/world-map"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
