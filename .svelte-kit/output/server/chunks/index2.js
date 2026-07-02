import { resolve } from "node:path";
import { drizzle as drizzle$1 } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import postgres from "postgres";
import "@electric-sql/pglite";
import { p as private_env } from "./shared-server.js";
import { b as building } from "./environment.js";
import { pgConnectionUrl, createPostgreSQLProvider } from "@aphexcms/postgresql-adapter";
import { createPgliteClient, createPgliteProvider } from "@aphexcms/postgresql-adapter/pglite";
import { assets, documentReferences, documentStatusEnum, documentVersions, documents, instanceSettings, invitations, organizationMembers, organizations, roles, schemaTypeEnum, schemaTypes, userProfiles, userSessions, versionEventEnum } from "@aphexcms/postgresql-adapter/schema";
import { pgTable, timestamp, text, boolean, integer } from "drizzle-orm/pg-core";
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
  roles,
  schemaTypeEnum,
  schemaTypes,
  userProfiles,
  userSessions,
  versionEventEnum
}, Symbol.toStringTag, { value: "Module" }));
const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
});
const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
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
const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
const apikey = pgTable("apikey", {
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
const authSchema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  account,
  apikey,
  session,
  user,
  verification
}, Symbol.toStringTag, { value: "Module" }));
const schema = {
  ...cmsSchema,
  ...authSchema
};
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
let drizzleDb;
let db;
if (private_env.APHEX_DATABASE?.toLowerCase() === "pglite") {
  const dataDir = building ? void 0 : private_env.APHEX_PGLITE_DIR || ".aphex/pgdata";
  const pglite = createPgliteClient(dataDir);
  if (!building) {
    await migrate(drizzle({ client: pglite }), {
      migrationsFolder: resolve("drizzle")
    });
  }
  drizzleDb = drizzle({ client: pglite, schema, logger });
  db = createPgliteProvider({ client: pglite, multiTenancy }).createAdapter();
} else {
  const databaseUrl = building ? "postgres://build-placeholder" : pgConnectionUrl(private_env);
  const sql = postgres(databaseUrl, {
    max: 50,
    idle_timeout: 20,
    // Release idle connections after 20s
    connect_timeout: 10,
    // Fail fast if can't connect in 10s
    max_lifetime: 60 * 5
    // Recycle connections every 5 minutes
  });
  drizzleDb = drizzle$1(sql, { schema, logger });
  db = createPostgreSQLProvider({ client: sql, multiTenancy }).createAdapter();
}
export {
  apikey as a,
  db as b,
  drizzleDb as d,
  user as u
};
