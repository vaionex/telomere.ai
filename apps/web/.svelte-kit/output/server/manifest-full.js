export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.C-enyp_9.js",app:"_app/immutable/entry/app.DR96lBXf.js",imports:["_app/immutable/entry/start.C-enyp_9.js","_app/immutable/chunks/CuYi9sGH.js","_app/immutable/chunks/mFslsiFm.js","_app/immutable/chunks/CVwb4DH4.js","_app/immutable/chunks/B6EDXzyB.js","_app/immutable/entry/app.DR96lBXf.js","_app/immutable/chunks/Dp1pzeXC.js","_app/immutable/chunks/mFslsiFm.js","_app/immutable/chunks/BpggGyi-.js","_app/immutable/chunks/D-9SZUtk.js","_app/immutable/chunks/DXC3ax9b.js","_app/immutable/chunks/B6EDXzyB.js","_app/immutable/chunks/C1VlIKkJ.js","_app/immutable/chunks/CZEX9JcD.js","_app/immutable/chunks/Dhx1VHtg.js","_app/immutable/chunks/CVwb4DH4.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/blog",
				pattern: /^\/blog\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/blog/[slug]",
				pattern: /^\/blog\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/explore",
				pattern: /^\/explore\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/report/carrier",
				pattern: /^\/report\/carrier\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/report/health",
				pattern: /^\/report\/health\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/report/longevity",
				pattern: /^\/report\/longevity\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/report/nutrition",
				pattern: /^\/report\/nutrition\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/report/pharma",
				pattern: /^\/report\/pharma\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/report/traits",
				pattern: /^\/report\/traits\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/snp/[rsid]",
				pattern: /^\/snp\/([^/]+?)\/?$/,
				params: [{"name":"rsid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/upload",
				pattern: /^\/upload\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
