import { i as __reExport, r as __exportAll } from "./rolldown-runtime.js";
import { t as private_env } from "./shared-server.js";
import { t as building } from "./internal2.js";
import { createPostgreSQLProvider, pgConnectionUrl } from "@aphexcms/postgresql-adapter";
import { dirname, resolve } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { mkdirSync } from "node:fs";
import { drizzle as drizzle$1 } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { applyRecommendedPragmas, createSQLiteProvider } from "@aphexcms/sqlite-adapter";
import * as sqliteCmsSchema from "@aphexcms/sqlite-adapter/schema";
//#region src/lib/server/db/cms-schema.ts
var cms_schema_exports = /* @__PURE__ */ __exportAll({});
import * as import__aphexcms_postgresql_adapter_schema from "@aphexcms/postgresql-adapter/schema";
__reExport(cms_schema_exports, import__aphexcms_postgresql_adapter_schema);
//#endregion
//#region src/lib/server/db/auth-schema/pg.ts
var pg_exports = /* @__PURE__ */ __exportAll({});
import * as import__aphexcms_auth_schema_pg from "@aphexcms/auth/schema/pg";
__reExport(pg_exports, import__aphexcms_auth_schema_pg);
//#endregion
//#region src/lib/server/db/auth-schema/index.ts
var auth_schema_exports = /* @__PURE__ */ __exportAll({});
__reExport(auth_schema_exports, pg_exports);
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
* Auto-migrates on boot (like the sqlite adapter) so `pnpm dev` just works. Unlike
* a single-instance embedded database, real Postgres can have several replicas booting at once,
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
		max_lifetime: 300,
		connection: { idle_in_transaction_session_timeout: 6e4 }
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
var sqlite_exports = /* @__PURE__ */ __exportAll({});
import * as import__aphexcms_auth_schema_sqlite from "@aphexcms/auth/schema/sqlite";
__reExport(sqlite_exports, import__aphexcms_auth_schema_sqlite);
//#endregion
//#region src/lib/server/db/adapters/sqlite.ts
var schema = {
	...sqliteCmsSchema,
	...sqlite_exports
};
var migrationLocks = globalThis.__aphexSQLiteMigrationLocks ??= /* @__PURE__ */ new Map();
async function withMigrationLock(url, migrate) {
	const previous = migrationLocks.get(url) ?? Promise.resolve();
	let release;
	const current = new Promise((resolve) => release = resolve);
	const queued = previous.then(() => current);
	migrationLocks.set(url, queued);
	await previous;
	try {
		return await migrate();
	} finally {
		release();
		if (migrationLocks.get(url) === queued) migrationLocks.delete(url);
	}
}
/**
* libsql file database (the standalone templates' default).
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
		if (config.autoMigrate !== false) await withMigrationLock(url, async () => {
			const migration = await libsql.transaction("write");
			try {
				const { pushSQLiteSchema, generateSQLiteDrizzleJson, generateSQLiteMigration } = await import("drizzle-kit/api");
				const existing = new Set((await migration.execute("select name from sqlite_master where type in ('table','view') and name not like 'sqlite_%'")).rows.map((row) => String(row.name)));
				const missing = Object.values(schema).map((table) => {
					const nameSymbol = Object.getOwnPropertySymbols(table ?? {}).find((symbol) => symbol.description === "drizzle:Name");
					return nameSymbol ? String(table[nameSymbol]) : null;
				}).filter((name) => !!name && !existing.has(name));
				if (missing.length > 0) {
					const wanted = (await generateSQLiteMigration(await generateSQLiteDrizzleJson({}), await generateSQLiteDrizzleJson(schema))).filter((sql) => {
						const createdTable = sql.match(/^CREATE TABLE\s+[\`"']?([^\`"'\s(]+)/i)?.[1];
						return createdTable ? missing.includes(createdTable) : false;
					});
					for (const sql of wanted) await migration.execute(sql);
				}
				const { statementsToExecute } = await pushSQLiteSchema(schema, drizzle$1(migration));
				const statements = statementsToExecute.filter((sql) => !sql.toLowerCase().includes("cms_documents_fts"));
				for (const sql of statements) await migration.execute(sql);
				await migration.commit();
			} catch (error) {
				await migration.rollback();
				throw error;
			}
		});
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
export { cms_schema_exports as a, auth_schema_exports as i, dbDialect as n, drizzleDb as r, db as t };
