import { r as __exportAll } from "./rolldown-runtime.js";
import { t as private_env } from "./shared-server.js";
import { t as building } from "./internal2.js";
import { createPostgreSQLProvider, pgConnectionUrl } from "@aphexcms/postgresql-adapter";
import { dirname, resolve } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { assets, documentReferences, documentStatusEnum, documentVersions, documents, domainEvents, eventOutbox, instanceSettings, invitations, jobStatusEnum, jobs, organizationMembers, organizations, pluginSettings, pluginStorage, roles, schemaTypeEnum, schemaTypes, userProfiles, userSessions, versionEventEnum } from "@aphexcms/postgresql-adapter/schema";
import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { mkdirSync } from "node:fs";
import { drizzle as drizzle$1 } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { applyRecommendedPragmas, createSQLiteProvider } from "@aphexcms/sqlite-adapter";
import * as sqliteCmsSchema from "@aphexcms/sqlite-adapter/schema";
import { integer as integer$1, sqliteTable, text as text$1 } from "drizzle-orm/sqlite-core";
//#region src/lib/server/db/cms-schema.ts
var cms_schema_exports = /* @__PURE__ */ __exportAll({
	assets: () => assets,
	documentReferences: () => documentReferences,
	documentStatusEnum: () => documentStatusEnum,
	documentVersions: () => documentVersions,
	documents: () => documents,
	domainEvents: () => domainEvents,
	eventOutbox: () => eventOutbox,
	instanceSettings: () => instanceSettings,
	invitations: () => invitations,
	jobStatusEnum: () => jobStatusEnum,
	jobs: () => jobs,
	organizationMembers: () => organizationMembers,
	organizations: () => organizations,
	pluginSettings: () => pluginSettings,
	pluginStorage: () => pluginStorage,
	roles: () => roles,
	schemaTypeEnum: () => schemaTypeEnum,
	schemaTypes: () => schemaTypes,
	userProfiles: () => userProfiles,
	userSessions: () => userSessions,
	versionEventEnum: () => versionEventEnum
});
//#endregion
//#region src/lib/server/db/auth-schema/pg.ts
var user$1 = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var session$1 = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user$1.id, { onDelete: "cascade" })
});
var account$1 = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user$1.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var verification$1 = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var apikey$1 = pgTable("apikey", {
	id: text("id").primaryKey(),
	configId: text("config_id").notNull().default("default"),
	name: text("name"),
	start: text("start"),
	prefix: text("prefix"),
	key: text("key").notNull(),
	referenceId: text("reference_id").notNull(),
	refillInterval: integer("refill_interval"),
	refillAmount: integer("refill_amount"),
	lastRefillAt: timestamp("last_refill_at"),
	enabled: boolean("enabled").default(true),
	rateLimitEnabled: boolean("rate_limit_enabled").default(true),
	rateLimitTimeWindow: integer("rate_limit_time_window").default(864e5),
	rateLimitMax: integer("rate_limit_max").default(1e4),
	requestCount: integer("request_count").default(0),
	remaining: integer("remaining"),
	lastRequest: timestamp("last_request"),
	expiresAt: timestamp("expires_at"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	permissions: text("permissions"),
	metadata: text("metadata")
});
//#endregion
//#region src/lib/server/db/auth-schema/index.ts
var auth_schema_exports = /* @__PURE__ */ __exportAll({
	account: () => account$1,
	apikey: () => apikey$1,
	session: () => session$1,
	user: () => user$1,
	verification: () => verification$1
});
//#endregion
//#region src/lib/server/db/adapters/postgres.ts
var schema$1 = {
	...cms_schema_exports,
	...auth_schema_exports
};
/**
* Arbitrary but stable 64-bit key for the boot-migration advisory lock. Any value
* works as long as it's constant across replicas. Inlined as a literal (it's a
* compile-time constant, so `.unsafe()` carries no injection risk).
*/
var MIGRATION_LOCK_KEY = "7021226604092025191";
/**
* Standard Postgres driver (postgres-js against DATABASE_URL / PG_*). Connects
* lazily on first query, so a placeholder URL is fine during the build pass.
*
* Auto-migrates on boot (like the sqlite adapter) so `pnpm dev` just works. Real
* Postgres can have several replicas booting at once,
* so the migration runs under a session-level **advisory lock**: exactly one boot
* applies the pending migrations while the rest block, then find nothing to do.
* Additive, generated migration files only — the same ones `pnpm db:migrate` runs.
*/
async function postgresAdapter(config) {
	if (!config.building && config.autoMigrate !== false) {
		const migrationClient = postgres(config.connectionString, { max: 1 });
		try {
			await migrationClient.unsafe(`SELECT pg_advisory_lock(${MIGRATION_LOCK_KEY})`);
			await migrate(drizzle(migrationClient), { migrationsFolder: resolve("drizzle") });
		} catch (error) {
			const code = error.cause?.code;
			if (code === "42710" || code === "42P07") throw new Error("Boot migration failed: the database schema already exists but has no migration journal (it was likely created with `pnpm db:push`). Either set APHEX_DB_AUTO_MIGRATE=false and keep managing this database with db:push, or start from a fresh database so migrations can run from the beginning.", { cause: error });
			throw error;
		} finally {
			await migrationClient.unsafe(`SELECT pg_advisory_unlock(${MIGRATION_LOCK_KEY})`);
			await migrationClient.end();
		}
	}
	const sql = postgres(config.connectionString, {
		max: 50,
		idle_timeout: 20,
		connect_timeout: 10,
		max_lifetime: 300
	});
	return {
		client: sql,
		drizzleDb: drizzle(sql, {
			schema: schema$1,
			logger: config.logger
		}),
		db: createPostgreSQLProvider({
			client: sql,
			multiTenancy: config.multiTenancy
		}).createAdapter(),
		dbDialect: "pg"
	};
}
//#endregion
//#region src/lib/server/db/auth-schema/sqlite.ts
var sqlite_exports = /* @__PURE__ */ __exportAll({
	account: () => account,
	apikey: () => apikey,
	session: () => session,
	user: () => user,
	verification: () => verification
});
var timestamp$1 = (name) => integer$1(name, { mode: "timestamp_ms" });
var boolean$1 = (name) => integer$1(name, { mode: "boolean" });
var user = sqliteTable("user", {
	id: text$1("id").primaryKey(),
	name: text$1("name").notNull(),
	email: text$1("email").notNull().unique(),
	emailVerified: boolean$1("email_verified").default(false).notNull(),
	image: text$1("image"),
	createdAt: timestamp$1("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp$1("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var session = sqliteTable("session", {
	id: text$1("id").primaryKey(),
	expiresAt: timestamp$1("expires_at").notNull(),
	token: text$1("token").notNull().unique(),
	createdAt: timestamp$1("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp$1("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
	ipAddress: text$1("ip_address"),
	userAgent: text$1("user_agent"),
	userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
});
var account = sqliteTable("account", {
	id: text$1("id").primaryKey(),
	accountId: text$1("account_id").notNull(),
	providerId: text$1("provider_id").notNull(),
	userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	accessToken: text$1("access_token"),
	refreshToken: text$1("refresh_token"),
	idToken: text$1("id_token"),
	accessTokenExpiresAt: timestamp$1("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp$1("refresh_token_expires_at"),
	scope: text$1("scope"),
	password: text$1("password"),
	createdAt: timestamp$1("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp$1("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var verification = sqliteTable("verification", {
	id: text$1("id").primaryKey(),
	identifier: text$1("identifier").notNull(),
	value: text$1("value").notNull(),
	expiresAt: timestamp$1("expires_at").notNull(),
	createdAt: timestamp$1("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp$1("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var apikey = sqliteTable("apikey", {
	id: text$1("id").primaryKey(),
	configId: text$1("config_id").notNull().default("default"),
	name: text$1("name"),
	start: text$1("start"),
	prefix: text$1("prefix"),
	key: text$1("key").notNull(),
	referenceId: text$1("reference_id").notNull(),
	refillInterval: integer$1("refill_interval"),
	refillAmount: integer$1("refill_amount"),
	lastRefillAt: timestamp$1("last_refill_at"),
	enabled: boolean$1("enabled").default(true),
	rateLimitEnabled: boolean$1("rate_limit_enabled").default(true),
	rateLimitTimeWindow: integer$1("rate_limit_time_window").default(864e5),
	rateLimitMax: integer$1("rate_limit_max").default(1e4),
	requestCount: integer$1("request_count").default(0),
	remaining: integer$1("remaining"),
	lastRequest: timestamp$1("last_request"),
	expiresAt: timestamp$1("expires_at"),
	createdAt: timestamp$1("created_at").notNull(),
	updatedAt: timestamp$1("updated_at").notNull(),
	permissions: text$1("permissions"),
	metadata: text$1("metadata")
});
//#endregion
//#region src/lib/server/db/adapters/sqlite.ts
var schema = {
	...sqliteCmsSchema,
	...sqlite_exports
};
/**
* libsql file database — this template's default driver.
* Schema is pushed on boot via drizzle-kit — no migration files. `drizzle-kit`
* is a devDependency, so this path targets dev, not a pruned production image.
*/
async function sqliteAdapter(config) {
	const { url } = config;
	if (url.startsWith("file:") && !url.startsWith("file::memory:")) mkdirSync(dirname(resolve(url.slice(5))), { recursive: true });
	const libsql = createClient({
		url,
		authToken: config.authToken
	});
	if (!config.building) {
		await applyRecommendedPragmas(libsql, url);
		if (config.autoMigrate !== false) {
			const { pushSQLiteSchema } = await import("drizzle-kit/api");
			const { apply } = await pushSQLiteSchema(schema, drizzle$1(libsql));
			await apply();
		}
	}
	return {
		client: libsql,
		drizzleDb: drizzle$1(libsql, {
			schema,
			logger: config.logger
		}),
		db: createSQLiteProvider({
			client: libsql,
			multiTenancy: config.multiTenancy
		}).createAdapter(),
		dbDialect: "sqlite"
	};
}
//#endregion
//#region src/lib/server/db/index.ts
var SLOW_QUERY_THRESHOLD_MS = parseInt(private_env.SLOW_QUERY_MS || "100");
var SlowQueryLogger = class {
	logQuery(query, _params) {
		const start = performance.now();
		queueMicrotask(() => {
			const duration = performance.now() - start;
			if (duration >= SLOW_QUERY_THRESHOLD_MS) {
				const truncatedQuery = query.length > 200 ? query.slice(0, 200) + "..." : query;
				console.warn(`[SLOW QUERY] ${duration.toFixed(1)}ms — ${truncatedQuery}`);
			}
		});
	}
};
var logger = private_env.ENABLE_QUERY_LOG === "true" ? new SlowQueryLogger() : void 0;
var multiTenancy = {
	enableRLS: true,
	enableHierarchy: true
};
var autoMigrate = ![
	"false",
	"0",
	"no",
	"off"
].includes((private_env.APHEX_DB_AUTO_MIGRATE ?? "").toLowerCase());
var driver = private_env.APHEX_DATABASE?.toLowerCase();
var database;
if (driver === "postgres" || driver === "postgresql") database = await postgresAdapter({
	connectionString: building ? "postgres://build-placeholder" : pgConnectionUrl(private_env),
	building,
	autoMigrate,
	logger,
	multiTenancy
});
else database = await sqliteAdapter({
	url: building ? "file::memory:?cache=shared" : private_env.APHEX_SQLITE_URL || "file:.aphex/base.db",
	authToken: private_env.DATABASE_AUTH_TOKEN,
	building,
	autoMigrate,
	logger,
	multiTenancy
});
var { client, drizzleDb, dbDialect, db } = database;
//#endregion
export { user$1 as a, organizations as c, apikey$1 as i, dbDialect as n, invitations as o, drizzleDb as r, organizationMembers as s, db as t };
