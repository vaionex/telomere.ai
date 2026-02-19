
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/blog" | "/blog/[slug]" | "/dashboard" | "/explore" | "/privacy" | "/report" | "/report/carrier" | "/report/health" | "/report/longevity" | "/report/nutrition" | "/report/pharma" | "/report/traits" | "/snp" | "/snp/[rsid]" | "/upload";
		RouteParams(): {
			"/blog/[slug]": { slug: string };
			"/snp/[rsid]": { rsid: string }
		};
		LayoutParams(): {
			"/": { slug?: string; rsid?: string };
			"/about": Record<string, never>;
			"/blog": { slug?: string };
			"/blog/[slug]": { slug: string };
			"/dashboard": Record<string, never>;
			"/explore": Record<string, never>;
			"/privacy": Record<string, never>;
			"/report": Record<string, never>;
			"/report/carrier": Record<string, never>;
			"/report/health": Record<string, never>;
			"/report/longevity": Record<string, never>;
			"/report/nutrition": Record<string, never>;
			"/report/pharma": Record<string, never>;
			"/report/traits": Record<string, never>;
			"/snp": { rsid?: string };
			"/snp/[rsid]": { rsid: string };
			"/upload": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/blog" | `/blog/${string}` & {} | "/dashboard" | "/explore" | "/privacy" | "/report/carrier" | "/report/health" | "/report/longevity" | "/report/nutrition" | "/report/pharma" | "/report/traits" | `/snp/${string}` & {} | "/upload";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | string & {};
	}
}