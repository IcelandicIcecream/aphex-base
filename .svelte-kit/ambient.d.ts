
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const SVELTEKIT_FORK: string;
	export const INIT_CWD: string;
	export const GITHUB_STEP_SUMMARY: string;
	export const ANDROID_NDK_HOME: string;
	export const CHROME_BIN: string;
	export const PSModulePath: string;
	export const GITHUB_BASE_REF: string;
	export const GOROOT_1_26_X64: string;
	export const PATH: string;
	export const VIPSHOME: string;
	export const GITHUB_ACTIONS: string;
	export const GITHUB_WORKFLOW_SHA: string;
	export const GITHUB_ARTIFACTS: string;
	export const GITHUB_ACTION: string;
	export const GITHUB_API_URL: string;
	export const GITHUB_PATH: string;
	export const GHCUP_INSTALL_BASE_PREFIX: string;
	export const BOOTSTRAP_HASKELL_NONINTERACTIVE: string;
	export const GITHUB_SHA: string;
	export const npm_command: string;
	export const npm_config_globalconfig: string;
	export const RUNNER_WORKSPACE: string;
	export const DOTNET_SKIP_FIRST_TIME_EXPERIENCE: string;
	export const GITHUB_RUN_NUMBER: string;
	export const GITHUB_GRAPHQL_URL: string;
	export const USE_BAZEL_FALLBACK_VERSION: string;
	export const GITHUB_WORKFLOW: string;
	export const GITHUB_EVENT_PATH: string;
	export const npm_package_json: string;
	export const GOROOT_1_24_X64: string;
	export const JOURNAL_STREAM: string;
	export const npm_config_engine_strict: string;
	export const npm_config_frozen_lockfile: string;
	export const npm_lifecycle_script: string;
	export const ACTIONS_ORCHESTRATION_ID: string;
	export const PWD: string;
	export const USER: string;
	export const SGX_AESM_ADDR: string;
	export const SHLVL: string;
	export const GITHUB_REPOSITORY_ID: string;
	export const GITHUB_REF_NAME: string;
	export const ACTIONS_RUNNER_RETURN_JOB_RESULT_FOR_HOSTED: string;
	export const CI: string;
	export const GRADLE_HOME: string;
	export const GITHUB_RUN_ID: string;
	export const NVM_DIR: string;
	export const RUNNER_ENVIRONMENT: string;
	export const GITHUB_REPOSITORY: string;
	export const MEMORY_PRESSURE_WRITE: string;
	export const ImageOS: string;
	export const GITHUB_RUN_ATTEMPT: string;
	export const JAVA_HOME_8_X64: string;
	export const GITHUB_REF_TYPE: string;
	export const POWERSHELL_DISTRIBUTION_CHANNEL: string;
	export const PIPX_HOME: string;
	export const AZURE_EXTENSION_DIR: string;
	export const GITHUB_STATE: string;
	export const HCA_CLOUD_PROVIDER: string;
	export const HOME: string;
	export const ImageVersion: string;
	export const RUNNER_TEMP: string;
	export const GITHUB_REPOSITORY_OWNER_ID: string;
	export const SELENIUM_JAR_PATH: string;
	export const npm_config_registry: string;
	export const pnpm_config_verify_deps_before_run: string;
	export const NODE_ENV: string;
	export const JAVA_HOME_25_X64: string;
	export const GITHUB_REF: string;
	export const JAVA_HOME_11_X64: string;
	export const GITHUB_REPOSITORY_OWNER: string;
	export const GITHUB_RETENTION_DAYS: string;
	export const NODE: string;
	export const XDG_CONFIG_HOME: string;
	export const JAVA_HOME_17_X64: string;
	export const ACTIONS_RUNNER_ACTION_ARCHIVE_CACHE: string;
	export const PIPX_BIN_DIR: string;
	export const ANDROID_NDK_LATEST_HOME: string;
	export const VCPKG_INSTALLATION_ROOT: string;
	export const CHROMEWEBDRIVER: string;
	export const GITHUB_EVENT_NAME: string;
	export const JAVA_HOME_21_X64: string;
	export const SWIFT_PATH: string;
	export const GECKOWEBDRIVER: string;
	export const DOTNET_NOLOGO: string;
	export const SYSTEMD_EXEC_PID: string;
	export const npm_config_verify_deps_before_run: string;
	export const GOROOT_1_25_X64: string;
	export const GITHUB_WORKFLOW_REF: string;
	export const RUNNER_ARCH: string;
	export const GITHUB_ACTION_REPOSITORY: string;
	export const RUNNER_OS: string;
	export const ENABLE_RUNNER_TRACING: string;
	export const npm_config_node_gyp: string;
	export const AGENT_TOOLSDIRECTORY: string;
	export const LOGNAME: string;
	export const MEMORY_PRESSURE_WATCH: string;
	export const SHELL: string;
	export const ANT_HOME: string;
	export const DOTNET_MULTILEVEL_LOOKUP: string;
	export const RUNNER_TRACKING_ID: string;
	export const GITHUB_ENV: string;
	export const ANDROID_NDK: string;
	export const INVOCATION_ID: string;
	export const RUNNER_TOOL_CACHE: string;
	export const npm_package_name: string;
	export const CONDA: string;
	export const GITHUB_HEAD_REF: string;
	export const GITHUB_OUTPUT: string;
	export const GITHUB_TRIGGERING_ACTOR: string;
	export const XDG_RUNTIME_DIR: string;
	export const LANG: string;
	export const _: string;
	export const RUNNER_NAME: string;
	export const ANDROID_NDK_ROOT: string;
	export const GITHUB_ACTION_REF: string;
	export const npm_node_execpath: string;
	export const DEBIAN_FRONTEND: string;
	export const NODE_PATH: string;
	export const GITHUB_ARTIFACTS_LIST: string;
	export const npm_lifecycle_event: string;
	export const GITHUB_REF_PROTECTED: string;
	export const GITHUB_WORKSPACE: string;
	export const ACCEPT_EULA: string;
	export const GITHUB_JOB: string;
	export const npm_config_npm_globalconfig: string;
	export const npm_config_user_agent: string;
	export const GITHUB_ACTOR: string;
	export const ANDROID_SDK_ROOT: string;
	export const GITHUB_ACTOR_ID: string;
	export const npm_execpath: string;
	export const HOMEBREW_CLEANUP_PERIODIC_FULL_DAYS: string;
	export const HOMEBREW_NO_AUTO_UPDATE: string;
	export const npm_package_version: string;
	export const ANDROID_HOME: string;
	export const PNPM_HOME: string;
	export const GITHUB_SERVER_URL: string;
	export const EDGEWEBDRIVER: string;
	export const npm_config__jsr_registry: string;
	export const JAVA_HOME: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		SVELTEKIT_FORK: string;
		INIT_CWD: string;
		GITHUB_STEP_SUMMARY: string;
		ANDROID_NDK_HOME: string;
		CHROME_BIN: string;
		PSModulePath: string;
		GITHUB_BASE_REF: string;
		GOROOT_1_26_X64: string;
		PATH: string;
		VIPSHOME: string;
		GITHUB_ACTIONS: string;
		GITHUB_WORKFLOW_SHA: string;
		GITHUB_ARTIFACTS: string;
		GITHUB_ACTION: string;
		GITHUB_API_URL: string;
		GITHUB_PATH: string;
		GHCUP_INSTALL_BASE_PREFIX: string;
		BOOTSTRAP_HASKELL_NONINTERACTIVE: string;
		GITHUB_SHA: string;
		npm_command: string;
		npm_config_globalconfig: string;
		RUNNER_WORKSPACE: string;
		DOTNET_SKIP_FIRST_TIME_EXPERIENCE: string;
		GITHUB_RUN_NUMBER: string;
		GITHUB_GRAPHQL_URL: string;
		USE_BAZEL_FALLBACK_VERSION: string;
		GITHUB_WORKFLOW: string;
		GITHUB_EVENT_PATH: string;
		npm_package_json: string;
		GOROOT_1_24_X64: string;
		JOURNAL_STREAM: string;
		npm_config_engine_strict: string;
		npm_config_frozen_lockfile: string;
		npm_lifecycle_script: string;
		ACTIONS_ORCHESTRATION_ID: string;
		PWD: string;
		USER: string;
		SGX_AESM_ADDR: string;
		SHLVL: string;
		GITHUB_REPOSITORY_ID: string;
		GITHUB_REF_NAME: string;
		ACTIONS_RUNNER_RETURN_JOB_RESULT_FOR_HOSTED: string;
		CI: string;
		GRADLE_HOME: string;
		GITHUB_RUN_ID: string;
		NVM_DIR: string;
		RUNNER_ENVIRONMENT: string;
		GITHUB_REPOSITORY: string;
		MEMORY_PRESSURE_WRITE: string;
		ImageOS: string;
		GITHUB_RUN_ATTEMPT: string;
		JAVA_HOME_8_X64: string;
		GITHUB_REF_TYPE: string;
		POWERSHELL_DISTRIBUTION_CHANNEL: string;
		PIPX_HOME: string;
		AZURE_EXTENSION_DIR: string;
		GITHUB_STATE: string;
		HCA_CLOUD_PROVIDER: string;
		HOME: string;
		ImageVersion: string;
		RUNNER_TEMP: string;
		GITHUB_REPOSITORY_OWNER_ID: string;
		SELENIUM_JAR_PATH: string;
		npm_config_registry: string;
		pnpm_config_verify_deps_before_run: string;
		NODE_ENV: string;
		JAVA_HOME_25_X64: string;
		GITHUB_REF: string;
		JAVA_HOME_11_X64: string;
		GITHUB_REPOSITORY_OWNER: string;
		GITHUB_RETENTION_DAYS: string;
		NODE: string;
		XDG_CONFIG_HOME: string;
		JAVA_HOME_17_X64: string;
		ACTIONS_RUNNER_ACTION_ARCHIVE_CACHE: string;
		PIPX_BIN_DIR: string;
		ANDROID_NDK_LATEST_HOME: string;
		VCPKG_INSTALLATION_ROOT: string;
		CHROMEWEBDRIVER: string;
		GITHUB_EVENT_NAME: string;
		JAVA_HOME_21_X64: string;
		SWIFT_PATH: string;
		GECKOWEBDRIVER: string;
		DOTNET_NOLOGO: string;
		SYSTEMD_EXEC_PID: string;
		npm_config_verify_deps_before_run: string;
		GOROOT_1_25_X64: string;
		GITHUB_WORKFLOW_REF: string;
		RUNNER_ARCH: string;
		GITHUB_ACTION_REPOSITORY: string;
		RUNNER_OS: string;
		ENABLE_RUNNER_TRACING: string;
		npm_config_node_gyp: string;
		AGENT_TOOLSDIRECTORY: string;
		LOGNAME: string;
		MEMORY_PRESSURE_WATCH: string;
		SHELL: string;
		ANT_HOME: string;
		DOTNET_MULTILEVEL_LOOKUP: string;
		RUNNER_TRACKING_ID: string;
		GITHUB_ENV: string;
		ANDROID_NDK: string;
		INVOCATION_ID: string;
		RUNNER_TOOL_CACHE: string;
		npm_package_name: string;
		CONDA: string;
		GITHUB_HEAD_REF: string;
		GITHUB_OUTPUT: string;
		GITHUB_TRIGGERING_ACTOR: string;
		XDG_RUNTIME_DIR: string;
		LANG: string;
		_: string;
		RUNNER_NAME: string;
		ANDROID_NDK_ROOT: string;
		GITHUB_ACTION_REF: string;
		npm_node_execpath: string;
		DEBIAN_FRONTEND: string;
		NODE_PATH: string;
		GITHUB_ARTIFACTS_LIST: string;
		npm_lifecycle_event: string;
		GITHUB_REF_PROTECTED: string;
		GITHUB_WORKSPACE: string;
		ACCEPT_EULA: string;
		GITHUB_JOB: string;
		npm_config_npm_globalconfig: string;
		npm_config_user_agent: string;
		GITHUB_ACTOR: string;
		ANDROID_SDK_ROOT: string;
		GITHUB_ACTOR_ID: string;
		npm_execpath: string;
		HOMEBREW_CLEANUP_PERIODIC_FULL_DAYS: string;
		HOMEBREW_NO_AUTO_UPDATE: string;
		npm_package_version: string;
		ANDROID_HOME: string;
		PNPM_HOME: string;
		GITHUB_SERVER_URL: string;
		EDGEWEBDRIVER: string;
		npm_config__jsr_registry: string;
		JAVA_HOME: string;
		PNPM_SCRIPT_SRC_DIR: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
