import { p as private_env } from "./shared-server.js";
import { b as building } from "./environment.js";
import { createPostgreSQLProvider, pgConnectionUrl } from "@aphexcms/postgresql-adapter";
import { resolve, dirname } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { assets, documentReferences, documentStatusEnum, documentVersions, documents, instanceSettings, invitations, organizationMembers, organizations, pluginSettings, roles, schemaTypeEnum, schemaTypes, userProfiles, userSessions, versionEventEnum } from "@aphexcms/postgresql-adapter/schema";
import { pgTable, timestamp as timestamp$1, text, boolean as boolean$1, integer } from "drizzle-orm/pg-core";
import { drizzle as drizzle$1 } from "drizzle-orm/pglite";
import { migrate as migrate$1 } from "drizzle-orm/pglite/migrator";
import { createPgliteClient, createPgliteProvider } from "@aphexcms/postgresql-adapter/pglite";
import { mkdirSync } from "node:fs";
import { drizzle as drizzle$2 } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { applyRecommendedPragmas, createSQLiteProvider } from "@aphexcms/sqlite-adapter";
import * as sqliteCmsSchema from "@aphexcms/sqlite-adapter/schema";
import { sqliteTable, text as text$1, integer as integer$1 } from "drizzle-orm/sqlite-core";
const cmsSchema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  assets,
  documentReferences,
  documentStatusEnum,
  documentVersions,
  documents,
  instanceSettings,
  invitations,
  organizationMembers,
  organizations,
  pluginSettings,
  roles,
  schemaTypeEnum,
  schemaTypes,
  userProfiles,
  userSessions,
  versionEventEnum
}, Symbol.toStringTag, { value: "Module" }));
const user$1 = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean$1("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp$1("created_at").defaultNow().notNull(),
  updatedAt: timestamp$1("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
const session$1 = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp$1("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp$1("created_at").defaultNow().notNull(),
  updatedAt: timestamp$1("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user$1.id, { onDelete: "cascade" })
});
const account$1 = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user$1.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp$1("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp$1("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp$1("created_at").defaultNow().notNull(),
  updatedAt: timestamp$1("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
const verification$1 = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp$1("expires_at").notNull(),
  createdAt: timestamp$1("created_at").defaultNow().notNull(),
  updatedAt: timestamp$1("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
const apikey$1 = pgTable("apikey", {
  id: text("id").primaryKey(),
  configId: text("config_id").notNull().default("default"),
  name: text("name"),
  start: text("start"),
  prefix: text("prefix"),
  key: text("key").notNull(),
  referenceId: text("reference_id").notNull(),
  refillInterval: integer("refill_interval"),
  refillAmount: integer("refill_amount"),
  lastRefillAt: timestamp$1("last_refill_at"),
  enabled: boolean$1("enabled").default(true),
  rateLimitEnabled: boolean$1("rate_limit_enabled").default(true),
  rateLimitTimeWindow: integer("rate_limit_time_window").default(864e5),
  rateLimitMax: integer("rate_limit_max").default(1e4),
  requestCount: integer("request_count").default(0),
  remaining: integer("remaining"),
  lastRequest: timestamp$1("last_request"),
  expiresAt: timestamp$1("expires_at"),
  createdAt: timestamp$1("created_at").notNull(),
  updatedAt: timestamp$1("updated_at").notNull(),
  permissions: text("permissions"),
  metadata: text("metadata")
});
const authSchema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  account: account$1,
  apikey: apikey$1,
  session: session$1,
  user: user$1,
  verification: verification$1
}, Symbol.toStringTag, { value: "Module" }));
const schema$2 = { ...cmsSchema, ...authSchema };
const MIGRATION_LOCK_KEY = "7021226604092025191";
async function postgresAdapter(config) {
  if (!config.building && config.autoMigrate !== false) {
    const migrationClient = postgres(config.connectionString, { max: 1 });
    try {
      await migrationClient.unsafe(`SELECT pg_advisory_lock(${MIGRATION_LOCK_KEY})`);
      await migrate(drizzle(migrationClient), {
        migrationsFolder: resolve("drizzle")
      });
    } catch (error) {
      const code = error.cause?.code;
      if (code === "42710" || code === "42P07") {
        throw new Error(
          "Boot migration failed: the database schema already exists but has no migration journal (it was likely created with `pnpm db:push`). Either set APHEX_DB_AUTO_MIGRATE=false and keep managing this database with db:push, or start from a fresh database so migrations can run from the beginning.",
          { cause: error }
        );
      }
      throw error;
    } finally {
      await migrationClient.unsafe(`SELECT pg_advisory_unlock(${MIGRATION_LOCK_KEY})`);
      await migrationClient.end();
    }
  }
  const sql = postgres(config.connectionString, {
    max: 50,
    idle_timeout: 20,
    // Release idle connections after 20s
    connect_timeout: 10,
    // Fail fast if can't connect in 10s
    max_lifetime: 60 * 5
    // Recycle connections every 5 minutes
  });
  const drizzleDb2 = drizzle(sql, { schema: schema$2, logger: config.logger });
  const db2 = createPostgreSQLProvider({
    client: sql,
    multiTenancy: config.multiTenancy
  }).createAdapter();
  return { client: sql, drizzleDb: drizzleDb2, db: db2, dbDialect: "pg" };
}
const schema$1 = { ...cmsSchema, ...authSchema };
async function pgliteAdapter(config) {
  const pglite = createPgliteClient(config.dataDir);
  if (!config.building && config.autoMigrate !== false) {
    try {
      await migrate$1(drizzle$1({ client: pglite }), {
        migrationsFolder: resolve("drizzle")
      });
    } catch (error) {
      const code = error.cause?.code;
      if (code === "42710" || code === "42P07") {
        throw new Error(
          "Boot migration failed: the PGlite data dir already has the schema but no migration journal (likely created with `pnpm db:push`). Either set APHEX_DB_AUTO_MIGRATE=false, or delete the data dir to start fresh.",
          { cause: error }
        );
      }
      throw error;
    }
  }
  const drizzleDb2 = drizzle$1({
    client: pglite,
    schema: schema$1,
    logger: config.logger
  });
  const db2 = createPgliteProvider({
    client: pglite,
    multiTenancy: config.multiTenancy
  }).createAdapter();
  return { client: pglite, drizzleDb: drizzleDb2, db: db2, dbDialect: "pg" };
}
const timestamp = (name) => integer$1(name, { mode: "timestamp_ms" });
const boolean = (name) => integer$1(name, { mode: "boolean" });
const user = sqliteTable("user", {
  id: text$1("id").primaryKey(),
  name: text$1("name").notNull(),
  email: text$1("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text$1("image"),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
const session = sqliteTable("session", {
  id: text$1("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text$1("token").notNull().unique(),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
  ipAddress: text$1("ip_address"),
  userAgent: text$1("user_agent"),
  userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
});
const account = sqliteTable("account", {
  id: text$1("id").primaryKey(),
  accountId: text$1("account_id").notNull(),
  providerId: text$1("provider_id").notNull(),
  userId: text$1("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text$1("access_token"),
  refreshToken: text$1("refresh_token"),
  idToken: text$1("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text$1("scope"),
  password: text$1("password"),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
const verification = sqliteTable("verification", {
  id: text$1("id").primaryKey(),
  identifier: text$1("identifier").notNull(),
  value: text$1("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
const apikey = sqliteTable("apikey", {
  id: text$1("id").primaryKey(),
  configId: text$1("config_id").notNull().default("default"),
  name: text$1("name"),
  start: text$1("start"),
  prefix: text$1("prefix"),
  key: text$1("key").notNull(),
  referenceId: text$1("reference_id").notNull(),
  refillInterval: integer$1("refill_interval"),
  refillAmount: integer$1("refill_amount"),
  lastRefillAt: timestamp("last_refill_at"),
  enabled: boolean("enabled").default(true),
  rateLimitEnabled: boolean("rate_limit_enabled").default(true),
  rateLimitTimeWindow: integer$1("rate_limit_time_window").default(864e5),
  rateLimitMax: integer$1("rate_limit_max").default(1e4),
  requestCount: integer$1("request_count").default(0),
  remaining: integer$1("remaining"),
  lastRequest: timestamp("last_request"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  permissions: text$1("permissions"),
  metadata: text$1("metadata")
});
const sqliteAuthSchema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  account,
  apikey,
  session,
  user,
  verification
}, Symbol.toStringTag, { value: "Module" }));
const schema = { ...sqliteCmsSchema, ...sqliteAuthSchema };
async function sqliteAdapter(config) {
  const { url } = config;
  if (url.startsWith("file:") && !url.startsWith("file::memory:")) {
    mkdirSync(dirname(resolve(url.slice("file:".length))), { recursive: true });
  }
  const libsql = createClient({ url, authToken: config.authToken });
  if (!config.building) {
    await applyRecommendedPragmas(libsql, url);
    if (config.autoMigrate !== false) {
      const { pushSQLiteSchema } = await import("drizzle-kit/api");
      const { apply } = await pushSQLiteSchema(schema, drizzle$2(libsql));
      await apply();
    }
  }
  const drizzleDb2 = drizzle$2(libsql, {
    schema,
    logger: config.logger
  });
  const db2 = createSQLiteProvider({
    client: libsql,
    multiTenancy: config.multiTenancy
  }).createAdapter();
  return { client: libsql, drizzleDb: drizzleDb2, db: db2, dbDialect: "sqlite" };
}
const SLOW_QUERY_THRESHOLD_MS = parseInt(private_env.SLOW_QUERY_MS || "100");
class SlowQueryLogger {
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
}
const logger = private_env.ENABLE_QUERY_LOG === "true" ? new SlowQueryLogger() : void 0;
const multiTenancy = { enableRLS: true, enableHierarchy: true };
const autoMigrate = !["false", "0", "no", "off"].includes(
  (private_env.APHEX_DB_AUTO_MIGRATE ?? "").toLowerCase()
);
const driver = private_env.APHEX_DATABASE?.toLowerCase();
let database;
if (driver === "sqlite") {
  database = await sqliteAdapter({
    url: building ? "file::memory:?cache=shared" : private_env.APHEX_SQLITE_URL || "file:.aphex/studio.db",
    authToken: private_env.DATABASE_AUTH_TOKEN,
    building,
    autoMigrate,
    logger,
    multiTenancy
  });
} else if (driver === "pglite") {
  database = await pgliteAdapter({
    // Ephemeral in-memory during the build pass; persist to a gitignored dir at runtime.
    dataDir: building ? void 0 : private_env.APHEX_PGLITE_DIR || ".aphex/pgdata",
    building,
    autoMigrate,
    logger,
    multiTenancy
  });
} else {
  database = await postgresAdapter({
    // `building` serves no requests, so a placeholder is fine — postgres-js connects lazily.
    connectionString: building ? "postgres://build-placeholder" : pgConnectionUrl(private_env),
    building,
    autoMigrate,
    logger,
    multiTenancy
  });
}
const { client, drizzleDb, dbDialect, db } = database;
export {
  apikey$1 as a,
  db as b,
  dbDialect as c,
  drizzleDb as d,
  user$1 as u
};
