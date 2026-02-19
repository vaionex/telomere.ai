
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const GITHUB_PAT: string;
	export const OPENCLAW_WORKSPACE_DIR: string;
	export const npm_config_user_agent: string;
	export const NODE_VERSION: string;
	export const HOSTNAME: string;
	export const YARN_VERSION: string;
	export const npm_node_execpath: string;
	export const ANTHROPIC_SETUP_TOKEN: string;
	export const OPENCLAW_GATEWAY_TOKEN: string;
	export const HOME: string;
	export const VIPSHOME: string;
	export const OLDPWD: string;
	export const npm_package_json: string;
	export const COREPACK_ROOT: string;
	export const OPENAI_API_KEY: string;
	export const NODE_NO_WARNINGS: string;
	export const OPENCLAW_PREFER_PNPM: string;
	export const COREPACK_ENABLE_DOWNLOAD_PROMPT: string;
	export const CLAUDE_AI_SESSION_KEY: string;
	export const pnpm_config_verify_deps_before_run: string;
	export const CLAUDE_WEB_COOKIE: string;
	export const npm_config_registry: string;
	export const TERM: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const CLAUDE_WEB_SESSION_KEY: string;
	export const ANTHROPIC_API_KEY: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const npm_config_frozen_lockfile: string;
	export const OPENCLAW_GATEWAY_PORT: string;
	export const OPENCLAW_CONFIG_DIR: string;
	export const npm_lifecycle_script: string;
	export const npm_package_version: string;
	export const npm_config_verify_deps_before_run: string;
	export const npm_lifecycle_event: string;
	export const NODE_PATH: string;
	export const ANTHROPIC_OAUTH_TOKEN: string;
	export const npm_config_npm_globalconfig: string;
	export const npm_config_globalconfig: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const npm_config_recursive: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const npm_config__jsr_registry: string;
	export const npm_command: string;
	export const NODE_ENV: string;
	export const OPENCLAW_PATH_BOOTSTRAPPED: string;
	export const INIT_CWD: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		GITHUB_PAT: string;
		OPENCLAW_WORKSPACE_DIR: string;
		npm_config_user_agent: string;
		NODE_VERSION: string;
		HOSTNAME: string;
		YARN_VERSION: string;
		npm_node_execpath: string;
		ANTHROPIC_SETUP_TOKEN: string;
		OPENCLAW_GATEWAY_TOKEN: string;
		HOME: string;
		VIPSHOME: string;
		OLDPWD: string;
		npm_package_json: string;
		COREPACK_ROOT: string;
		OPENAI_API_KEY: string;
		NODE_NO_WARNINGS: string;
		OPENCLAW_PREFER_PNPM: string;
		COREPACK_ENABLE_DOWNLOAD_PROMPT: string;
		CLAUDE_AI_SESSION_KEY: string;
		pnpm_config_verify_deps_before_run: string;
		CLAUDE_WEB_COOKIE: string;
		npm_config_registry: string;
		TERM: string;
		npm_config_node_gyp: string;
		PATH: string;
		CLAUDE_WEB_SESSION_KEY: string;
		ANTHROPIC_API_KEY: string;
		NODE: string;
		npm_package_name: string;
		npm_config_frozen_lockfile: string;
		OPENCLAW_GATEWAY_PORT: string;
		OPENCLAW_CONFIG_DIR: string;
		npm_lifecycle_script: string;
		npm_package_version: string;
		npm_config_verify_deps_before_run: string;
		npm_lifecycle_event: string;
		NODE_PATH: string;
		ANTHROPIC_OAUTH_TOKEN: string;
		npm_config_npm_globalconfig: string;
		npm_config_globalconfig: string;
		PWD: string;
		npm_execpath: string;
		npm_config_recursive: string;
		PNPM_SCRIPT_SRC_DIR: string;
		npm_config__jsr_registry: string;
		npm_command: string;
		NODE_ENV: string;
		OPENCLAW_PATH_BOOTSTRAPPED: string;
		INIT_CWD: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
