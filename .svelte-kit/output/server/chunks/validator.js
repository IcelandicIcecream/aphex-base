import { t as cmsLogger } from "./logger.js";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.5.2_6aae2b0bc5f037c66cc3c68e11b93a28/node_modules/@aphexcms/cms-core/dist/types/capabilities.js
/**
* Enumerate every capability. Useful for owner seeding and validation.
*/
var ALL_CAPABILITIES = [
	"document.read",
	"document.create",
	"document.update",
	"document.delete",
	"document.publish",
	"document.unpublish",
	"asset.read",
	"asset.upload",
	"asset.delete",
	"member.invite",
	"member.remove",
	"member.changeRole",
	"apiKey.manage",
	"role.manage",
	"org.settings",
	"plugin.settings.manage"
];
/**
* Define a capability with metadata. Plugins pass these to the `aphex/capabilities`
* part so their permissions appear (and are assignable) in the roles UI.
*
* @example
* defineCapability('forms.export', { title: 'Export submissions', group: 'Forms' })
*/
function defineCapability(id, meta = {}) {
	return {
		id,
		title: meta.title || prettifyCapabilityId(id),
		description: meta.description,
		group: meta.group
	};
}
/** Fallback label for a bare id: `document.publish` → `Publish` (last segment, title-cased). */
function prettifyCapabilityId(id) {
	const spaced = (id.split(/[.:]/).pop() ?? id).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
/** The built-in capability catalog — metadata for every core capability. */
var BUILTIN_CAPABILITY_DEFS = [
	{
		id: "document.read",
		title: "Read documents",
		group: "Documents",
		description: "View documents and their content."
	},
	{
		id: "document.create",
		title: "Create documents",
		group: "Documents",
		description: "Create new documents."
	},
	{
		id: "document.update",
		title: "Edit documents",
		group: "Documents",
		description: "Edit existing documents."
	},
	{
		id: "document.delete",
		title: "Delete documents",
		group: "Documents",
		description: "Delete documents."
	},
	{
		id: "document.publish",
		title: "Publish documents",
		group: "Documents",
		description: "Publish drafts to the live site."
	},
	{
		id: "document.unpublish",
		title: "Unpublish documents",
		group: "Documents",
		description: "Revert published documents to draft."
	},
	{
		id: "asset.read",
		title: "View assets",
		group: "Assets",
		description: "Browse the media library."
	},
	{
		id: "asset.upload",
		title: "Upload assets",
		group: "Assets",
		description: "Upload files to the media library."
	},
	{
		id: "asset.delete",
		title: "Delete assets",
		group: "Assets",
		description: "Delete files from the media library."
	},
	{
		id: "member.invite",
		title: "Invite members",
		group: "Organization",
		description: "Invite people to the organization."
	},
	{
		id: "member.remove",
		title: "Remove members",
		group: "Organization",
		description: "Remove people from the organization."
	},
	{
		id: "member.changeRole",
		title: "Change member roles",
		group: "Organization",
		description: "Change a member's role."
	},
	{
		id: "apiKey.manage",
		title: "Manage API keys",
		group: "Organization",
		description: "Create and revoke API keys."
	},
	{
		id: "role.manage",
		title: "Manage roles",
		group: "Organization",
		description: "Create and edit custom roles."
	},
	{
		id: "org.settings",
		title: "Edit settings",
		group: "Organization",
		description: "Change organization settings."
	},
	{
		id: "plugin.settings.manage",
		title: "Manage plugin settings",
		group: "Organization",
		description: "View and edit configuration and secrets for installed plugins."
	}
];
/**
* Merge the built-in catalog with extra (plugin) definitions, deduped by id — the
* first definition of an id wins, so plugins can't silently redefine a core cap.
*/
function mergeCapabilityCatalog(extra = []) {
	const byId = /* @__PURE__ */ new Map();
	for (const def of [...BUILTIN_CAPABILITY_DEFS, ...extra]) if (!byId.has(def.id)) byId.set(def.id, def);
	return [...byId.values()];
}
/**
* Built-in role names. These are the guaranteed defaults every org receives.
* Custom role names are any other string.
*/
var BUILTIN_ROLE_NAMES = [
	"owner",
	"admin",
	"editor",
	"viewer"
];
/**
* Seed data for the four built-in roles.
*
* For viewer/editor/admin this is the **default floor** — the set of capabilities
* a freshly-created org starts with. Once seeded, rows live in `cms_roles` and can
* be edited by admins via the Roles UI; they are never force-updated afterwards,
* so a capability added by a later core upgrade is not granted retroactively.
*
* `owner` is different: it is an **invariant**, not a floor. It is always the whole
* of ALL_CAPABILITIES, is rejected by the roles PATCH route, and is reconciled on
* every boot (see CMSEngine.reconcileBuiltinRoles) so new capabilities reach orgs
* that were seeded before those capabilities existed.
*
* Also acts as the defense-in-depth fallback: if a role lookup misses (e.g.
* a row got deleted out-of-band for a built-in name), the checker falls back
* to this map rather than locking the org out.
*/
var BUILTIN_ROLE_SEED = {
	viewer: {
		description: "Read-only access to documents and assets.",
		capabilities: ["document.read", "asset.read"]
	},
	editor: {
		description: "Create, edit, and publish content.",
		capabilities: [
			"document.read",
			"document.create",
			"document.update",
			"document.delete",
			"document.publish",
			"document.unpublish",
			"asset.read",
			"asset.upload",
			"asset.delete"
		]
	},
	admin: {
		description: "All content permissions plus member and settings management.",
		capabilities: [
			"document.read",
			"document.create",
			"document.update",
			"document.delete",
			"document.publish",
			"document.unpublish",
			"asset.read",
			"asset.upload",
			"asset.delete",
			"member.invite",
			"member.remove",
			"member.changeRole",
			"apiKey.manage",
			"role.manage",
			"org.settings",
			"plugin.settings.manage"
		]
	},
	owner: {
		description: "Full access including organization deletion.",
		capabilities: ALL_CAPABILITIES
	}
};
/**
* Write capabilities that imply a matching read. Keeps the UI/API from
* producing degenerate roles/keys that can mutate a resource but not see it.
*/
var DOCUMENT_WRITE_CAPS = [
	"document.create",
	"document.update",
	"document.delete",
	"document.publish",
	"document.unpublish"
];
var ASSET_WRITE_CAPS = ["asset.upload", "asset.delete"];
/**
* Idempotently expand a capability list so that any write cap drags in the
* corresponding read. Used by both the role schema and the API-key schema.
* Accepts `string[]` since a granted list may include plugin capability ids; the
* built-in read/write implications only touch known core ids and pass others through.
*/
function normalizeCapabilities(caps) {
	const set = new Set(caps);
	if (DOCUMENT_WRITE_CAPS.some((c) => set.has(c))) set.add("document.read");
	if (ASSET_WRITE_CAPS.some((c) => set.has(c))) set.add("asset.read");
	return Array.from(set);
}
/**
* Instance roles that override everything else.
*
* `super_admin` and `admin` on the user profile receive the full capability
* set regardless of their per-org role. Keeps the "break glass" path usable
* even if an admin accidentally locks their own role down.
*/
var INSTANCE_ROLE_OVERRIDES = /* @__PURE__ */ new Set(["super_admin", "admin"]);
function isInstanceRole(auth) {
	return auth.type === "session" && INSTANCE_ROLE_OVERRIDES.has(auth.user.role);
}
/**
* Check whether an Auth already has a capability.
*
* Expects `auth.capabilities` to have been populated by the auth hook via
* RolesService. If absent (e.g. legacy call site), falls back to the built-in
* seed for the org role so behavior remains safe.
*/
function hasCapability(auth, capability) {
	return resolveCapabilities(auth).has(capability);
}
/**
* Resolve the effective capability set for an Auth.
*
* Precedence:
*   1. `auth.capabilities` (pre-resolved by the auth hook) — authoritative.
*   2. Instance-role override (super_admin/admin) → all capabilities.
*   3. API keys → derived from `read`/`write` scopes.
*   4. Session fallback → built-in seed for the org role.
*   5. Partial session → empty set.
*/
function resolveCapabilities(auth) {
	if (auth.type === "partial_session") return EMPTY;
	if ("capabilities" in auth && Array.isArray(auth.capabilities)) return new Set(auth.capabilities);
	if (auth.type === "session" && INSTANCE_ROLE_OVERRIDES.has(auth.user.role)) return new Set(ALL_CAPABILITIES);
	if (auth.type === "api_key") {
		if (Array.isArray(auth.capabilities) && auth.capabilities.length > 0) return new Set(auth.capabilities);
		const caps = /* @__PURE__ */ new Set(["document.read", "asset.read"]);
		if (auth.permissions.includes("write")) {
			caps.add("document.create");
			caps.add("document.update");
			caps.add("document.delete");
			caps.add("document.publish");
			caps.add("document.unpublish");
			caps.add("asset.upload");
			caps.add("asset.delete");
		}
		return caps;
	}
	const builtin = BUILTIN_ROLE_SEED[auth.organizationRole];
	return builtin ? new Set(builtin.capabilities) : EMPTY;
}
/**
* Resolve the effective organization role name for an Auth, honoring
* instance-role overrides. Returns the role name as a string — built-in or
* custom — or `null` for partial sessions and API keys.
*
* Used by schema-level access lists: an allowlist like
* `['admin','owner','Testing']` is matched literally against this value, so
* custom role names participate just like built-ins do.
*/
function effectiveOrganizationRole(auth) {
	if (auth.type !== "session") return null;
	if (INSTANCE_ROLE_OVERRIDES.has(auth.user.role)) return "owner";
	return auth.organizationRole ?? null;
}
var EMPTY = /* @__PURE__ */ new Set();
var SECONDS_A_HOUR = 3600;
var SECONDS_A_DAY = SECONDS_A_HOUR * 24;
var SECONDS_A_WEEK = SECONDS_A_DAY * 7;
var MILLISECONDS_A_SECOND = 1e3;
var MILLISECONDS_A_MINUTE = 60 * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND;
var MS = "millisecond";
var S = "second";
var MIN = "minute";
var H = "hour";
var W = "week";
var M = "month";
var Q = "quarter";
var Y = "year";
var DATE = "date";
var INVALID_DATE_STRING = "Invalid Date";
var REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
//#endregion
//#region ../../node_modules/.pnpm/dayjs@1.11.19/node_modules/dayjs/esm/locale/en.js
var en_default = {
	name: "en",
	weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
	months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
	ordinal: function ordinal(n) {
		var s = [
			"th",
			"st",
			"nd",
			"rd"
		];
		var v = n % 100;
		return "[" + n + (s[(v - 20) % 10] || s[v] || s[0]) + "]";
	}
};
//#endregion
//#region ../../node_modules/.pnpm/dayjs@1.11.19/node_modules/dayjs/esm/utils.js
var padStart = function padStart(string, length, pad) {
	var s = String(string);
	if (!s || s.length >= length) return string;
	return "" + Array(length + 1 - s.length).join(pad) + string;
};
var utils_default = {
	s: padStart,
	z: function padZoneStr(instance) {
		var negMinutes = -instance.utcOffset();
		var minutes = Math.abs(negMinutes);
		var hourOffset = Math.floor(minutes / 60);
		var minuteOffset = minutes % 60;
		return (negMinutes <= 0 ? "+" : "-") + padStart(hourOffset, 2, "0") + ":" + padStart(minuteOffset, 2, "0");
	},
	m: function monthDiff(a, b) {
		if (a.date() < b.date()) return -monthDiff(b, a);
		var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
		var anchor = a.clone().add(wholeMonthDiff, M);
		var c = b - anchor < 0;
		var anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), M);
		return +(-(wholeMonthDiff + (b - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)) || 0);
	},
	a: function absFloor(n) {
		return n < 0 ? Math.ceil(n) || 0 : Math.floor(n);
	},
	p: function prettyUnit(u) {
		return {
			M: "month",
			y: "year",
			w: "week",
			d: "day",
			D: "date",
			h: "hour",
			m: "minute",
			s: "second",
			ms: "millisecond",
			Q: "quarter"
		}[u] || String(u || "").toLowerCase().replace(/s$/, "");
	},
	u: function isUndefined(s) {
		return s === void 0;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/dayjs@1.11.19/node_modules/dayjs/esm/index.js
var L = "en";
var Ls = {};
Ls[L] = en_default;
var IS_DAYJS = "$isDayjsObject";
var isDayjs = function isDayjs(d) {
	return d instanceof Dayjs || !!(d && d[IS_DAYJS]);
};
var parseLocale = function parseLocale(preset, object, isLocal) {
	var l;
	if (!preset) return L;
	if (typeof preset === "string") {
		var presetLower = preset.toLowerCase();
		if (Ls[presetLower]) l = presetLower;
		if (object) {
			Ls[presetLower] = object;
			l = presetLower;
		}
		var presetSplit = preset.split("-");
		if (!l && presetSplit.length > 1) return parseLocale(presetSplit[0]);
	} else {
		var name = preset.name;
		Ls[name] = preset;
		l = name;
	}
	if (!isLocal && l) L = l;
	return l || !isLocal && L;
};
var dayjs = function dayjs(date, c) {
	if (isDayjs(date)) return date.clone();
	var cfg = typeof c === "object" ? c : {};
	cfg.date = date;
	cfg.args = arguments;
	return new Dayjs(cfg);
};
var wrapper = function wrapper(date, instance) {
	return dayjs(date, {
		locale: instance.$L,
		utc: instance.$u,
		x: instance.$x,
		$offset: instance.$offset
	});
};
var Utils = utils_default;
Utils.l = parseLocale;
Utils.i = isDayjs;
Utils.w = wrapper;
var parseDate = function parseDate(cfg) {
	var date = cfg.date, utc = cfg.utc;
	if (date === null) return /* @__PURE__ */ new Date(NaN);
	if (Utils.u(date)) return /* @__PURE__ */ new Date();
	if (date instanceof Date) return new Date(date);
	if (typeof date === "string" && !/Z$/i.test(date)) {
		var d = date.match(REGEX_PARSE);
		if (d) {
			var m = d[2] - 1 || 0;
			var ms = (d[7] || "0").substring(0, 3);
			if (utc) return new Date(Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms));
			return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
		}
	}
	return new Date(date);
};
var Dayjs = /*#__PURE__*/ function() {
	function Dayjs(cfg) {
		this.$L = parseLocale(cfg.locale, null, true);
		this.parse(cfg);
		this.$x = this.$x || cfg.x || {};
		this[IS_DAYJS] = true;
	}
	var _proto = Dayjs.prototype;
	_proto.parse = function parse(cfg) {
		this.$d = parseDate(cfg);
		this.init();
	};
	_proto.init = function init() {
		var $d = this.$d;
		this.$y = $d.getFullYear();
		this.$M = $d.getMonth();
		this.$D = $d.getDate();
		this.$W = $d.getDay();
		this.$H = $d.getHours();
		this.$m = $d.getMinutes();
		this.$s = $d.getSeconds();
		this.$ms = $d.getMilliseconds();
	};
	_proto.$utils = function $utils() {
		return Utils;
	};
	_proto.isValid = function isValid() {
		return !(this.$d.toString() === INVALID_DATE_STRING);
	};
	_proto.isSame = function isSame(that, units) {
		var other = dayjs(that);
		return this.startOf(units) <= other && other <= this.endOf(units);
	};
	_proto.isAfter = function isAfter(that, units) {
		return dayjs(that) < this.startOf(units);
	};
	_proto.isBefore = function isBefore(that, units) {
		return this.endOf(units) < dayjs(that);
	};
	_proto.$g = function $g(input, get, set) {
		if (Utils.u(input)) return this[get];
		return this.set(set, input);
	};
	_proto.unix = function unix() {
		return Math.floor(this.valueOf() / 1e3);
	};
	_proto.valueOf = function valueOf() {
		return this.$d.getTime();
	};
	_proto.startOf = function startOf(units, _startOf) {
		var _this = this;
		var isStartOf = !Utils.u(_startOf) ? _startOf : true;
		var unit = Utils.p(units);
		var instanceFactory = function instanceFactory(d, m) {
			var ins = Utils.w(_this.$u ? Date.UTC(_this.$y, m, d) : new Date(_this.$y, m, d), _this);
			return isStartOf ? ins : ins.endOf("day");
		};
		var instanceFactorySet = function instanceFactorySet(method, slice) {
			return Utils.w(_this.toDate()[method].apply(_this.toDate("s"), (isStartOf ? [
				0,
				0,
				0,
				0
			] : [
				23,
				59,
				59,
				999
			]).slice(slice)), _this);
		};
		var $W = this.$W, $M = this.$M, $D = this.$D;
		var utcPad = "set" + (this.$u ? "UTC" : "");
		switch (unit) {
			case Y: return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);
			case M: return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);
			case W:
				var weekStart = this.$locale().weekStart || 0;
				var gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
				return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
			case "day":
			case DATE: return instanceFactorySet(utcPad + "Hours", 0);
			case H: return instanceFactorySet(utcPad + "Minutes", 1);
			case MIN: return instanceFactorySet(utcPad + "Seconds", 2);
			case S: return instanceFactorySet(utcPad + "Milliseconds", 3);
			default: return this.clone();
		}
	};
	_proto.endOf = function endOf(arg) {
		return this.startOf(arg, false);
	};
	_proto.$set = function $set(units, _int) {
		var _C$D$C$DATE$C$M$C$Y$C;
		var unit = Utils.p(units);
		var utcPad = "set" + (this.$u ? "UTC" : "");
		var name = (_C$D$C$DATE$C$M$C$Y$C = {}, _C$D$C$DATE$C$M$C$Y$C["day"] = utcPad + "Date", _C$D$C$DATE$C$M$C$Y$C[DATE] = utcPad + "Date", _C$D$C$DATE$C$M$C$Y$C[M] = utcPad + "Month", _C$D$C$DATE$C$M$C$Y$C[Y] = utcPad + "FullYear", _C$D$C$DATE$C$M$C$Y$C[H] = utcPad + "Hours", _C$D$C$DATE$C$M$C$Y$C[MIN] = utcPad + "Minutes", _C$D$C$DATE$C$M$C$Y$C[S] = utcPad + "Seconds", _C$D$C$DATE$C$M$C$Y$C[MS] = utcPad + "Milliseconds", _C$D$C$DATE$C$M$C$Y$C)[unit];
		var arg = unit === "day" ? this.$D + (_int - this.$W) : _int;
		if (unit === "month" || unit === "year") {
			var date = this.clone().set(DATE, 1);
			date.$d[name](arg);
			date.init();
			this.$d = date.set(DATE, Math.min(this.$D, date.daysInMonth())).$d;
		} else if (name) this.$d[name](arg);
		this.init();
		return this;
	};
	_proto.set = function set(string, _int2) {
		return this.clone().$set(string, _int2);
	};
	_proto.get = function get(unit) {
		return this[Utils.p(unit)]();
	};
	_proto.add = function add(number, units) {
		var _this2 = this, _C$MIN$C$H$C$S$unit;
		number = Number(number);
		var unit = Utils.p(units);
		var instanceFactorySet = function instanceFactorySet(n) {
			var d = dayjs(_this2);
			return Utils.w(d.date(d.date() + Math.round(n * number)), _this2);
		};
		if (unit === "month") return this.set(M, this.$M + number);
		if (unit === "year") return this.set(Y, this.$y + number);
		if (unit === "day") return instanceFactorySet(1);
		if (unit === "week") return instanceFactorySet(7);
		var step = (_C$MIN$C$H$C$S$unit = {}, _C$MIN$C$H$C$S$unit["minute"] = 6e4, _C$MIN$C$H$C$S$unit["hour"] = 36e5, _C$MIN$C$H$C$S$unit["second"] = 1e3, _C$MIN$C$H$C$S$unit)[unit] || 1;
		var nextTimeStamp = this.$d.getTime() + number * step;
		return Utils.w(nextTimeStamp, this);
	};
	_proto.subtract = function subtract(number, string) {
		return this.add(number * -1, string);
	};
	_proto.format = function format(formatStr) {
		var _this3 = this;
		var locale = this.$locale();
		if (!this.isValid()) return locale.invalidDate || "Invalid Date";
		var str = formatStr || "YYYY-MM-DDTHH:mm:ssZ";
		var zoneStr = Utils.z(this);
		var $H = this.$H, $m = this.$m, $M = this.$M;
		var weekdays = locale.weekdays, months = locale.months, meridiem = locale.meridiem;
		var getShort = function getShort(arr, index, full, length) {
			return arr && (arr[index] || arr(_this3, str)) || full[index].slice(0, length);
		};
		var get$H = function get$H(num) {
			return Utils.s($H % 12 || 12, num, "0");
		};
		var meridiemFunc = meridiem || function(hour, minute, isLowercase) {
			var m = hour < 12 ? "AM" : "PM";
			return isLowercase ? m.toLowerCase() : m;
		};
		var matches = function matches(match) {
			switch (match) {
				case "YY": return String(_this3.$y).slice(-2);
				case "YYYY": return Utils.s(_this3.$y, 4, "0");
				case "M": return $M + 1;
				case "MM": return Utils.s($M + 1, 2, "0");
				case "MMM": return getShort(locale.monthsShort, $M, months, 3);
				case "MMMM": return getShort(months, $M);
				case "D": return _this3.$D;
				case "DD": return Utils.s(_this3.$D, 2, "0");
				case "d": return String(_this3.$W);
				case "dd": return getShort(locale.weekdaysMin, _this3.$W, weekdays, 2);
				case "ddd": return getShort(locale.weekdaysShort, _this3.$W, weekdays, 3);
				case "dddd": return weekdays[_this3.$W];
				case "H": return String($H);
				case "HH": return Utils.s($H, 2, "0");
				case "h": return get$H(1);
				case "hh": return get$H(2);
				case "a": return meridiemFunc($H, $m, true);
				case "A": return meridiemFunc($H, $m, false);
				case "m": return String($m);
				case "mm": return Utils.s($m, 2, "0");
				case "s": return String(_this3.$s);
				case "ss": return Utils.s(_this3.$s, 2, "0");
				case "SSS": return Utils.s(_this3.$ms, 3, "0");
				case "Z": return zoneStr;
				default: break;
			}
			return null;
		};
		return str.replace(REGEX_FORMAT, function(match, $1) {
			return $1 || matches(match) || zoneStr.replace(":", "");
		});
	};
	_proto.utcOffset = function utcOffset() {
		return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
	};
	_proto.diff = function diff(input, units, _float) {
		var _this4 = this;
		var unit = Utils.p(units);
		var that = dayjs(input);
		var zoneDelta = (that.utcOffset() - this.utcOffset()) * MILLISECONDS_A_MINUTE;
		var diff = this - that;
		var getMonth = function getMonth() {
			return Utils.m(_this4, that);
		};
		var result;
		switch (unit) {
			case Y:
				result = getMonth() / 12;
				break;
			case M:
				result = getMonth();
				break;
			case Q:
				result = getMonth() / 3;
				break;
			case W:
				result = (diff - zoneDelta) / MILLISECONDS_A_WEEK;
				break;
			case "day":
				result = (diff - zoneDelta) / MILLISECONDS_A_DAY;
				break;
			case H:
				result = diff / MILLISECONDS_A_HOUR;
				break;
			case MIN:
				result = diff / MILLISECONDS_A_MINUTE;
				break;
			case S:
				result = diff / MILLISECONDS_A_SECOND;
				break;
			default:
				result = diff;
				break;
		}
		return _float ? result : Utils.a(result);
	};
	_proto.daysInMonth = function daysInMonth() {
		return this.endOf(M).$D;
	};
	_proto.$locale = function $locale() {
		return Ls[this.$L];
	};
	_proto.locale = function locale(preset, object) {
		if (!preset) return this.$L;
		var that = this.clone();
		var nextLocaleName = parseLocale(preset, object, true);
		if (nextLocaleName) that.$L = nextLocaleName;
		return that;
	};
	_proto.clone = function clone() {
		return Utils.w(this.$d, this);
	};
	_proto.toDate = function toDate() {
		return new Date(this.valueOf());
	};
	_proto.toJSON = function toJSON() {
		return this.isValid() ? this.toISOString() : null;
	};
	_proto.toISOString = function toISOString() {
		return this.$d.toISOString();
	};
	_proto.toString = function toString() {
		return this.$d.toUTCString();
	};
	return Dayjs;
}();
var proto = Dayjs.prototype;
dayjs.prototype = proto;
[
	["$ms", MS],
	["$s", S],
	["$m", MIN],
	["$H", H],
	["$W", "day"],
	["$M", M],
	["$y", Y],
	["$D", DATE]
].forEach(function(g) {
	proto[g[1]] = function(input) {
		return this.$g(input, g[0], g[1]);
	};
});
dayjs.extend = function(plugin, option) {
	if (!plugin.$i) {
		plugin(option, Dayjs, dayjs);
		plugin.$i = true;
	}
	return dayjs;
};
dayjs.locale = parseLocale;
dayjs.isDayjs = isDayjs;
dayjs.unix = function(timestamp) {
	return dayjs(timestamp * 1e3);
};
dayjs.en = Ls[L];
dayjs.Ls = Ls;
dayjs.p = {};
//#endregion
//#region ../../node_modules/.pnpm/dayjs@1.11.19/node_modules/dayjs/esm/plugin/localizedFormat/utils.js
var t = function t(format) {
	return format.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(_, a, b) {
		return a || b.slice(1);
	});
};
var englishFormats = {
	LTS: "h:mm:ss A",
	LT: "h:mm A",
	L: "MM/DD/YYYY",
	LL: "MMMM D, YYYY",
	LLL: "MMMM D, YYYY h:mm A",
	LLLL: "dddd, MMMM D, YYYY h:mm A"
};
var u = function u(formatStr, formats) {
	return formatStr.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(_, a, b) {
		var B = b && b.toUpperCase();
		return a || formats[b] || englishFormats[b] || t(formats[B]);
	});
};
//#endregion
//#region ../../node_modules/.pnpm/dayjs@1.11.19/node_modules/dayjs/esm/plugin/customParseFormat/index.js
var formattingTokens = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g;
var match1 = /\d/;
var match2 = /\d\d/;
var match3 = /\d{3}/;
var match4 = /\d{4}/;
var match1to2 = /\d\d?/;
var matchSigned = /[+-]?\d+/;
var matchOffset = /[+-]\d\d:?(\d\d)?|Z/;
var matchWord = /\d*[^-_:/,()\s\d]+/;
var locale = {};
var parseTwoDigitYear = function parseTwoDigitYear(input) {
	input = +input;
	return input + (input > 68 ? 1900 : 2e3);
};
function offsetFromString$1(string) {
	if (!string) return 0;
	if (string === "Z") return 0;
	var parts = string.match(/([+-]|\d\d)/g);
	var minutes = +(parts[1] * 60) + (+parts[2] || 0);
	return minutes === 0 ? 0 : parts[0] === "+" ? -minutes : minutes;
}
var addInput = function addInput(property) {
	return function(input) {
		this[property] = +input;
	};
};
var zoneExpressions = [matchOffset, function(input) {
	var zone = this.zone || (this.zone = {});
	zone.offset = offsetFromString$1(input);
}];
var getLocalePart = function getLocalePart(name) {
	var part = locale[name];
	return part && (part.indexOf ? part : part.s.concat(part.f));
};
var meridiemMatch = function meridiemMatch(input, isLowerCase) {
	var isAfternoon;
	var meridiem = locale.meridiem;
	if (!meridiem) isAfternoon = input === (isLowerCase ? "pm" : "PM");
	else for (var i = 1; i <= 24; i += 1) if (input.indexOf(meridiem(i, 0, isLowerCase)) > -1) {
		isAfternoon = i > 12;
		break;
	}
	return isAfternoon;
};
var expressions = {
	A: [matchWord, function(input) {
		this.afternoon = meridiemMatch(input, false);
	}],
	a: [matchWord, function(input) {
		this.afternoon = meridiemMatch(input, true);
	}],
	Q: [match1, function(input) {
		this.month = (input - 1) * 3 + 1;
	}],
	S: [match1, function(input) {
		this.milliseconds = +input * 100;
	}],
	SS: [match2, function(input) {
		this.milliseconds = +input * 10;
	}],
	SSS: [match3, function(input) {
		this.milliseconds = +input;
	}],
	s: [match1to2, addInput("seconds")],
	ss: [match1to2, addInput("seconds")],
	m: [match1to2, addInput("minutes")],
	mm: [match1to2, addInput("minutes")],
	H: [match1to2, addInput("hours")],
	h: [match1to2, addInput("hours")],
	HH: [match1to2, addInput("hours")],
	hh: [match1to2, addInput("hours")],
	D: [match1to2, addInput("day")],
	DD: [match2, addInput("day")],
	Do: [matchWord, function(input) {
		var ordinal = locale.ordinal;
		var _input$match = input.match(/\d+/);
		this.day = _input$match[0];
		if (!ordinal) return;
		for (var i = 1; i <= 31; i += 1) if (ordinal(i).replace(/\[|\]/g, "") === input) this.day = i;
	}],
	w: [match1to2, addInput("week")],
	ww: [match2, addInput("week")],
	M: [match1to2, addInput("month")],
	MM: [match2, addInput("month")],
	MMM: [matchWord, function(input) {
		var months = getLocalePart("months");
		var matchIndex = (getLocalePart("monthsShort") || months.map(function(_) {
			return _.slice(0, 3);
		})).indexOf(input) + 1;
		if (matchIndex < 1) throw new Error();
		this.month = matchIndex % 12 || matchIndex;
	}],
	MMMM: [matchWord, function(input) {
		var matchIndex = getLocalePart("months").indexOf(input) + 1;
		if (matchIndex < 1) throw new Error();
		this.month = matchIndex % 12 || matchIndex;
	}],
	Y: [matchSigned, addInput("year")],
	YY: [match2, function(input) {
		this.year = parseTwoDigitYear(input);
	}],
	YYYY: [match4, addInput("year")],
	Z: zoneExpressions,
	ZZ: zoneExpressions
};
function correctHours(time) {
	var afternoon = time.afternoon;
	if (afternoon !== void 0) {
		var hours = time.hours;
		if (afternoon) {
			if (hours < 12) time.hours += 12;
		} else if (hours === 12) time.hours = 0;
		delete time.afternoon;
	}
}
function makeParser(format) {
	format = u(format, locale && locale.formats);
	var array = format.match(formattingTokens);
	var length = array.length;
	for (var i = 0; i < length; i += 1) {
		var token = array[i];
		var parseTo = expressions[token];
		var regex = parseTo && parseTo[0];
		var parser = parseTo && parseTo[1];
		if (parser) array[i] = {
			regex,
			parser
		};
		else array[i] = token.replace(/^\[|\]$/g, "");
	}
	return function(input) {
		var time = {};
		for (var _i = 0, start = 0; _i < length; _i += 1) {
			var _token = array[_i];
			if (typeof _token === "string") start += _token.length;
			else {
				var _regex = _token.regex, _parser = _token.parser;
				var part = input.slice(start);
				var value = _regex.exec(part)[0];
				_parser.call(time, value);
				input = input.replace(value, "");
			}
		}
		correctHours(time);
		return time;
	};
}
var parseFormattedInput = function parseFormattedInput(input, format, utc, dayjs) {
	try {
		if (["x", "X"].indexOf(format) > -1) return /* @__PURE__ */ new Date((format === "X" ? 1e3 : 1) * input);
		var _parser2 = makeParser(format)(input), year = _parser2.year, month = _parser2.month, day = _parser2.day, hours = _parser2.hours, minutes = _parser2.minutes, seconds = _parser2.seconds, milliseconds = _parser2.milliseconds, zone = _parser2.zone, week = _parser2.week;
		var now = /* @__PURE__ */ new Date();
		var d = day || (!year && !month ? now.getDate() : 1);
		var y = year || now.getFullYear();
		var M = 0;
		if (!(year && !month)) M = month > 0 ? month - 1 : now.getMonth();
		var h = hours || 0;
		var m = minutes || 0;
		var s = seconds || 0;
		var ms = milliseconds || 0;
		if (zone) return new Date(Date.UTC(y, M, d, h, m, s, ms + zone.offset * 60 * 1e3));
		if (utc) return new Date(Date.UTC(y, M, d, h, m, s, ms));
		var newDate = new Date(y, M, d, h, m, s, ms);
		if (week) newDate = dayjs(newDate).week(week).toDate();
		return newDate;
	} catch (e) {
		return /* @__PURE__ */ new Date("");
	}
};
var customParseFormat_default = (function(o, C, d) {
	d.p.customParseFormat = true;
	if (o && o.parseTwoDigitYear) parseTwoDigitYear = o.parseTwoDigitYear;
	var proto = C.prototype;
	var oldParse = proto.parse;
	proto.parse = function(cfg) {
		var date = cfg.date, utc = cfg.utc, args = cfg.args;
		this.$u = utc;
		var format = args[1];
		if (typeof format === "string") {
			var isStrictWithoutLocale = args[2] === true;
			var isStrictWithLocale = args[3] === true;
			var isStrict = isStrictWithoutLocale || isStrictWithLocale;
			var pl = args[2];
			if (isStrictWithLocale) pl = args[2];
			locale = this.$locale();
			if (!isStrictWithoutLocale && pl) locale = d.Ls[pl];
			this.$d = parseFormattedInput(date, format, utc, d);
			this.init();
			if (pl && pl !== true) this.$L = this.locale(pl).$L;
			if (isStrict && date != this.format(format)) this.$d = /* @__PURE__ */ new Date("");
			locale = {};
		} else if (format instanceof Array) {
			var len = format.length;
			for (var i = 1; i <= len; i += 1) {
				args[1] = format[i - 1];
				var result = d.apply(this, args);
				if (result.isValid()) {
					this.$d = result.$d;
					this.$L = result.$L;
					this.init();
					break;
				}
				if (i === len) this.$d = /* @__PURE__ */ new Date("");
			}
		} else oldParse.call(this, cfg);
	};
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.5.2_6aae2b0bc5f037c66cc3c68e11b93a28/node_modules/@aphexcms/cms-core/dist/field-validation/rule.js
dayjs.extend(customParseFormat_default);
var Rule = class Rule {
	_required = false;
	_rules = [];
	_level = "error";
	_message;
	static FIELD_REF = Symbol("fieldReference");
	static valueOfField(path) {
		return {
			__fieldReference: true,
			path
		};
	}
	valueOfField(path) {
		return Rule.valueOfField(path);
	}
	required() {
		const newRule = this.clone();
		newRule._required = true;
		return newRule;
	}
	optional() {
		const newRule = this.clone();
		newRule._required = false;
		return newRule;
	}
	min(len) {
		const newRule = this.clone();
		newRule._rules.push({
			type: "min",
			constraint: len
		});
		return newRule;
	}
	max(len) {
		const newRule = this.clone();
		newRule._rules.push({
			type: "max",
			constraint: len
		});
		return newRule;
	}
	length(len) {
		const newRule = this.clone();
		newRule._rules.push({
			type: "length",
			constraint: len
		});
		return newRule;
	}
	unique() {
		const newRule = this.clone();
		newRule._rules.push({ type: "unique" });
		return newRule;
	}
	email() {
		const newRule = this.clone();
		newRule._rules.push({ type: "email" });
		return newRule;
	}
	uri(options) {
		const newRule = this.clone();
		newRule._rules.push({
			type: "uri",
			constraint: options
		});
		return newRule;
	}
	regex(pattern, name) {
		const newRule = this.clone();
		newRule._rules.push({
			type: "regex",
			constraint: {
				pattern,
				name
			}
		});
		return newRule;
	}
	positive() {
		const newRule = this.clone();
		newRule._rules.push({ type: "positive" });
		return newRule;
	}
	negative() {
		const newRule = this.clone();
		newRule._rules.push({ type: "negative" });
		return newRule;
	}
	integer() {
		const newRule = this.clone();
		newRule._rules.push({ type: "integer" });
		return newRule;
	}
	greaterThan(num) {
		const newRule = this.clone();
		newRule._rules.push({
			type: "greaterThan",
			constraint: num
		});
		return newRule;
	}
	lessThan(num) {
		const newRule = this.clone();
		newRule._rules.push({
			type: "lessThan",
			constraint: num
		});
		return newRule;
	}
	date(format) {
		const newRule = this.clone();
		newRule._rules.push({
			type: "date",
			constraint: format || "YYYY-MM-DD"
		});
		return newRule;
	}
	datetime(dateFormat, timeFormat) {
		const newRule = this.clone();
		const fullFormat = `${dateFormat || "YYYY-MM-DD"} ${timeFormat || "HH:mm"}`;
		newRule._rules.push({
			type: "datetime",
			constraint: fullFormat
		});
		return newRule;
	}
	custom(fn) {
		const newRule = this.clone();
		newRule._rules.push({
			type: "custom",
			constraint: fn
		});
		return newRule;
	}
	error(message) {
		const newRule = this.clone();
		newRule._level = "error";
		newRule._message = message;
		return newRule;
	}
	warning(message) {
		const newRule = this.clone();
		newRule._level = "warning";
		newRule._message = message;
		return newRule;
	}
	info(message) {
		const newRule = this.clone();
		newRule._level = "info";
		newRule._message = message;
		return newRule;
	}
	clone() {
		const newRule = new Rule();
		newRule._required = this._required;
		newRule._rules = [...this._rules];
		newRule._level = this._level;
		newRule._message = this._message;
		return newRule;
	}
	async validate(value, context = {}) {
		const markers = [];
		if (this._required && (value === void 0 || value === null || value === "")) markers.push({
			level: this._level,
			message: this._message || "Required",
			path: context.path
		});
		if (!this._required && (value === void 0 || value === null || value === "")) return markers;
		for (const rule of this._rules) try {
			const result = await this.validateRule(rule, value, context);
			if (result) markers.push({
				level: this._level,
				message: this._message || result,
				path: context.path
			});
		} catch (error) {
			markers.push({
				level: "error",
				message: `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
				path: context.path
			});
		}
		return markers;
	}
	async validateRule(rule, value, context) {
		switch (rule.type) {
			case "min":
				if (typeof value === "string" && value.length < rule.constraint) return `Must be at least ${rule.constraint} characters`;
				if (typeof value === "number" && value < rule.constraint) return `Must be at least ${rule.constraint}`;
				if (Array.isArray(value) && value.length < rule.constraint) return `Must have at least ${rule.constraint} item${rule.constraint === 1 ? "" : "s"}`;
				break;
			case "max":
				if (typeof value === "string" && value.length > rule.constraint) return `Must be at most ${rule.constraint} characters`;
				if (typeof value === "number" && value > rule.constraint) return `Must be at most ${rule.constraint}`;
				if (Array.isArray(value) && value.length > rule.constraint) return `Must have at most ${rule.constraint} item${rule.constraint === 1 ? "" : "s"}`;
				break;
			case "length":
				if (Array.isArray(value) && value.length !== rule.constraint) return `Must have exactly ${rule.constraint} item${rule.constraint === 1 ? "" : "s"}`;
				if (typeof value === "string" && value.length !== rule.constraint) return `Must be exactly ${rule.constraint} characters`;
				break;
			case "unique":
				if (Array.isArray(value)) {
					const seen = /* @__PURE__ */ new Set();
					for (const item of value) {
						const normalized = this.normalizeForComparison(item);
						const serialized = JSON.stringify(normalized);
						if (seen.has(serialized)) return "All items must be unique";
						seen.add(serialized);
					}
				}
				break;
			case "email":
				if (typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Must be a valid email address";
				break;
			case "uri":
				if (typeof value === "string") {
					const opts = rule.constraint || {};
					const schemes = opts.scheme || [/^https?$/];
					const allowRelative = opts.allowRelative || false;
					const relativeOnly = opts.relativeOnly || false;
					const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
					const isProtocolRelative = value.startsWith("//");
					if (relativeOnly) {
						if (hasScheme || isProtocolRelative) return "Must be a relative URL";
						if (!value.startsWith("/") && !value.startsWith(".") && !value.startsWith("#") && !value.startsWith("?")) return "Must be a relative URL starting with /, ., #, or ?";
					} else if (!hasScheme && !isProtocolRelative) {
						if (!allowRelative) return "Must be an absolute URL";
						if (!value.startsWith("/") && !value.startsWith(".") && !value.startsWith("#") && !value.startsWith("?")) return "Must be a valid relative URL";
					} else try {
						const urlScheme = new URL(value).protocol.slice(0, -1);
						if (!schemes.some((s) => s instanceof RegExp ? s.test(urlScheme) : s === urlScheme)) return `URL scheme must be one of: ${schemes.map((s) => s instanceof RegExp ? s.toString() : s).join(", ")}`;
					} catch {
						return "Must be a valid URL";
					}
				}
				break;
			case "regex":
				if (typeof value === "string" && !rule.constraint.pattern.test(value)) return `Must match pattern${rule.constraint.name ? ` (${rule.constraint.name})` : ""}`;
				break;
			case "positive":
				if (typeof value === "number" && value <= 0) return "Must be positive";
				break;
			case "negative":
				if (typeof value === "number" && value >= 0) return "Must be negative";
				break;
			case "integer":
				if (typeof value === "number" && !Number.isInteger(value)) return "Must be an integer";
				break;
			case "date":
				if (typeof value === "string") {
					const format = rule.constraint || "YYYY-MM-DD";
					cmsLogger.debug("[Rule.validate] DATE validation", {
						value,
						format
					});
					const parsed = dayjs(value, format, true);
					cmsLogger.debug("[Rule.validate] DATE parsed", {
						isValid: parsed.isValid(),
						parsed: parsed.format()
					});
					if (!parsed.isValid()) {
						cmsLogger.debug("[Rule.validate] DATE validation FAILED - invalid format");
						return `Invalid date format. Expected: ${format}`;
					}
					if (parsed.format(format) !== value) {
						cmsLogger.debug("[Rule.validate] DATE validation FAILED - format mismatch", {
							expected: value,
							got: parsed.format(format)
						});
						return `Invalid date. Expected format: ${format}`;
					}
					cmsLogger.debug("[Rule.validate] DATE validation PASSED");
				}
				break;
			case "datetime":
				if (typeof value === "string") {
					const format = rule.constraint || "YYYY-MM-DD HH:mm";
					cmsLogger.debug("[Rule.validate] DATETIME validation", {
						value,
						format
					});
					const parsed = dayjs(value, format, true);
					cmsLogger.debug("[Rule.validate] DATETIME parsed", {
						isValid: parsed.isValid(),
						parsed: parsed.format()
					});
					if (!parsed.isValid()) {
						cmsLogger.debug("[Rule.validate] DATETIME validation FAILED - invalid format");
						return `Invalid datetime format. Expected: ${format}`;
					}
					if (parsed.format(format) !== value) {
						cmsLogger.debug("[Rule.validate] DATETIME validation FAILED - format mismatch", {
							expected: value,
							got: parsed.format(format)
						});
						return `Invalid datetime. Expected format: ${format}`;
					}
					cmsLogger.debug("[Rule.validate] DATETIME validation PASSED");
				}
				break;
			case "custom": {
				const customResult = await rule.constraint(value, context);
				if (customResult === false) return "Validation failed";
				if (typeof customResult === "string") return customResult;
				if (Array.isArray(customResult) && customResult.length > 0) return customResult[0].message;
				break;
			}
		}
		return null;
	}
	isRequired() {
		return this._required;
	}
	normalizeForComparison(value) {
		if (value === null || value === void 0) return value;
		if (Array.isArray(value)) return value.map((item) => this.normalizeForComparison(item));
		if (typeof value === "object") {
			const normalized = {};
			for (const [key, val] of Object.entries(value)) if (key !== "_key") normalized[key] = this.normalizeForComparison(val);
			return normalized;
		}
		return value;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/dayjs@1.11.19/node_modules/dayjs/esm/plugin/utc/index.js
var REGEX_VALID_OFFSET_FORMAT = /[+-]\d\d(?::?\d\d)?/g;
var REGEX_OFFSET_HOURS_MINUTES_FORMAT = /([+-]|\d\d)/g;
function offsetFromString(value) {
	if (value === void 0) value = "";
	var offset = value.match(REGEX_VALID_OFFSET_FORMAT);
	if (!offset) return null;
	var _ref = ("" + offset[0]).match(REGEX_OFFSET_HOURS_MINUTES_FORMAT) || [
		"-",
		0,
		0
	], indicator = _ref[0], hoursOffset = _ref[1], minutesOffset = _ref[2];
	var totalOffsetInMinutes = +hoursOffset * 60 + +minutesOffset;
	if (totalOffsetInMinutes === 0) return 0;
	return indicator === "+" ? totalOffsetInMinutes : -totalOffsetInMinutes;
}
var utc_default = (function(option, Dayjs, dayjs) {
	var proto = Dayjs.prototype;
	dayjs.utc = function(date) {
		return new Dayjs({
			date,
			utc: true,
			args: arguments
		});
	};
	proto.utc = function(keepLocalTime) {
		var ins = dayjs(this.toDate(), {
			locale: this.$L,
			utc: true
		});
		if (keepLocalTime) return ins.add(this.utcOffset(), MIN);
		return ins;
	};
	proto.local = function() {
		return dayjs(this.toDate(), {
			locale: this.$L,
			utc: false
		});
	};
	var oldParse = proto.parse;
	proto.parse = function(cfg) {
		if (cfg.utc) this.$u = true;
		if (!this.$utils().u(cfg.$offset)) this.$offset = cfg.$offset;
		oldParse.call(this, cfg);
	};
	var oldInit = proto.init;
	proto.init = function() {
		if (this.$u) {
			var $d = this.$d;
			this.$y = $d.getUTCFullYear();
			this.$M = $d.getUTCMonth();
			this.$D = $d.getUTCDate();
			this.$W = $d.getUTCDay();
			this.$H = $d.getUTCHours();
			this.$m = $d.getUTCMinutes();
			this.$s = $d.getUTCSeconds();
			this.$ms = $d.getUTCMilliseconds();
		} else oldInit.call(this);
	};
	var oldUtcOffset = proto.utcOffset;
	proto.utcOffset = function(input, keepLocalTime) {
		var u = this.$utils().u;
		if (u(input)) {
			if (this.$u) return 0;
			if (!u(this.$offset)) return this.$offset;
			return oldUtcOffset.call(this);
		}
		if (typeof input === "string") {
			input = offsetFromString(input);
			if (input === null) return this;
		}
		var offset = Math.abs(input) <= 16 ? input * 60 : input;
		if (offset === 0) return this.utc(keepLocalTime);
		var ins = this.clone();
		if (keepLocalTime) {
			ins.$offset = offset;
			ins.$u = false;
			return ins;
		}
		var localTimezoneOffset = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
		ins = this.local().add(offset + localTimezoneOffset, MIN);
		ins.$offset = offset;
		ins.$x.$localOffset = localTimezoneOffset;
		return ins;
	};
	var oldFormat = proto.format;
	var UTC_FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ss[Z]";
	proto.format = function(formatStr) {
		var str = formatStr || (this.$u ? UTC_FORMAT_DEFAULT : "");
		return oldFormat.call(this, str);
	};
	proto.valueOf = function() {
		var addedOffset = !this.$utils().u(this.$offset) ? this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset()) : 0;
		return this.$d.valueOf() - addedOffset * MILLISECONDS_A_MINUTE;
	};
	proto.isUTC = function() {
		return !!this.$u;
	};
	proto.toISOString = function() {
		return this.toDate().toISOString();
	};
	proto.toString = function() {
		return this.toDate().toUTCString();
	};
	var oldToDate = proto.toDate;
	proto.toDate = function(type) {
		if (type === "s" && this.$offset) return dayjs(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate();
		return oldToDate.call(this);
	};
	var oldDiff = proto.diff;
	proto.diff = function(input, units, _float) {
		if (input && this.$u === input.$u) return oldDiff.call(this, input, units, _float);
		var localThis = this.local();
		var localInput = dayjs(input).local();
		return oldDiff.call(localThis, localInput, units, _float);
	};
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.5.2_6aae2b0bc5f037c66cc3c68e11b93a28/node_modules/@aphexcms/cms-core/dist/field-validation/date-utils.js
dayjs.extend(customParseFormat_default);
dayjs.extend(utc_default);
/**
* Convert a date value to user format for validation
* Handles both ISO format and user format inputs
*/
function convertDateToUserFormat(value, userFormat) {
	const parsedISO = dayjs(value, "YYYY-MM-DD", true);
	if (parsedISO.isValid()) return parsedISO.format(userFormat);
	if (dayjs(value, userFormat, true).isValid()) return value;
	return value;
}
/**
* Convert a date value to ISO format for storage
* Returns ISO if already valid, or original value if invalid
*/
function convertDateToISO(value, userFormat) {
	const parsedUser = dayjs(value, userFormat, true);
	if (parsedUser.isValid()) return parsedUser.format("YYYY-MM-DD");
	if (dayjs(value, "YYYY-MM-DD", true).isValid()) return value;
	return value;
}
/**
* Convert a datetime value to user format for validation
* Handles both ISO datetime and user format inputs
*/
function convertDateTimeToUserFormat(value, dateFormat, timeFormat = "HH:mm") {
	const userFormat = `${dateFormat} ${timeFormat}`;
	const parsedISO = dayjs(value, "YYYY-MM-DDTHH:mm:ss[Z]", true);
	if (parsedISO.isValid()) return parsedISO.format(userFormat);
	if (dayjs(value, userFormat, true).isValid()) return value;
	return value;
}
/**
* Convert a datetime value to ISO UTC format for storage
* Returns ISO UTC if already valid, or original value if invalid
*/
function convertDateTimeToISO(value, dateFormat, timeFormat = "HH:mm") {
	const userFormat = `${dateFormat} ${timeFormat}`;
	cmsLogger.debug("[convertDateTimeToISO]", {
		value,
		userFormat
	});
	const parsedUser = dayjs(value, userFormat, true);
	if (parsedUser.isValid()) {
		const result = parsedUser.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
		cmsLogger.debug("[convertDateTimeToISO] User format parse successful, converting to UTC:", result);
		return result;
	}
	const parsedISO = dayjs(value, "YYYY-MM-DDTHH:mm:ss[Z]", true);
	if (parsedISO.isValid()) {
		const result = parsedISO.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
		cmsLogger.debug("[convertDateTimeToISO] ISO parse successful:", result);
		return result;
	}
	cmsLogger.debug("[convertDateTimeToISO] Invalid - returning as-is");
	return value;
}
/**
* Normalize date fields in data object
* Converts dates to ISO for storage and creates a parallel object with user-formatted dates for validation
*/
function normalizeDateFields(data, schema) {
	const normalizedData = { ...data };
	const dataForValidation = { ...data };
	cmsLogger.debug("[normalizeDateFields] Starting normalization...");
	cmsLogger.debug("[normalizeDateFields] Input data:", data);
	for (const field of schema.fields) if (field.type === "date" && normalizedData[field.name]) {
		const userFormat = field.options?.dateFormat || "YYYY-MM-DD";
		const dateValue = normalizedData[field.name];
		cmsLogger.debug(`[normalizeDateFields] Processing DATE field "${field.name}"`, {
			originalValue: dateValue,
			userFormat
		});
		if (typeof dateValue === "string") {
			normalizedData[field.name] = convertDateToISO(dateValue, userFormat);
			dataForValidation[field.name] = convertDateToUserFormat(dateValue, userFormat);
			cmsLogger.debug(`[normalizeDateFields] Converted DATE field "${field.name}"`, {
				normalizedValue: normalizedData[field.name],
				validationValue: dataForValidation[field.name]
			});
		}
	} else if (field.type === "datetime" && normalizedData[field.name]) {
		const dateTimeField = field;
		const dateFormat = dateTimeField.options?.dateFormat || "YYYY-MM-DD";
		const timeFormat = dateTimeField.options?.timeFormat || "HH:mm";
		const dateTimeValue = normalizedData[field.name];
		cmsLogger.debug(`[normalizeDateFields] Processing DATETIME field "${field.name}"`, {
			originalValue: dateTimeValue,
			dateFormat,
			timeFormat,
			combinedFormat: `${dateFormat} ${timeFormat}`
		});
		if (typeof dateTimeValue === "string") {
			normalizedData[field.name] = convertDateTimeToISO(dateTimeValue, dateFormat, timeFormat);
			dataForValidation[field.name] = convertDateTimeToUserFormat(dateTimeValue, dateFormat, timeFormat);
			cmsLogger.debug(`[normalizeDateFields] Converted DATETIME field "${field.name}"`, {
				normalizedValue: normalizedData[field.name],
				validationValue: dataForValidation[field.name]
			});
		}
	}
	cmsLogger.debug("[normalizeDateFields] Final result:", {
		normalizedData,
		dataForValidation
	});
	return {
		normalizedData,
		dataForValidation
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.5.2_6aae2b0bc5f037c66cc3c68e11b93a28/node_modules/@aphexcms/cms-core/dist/field-validation/utils.js
/**
* Check if a field is required based on its validation rules
*/
function isFieldRequired(field) {
	if (!field.validation) return false;
	try {
		const validationFn = Array.isArray(field.validation) ? field.validation[0] : field.validation;
		if (!validationFn) return false;
		return validationFn(new Rule()).isRequired();
	} catch {
		return false;
	}
}
function describeValue(value) {
	if (Array.isArray(value)) return "an array";
	if (value === null) return "null";
	if (typeof value === "object") return "an object";
	return `a ${typeof value}`;
}
var isPlainObject = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
/**
* Structural (shape) validation for a field's stored value — the depth=0 write
* shape. This catches a caller (notably an AI agent over MCP) sending the wrong
* JSON shape that presence/required checks would miss: a slug as `{ current }`
* (Sanity's convention — AphexCMS stores slugs as plain strings), or a
* reference/image missing its `_ref`. Runs before the user's Rule validation
* and only when a value is meaningfully present (absent/empty is a required-ness
* concern, handled separately), so optional and half-filled fields are left
* alone. Returns an error message, or null when the shape is acceptable.
*
* Intentionally conservative: only unambiguous mismatches error, and empty
* placeholders (`''`, an image with no `asset`) are treated as absent so the
* admin's in-progress edit states don't trip it.
*/
function validateValueShape(field, value) {
	if (value === null || value === void 0) return null;
	switch (field.type) {
		case "string":
		case "text":
		case "slug":
		case "url": return typeof value === "string" ? null : `expected a string, got ${describeValue(value)}`;
		case "reference":
			if (value === "") return null;
			return isPlainObject(value) && typeof value._ref === "string" ? null : `expected a reference object { _type: 'reference', _ref: '<documentId>' }, got ${describeValue(value)}`;
		case "image":
		case "file":
			if (value === "") return null;
			if (!isPlainObject(value)) return `expected an ${field.type} object { _type: '${field.type}', asset: { _type: 'reference', _ref: '<assetId>' } }, got ${describeValue(value)}`;
			if (value.asset === void 0 || value.asset === null) return null;
			return isPlainObject(value.asset) && typeof value.asset._ref === "string" ? null : `${field.type} asset must be { _type: 'reference', _ref: '<assetId>' }`;
		case "array": return Array.isArray(value) ? null : `expected an array, got ${describeValue(value)}`;
		case "object": return isPlainObject(value) ? null : `expected an object, got ${describeValue(value)}`;
		default: return null;
	}
}
/**
* Validate a field value against its validation rules
*/
async function validateField(field, value, context = {}) {
	cmsLogger.debug("[validateField]", `Validating field "${field.name}"`, {
		type: field.type,
		value,
		hasValidation: !!field.validation
	});
	const allErrors = [];
	const shapeError = validateValueShape(field, value);
	if (shapeError) return {
		isValid: false,
		errors: [{
			level: "error",
			message: `Field "${field.name}" ${shapeError}`
		}]
	};
	if (field.type === "date") {
		const dateFormat = field.options?.dateFormat || "YYYY-MM-DD";
		cmsLogger.debug("[validateField]", `Adding automatic DATE validation for "${field.name}"`, { dateFormat });
		const markers = await new Rule().date(dateFormat).validate(value, {
			path: [field.name],
			...context
		});
		allErrors.push(...markers.map((marker) => ({
			level: marker.level,
			message: marker.message
		})));
	} else if (field.type === "datetime") {
		const dateTimeField = field;
		const dateFormat = dateTimeField.options?.dateFormat || "YYYY-MM-DD";
		const timeFormat = dateTimeField.options?.timeFormat || "HH:mm";
		cmsLogger.debug("[validateField]", `Adding automatic DATETIME validation for "${field.name}"`, {
			dateFormat,
			timeFormat
		});
		const markers = await new Rule().datetime(dateFormat, timeFormat).validate(value, {
			path: [field.name],
			...context
		});
		allErrors.push(...markers.map((marker) => ({
			level: marker.level,
			message: marker.message
		})));
	} else if (field.type === "url") if (!field.validation) {
		cmsLogger.debug("[validateField]", `Adding automatic URL validation for "${field.name}"`);
		if (value && value !== "") {
			const markers = await new Rule().uri().validate(value, {
				path: [field.name],
				...context
			});
			allErrors.push(...markers.map((marker) => ({
				level: marker.level,
				message: marker.message
			})));
		}
	} else cmsLogger.debug("[validateField]", `Skipping automatic URL validation for "${field.name}" (has custom validation)`);
	if (!field.validation) cmsLogger.debug("[validateField]", `No custom validation rules for "${field.name}"`);
	else try {
		const validationFunctions = Array.isArray(field.validation) ? field.validation : [field.validation];
		cmsLogger.debug("[validateField]", `Field "${field.name}" has ${validationFunctions.length} custom validation function(s)`);
		for (const validationFn of validationFunctions) {
			const rule = validationFn(new Rule());
			if (!(rule instanceof Rule)) {
				cmsLogger.error(`Validation function for field "${field.name}" did not return a Rule object. Make sure you are chaining validation methods and returning the result.`);
				continue;
			}
			const markers = await rule.validate(value, {
				path: [field.name],
				...context
			});
			allErrors.push(...markers.map((marker) => ({
				level: marker.level,
				message: marker.message
			})));
		}
	} catch (error) {
		cmsLogger.error("[validateField]", `Validation error for "${field.name}":`, error);
		allErrors.push({
			level: "error",
			message: "Validation failed"
		});
	}
	const isValid = allErrors.filter((e) => e.level === "error").length === 0;
	cmsLogger.debug("[validateField]", `Field "${field.name}" validation complete`, {
		isValid,
		errors: allErrors
	});
	return {
		isValid,
		errors: allErrors
	};
}
/**
* Validate an entire document's data against a schema
* This function:
* 1. Normalizes date fields (converts user format to ISO for storage)
* 2. Converts ISO dates to user format for validation
* 3. Validates all fields and returns errors
* 4. Returns normalized data (with ISO dates) for storage
*
* @param schema - The schema type containing field definitions
* @param data - The document data to validate
* @param context - Optional context to pass to field validators
* @returns Validation result with isValid flag, errors, and normalized data
*/
async function validateDocumentData(schema, data, context = {}) {
	cmsLogger.debug("[validateDocumentData]", "Starting validation", {
		schemaName: schema.name,
		data
	});
	const validationErrors = [];
	const { normalizedData, dataForValidation } = normalizeDateFields(data, schema);
	cmsLogger.debug("[validateDocumentData]", "After normalization", {
		normalizedData,
		dataForValidation
	});
	for (const field of schema.fields) {
		const value = dataForValidation[field.name];
		cmsLogger.debug("[validateDocumentData]", `Validating field "${field.name}"`, {
			type: field.type,
			value
		});
		const result = await validateField(field, value, {
			...context,
			...dataForValidation
		});
		cmsLogger.debug("[validateDocumentData]", `Field "${field.name}" validation result`, {
			isValid: result.isValid,
			errors: result.errors
		});
		if (!result.isValid) {
			const errorMessages = result.errors.filter((e) => e.level === "error").map((e) => e.message);
			if (errorMessages.length > 0) validationErrors.push({
				field: field.name,
				errors: errorMessages
			});
		}
	}
	cmsLogger.debug("[validateDocumentData]", "Final result", {
		isValid: validationErrors.length === 0,
		errors: validationErrors
	});
	return {
		isValid: validationErrors.length === 0,
		errors: validationErrors,
		normalizedData
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.5.2_6aae2b0bc5f037c66cc3c68e11b93a28/node_modules/@aphexcms/cms-core/dist/schema-utils/validator.js
var RESERVED_FIELD_NAMES = [
	"id",
	"type",
	"status",
	"organizationId",
	"createdBy",
	"updatedBy",
	"createdAt",
	"updatedAt",
	"publishedAt",
	"draftData",
	"publishedData",
	"publishedHash"
];
/**
* Check if a field name is reserved
*/
function isReservedFieldName(fieldName) {
	return RESERVED_FIELD_NAMES.includes(fieldName);
}
/** Field names that conflict with system properties and can't be used in a schema. */
var RESERVED_FIELDS = RESERVED_FIELD_NAMES;
/** Primitive (leaf) field types. The single runtime source of truth. */
var PRIMITIVE_FIELD_TYPES = [
	"string",
	"text",
	"number",
	"boolean",
	"slug",
	"url",
	"image",
	"file",
	"date",
	"datetime",
	"reference"
];
/** All valid field types (primitives + containers). */
var VALID_FIELD_TYPES = [
	...PRIMITIVE_FIELD_TYPES,
	"array",
	"object"
];
/**
* Validate all schema references to ensure they exist
*/
function validateSchemaReferences(schemas) {
	const schemaNames = new Set(schemas.map((schema) => schema.name));
	const errors = [];
	const nameCounts = /* @__PURE__ */ new Map();
	for (const schema of schemas) nameCounts.set(schema.name, (nameCounts.get(schema.name) ?? 0) + 1);
	for (const [name, count] of nameCounts) if (count > 1) errors.push(`Duplicate schema name "${name}" (defined ${count} times). Schema names must be unique across app and plugin schemas.`);
	const primitiveTypes = PRIMITIVE_FIELD_TYPES;
	const validFieldTypes = VALID_FIELD_TYPES;
	function validateField(field, parentSchema) {
		if (!field.type) {
			errors.push(`Schema "${parentSchema}" field "${field.name || "unknown"}" is missing required "type" property`);
			return;
		}
		if (!validFieldTypes.includes(field.type)) errors.push(`Schema "${parentSchema}" field "${field.name}" has invalid type "${field.type}". Valid types: ${validFieldTypes.join(", ")}`);
		if (isReservedFieldName(field.name)) errors.push(`Schema "${parentSchema}" uses reserved field name "${field.name}". Reserved names: ${RESERVED_FIELD_NAMES.join(", ")}`);
		if (field.type === "array" && field.of) for (const arrayType of field.of) {
			if (arrayType.type === "reference") {
				const to = arrayType.to;
				if (!Array.isArray(to) || to.length === 0) errors.push(`Schema "${parentSchema}" field "${field.name}" has a reference array item missing "to" — declare allowed target document types`);
				else for (const target of to) if (!schemaNames.has(target.type)) errors.push(`Schema "${parentSchema}" field "${field.name}" reference array item targets unknown document type "${target.type}"`);
				continue;
			}
			if (primitiveTypes.includes(arrayType.type)) continue;
			if (arrayType.type === "block") continue;
			if (arrayType.fields) continue;
			if (!schemaNames.has(arrayType.type)) errors.push(`Schema "${parentSchema}" field "${field.name}" references unknown type "${arrayType.type}"`);
		}
		if (field.type === "object" && typeof field.fields === "string") {
			if (!schemaNames.has(field.fields)) errors.push(`Schema "${parentSchema}" field "${field.name}" references unknown object type "${field.fields}"`);
		}
		if (field.type === "reference" && "to" in field && field.to) {
			for (const target of field.to) if (!schemaNames.has(target.type)) errors.push(`Schema "${parentSchema}" field "${field.name}" references unknown document type "${target.type}"`);
		}
		if ("fields" in field && Array.isArray(field.fields)) for (const nestedField of field.fields) validateField(nestedField, parentSchema);
	}
	for (const schema of schemas) {
		if (schema.type !== "document" && schema.type !== "object") errors.push(`Schema "${schema.name}" has invalid type "${schema.type}". Must be "document" or "object"`);
		if (schema.fields) for (const field of schema.fields) validateField(field, schema.name);
		if (schema.fields) {
			const groupNames = new Set((schema.groups ?? []).map((g) => g.name));
			for (const field of schema.fields) {
				if (!field.group) continue;
				const refs = Array.isArray(field.group) ? field.group : [field.group];
				for (const ref of refs) if (!groupNames.has(ref)) errors.push(`Schema "${schema.name}" field "${field.name}" references unknown group "${ref}". Declare it in schema.groups.`);
			}
		}
		if (schema.preview?.select) {
			const fieldNames = new Set(schema.fields?.map((f) => f.name) || []);
			const rootOf = (path) => path.split(".", 1)[0] ?? path;
			for (const [key, path] of Object.entries(schema.preview.select)) {
				if (typeof path !== "string" || !path) continue;
				if (!fieldNames.has(rootOf(path))) errors.push(`Schema "${schema.name}" preview.select.${key} references unknown field "${path}"`);
			}
		}
		if (schema.orderings && schema.orderings.length > 0) {
			const fieldNames = new Set(schema.fields?.map((f) => f.name) || []);
			fieldNames.add("createdAt");
			fieldNames.add("updatedAt");
			for (const ordering of schema.orderings) {
				if (!ordering.name) {
					errors.push(`Schema "${schema.name}" has an ordering without a "name" property`);
					continue;
				}
				if (!ordering.title) errors.push(`Schema "${schema.name}" ordering "${ordering.name}" is missing required "title" property`);
				if (!ordering.by || ordering.by.length === 0) {
					errors.push(`Schema "${schema.name}" ordering "${ordering.name}" is missing required "by" array`);
					continue;
				}
				for (const orderItem of ordering.by) {
					if (!orderItem.field) {
						errors.push(`Schema "${schema.name}" ordering "${ordering.name}" has an item without a "field" property`);
						continue;
					}
					if (!fieldNames.has(orderItem.field)) errors.push(`Schema "${schema.name}" ordering "${ordering.name}" references unknown field "${orderItem.field}"`);
					if (orderItem.direction && orderItem.direction !== "asc" && orderItem.direction !== "desc") errors.push(`Schema "${schema.name}" ordering "${ordering.name}" field "${orderItem.field}" has invalid direction "${orderItem.direction}". Must be "asc" or "desc"`);
				}
			}
		}
	}
	if (errors.length > 0) {
		cmsLogger.error("[Schema]", "Validation errors:");
		errors.forEach((error) => cmsLogger.error("[Schema]", error));
		throw new Error(errors.join("\n"));
	}
	cmsLogger.info("[Schema]", "Validation passed - all references are valid");
}
//#endregion
export { resolveCapabilities as _, validateDocumentData as a, ALL_CAPABILITIES as c, defineCapability as d, effectiveOrganizationRole as f, normalizeCapabilities as g, mergeCapabilityCatalog as h, isFieldRequired as i, BUILTIN_ROLE_NAMES as l, isInstanceRole as m, VALID_FIELD_TYPES as n, utc_default as o, hasCapability as p, validateSchemaReferences as r, dayjs as s, RESERVED_FIELDS as t, BUILTIN_ROLE_SEED as u };
