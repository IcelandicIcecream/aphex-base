import { t as private_env } from "./shared-server.js";
import { t as building } from "./internal2.js";
import { n as dbDialect, r as drizzleDb, t as db } from "./db.js";
import { n as emailConfig, t as email } from "./email.js";
import "./server3.js";
import { n as bootstrapPolicy, t as authOptions } from "./auth.config.js";
import { createAphexAuth } from "@aphexcms/auth";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/cache/adapters/in-memory-cache-adapter.js
var InMemoryCacheAdapter = class {
	name = "in-memory";
	store = /* @__PURE__ */ new Map();
	maxSize;
	defaultTTL;
	constructor(options = {}) {
		this.maxSize = options.maxSize ?? 1e3;
		this.defaultTTL = options.defaultTTL;
	}
	async get(key) {
		const entry = this.store.get(key);
		if (!entry) return null;
		if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
			this.store.delete(key);
			return null;
		}
		return entry.value;
	}
	async set(key, value, ttl) {
		if (!this.store.has(key) && this.store.size >= this.maxSize) {
			const firstKey = this.store.keys().next().value;
			if (firstKey !== void 0) this.store.delete(firstKey);
		}
		const seconds = ttl ?? this.defaultTTL;
		this.store.set(key, {
			value,
			expiresAt: seconds != null ? Date.now() + seconds * 1e3 : null
		});
	}
	async delete(key) {
		this.store.delete(key);
	}
	async invalidateByPrefix(prefix) {
		for (const key of this.store.keys()) if (key.startsWith(prefix)) this.store.delete(key);
	}
	async flush() {
		this.store.clear();
	}
	async isHealthy() {
		return true;
	}
};
//#endregion
//#region src/lib/server/cache/index.ts
/**
* Shared cache adapter singleton.
* Used by both CMS config (document caching) and auth (API key caching).
* Set to null to disable caching.
*/
var cacheAdapter = new InMemoryCacheAdapter({ maxSize: 5e3 });
//#endregion
//#region src/lib/server/auth/index.ts
var secret = private_env.AUTH_SECRET || private_env.BETTER_AUTH_SECRET;
var baseURL = private_env.AUTH_URL || private_env.BETTER_AUTH_URL;
var { auth, service: authService, provider: authProvider } = createAphexAuth({
	database: db,
	drizzleDb,
	dialect: dbDialect,
	secret,
	baseURL,
	trustedOrigins: (private_env.AUTH_TRUSTED_ORIGINS || baseURL || "").split(",").map((origin) => origin.trim()).filter(Boolean),
	building,
	emailAdapter: email,
	email: emailConfig,
	cache: cacheAdapter,
	options: authOptions,
	bootstrap: bootstrapPolicy,
	appName: "Aphex CMS"
});
//#endregion
export { cacheAdapter as i, authProvider as n, authService as r, auth as t };
