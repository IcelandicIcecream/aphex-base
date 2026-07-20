import "../../../../chunks/index-server.js";
import { $ as clsx, Q as attr, a as bind_props, c as ensure_array_like, et as escape_html, f as spread_props, i as attributes, l as head, n as attr_class, o as derived, p as stringify, pt as run, r as attr_style, u as props_id, vt as setContext } from "../../../../chunks/dev.js";
import "../../../../chunks/validator.js";
import { t as cmsLogger } from "../../../../chunks/logger.js";
import "../../../../chunks/schema-utils.js";
import { t as createPartResolver } from "../../../../chunks/resolver.js";
import "../../../../chunks/utils2.js";
import { a as assets, c as documents, l as ApiError } from "../../../../chunks/api.js";
import { t as collectReferenceIds } from "../../../../chunks/reference-walk.js";
import { t as goto } from "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import { t as page } from "../../../../chunks/state.js";
import { $ as isHTMLElement, B as useId, D as Separator, E as Icon, F as Floating_layer, G as resolveLocaleProp, H as isValidIndex, I as getFloatingContentCSSVars, J as noop$1, M as Popper_layer_force_mount, N as Popper_layer, P as Floating_layer_anchor, Q as isElement, T as X, U as isTabbable, V as chunk, W as Portal, X as RovingFocusGroup, Y as PresenceManager, Z as isBrowser, _ as Calendar_clock, _t as useAdminSlots, at as ENTER, ct as watch, dt as useSidebar, et as isTouch, f as Refresh_cw, ft as setBlockPreviews, gt as setFieldComponents, h as Chevron_down, ht as setAdminNav, it as ARROW_UP, j as SafePolygon, lt as Context, m as Chevron_right, mt as usePermissions, n as confirmDialog, nt as ARROW_LEFT, ot as DOMContext, pt as setPermissionsContext, rt as ARROW_RIGHT, st as afterTick, t as ConfirmDialogHost, tt as ARROW_DOWN, ut as srOnlyStylesString, v as toast, vt as setSchemaContext, y as Circle_check } from "../../../../chunks/stega.js";
import { a as SvelteMap, o as SvelteSet, s as SvelteURLSearchParams } from "../../../../chunks/dist5.js";
import { t as cn } from "../../../../chunks/utils3.js";
import { O as Input, d as getDataTransitionAttrs, f as attachRef, i as boolToStr, n as createId, o as boolToTrueOrUndef, p as mergeProps, r as boolToEmptyStrOrUndef, s as createBitsAttrs, t as Label, u as getDataOpenClosed, x as boxWith } from "../../../../chunks/label.js";
import { a as Dialog_header, i as Dialog_content, o as Dialog_footer, r as Dialog_description, s as Dialog_title, t as Root$1 } from "../../../../chunks/dialog.js";
import { t as Checkbox } from "../../../../chunks/checkbox.js";
import { n as buttonVariants, t as Button } from "../../../../chunks/button.js";
import { t as External_link } from "../../../../chunks/external-link.js";
import { t as Lock } from "../../../../chunks/lock.js";
import { t as Search } from "../../../../chunks/search.js";
import { t as Trash_2 } from "../../../../chunks/trash-2.js";
import { t as Upload } from "../../../../chunks/upload.js";
import { t as Badge } from "../../../../chunks/badge.js";
import "../../../../chunks/card.js";
import { t as plugins } from "../../../../chunks/plugins.js";
import { t as activeTabState } from "../../../../chunks/activeTab.svelte.js";
import { t as schemaTypes } from "../../../../chunks/schemaTypes.js";
import { n as Alert_description, r as Alert, t as Alert_title } from "../../../../chunks/alert.js";
import { CalendarDate, CalendarDateTime, DateFormatter, ZonedDateTime, endOfMonth, getDayOfWeek, getLocalTimeZone, isEqualMonth, isSameDay, isSameMonth, isToday, parseDate, parseDateTime, parseZonedDateTime, startOfMonth, toCalendar, today } from "@internationalized/date";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/utils/content-hash.js
/**
* Content hashing utilities for document version tracking
* Includes timestamp for proper change detection and UX
*/
/**
* Recursively sort object keys for stable JSON serialization
*/
function sortObject(item) {
	if (item === null || typeof item !== "object") return item;
	if (Array.isArray(item)) return item.map(sortObject);
	const sortedKeys = Object.keys(item).sort();
	const sortedObj = {};
	for (const key of sortedKeys) sortedObj[key] = sortObject(item[key]);
	return sortedObj;
}
/**
* Create a stable hash from any object using a simple hash algorithm
*/
function simpleHash(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return Math.abs(hash).toString(36);
}
/**
* Create a content hash including timestamp for change tracking
* This matches Sanity's behavior where any interaction creates a publishable state
*/
function createContentHash(data, includeTimestamp = true) {
	const hashData = includeTimestamp ? {
		...data,
		_lastModified: (/* @__PURE__ */ new Date()).toISOString()
	} : data;
	return simpleHash(JSON.stringify(sortObject(hashData)));
}
/**
* Create a hash from published data (no timestamp needed as it's already stable)
*/
function createPublishedHash(data) {
	return createContentHash(data, false);
}
/**
* Compare if current draft differs from published version
*/
function hasUnpublishedChanges(draftData, publishedHash) {
	if (!publishedHash) return true;
	return createPublishedHash(draftData) !== publishedHash;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/utils/preview.js
/**
* Walk a dot-path (e.g. `seo.title`) through an object. Returns the
* terminal value, or `undefined` if any segment along the way is missing.
*
* Quoted strings (single or double) are treated as literals and returned
* as-is, e.g. `'"My Title"'` → `'My Title'`. Useful for singletons or
* any schema that needs a static preview title.
*/
function readPath(item, path) {
	const match = path.match(/^(['"])(.+)\1$/);
	if (match) return match[2];
	let current = item;
	for (const segment of path.split(".")) {
		if (current == null) return void 0;
		current = current[segment];
	}
	return current;
}
/**
* Coerce a value into a printable string for preview rows. Returns `null`
* when the value isn't worth rendering (empty, nullish, non-primitive).
*/
function toPreviewString(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed ? trimmed : null;
	}
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	if (typeof value === "boolean") return value ? "true" : "false";
	return null;
}
/**
* Conventional fallback field names for the title slot when a schema
* doesn't declare a `preview.select.title`. Mirrors Sanity's heuristic
* — the first non-empty string wins.
*/
var DEFAULT_TITLE_FIELDS = [
	"title",
	"heading",
	"name",
	"label"
];
/**
* Run `preview.prepare` if defined: resolve every dot-path in `select`,
* pass the resolved selection map to `prepare`, and return the result.
* Returns `null` when no `prepare` is configured — callers should fall
* back to direct `select.title` / `select.subtitle` reads in that case.
*/
function runPrepare(item, schema) {
	const prepare = schema?.preview?.prepare;
	if (!prepare) return null;
	const select = schema?.preview?.select ?? {};
	const selection = {};
	for (const [key, path] of Object.entries(select)) selection[key] = readPath(item, path);
	return prepare(selection);
}
/**
* Resolve the title to display for an item (array row, document list row,
* reference picker row, editor breadcrumb). Precedence: `preview.prepare()` →
* literal `preview.title` → `select.title` dot-path → conventional field names →
* schema title → type name.
*/
function resolvePreviewTitle(item, schema, defaultTypeLabel) {
	const prepared = runPrepare(item, schema);
	if (prepared) {
		const resolved = toPreviewString(prepared.title);
		if (resolved) return resolved;
	} else {
		const literal = toPreviewString(schema?.preview?.title);
		if (literal) return literal;
		const configured = schema?.preview?.select?.title;
		if (configured) {
			const resolved = toPreviewString(readPath(item, configured));
			if (resolved) return resolved;
		} else for (const name of DEFAULT_TITLE_FIELDS) {
			const resolved = toPreviewString(item?.[name]);
			if (resolved) return resolved;
		}
	}
	return schema?.title ?? defaultTypeLabel ?? "Untitled";
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/internal/date-time/announcer.js
/**
* Creates or gets an announcer element which is used to announce messages to screen readers.
* Within the date components, we use this to announce when the values of the individual segments
* change, as without it we get inconsistent behavior across screen readers.
*/
function initAnnouncer(doc) {
	if (!isBrowser || !doc) return null;
	let el = doc.querySelector("[data-bits-announcer]");
	/**
	* Creates a log element for assertive or polite announcements.
	*/
	const createLog = (kind) => {
		const log = doc.createElement("div");
		log.role = "log";
		log.ariaLive = kind;
		log.setAttribute("aria-relevant", "additions");
		return log;
	};
	if (!isHTMLElement(el)) {
		const div = doc.createElement("div");
		div.style.cssText = srOnlyStylesString;
		div.setAttribute("data-bits-announcer", "");
		div.appendChild(createLog("assertive"));
		div.appendChild(createLog("polite"));
		el = div;
		doc.body.insertBefore(el, doc.body.firstChild);
	}
	/**
	* Retrieves the log element for assertive or polite announcements.
	*/
	const getLog = (kind) => {
		if (!isHTMLElement(el)) return null;
		const log = el.querySelector(`[aria-live="${kind}"]`);
		if (!isHTMLElement(log)) return null;
		return log;
	};
	return { getLog };
}
/**
* Creates an announcer object that can be used to make `aria-live` announcements to screen readers.
*/
function getAnnouncer(doc) {
	const announcer = initAnnouncer(doc);
	/**
	* Announces a message to screen readers using the specified kind of announcement.
	*/
	function announce(value, kind = "assertive", timeout = 7500) {
		if (!announcer || !isBrowser || !doc) return;
		const log = announcer.getLog(kind);
		const content = doc.createElement("div");
		if (typeof value === "number") value = value.toString();
		else if (value === null) value = "Empty";
		else value = value.trim();
		content.innerText = value;
		if (kind === "assertive") log?.replaceChildren(content);
		else log?.appendChild(content);
		return setTimeout(() => {
			content.remove();
		}, timeout);
	}
	return { announce };
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/internal/date-time/utils.js
var defaultDateDefaults = {
	defaultValue: void 0,
	granularity: "day"
};
/**
* A helper function used throughout the various date builders
* to generate a default `DateValue` using the `defaultValue`,
* `defaultPlaceholder`, `minValue`, `maxValue`, and `granularity` props.
*
* It's important to match the `DateValue` type being used
* elsewhere in the builder, so they behave according to the
* behavior the user expects based on the props they've provided.
*
*/
function getDefaultDate(opts) {
	const { defaultValue, granularity, minValue, maxValue } = {
		...defaultDateDefaults,
		...opts
	};
	if (Array.isArray(defaultValue) && defaultValue.length) return defaultValue[defaultValue.length - 1];
	if (defaultValue && !Array.isArray(defaultValue)) return defaultValue;
	else {
		let date = /* @__PURE__ */ new Date();
		if (minValue && date < minValue.toDate(getLocalTimeZone())) date = minValue.toDate(getLocalTimeZone());
		else if (maxValue && date > maxValue.toDate(getLocalTimeZone())) date = maxValue.toDate(getLocalTimeZone());
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		if ([
			"hour",
			"minute",
			"second"
		].includes(granularity ?? "day")) return new CalendarDateTime(year, month, day, 0, 0, 0);
		return new CalendarDate(year, month, day);
	}
}
/**
* Given a date string and a reference `DateValue` object, parse the
* string to the same type as the reference object.
*
* Useful for parsing strings from data attributes, which are always
* strings, to the same type being used by the date component.
*/
function parseStringToDateValue(dateStr, referenceVal) {
	let dateValue;
	if (referenceVal instanceof ZonedDateTime) dateValue = parseZonedDateTime(dateStr);
	else if (referenceVal instanceof CalendarDateTime) dateValue = parseDateTime(dateStr);
	else dateValue = parseDate(dateStr);
	return dateValue.calendar !== referenceVal.calendar ? toCalendar(dateValue, referenceVal.calendar) : dateValue;
}
/**
* Given a `DateValue` object, convert it to a native `Date` object.
* If a timezone is provided, the date will be converted to that timezone.
* If no timezone is provided, the date will be converted to the local timezone.
*/
function toDate(dateValue, tz = getLocalTimeZone()) {
	if (dateValue instanceof ZonedDateTime) return dateValue.toDate();
	else return dateValue.toDate(tz);
}
function getDateValueType(date) {
	if (date instanceof CalendarDate) return "date";
	if (date instanceof CalendarDateTime) return "datetime";
	if (date instanceof ZonedDateTime) return "zoneddatetime";
	throw new Error("Unknown date type");
}
function parseAnyDateValue(value, type) {
	switch (type) {
		case "date": return parseDate(value);
		case "datetime": return parseDateTime(value);
		case "zoneddatetime": return parseZonedDateTime(value);
		default: throw new Error(`Unknown date type: ${type}`);
	}
}
function isCalendarDateTime(dateValue) {
	return dateValue instanceof CalendarDateTime;
}
function isZonedDateTime(dateValue) {
	return dateValue instanceof ZonedDateTime;
}
function hasTime(dateValue) {
	return isCalendarDateTime(dateValue) || isZonedDateTime(dateValue);
}
/**
* Given a date, return the number of days in the month.
*/
function getDaysInMonth(date) {
	if (date instanceof Date) {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		/**
		* By using zero as the day, we get the
		* last day of the previous month, which
		* is the month we originally passed in.
		*/
		return new Date(year, month, 0).getDate();
	} else return date.set({ day: 100 }).day;
}
/**
* Determine if a date is before the reference date.
* @param dateToCompare - is this date before the `referenceDate`
* @param referenceDate - is the `dateToCompare` before this date
*
* @see {@link isBeforeOrSame} for inclusive
*/
function isBefore(dateToCompare, referenceDate) {
	return dateToCompare.compare(referenceDate) < 0;
}
/**
* Determine if a date is after the reference date.
* @param dateToCompare - is this date after the `referenceDate`
* @param referenceDate - is the `dateToCompare` after this date
*
* @see {@link isAfterOrSame} for inclusive
*/
function isAfter(dateToCompare, referenceDate) {
	return dateToCompare.compare(referenceDate) > 0;
}
function getLastFirstDayOfWeek(date, firstDayOfWeek, locale) {
	const day = getDayOfWeek(date, locale);
	if (firstDayOfWeek > day) return date.subtract({ days: day + 7 - firstDayOfWeek });
	if (firstDayOfWeek === day) return date;
	return date.subtract({ days: day - firstDayOfWeek });
}
function getNextLastDayOfWeek(date, firstDayOfWeek, locale) {
	const day = getDayOfWeek(date, locale);
	const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
	if (day === lastDayOfWeek) return date;
	if (day > lastDayOfWeek) return date.add({ days: 7 - day + lastDayOfWeek });
	return date.add({ days: lastDayOfWeek - day });
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/internal/date-time/formatter.js
var defaultPartOptions = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
};
/**
* Creates a wrapper around the `DateFormatter`, which is
* an improved version of the {@link Intl.DateTimeFormat} API,
* that is used internally by the various date builders to
* easily format dates in a consistent way.
*
* @see [DateFormatter](https://react-spectrum.adobe.com/internationalized/date/DateFormatter.html)
*/
function createFormatter(opts) {
	let locale = opts.initialLocale;
	function setLocale(newLocale) {
		locale = newLocale;
	}
	function getLocale() {
		return locale;
	}
	function custom(date, options) {
		return new DateFormatter(locale, options).format(date);
	}
	function selectedDate(date, includeTime = true) {
		if (hasTime(date) && includeTime) return custom(toDate(date), {
			dateStyle: "long",
			timeStyle: "long"
		});
		else return custom(toDate(date), { dateStyle: "long" });
	}
	function fullMonthAndYear(date) {
		if (typeof opts.monthFormat.current !== "function" && typeof opts.yearFormat.current !== "function") return new DateFormatter(locale, {
			month: opts.monthFormat.current,
			year: opts.yearFormat.current
		}).format(date);
		return `${typeof opts.monthFormat.current === "function" ? opts.monthFormat.current(date.getMonth() + 1) : new DateFormatter(locale, { month: opts.monthFormat.current }).format(date)} ${typeof opts.yearFormat.current === "function" ? opts.yearFormat.current(date.getFullYear()) : new DateFormatter(locale, { year: opts.yearFormat.current }).format(date)}`;
	}
	function fullMonth(date) {
		return new DateFormatter(locale, { month: "long" }).format(date);
	}
	function fullYear(date) {
		return new DateFormatter(locale, { year: "numeric" }).format(date);
	}
	function toParts(date, options) {
		if (isZonedDateTime(date)) return new DateFormatter(locale, {
			...options,
			timeZone: date.timeZone
		}).formatToParts(toDate(date));
		else return new DateFormatter(locale, options).formatToParts(toDate(date));
	}
	function dayOfWeek(date, length = "narrow") {
		return new DateFormatter(locale, { weekday: length }).format(date);
	}
	function dayPeriod(date, hourCycle = void 0) {
		if (new DateFormatter(locale, {
			hour: "numeric",
			minute: "numeric",
			hourCycle: hourCycle === 24 ? "h23" : void 0
		}).formatToParts(date).find((p) => p.type === "dayPeriod")?.value === "PM") return "PM";
		return "AM";
	}
	function part(dateObj, type, options = {}) {
		const part = toParts(dateObj, {
			...defaultPartOptions,
			...options
		}).find((p) => p.type === type);
		return part ? part.value : "";
	}
	return {
		setLocale,
		getLocale,
		fullMonth,
		fullYear,
		fullMonthAndYear,
		toParts,
		custom,
		part,
		dayPeriod,
		selectedDate,
		dayOfWeek
	};
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/internal/date-time/calendar-helpers.svelte.js
function isCalendarDayNode(node) {
	if (!isHTMLElement(node)) return false;
	if (!node.hasAttribute("data-bits-day")) return false;
	return true;
}
/**
* Retrieves an array of date values representing the days between
* the provided start and end dates.
*/
function getDaysBetween(start, end) {
	const days = [];
	let dCurrent = start.add({ days: 1 });
	const dEnd = end;
	while (dCurrent.compare(dEnd) < 0) {
		days.push(dCurrent);
		dCurrent = dCurrent.add({ days: 1 });
	}
	return days;
}
/**
* Creates a calendar month object.
*
* @remarks
* Given a date, this function returns an object containing
* the necessary values to render a calendar month, including
* the month's date (the first day of that month), which can be
* used to render the name of the month, an array of all dates
* in that month, and an array of weeks. Each week is an array
* of dates, useful for rendering an accessible calendar grid
* using a loop and table elements.
*
*/
function createMonth(props) {
	const { dateObj, weekStartsOn, fixedWeeks, locale } = props;
	const daysInMonth = getDaysInMonth(dateObj);
	const datesArray = Array.from({ length: daysInMonth }, (_, i) => dateObj.set({ day: i + 1 }));
	const firstDayOfMonth = startOfMonth(dateObj);
	const lastDayOfMonth = endOfMonth(dateObj);
	const lastSunday = weekStartsOn !== void 0 ? getLastFirstDayOfWeek(firstDayOfMonth, weekStartsOn, "en-US") : getLastFirstDayOfWeek(firstDayOfMonth, 0, locale);
	const nextSaturday = weekStartsOn !== void 0 ? getNextLastDayOfWeek(lastDayOfMonth, weekStartsOn, "en-US") : getNextLastDayOfWeek(lastDayOfMonth, 0, locale);
	const lastMonthDays = getDaysBetween(lastSunday.subtract({ days: 1 }), firstDayOfMonth);
	const nextMonthDays = getDaysBetween(lastDayOfMonth, nextSaturday.add({ days: 1 }));
	const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;
	if (fixedWeeks && totalDays < 42) {
		const extraDays = 42 - totalDays;
		let startFrom = nextMonthDays[nextMonthDays.length - 1];
		if (!startFrom) startFrom = dateObj.add({ months: 1 }).set({ day: 1 });
		let length = extraDays;
		if (nextMonthDays.length === 0) {
			length = extraDays - 1;
			nextMonthDays.push(startFrom);
		}
		const extraDaysArray = Array.from({ length }, (_, i) => {
			const incr = i + 1;
			return startFrom.add({ days: incr });
		});
		nextMonthDays.push(...extraDaysArray);
	}
	const allDays = lastMonthDays.concat(datesArray, nextMonthDays);
	return {
		value: dateObj,
		dates: allDays,
		weeks: chunk(allDays, 7)
	};
}
function createMonths(props) {
	const { numberOfMonths, dateObj, ...monthProps } = props;
	const months = [];
	if (!numberOfMonths || numberOfMonths === 1) {
		months.push(createMonth({
			...monthProps,
			dateObj
		}));
		return months;
	}
	months.push(createMonth({
		...monthProps,
		dateObj
	}));
	for (let i = 1; i < numberOfMonths; i++) {
		const nextMonth = dateObj.add({ months: i });
		months.push(createMonth({
			...monthProps,
			dateObj: nextMonth
		}));
	}
	return months;
}
function getSelectableCells(calendarNode) {
	if (!calendarNode) return [];
	return Array.from(calendarNode.querySelectorAll(`[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])`)).filter((el) => isHTMLElement(el));
}
/**
* A helper function to extract the date from the `data-value`
* attribute of a date cell and set it as the placeholder value.
*
* Shared between the calendar and range calendar builders.
*
* @param node - The node to extract the date from.
* @param placeholder - The placeholder value store which will be set to the extracted date.
*/
function setPlaceholderToNodeValue(node, placeholder) {
	const cellValue = node.getAttribute("data-value");
	if (!cellValue) return;
	placeholder.current = parseStringToDateValue(cellValue, placeholder.current);
}
/**
* Shared logic for shifting focus between cells in the
* calendar and range calendar.
*/
function shiftCalendarFocus({ node, add, placeholder, calendarNode, isPrevButtonDisabled, isNextButtonDisabled, months, numberOfMonths }) {
	const candidateCells = getSelectableCells(calendarNode);
	if (!candidateCells.length) return;
	const nextIndex = candidateCells.indexOf(node) + add;
	/**
	* If the next cell is within the bounds of the displayed cells,
	* easy day, we just focus it.
	*/
	if (isValidIndex(nextIndex, candidateCells)) {
		const nextCell = candidateCells[nextIndex];
		setPlaceholderToNodeValue(nextCell, placeholder);
		return nextCell.focus();
	}
	/**
	* When the next cell falls outside the displayed cells range,
	* we update the focus to the previous or next month based on the
	* direction, and then focus on the relevant cell.
	*/
	if (nextIndex < 0) {
		/**
		* To handle negative indices, we rewind by one month,
		* retrieve candidate cells for that month, and shift focus
		* by the difference between the nextIndex starting from the end
		* of the array.
		*/
		if (isPrevButtonDisabled) return;
		const firstMonth = months[0]?.value;
		if (!firstMonth) return;
		placeholder.current = firstMonth.subtract({ months: numberOfMonths });
		afterTick(() => {
			const newCandidateCells = getSelectableCells(calendarNode);
			if (!newCandidateCells.length) return;
			/**
			* Starting at the end of the array, shift focus by the diff
			* between the nextIndex and the length of the array, since the
			* nextIndex is negative.
			*/
			const newIndex = newCandidateCells.length - Math.abs(nextIndex);
			if (isValidIndex(newIndex, newCandidateCells)) {
				const newCell = newCandidateCells[newIndex];
				setPlaceholderToNodeValue(newCell, placeholder);
				return newCell.focus();
			}
		});
	}
	if (nextIndex >= candidateCells.length) {
		/**
		* Since we're in the positive index range, we need to go forward
		* a month, refetch the candidate cells within that month, and then
		* starting at the beginning of the array, shift focus by the nextIndex
		* amount.
		*/
		if (isNextButtonDisabled) return;
		const firstMonth = months[0]?.value;
		if (!firstMonth) return;
		placeholder.current = firstMonth.add({ months: numberOfMonths });
		afterTick(() => {
			const newCandidateCells = getSelectableCells(calendarNode);
			if (!newCandidateCells.length) return;
			/**
			* We need to determine how far into the next month we need to go
			* to get the next index. So if we only went over the previous month
			* by one, we need to go into the next month by 1 to get the right index.
			*/
			const newIndex = nextIndex - candidateCells.length;
			if (isValidIndex(newIndex, newCandidateCells)) return newCandidateCells[newIndex].focus();
		});
	}
}
var ARROW_KEYS = [
	ARROW_DOWN,
	ARROW_UP,
	ARROW_LEFT,
	ARROW_RIGHT
];
var SELECT_KEYS = [ENTER, " "];
/**
* Shared keyboard event handler for the calendar and range calendar.
*/
function handleCalendarKeydown({ event, handleCellClick, shiftFocus, placeholderValue }) {
	const currentCell = event.target;
	if (!isCalendarDayNode(currentCell)) return;
	if (!ARROW_KEYS.includes(event.key) && !SELECT_KEYS.includes(event.key)) return;
	event.preventDefault();
	const kbdFocusMap = {
		[ARROW_DOWN]: 7,
		[ARROW_UP]: -7,
		[ARROW_LEFT]: -1,
		[ARROW_RIGHT]: 1
	};
	if (ARROW_KEYS.includes(event.key)) {
		const add = kbdFocusMap[event.key];
		if (add !== void 0) shiftFocus(currentCell, add);
	}
	if (SELECT_KEYS.includes(event.key)) {
		const cellValue = currentCell.getAttribute("data-value");
		if (!cellValue) return;
		handleCellClick(event, parseStringToDateValue(cellValue, placeholderValue));
	}
}
function handleCalendarNextPage({ months, setMonths, numberOfMonths, pagedNavigation, weekStartsOn, locale, fixedWeeks, setPlaceholder }) {
	const firstMonth = months[0]?.value;
	if (!firstMonth) return;
	if (pagedNavigation) setPlaceholder(firstMonth.add({ months: numberOfMonths }));
	else {
		const targetDate = firstMonth.add({ months: 1 });
		const newMonths = createMonths({
			dateObj: targetDate,
			weekStartsOn,
			locale,
			fixedWeeks,
			numberOfMonths
		});
		setPlaceholder(targetDate);
		setMonths(newMonths);
	}
}
function handleCalendarPrevPage({ months, setMonths, numberOfMonths, pagedNavigation, weekStartsOn, locale, fixedWeeks, setPlaceholder }) {
	const firstMonth = months[0]?.value;
	if (!firstMonth) return;
	if (pagedNavigation) setPlaceholder(firstMonth.subtract({ months: numberOfMonths }));
	else {
		const targetDate = firstMonth.subtract({ months: 1 });
		const newMonths = createMonths({
			dateObj: targetDate,
			weekStartsOn,
			locale,
			fixedWeeks,
			numberOfMonths
		});
		setPlaceholder(targetDate);
		setMonths(newMonths);
	}
}
function getWeekdays({ months, formatter, weekdayFormat }) {
	if (!months.length) return [];
	const firstWeek = months[0].weeks[0];
	if (!firstWeek) return [];
	return firstWeek.map((date) => formatter.dayOfWeek(toDate(date), weekdayFormat));
}
function useMonthViewPlaceholderSync({ placeholder, getVisibleMonths, weekStartsOn, locale, fixedWeeks, numberOfMonths, setMonths }) {
	/**
	* If the placeholder's month is already in this visible months,
	* we don't need to do anything.
	*/
}
function getIsNextButtonDisabled({ maxValue, months, disabled }) {
	if (!maxValue || !months.length) return false;
	if (disabled) return true;
	const lastMonthInView = months[months.length - 1]?.value;
	if (!lastMonthInView) return false;
	return isAfter(lastMonthInView.add({ months: 1 }).set({ day: 1 }), maxValue);
}
function getIsPrevButtonDisabled({ minValue, months, disabled }) {
	if (!minValue || !months.length) return false;
	if (disabled) return true;
	const firstMonthInView = months[0]?.value;
	if (!firstMonthInView) return false;
	return isBefore(firstMonthInView.subtract({ months: 1 }).set({ day: 35 }), minValue);
}
function getCalendarHeadingValue({ months, locale, formatter }) {
	if (!months.length) return "";
	if (locale !== formatter.getLocale()) formatter.setLocale(locale);
	if (months.length === 1) {
		const month = toDate(months[0].value);
		return `${formatter.fullMonthAndYear(month)}`;
	}
	const startMonth = toDate(months[0].value);
	const endMonth = toDate(months[months.length - 1].value);
	const startMonthName = formatter.fullMonth(startMonth);
	const endMonthName = formatter.fullMonth(endMonth);
	const startMonthYear = formatter.fullYear(startMonth);
	const endMonthYear = formatter.fullYear(endMonth);
	return startMonthYear === endMonthYear ? `${startMonthName} - ${endMonthName} ${endMonthYear}` : `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`;
}
function getCalendarElementProps({ fullCalendarLabel, id, isInvalid, disabled, readonly }) {
	return {
		id,
		role: "application",
		"aria-label": fullCalendarLabel,
		"data-invalid": boolToEmptyStrOrUndef(isInvalid),
		"data-disabled": boolToEmptyStrOrUndef(disabled),
		"data-readonly": boolToEmptyStrOrUndef(readonly)
	};
}
function getFirstNonDisabledDateInView(calendarRef) {
	if (!isBrowser) return;
	const daysInView = Array.from(calendarRef.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
	if (daysInView.length === 0) return;
	const element = daysInView[0];
	const value = element?.getAttribute("data-value");
	const type = element?.getAttribute("data-type");
	if (!value || !type) return;
	return parseAnyDateValue(value, type);
}
/**
* Ensures the placeholder is not set to a disabled date,
* which would prevent the user from entering the Calendar
* via the keyboard.
*/
function useEnsureNonDisabledPlaceholder({ ref, placeholder, defaultPlaceholder, minValue, maxValue, isDateDisabled }) {
	function isDisabled(date) {
		if (isDateDisabled.current(date)) return true;
		if (minValue.current && isBefore(date, minValue.current)) return true;
		if (maxValue.current && isBefore(maxValue.current, date)) return true;
		return false;
	}
	watch(() => ref.current, () => {
		if (!ref.current) return;
		/**
		* If the placeholder is still the default placeholder and it's a disabled date, find
		* the first available date in the calendar view and set it as the placeholder.
		*
		* This prevents the placeholder from being a disabled date and no date being tabbable
		* preventing the user from entering the Calendar. If all dates in the view are
		* disabled, currently that is considered an error on the developer's part and should
		* be handled by them.
		*
		* Perhaps in the future we can introduce a dev-only log message to prevent this from
		* being a silent error.
		*/
		if (placeholder.current && isSameDay(placeholder.current, defaultPlaceholder) && isDisabled(defaultPlaceholder)) placeholder.current = getFirstNonDisabledDateInView(ref.current) ?? defaultPlaceholder;
	});
}
function getDateWithPreviousTime(date, prev) {
	if (!date || !prev) return date;
	if (hasTime(date) && hasTime(prev)) return date.set({
		hour: prev.hour,
		minute: prev.minute,
		millisecond: prev.millisecond,
		second: prev.second
	});
	return date;
}
var calendarAttrs = createBitsAttrs({
	component: "calendar",
	parts: [
		"root",
		"grid",
		"cell",
		"next-button",
		"prev-button",
		"day",
		"grid-body",
		"grid-head",
		"grid-row",
		"head-cell",
		"header",
		"heading",
		"month-select",
		"year-select"
	]
});
function getDefaultYears(opts) {
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const latestYear = Math.max(opts.placeholderYear, currentYear);
	let minYear;
	let maxYear;
	if (opts.minValue) minYear = opts.minValue.year;
	else {
		const initialMinYear = latestYear - 100;
		minYear = opts.placeholderYear < initialMinYear ? opts.placeholderYear - 10 : initialMinYear;
	}
	if (opts.maxValue) maxYear = opts.maxValue.year;
	else maxYear = latestYear + 10;
	if (minYear > maxYear) minYear = maxYear;
	const totalYears = maxYear - minYear + 1;
	return Array.from({ length: totalYears }, (_, i) => minYear + i);
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/calendar.svelte.js
var CalendarRootContext = new Context("Calendar.Root | RangeCalender.Root");
var CalendarRootState = class CalendarRootState {
	static create(opts) {
		return CalendarRootContext.set(new CalendarRootState(opts));
	}
	opts;
	#visibleMonths = derived(() => this.months.map((month) => month.value));
	get visibleMonths() {
		return this.#visibleMonths();
	}
	set visibleMonths($$value) {
		return this.#visibleMonths($$value);
	}
	formatter;
	accessibleHeadingId = useId();
	domContext;
	attachment;
	months = [];
	announcer;
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.domContext = new DOMContext(opts.ref);
		this.announcer = getAnnouncer(null);
		this.formatter = createFormatter({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat
		});
		this.setMonths = this.setMonths.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.prevPage = this.prevPage.bind(this);
		this.prevYear = this.prevYear.bind(this);
		this.nextYear = this.nextYear.bind(this);
		this.setYear = this.setYear.bind(this);
		this.setMonth = this.setMonth.bind(this);
		this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this);
		this.isDateDisabled = this.isDateDisabled.bind(this);
		this.isDateSelected = this.isDateSelected.bind(this);
		this.shiftFocus = this.shiftFocus.bind(this);
		this.handleCellClick = this.handleCellClick.bind(this);
		this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this);
		this.handleSingleUpdate = this.handleSingleUpdate.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.getBitsAttr = this.getBitsAttr.bind(this);
		this.months = createMonths({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current
		});
		this.#setupInitialFocusEffect();
		this.#setupAccessibleHeadingEffect();
		this.#setupFormatterEffect();
		/**
		* Updates the displayed months based on changes in the placeholder value.
		*/
		useMonthViewPlaceholderSync({
			placeholder: this.opts.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.opts.weekStartsOn,
			locale: this.opts.locale,
			fixedWeeks: this.opts.fixedWeeks,
			numberOfMonths: this.opts.numberOfMonths,
			setMonths: (months) => this.months = months
		});
		/**
		* Updates the displayed months based on changes in the options values,
		* which determines the month to show in the calendar.
		*/
		this.opts.fixedWeeks, this.opts.locale, this.opts.numberOfMonths, this.opts.placeholder, this.setMonths, this.opts.weekStartsOn;
		/**
		* Update the accessible heading's text content when the `fullCalendarLabel`
		* changes.
		*/
		watch(() => this.fullCalendarLabel, (label) => {
			const node = this.domContext.getElementById(this.accessibleHeadingId);
			if (!node) return;
			node.textContent = label;
		});
		/**
		* Synchronize the placeholder value with the current value.
		*/
		watch(() => this.opts.value.current, () => {
			const value = this.opts.value.current;
			if (Array.isArray(value) && value.length) {
				const lastValue = value[value.length - 1];
				if (lastValue && this.opts.placeholder.current !== lastValue) this.opts.placeholder.current = lastValue;
			} else if (!Array.isArray(value) && value && this.opts.placeholder.current !== value) this.opts.placeholder.current = value;
		});
		useEnsureNonDisabledPlaceholder({
			placeholder: opts.placeholder,
			defaultPlaceholder: opts.defaultPlaceholder,
			isDateDisabled: opts.isDateDisabled,
			maxValue: opts.maxValue,
			minValue: opts.minValue,
			ref: opts.ref
		});
	}
	setMonths(months) {
		this.months = months;
	}
	#weekdays = derived(
		/**
		* This derived state holds an array of localized day names for the current
		* locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
		* updating its content when the option changes. Using this state to render the
		* calendar's days of the week is strongly recommended, as it guarantees that
		* the days are correctly formatted for the current locale and calendar view.
		*/
		() => {
			return getWeekdays({
				months: this.months,
				formatter: this.formatter,
				weekdayFormat: this.opts.weekdayFormat.current
			});
		}
	);
	get weekdays() {
		return this.#weekdays();
	}
	set weekdays($$value) {
		return this.#weekdays($$value);
	}
	#initialPlaceholderYear = derived(() => run(() => this.opts.placeholder.current.year));
	get initialPlaceholderYear() {
		return this.#initialPlaceholderYear();
	}
	set initialPlaceholderYear($$value) {
		return this.#initialPlaceholderYear($$value);
	}
	#defaultYears = derived(() => {
		return getDefaultYears({
			minValue: this.opts.minValue.current,
			maxValue: this.opts.maxValue.current,
			placeholderYear: this.initialPlaceholderYear
		});
	});
	get defaultYears() {
		return this.#defaultYears();
	}
	set defaultYears($$value) {
		return this.#defaultYears($$value);
	}
	#setupInitialFocusEffect() {}
	#setupAccessibleHeadingEffect() {}
	#setupFormatterEffect() {}
	/**
	* Navigates to the next page of the calendar.
	*/
	nextPage() {
		handleCalendarNextPage({
			fixedWeeks: this.opts.fixedWeeks.current,
			locale: this.opts.locale.current,
			numberOfMonths: this.opts.numberOfMonths.current,
			pagedNavigation: this.opts.pagedNavigation.current,
			setMonths: this.setMonths,
			setPlaceholder: (date) => this.opts.placeholder.current = date,
			weekStartsOn: this.opts.weekStartsOn.current,
			months: this.months
		});
	}
	/**
	* Navigates to the previous page of the calendar.
	*/
	prevPage() {
		handleCalendarPrevPage({
			fixedWeeks: this.opts.fixedWeeks.current,
			locale: this.opts.locale.current,
			numberOfMonths: this.opts.numberOfMonths.current,
			pagedNavigation: this.opts.pagedNavigation.current,
			setMonths: this.setMonths,
			setPlaceholder: (date) => this.opts.placeholder.current = date,
			weekStartsOn: this.opts.weekStartsOn.current,
			months: this.months
		});
	}
	nextYear() {
		this.opts.placeholder.current = this.opts.placeholder.current.add({ years: 1 });
	}
	prevYear() {
		this.opts.placeholder.current = this.opts.placeholder.current.subtract({ years: 1 });
	}
	setYear(year) {
		this.opts.placeholder.current = this.opts.placeholder.current.set({ year });
	}
	setMonth(month) {
		this.opts.placeholder.current = this.opts.placeholder.current.set({ month });
	}
	#isNextButtonDisabled = derived(() => {
		return getIsNextButtonDisabled({
			maxValue: this.opts.maxValue.current,
			months: this.months,
			disabled: this.opts.disabled.current
		});
	});
	get isNextButtonDisabled() {
		return this.#isNextButtonDisabled();
	}
	set isNextButtonDisabled($$value) {
		return this.#isNextButtonDisabled($$value);
	}
	#isPrevButtonDisabled = derived(() => {
		return getIsPrevButtonDisabled({
			minValue: this.opts.minValue.current,
			months: this.months,
			disabled: this.opts.disabled.current
		});
	});
	get isPrevButtonDisabled() {
		return this.#isPrevButtonDisabled();
	}
	set isPrevButtonDisabled($$value) {
		return this.#isPrevButtonDisabled($$value);
	}
	#isInvalid = derived(() => {
		const value = this.opts.value.current;
		const isDateDisabled = this.opts.isDateDisabled.current;
		const isDateUnavailable = this.opts.isDateUnavailable.current;
		if (Array.isArray(value)) {
			if (!value.length) return false;
			for (const date of value) {
				if (isDateDisabled(date)) return true;
				if (isDateUnavailable(date)) return true;
			}
		} else {
			if (!value) return false;
			if (isDateDisabled(value)) return true;
			if (isDateUnavailable(value)) return true;
		}
		return false;
	});
	get isInvalid() {
		return this.#isInvalid();
	}
	set isInvalid($$value) {
		return this.#isInvalid($$value);
	}
	#headingValue = derived(() => {
		this.opts.monthFormat.current;
		this.opts.yearFormat.current;
		return getCalendarHeadingValue({
			months: this.months,
			formatter: this.formatter,
			locale: this.opts.locale.current
		});
	});
	get headingValue() {
		return this.#headingValue();
	}
	set headingValue($$value) {
		return this.#headingValue($$value);
	}
	#fullCalendarLabel = derived(() => {
		return `${this.opts.calendarLabel.current} ${this.headingValue}`;
	});
	get fullCalendarLabel() {
		return this.#fullCalendarLabel();
	}
	set fullCalendarLabel($$value) {
		return this.#fullCalendarLabel($$value);
	}
	isOutsideVisibleMonths(date) {
		return !this.visibleMonths.some((month) => isSameMonth(date, month));
	}
	isDateDisabled(date) {
		if (this.opts.isDateDisabled.current(date) || this.opts.disabled.current) return true;
		const minValue = this.opts.minValue.current;
		const maxValue = this.opts.maxValue.current;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isBefore(maxValue, date)) return true;
		return false;
	}
	isDateSelected(date) {
		const value = this.opts.value.current;
		if (Array.isArray(value)) return value.some((d) => isSameDay(d, date));
		else if (!value) return false;
		return isSameDay(value, date);
	}
	shiftFocus(node, add) {
		return shiftCalendarFocus({
			node,
			add,
			placeholder: this.opts.placeholder,
			calendarNode: this.opts.ref.current,
			isPrevButtonDisabled: this.isPrevButtonDisabled,
			isNextButtonDisabled: this.isNextButtonDisabled,
			months: this.months,
			numberOfMonths: this.opts.numberOfMonths.current
		});
	}
	#isMultipleSelectionValid(selectedDates) {
		if (this.opts.type.current !== "multiple") return true;
		if (!this.opts.maxDays.current) return true;
		const selectedCount = selectedDates.length;
		if (this.opts.maxDays.current && selectedCount > this.opts.maxDays.current) return false;
		return true;
	}
	handleCellClick(_, date) {
		if (this.opts.readonly.current || this.opts.isDateDisabled.current?.(date) || this.opts.isDateUnavailable.current?.(date)) return;
		const prev = this.opts.value.current;
		if (this.opts.type.current === "multiple") {
			if (Array.isArray(prev) || prev === void 0) this.opts.value.current = this.handleMultipleUpdate(prev, date);
		} else if (!Array.isArray(prev)) {
			const next = this.handleSingleUpdate(prev, date);
			if (!next) this.announcer.announce("Selected date is now empty.", "polite", 5e3);
			else this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(next, false)}`, "polite");
			this.opts.value.current = getDateWithPreviousTime(next, prev);
			if (next !== void 0) this.opts.onDateSelect?.current?.();
		}
	}
	handleMultipleUpdate(prev, date) {
		if (!prev) {
			const newSelection = [date];
			return this.#isMultipleSelectionValid(newSelection) ? newSelection : [date];
		}
		if (!Array.isArray(prev)) return;
		const index = prev.findIndex((d) => isSameDay(d, date));
		const preventDeselect = this.opts.preventDeselect.current;
		if (index === -1) {
			const newSelection = [...prev, date];
			if (this.#isMultipleSelectionValid(newSelection)) return newSelection;
			else return [date];
		} else if (preventDeselect) return prev;
		else {
			const next = prev.filter((d) => !isSameDay(d, date));
			if (!next.length) {
				this.opts.placeholder.current = date;
				return;
			}
			return next;
		}
	}
	handleSingleUpdate(prev, date) {
		if (Array.isArray(prev)) {}
		if (!prev) return date;
		if (!this.opts.preventDeselect.current && isSameDay(prev, date)) {
			this.opts.placeholder.current = date;
			return;
		}
		return date;
	}
	onkeydown(event) {
		handleCalendarKeydown({
			event,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.opts.placeholder.current
		});
	}
	#snippetProps = derived(() => ({
		months: this.months,
		weekdays: this.weekdays
	}));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	getBitsAttr = (part) => {
		return calendarAttrs.getAttr(part);
	};
	#props = derived(() => ({
		...getCalendarElementProps({
			fullCalendarLabel: this.fullCalendarLabel,
			id: this.opts.id.current,
			isInvalid: this.isInvalid,
			disabled: this.opts.disabled.current,
			readonly: this.opts.readonly.current
		}),
		[this.getBitsAttr("root")]: "",
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarCellContext = new Context("Calendar.Cell | RangeCalendar.Cell");
var CalendarCellState = class CalendarCellState {
	static create(opts) {
		return CalendarCellContext.set(new CalendarCellState(opts, CalendarRootContext.get()));
	}
	opts;
	root;
	#cellDate = derived(() => toDate(this.opts.date.current));
	get cellDate() {
		return this.#cellDate();
	}
	set cellDate($$value) {
		return this.#cellDate($$value);
	}
	#isUnavailable = derived(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
	get isUnavailable() {
		return this.#isUnavailable();
	}
	set isUnavailable($$value) {
		return this.#isUnavailable($$value);
	}
	#isDateToday = derived(() => isToday(this.opts.date.current, getLocalTimeZone()));
	get isDateToday() {
		return this.#isDateToday();
	}
	set isDateToday($$value) {
		return this.#isDateToday($$value);
	}
	#isOutsideMonth = derived(() => !isSameMonth(this.opts.date.current, this.opts.month.current));
	get isOutsideMonth() {
		return this.#isOutsideMonth();
	}
	set isOutsideMonth($$value) {
		return this.#isOutsideMonth($$value);
	}
	#isOutsideVisibleMonths = derived(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
	get isOutsideVisibleMonths() {
		return this.#isOutsideVisibleMonths();
	}
	set isOutsideVisibleMonths($$value) {
		return this.#isOutsideVisibleMonths($$value);
	}
	#isDisabled = derived(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
	get isDisabled() {
		return this.#isDisabled();
	}
	set isDisabled($$value) {
		return this.#isDisabled($$value);
	}
	#isFocusedDate = derived(() => isSameDay(this.opts.date.current, this.root.opts.placeholder.current));
	get isFocusedDate() {
		return this.#isFocusedDate();
	}
	set isFocusedDate($$value) {
		return this.#isFocusedDate($$value);
	}
	#isSelectedDate = derived(() => this.root.isDateSelected(this.opts.date.current));
	get isSelectedDate() {
		return this.#isSelectedDate();
	}
	set isSelectedDate($$value) {
		return this.#isSelectedDate($$value);
	}
	#labelText = derived(() => this.root.formatter.custom(this.cellDate, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	}));
	get labelText() {
		return this.#labelText();
	}
	set labelText($$value) {
		return this.#labelText($$value);
	}
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#snippetProps = derived(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
		day: `${this.opts.date.current.day}`
	}));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#ariaDisabled = derived(() => {
		return this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable;
	});
	get ariaDisabled() {
		return this.#ariaDisabled();
	}
	set ariaDisabled($$value) {
		return this.#ariaDisabled($$value);
	}
	#sharedDataAttrs = derived(() => ({
		"data-unavailable": boolToEmptyStrOrUndef(this.isUnavailable),
		"data-today": this.isDateToday ? "" : void 0,
		"data-outside-month": this.isOutsideMonth ? "" : void 0,
		"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
		"data-focused": this.isFocusedDate ? "" : void 0,
		"data-selected": boolToEmptyStrOrUndef(this.isSelectedDate),
		"data-value": this.opts.date.current.toString(),
		"data-type": getDateValueType(this.opts.date.current),
		"data-disabled": boolToEmptyStrOrUndef(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
	}));
	get sharedDataAttrs() {
		return this.#sharedDataAttrs();
	}
	set sharedDataAttrs($$value) {
		return this.#sharedDataAttrs($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "gridcell",
		"aria-selected": boolToStr(this.isSelectedDate),
		"aria-disabled": boolToStr(this.ariaDisabled),
		...this.sharedDataAttrs,
		[this.root.getBitsAttr("cell")]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarDayState = class CalendarDayState {
	static create(opts) {
		return new CalendarDayState(opts, CalendarCellContext.get());
	}
	opts;
	cell;
	attachment;
	constructor(opts, cell) {
		this.opts = opts;
		this.cell = cell;
		this.onclick = this.onclick.bind(this);
		this.attachment = attachRef(this.opts.ref);
	}
	#tabindex = derived(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.isFocusedDate ? 0 : -1);
	onclick(e) {
		if (this.cell.isDisabled) return;
		this.cell.root.handleCellClick(e, this.cell.opts.date.current);
	}
	#snippetProps = derived(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnavailable,
		selected: this.cell.isSelectedDate,
		day: `${this.cell.opts.date.current.day}`
	}));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "button",
		"aria-label": this.cell.labelText,
		"aria-disabled": boolToStr(this.cell.ariaDisabled),
		...this.cell.sharedDataAttrs,
		tabindex: this.#tabindex(),
		[this.cell.root.getBitsAttr("day")]: "",
		"data-bits-day": "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarNextButtonState = class CalendarNextButtonState {
	static create(opts) {
		return new CalendarNextButtonState(opts, CalendarRootContext.get());
	}
	opts;
	root;
	#isDisabled = derived(() => this.root.isNextButtonDisabled);
	get isDisabled() {
		return this.#isDisabled();
	}
	set isDisabled($$value) {
		return this.#isDisabled($$value);
	}
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);
		this.attachment = attachRef(this.opts.ref);
	}
	onclick(_) {
		if (this.isDisabled) return;
		this.root.nextPage();
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Next",
		"aria-disabled": boolToStr(this.isDisabled),
		"data-disabled": boolToEmptyStrOrUndef(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("next-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarPrevButtonState = class CalendarPrevButtonState {
	static create(opts) {
		return new CalendarPrevButtonState(opts, CalendarRootContext.get());
	}
	opts;
	root;
	#isDisabled = derived(() => this.root.isPrevButtonDisabled);
	get isDisabled() {
		return this.#isDisabled();
	}
	set isDisabled($$value) {
		return this.#isDisabled($$value);
	}
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);
		this.attachment = attachRef(this.opts.ref);
	}
	onclick(_) {
		if (this.isDisabled) return;
		this.root.prevPage();
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Previous",
		"aria-disabled": boolToStr(this.isDisabled),
		"data-disabled": boolToEmptyStrOrUndef(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("prev-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarGridState = class CalendarGridState {
	static create(opts) {
		return new CalendarGridState(opts, CalendarRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "grid",
		"aria-readonly": boolToStr(this.root.opts.readonly.current),
		"aria-disabled": boolToStr(this.root.opts.disabled.current),
		"data-readonly": boolToEmptyStrOrUndef(this.root.opts.readonly.current),
		"data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
		[this.root.getBitsAttr("grid")]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarGridBodyState = class CalendarGridBodyState {
	static create(opts) {
		return new CalendarGridBodyState(opts, CalendarRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
		"data-readonly": boolToEmptyStrOrUndef(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-body")]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarGridHeadState = class CalendarGridHeadState {
	static create(opts) {
		return new CalendarGridHeadState(opts, CalendarRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
		"data-readonly": boolToEmptyStrOrUndef(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-head")]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarGridRowState = class CalendarGridRowState {
	static create(opts) {
		return new CalendarGridRowState(opts, CalendarRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
		"data-readonly": boolToEmptyStrOrUndef(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-row")]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarHeadCellState = class CalendarHeadCellState {
	static create(opts) {
		return new CalendarHeadCellState(opts, CalendarRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
		"data-readonly": boolToEmptyStrOrUndef(this.root.opts.readonly.current),
		[this.root.getBitsAttr("head-cell")]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarHeaderState = class CalendarHeaderState {
	static create(opts) {
		return new CalendarHeaderState(opts, CalendarRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
		"data-readonly": boolToEmptyStrOrUndef(this.root.opts.readonly.current),
		[this.root.getBitsAttr("header")]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarMonthSelectState = class CalendarMonthSelectState {
	static create(opts) {
		return new CalendarMonthSelectState(opts, CalendarRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.onchange = this.onchange.bind(this);
		this.attachment = attachRef(this.opts.ref);
	}
	#monthItems = derived(() => {
		this.root.opts.locale.current;
		const monthNumbers = this.opts.months.current;
		const monthFormat = this.opts.monthFormat.current;
		const months = [];
		for (const month of monthNumbers) {
			const date = this.root.opts.placeholder.current.set({ month });
			let label;
			if (typeof monthFormat === "function") label = monthFormat(month);
			else label = this.root.formatter.custom(toDate(date), { month: monthFormat });
			months.push({
				value: month,
				label
			});
		}
		return months;
	});
	get monthItems() {
		return this.#monthItems();
	}
	set monthItems($$value) {
		return this.#monthItems($$value);
	}
	#currentMonth = derived(() => this.root.opts.placeholder.current.month);
	get currentMonth() {
		return this.#currentMonth();
	}
	set currentMonth($$value) {
		return this.#currentMonth($$value);
	}
	#isDisabled = derived(() => this.root.opts.disabled.current || this.opts.disabled.current);
	get isDisabled() {
		return this.#isDisabled();
	}
	set isDisabled($$value) {
		return this.#isDisabled($$value);
	}
	#snippetProps = derived(() => {
		return {
			monthItems: this.monthItems,
			selectedMonthItem: this.monthItems.find((month) => month.value === this.currentMonth)
		};
	});
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	onchange(event) {
		if (this.isDisabled) return;
		const target = event.target;
		const month = parseInt(target.value, 10);
		if (!isNaN(month)) this.root.opts.placeholder.current = this.root.opts.placeholder.current.set({ month });
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		value: this.currentMonth,
		disabled: this.isDisabled,
		"data-disabled": boolToEmptyStrOrUndef(this.isDisabled),
		[this.root.getBitsAttr("month-select")]: "",
		onchange: this.onchange,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CalendarYearSelectState = class CalendarYearSelectState {
	static create(opts) {
		return new CalendarYearSelectState(opts, CalendarRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.onchange = this.onchange.bind(this);
		this.attachment = attachRef(this.opts.ref);
	}
	#years = derived(() => {
		if (this.opts.years.current && this.opts.years.current.length) return this.opts.years.current;
		return this.root.defaultYears;
	});
	get years() {
		return this.#years();
	}
	set years($$value) {
		return this.#years($$value);
	}
	#yearItems = derived(() => {
		this.root.opts.locale.current;
		const yearFormat = this.opts.yearFormat.current;
		const localYears = [];
		for (const year of this.years) {
			const date = this.root.opts.placeholder.current.set({ year });
			let label;
			if (typeof yearFormat === "function") label = yearFormat(year);
			else label = this.root.formatter.custom(toDate(date), { year: yearFormat });
			localYears.push({
				value: year,
				label
			});
		}
		return localYears;
	});
	get yearItems() {
		return this.#yearItems();
	}
	set yearItems($$value) {
		return this.#yearItems($$value);
	}
	#currentYear = derived(() => this.root.opts.placeholder.current.year);
	get currentYear() {
		return this.#currentYear();
	}
	set currentYear($$value) {
		return this.#currentYear($$value);
	}
	#isDisabled = derived(() => this.root.opts.disabled.current || this.opts.disabled.current);
	get isDisabled() {
		return this.#isDisabled();
	}
	set isDisabled($$value) {
		return this.#isDisabled($$value);
	}
	#snippetProps = derived(() => {
		return {
			yearItems: this.yearItems,
			selectedYearItem: this.yearItems.find((year) => year.value === this.currentYear)
		};
	});
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	onchange(event) {
		if (this.isDisabled) return;
		const target = event.target;
		const year = parseInt(target.value, 10);
		if (!isNaN(year)) this.root.opts.placeholder.current = this.root.opts.placeholder.current.set({ year });
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		value: this.currentYear,
		disabled: this.isDisabled,
		"data-disabled": boolToEmptyStrOrUndef(this.isDisabled),
		[this.root.getBitsAttr("year-select")]: "",
		onchange: this.onchange,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar.svelte
function Calendar$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { child, children, id = useId(), ref = null, value = void 0, onValueChange = noop$1, placeholder = void 0, onPlaceholderChange = noop$1, weekdayFormat = "narrow", weekStartsOn, pagedNavigation = false, isDateDisabled = () => false, isDateUnavailable = () => false, fixedWeeks = false, numberOfMonths = 1, locale, calendarLabel = "Event", disabled = false, readonly = false, minValue = void 0, maxValue = void 0, preventDeselect = false, type, disableDaysOutsideMonth = true, initialFocus = false, maxDays, monthFormat = "long", yearFormat = "numeric", $$slots, $$events, ...restProps } = $$props;
		const defaultPlaceholder = getDefaultDate({
			defaultValue: value,
			minValue,
			maxValue
		});
		function handleDefaultPlaceholder() {
			if (placeholder !== void 0) return;
			placeholder = defaultPlaceholder;
		}
		handleDefaultPlaceholder();
		watch.pre(() => placeholder, () => {
			handleDefaultPlaceholder();
		});
		function handleDefaultValue() {
			if (value !== void 0) return;
			value = type === "single" ? void 0 : [];
		}
		handleDefaultValue();
		watch.pre(() => value, () => {
			handleDefaultValue();
		});
		const rootState = CalendarRootState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			weekdayFormat: boxWith(() => weekdayFormat),
			weekStartsOn: boxWith(() => weekStartsOn),
			pagedNavigation: boxWith(() => pagedNavigation),
			isDateDisabled: boxWith(() => isDateDisabled),
			isDateUnavailable: boxWith(() => isDateUnavailable),
			fixedWeeks: boxWith(() => fixedWeeks),
			numberOfMonths: boxWith(() => numberOfMonths),
			locale: resolveLocaleProp(() => locale),
			calendarLabel: boxWith(() => calendarLabel),
			readonly: boxWith(() => readonly),
			disabled: boxWith(() => disabled),
			minValue: boxWith(() => minValue),
			maxValue: boxWith(() => maxValue),
			disableDaysOutsideMonth: boxWith(() => disableDaysOutsideMonth),
			initialFocus: boxWith(() => initialFocus),
			maxDays: boxWith(() => maxDays),
			placeholder: boxWith(() => placeholder, (v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}),
			preventDeselect: boxWith(() => preventDeselect),
			value: boxWith(() => value, (v) => {
				value = v;
				onValueChange(v);
			}),
			type: boxWith(() => type),
			monthFormat: boxWith(() => monthFormat),
			yearFormat: boxWith(() => yearFormat),
			defaultPlaceholder
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, {
				props: mergedProps(),
				...rootState.snippetProps
			});
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer, rootState.snippetProps);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			ref,
			value,
			placeholder
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-day.svelte
function Calendar_day$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), $$slots, $$events, ...restProps } = $$props;
		const dayState = CalendarDayState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, dayState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, {
				props: mergedProps(),
				...dayState.snippetProps
			});
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			if (children) {
				$$renderer.push("<!--[0-->");
				children?.($$renderer, dayState.snippetProps);
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`${escape_html(dayState.cell.opts.date.current.day)}`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid.svelte
function Calendar_grid$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), $$slots, $$events, ...restProps } = $$props;
		const gridState = CalendarGridState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, gridState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<table${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></table>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-body.svelte
function Calendar_grid_body$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), $$slots, $$events, ...restProps } = $$props;
		const gridBodyState = CalendarGridBodyState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, gridBodyState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<tbody${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></tbody>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-cell.svelte
function Calendar_cell$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), date, month, $$slots, $$events, ...restProps } = $$props;
		const cellState = CalendarCellState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			date: boxWith(() => date),
			month: boxWith(() => month)
		});
		const mergedProps = derived(() => mergeProps(restProps, cellState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, {
				props: mergedProps(),
				...cellState.snippetProps
			});
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<td${attributes({ ...mergedProps() })}>`);
			children?.($$renderer, cellState.snippetProps);
			$$renderer.push(`<!----></td>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-head.svelte
function Calendar_grid_head$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), $$slots, $$events, ...restProps } = $$props;
		const gridHeadState = CalendarGridHeadState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, gridHeadState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<thead${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></thead>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-head-cell.svelte
function Calendar_head_cell$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), $$slots, $$events, ...restProps } = $$props;
		const headCellState = CalendarHeadCellState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, headCellState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<th${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></th>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-row.svelte
function Calendar_grid_row$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), $$slots, $$events, ...restProps } = $$props;
		const gridRowState = CalendarGridRowState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, gridRowState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<tr${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></tr>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-header.svelte
function Calendar_header$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), $$slots, $$events, ...restProps } = $$props;
		const headerState = CalendarHeaderState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, headerState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<header${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></header>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-month-select.svelte
function Calendar_month_select$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), months = [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12
		], monthFormat = "long", disabled = false, "aria-label": ariaLabel = "Select a month", $$slots, $$events, ...restProps } = $$props;
		const monthSelectState = CalendarMonthSelectState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			months: boxWith(() => months),
			monthFormat: boxWith(() => monthFormat),
			disabled: boxWith(() => Boolean(disabled))
		});
		const mergedProps = derived(() => mergeProps(restProps, monthSelectState.props, { "aria-label": ariaLabel }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, {
				props: mergedProps(),
				...monthSelectState.snippetProps
			});
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.select({ ...mergedProps() }, ($$renderer) => {
				if (children) {
					$$renderer.push("<!--[0-->");
					children?.($$renderer, monthSelectState.snippetProps);
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--[-->`);
					const each_array = ensure_array_like(monthSelectState.monthItems);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let month = each_array[$$index];
						$$renderer.option({
							value: month.value,
							selected: month.value === monthSelectState.currentMonth
						}, ($$renderer) => {
							$$renderer.push(`${escape_html(month.label)}`);
						});
					}
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]-->`);
			}, void 0, void 0, void 0, void 0, true);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-next-button.svelte
function Calendar_next_button$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, tabindex = 0, $$slots, $$events, ...restProps } = $$props;
		const nextButtonState = CalendarNextButtonState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, nextButtonState.props, { tabindex }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-prev-button.svelte
function Calendar_prev_button$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, tabindex = 0, $$slots, $$events, ...restProps } = $$props;
		const prevButtonState = CalendarPrevButtonState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, prevButtonState.props, { tabindex }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/calendar/components/calendar-year-select.svelte
function Calendar_year_select$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), years, yearFormat = "numeric", disabled = false, "aria-label": ariaLabel = "Select a year", $$slots, $$events, ...restProps } = $$props;
		const yearSelectState = CalendarYearSelectState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			years: boxWith(() => years),
			yearFormat: boxWith(() => yearFormat),
			disabled: boxWith(() => Boolean(disabled))
		});
		const mergedProps = derived(() => mergeProps(restProps, yearSelectState.props, { "aria-label": ariaLabel }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, {
				props: mergedProps(),
				...yearSelectState.snippetProps
			});
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.select({ ...mergedProps() }, ($$renderer) => {
				if (children) {
					$$renderer.push("<!--[0-->");
					children?.($$renderer, yearSelectState.snippetProps);
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--[-->`);
					const each_array = ensure_array_like(yearSelectState.yearItems);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let year = each_array[$$index];
						$$renderer.option({
							value: year.value,
							selected: year.value === yearSelectState.currentYear
						}, ($$renderer) => {
							$$renderer.push(`${escape_html(year.label)}`);
						});
					}
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]-->`);
			}, void 0, void 0, void 0, void 0, true);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/command/command.svelte.js
var commandAttrs = createBitsAttrs({
	component: "command",
	parts: [
		"root",
		"list",
		"input",
		"separator",
		"loading",
		"empty",
		"group",
		"group-items",
		"group-heading",
		"item",
		"viewport",
		"input-label"
	]
});
commandAttrs.selector("group");
commandAttrs.selector("group-items");
commandAttrs.selector("group-heading");
commandAttrs.selector("item");
`${commandAttrs.selector("item")}`;
new Context("Command.Root");
new Context("Command.List");
new Context("Command.Group");
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/popover/popover.svelte.js
var popoverAttrs = createBitsAttrs({
	component: "popover",
	parts: [
		"root",
		"trigger",
		"content",
		"close",
		"overlay"
	]
});
var PopoverRootContext = new Context("Popover.Root");
var PopoverRootState = class PopoverRootState {
	static create(opts) {
		return PopoverRootContext.set(new PopoverRootState(opts));
	}
	opts;
	contentNode = null;
	contentPresence;
	triggerNode = null;
	overlayNode = null;
	overlayPresence;
	openedViaHover = false;
	hasInteractedWithContent = false;
	hoverCooldown = false;
	closeDelay = 0;
	#closeTimeout = null;
	#domContext = null;
	constructor(opts) {
		this.opts = opts;
		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		});
		this.overlayPresence = new PresenceManager({
			ref: boxWith(() => this.overlayNode),
			open: this.opts.open
		});
		watch(() => this.opts.open.current, (isOpen) => {
			if (!isOpen) {
				this.openedViaHover = false;
				this.hasInteractedWithContent = false;
				this.#clearCloseTimeout();
			}
		});
	}
	setDomContext(ctx) {
		this.#domContext = ctx;
	}
	#clearCloseTimeout() {
		if (this.#closeTimeout !== null && this.#domContext) {
			this.#domContext.clearTimeout(this.#closeTimeout);
			this.#closeTimeout = null;
		}
	}
	toggleOpen() {
		this.#clearCloseTimeout();
		this.opts.open.current = !this.opts.open.current;
	}
	handleClose() {
		this.#clearCloseTimeout();
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}
	handleHoverOpen() {
		this.#clearCloseTimeout();
		if (this.opts.open.current) return;
		this.openedViaHover = true;
		this.opts.open.current = true;
	}
	handleHoverClose() {
		if (!this.opts.open.current) return;
		if (this.openedViaHover && !this.hasInteractedWithContent) this.opts.open.current = false;
	}
	handleDelayedHoverClose() {
		if (!this.opts.open.current) return;
		if (!this.openedViaHover || this.hasInteractedWithContent) return;
		this.#clearCloseTimeout();
		if (this.closeDelay <= 0) this.opts.open.current = false;
		else if (this.#domContext) this.#closeTimeout = this.#domContext.setTimeout(() => {
			if (this.openedViaHover && !this.hasInteractedWithContent) this.opts.open.current = false;
			this.#closeTimeout = null;
		}, this.closeDelay);
	}
	cancelDelayedClose() {
		this.#clearCloseTimeout();
	}
	markInteraction() {
		this.hasInteractedWithContent = true;
		this.#clearCloseTimeout();
	}
};
var PopoverTriggerState = class PopoverTriggerState {
	static create(opts) {
		return new PopoverTriggerState(opts, PopoverRootContext.get());
	}
	opts;
	root;
	attachment;
	domContext;
	#openTimeout = null;
	#closeTimeout = null;
	#isHovering = false;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.triggerNode = v);
		this.domContext = new DOMContext(opts.ref);
		this.root.setDomContext(this.domContext);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		watch(() => this.opts.closeDelay.current, (delay) => {
			this.root.closeDelay = delay;
		});
	}
	#clearOpenTimeout() {
		if (this.#openTimeout !== null) {
			this.domContext.clearTimeout(this.#openTimeout);
			this.#openTimeout = null;
		}
	}
	#clearCloseTimeout() {
		if (this.#closeTimeout !== null) {
			this.domContext.clearTimeout(this.#closeTimeout);
			this.#closeTimeout = null;
		}
	}
	#clearAllTimeouts() {
		this.#clearOpenTimeout();
		this.#clearCloseTimeout();
	}
	onpointerenter(e) {
		if (this.opts.disabled.current) return;
		if (!this.opts.openOnHover.current) return;
		if (isTouch(e)) return;
		this.#isHovering = true;
		this.#clearCloseTimeout();
		this.root.cancelDelayedClose();
		if (this.root.opts.open.current || this.root.hoverCooldown) return;
		const delay = this.opts.openDelay.current;
		if (delay <= 0) this.root.handleHoverOpen();
		else this.#openTimeout = this.domContext.setTimeout(() => {
			this.root.handleHoverOpen();
			this.#openTimeout = null;
		}, delay);
	}
	onpointerleave(e) {
		if (this.opts.disabled.current) return;
		if (!this.opts.openOnHover.current) return;
		if (isTouch(e)) return;
		this.#isHovering = false;
		this.#clearOpenTimeout();
		this.root.hoverCooldown = false;
	}
	onclick(e) {
		if (this.opts.disabled.current) return;
		if (e.button !== 0) return;
		this.#clearAllTimeouts();
		if (this.#isHovering && this.root.opts.open.current && this.root.openedViaHover) {
			this.root.openedViaHover = false;
			this.root.hasInteractedWithContent = true;
			return;
		}
		if (this.#isHovering && this.opts.openOnHover.current && this.root.opts.open.current) this.root.hoverCooldown = true;
		if (this.root.hoverCooldown && !this.root.opts.open.current) this.root.hoverCooldown = false;
		this.root.toggleOpen();
	}
	onkeydown(e) {
		if (this.opts.disabled.current) return;
		if (!(e.key === "Enter" || e.key === " ")) return;
		e.preventDefault();
		this.#clearAllTimeouts();
		this.root.toggleOpen();
	}
	#getAriaControls() {
		if (this.root.opts.open.current && this.root.contentNode?.id) return this.root.contentNode?.id;
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"aria-haspopup": "dialog",
		"aria-expanded": boolToStr(this.root.opts.open.current),
		"data-state": getDataOpenClosed(this.root.opts.open.current),
		"aria-controls": this.#getAriaControls(),
		[popoverAttrs.trigger]: "",
		disabled: this.opts.disabled.current,
		onkeydown: this.onkeydown,
		onclick: this.onclick,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var PopoverContentState = class PopoverContentState {
	static create(opts) {
		return new PopoverContentState(opts, PopoverRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.contentNode = v);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onfocusin = this.onfocusin.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		new SafePolygon({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && this.root.openedViaHover && !this.root.hasInteractedWithContent,
			onPointerExit: () => {
				this.root.handleDelayedHoverClose();
			}
		});
	}
	onpointerdown(_) {
		this.root.markInteraction();
	}
	onfocusin(e) {
		const target = e.target;
		if (isElement(target) && isTabbable(target)) this.root.markInteraction();
	}
	onpointerenter(e) {
		if (isTouch(e)) return;
		this.root.cancelDelayedClose();
	}
	onpointerleave(e) {
		if (isTouch(e)) return;
	}
	onInteractOutside = (e) => {
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		if (!isElement(e.target)) return;
		const closestTrigger = e.target.closest(popoverAttrs.selector("trigger"));
		if (closestTrigger && closestTrigger === this.root.triggerNode) return;
		if (this.opts.customAnchor.current) {
			if (isElement(this.opts.customAnchor.current)) {
				if (this.opts.customAnchor.current.contains(e.target)) return;
			} else if (typeof this.opts.customAnchor.current === "string") {
				const el = document.querySelector(this.opts.customAnchor.current);
				if (el && el.contains(e.target)) return;
			}
		}
		this.root.handleClose();
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
	get shouldTrapFocus() {
		if (this.root.openedViaHover && !this.root.hasInteractedWithContent) return false;
		return true;
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		"data-state": getDataOpenClosed(this.root.opts.open.current),
		...getDataTransitionAttrs(this.root.contentPresence.transitionStatus),
		[popoverAttrs.content]: "",
		style: {
			pointerEvents: "auto",
			contain: "layout style"
		},
		onpointerdown: this.onpointerdown,
		onfocusin: this.onfocusin,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown
	};
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/popover/components/popover-content.svelte
function Popover_content$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { child, children, ref = null, id = createId(uid), forceMount = false, onOpenAutoFocus = noop$1, onCloseAutoFocus = noop$1, onEscapeKeydown = noop$1, onInteractOutside = noop$1, trapFocus = true, preventScroll = false, customAnchor = null, style, $$slots, $$events, ...restProps } = $$props;
		const contentState = PopoverContentState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			onInteractOutside: boxWith(() => onInteractOutside),
			onEscapeKeydown: boxWith(() => onEscapeKeydown),
			customAnchor: boxWith(() => customAnchor)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		const effectiveTrapFocus = derived(() => trapFocus && contentState.shouldTrapFocus);
		function handleOpenAutoFocus(e) {
			if (!contentState.shouldTrapFocus) e.preventDefault();
			onOpenAutoFocus(e);
		}
		if (forceMount) {
			$$renderer.push("<!--[0-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("popover") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer_force_mount($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						ref: contentState.opts.ref,
						enabled: contentState.root.opts.open.current,
						id,
						trapFocus: effectiveTrapFocus(),
						preventScroll,
						loop: true,
						forceMount: true,
						customAnchor,
						onOpenAutoFocus: handleOpenAutoFocus,
						onCloseAutoFocus,
						shouldRender: contentState.shouldRender,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else if (!forceMount) {
			$$renderer.push("<!--[1-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("popover") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						ref: contentState.opts.ref,
						open: contentState.root.opts.open.current,
						id,
						trapFocus: effectiveTrapFocus(),
						preventScroll,
						loop: true,
						forceMount: false,
						customAnchor,
						onOpenAutoFocus: handleOpenAutoFocus,
						onCloseAutoFocus,
						shouldRender: contentState.shouldRender,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/popover/components/popover-trigger.svelte
function Popover_trigger$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, type = "button", disabled = false, openOnHover = false, openDelay = 700, closeDelay = 300, $$slots, $$events, ...restProps } = $$props;
		const triggerState = PopoverTriggerState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			disabled: boxWith(() => Boolean(disabled)),
			openOnHover: boxWith(() => openOnHover),
			openDelay: boxWith(() => openDelay),
			closeDelay: boxWith(() => closeDelay)
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
		Floating_layer_anchor($$renderer, {
			id,
			ref: triggerState.opts.ref,
			children: ($$renderer) => {
				if (child) {
					$$renderer.push("<!--[0-->");
					child($$renderer, { props: mergedProps() });
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
					children?.($$renderer);
					$$renderer.push(`<!----></button>`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/popover/components/popover.svelte
function Popover($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onOpenChange = noop$1, onOpenChangeComplete = noop$1, children } = $$props;
		PopoverRootState.create({
			open: boxWith(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
		});
		Floating_layer($$renderer, {
			children: ($$renderer) => {
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			},
			$$slots: { default: true }
		});
		bind_props($$props, { open });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/tabs/tabs.svelte.js
var tabsAttrs = createBitsAttrs({
	component: "tabs",
	parts: [
		"root",
		"list",
		"trigger",
		"content"
	]
});
var TabsRootContext = new Context("Tabs.Root");
var TabsRootState = class TabsRootState {
	static create(opts) {
		return TabsRootContext.set(new TabsRootState(opts));
	}
	opts;
	attachment;
	rovingFocusGroup;
	triggerIds = [];
	valueToTriggerId = new SvelteMap();
	valueToContentId = new SvelteMap();
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: tabsAttrs.trigger,
			rootNode: this.opts.ref,
			loop: this.opts.loop,
			orientation: this.opts.orientation
		});
	}
	registerTrigger(id, value) {
		this.triggerIds.push(id);
		this.valueToTriggerId.set(value, id);
		return () => {
			this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
			this.valueToTriggerId.delete(value);
		};
	}
	registerContent(id, value) {
		this.valueToContentId.set(value, id);
		return () => {
			this.valueToContentId.delete(value);
		};
	}
	setValue(v) {
		this.opts.value.current = v;
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-orientation": this.opts.orientation.current,
		[tabsAttrs.root]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var TabsContentState = class TabsContentState {
	static create(opts) {
		return new TabsContentState(opts, TabsRootContext.get());
	}
	opts;
	root;
	attachment;
	#isActive = derived(() => this.root.opts.value.current === this.opts.value.current);
	#ariaLabelledBy = derived(() => this.root.valueToTriggerId.get(this.opts.value.current));
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
		watch([() => this.opts.id.current, () => this.opts.value.current], ([id, value]) => {
			return this.root.registerContent(id, value);
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "tabpanel",
		hidden: boolToTrueOrUndef(!this.#isActive()),
		tabindex: 0,
		"data-value": this.opts.value.current,
		"data-state": getTabDataState(this.#isActive()),
		"aria-labelledby": this.#ariaLabelledBy(),
		"data-orientation": this.root.opts.orientation.current,
		[tabsAttrs.content]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
function getTabDataState(condition) {
	return condition ? "active" : "inactive";
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/tabs/components/tabs.svelte
function Tabs$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, value = "", onValueChange = noop$1, orientation = "horizontal", loop = true, activationMode = "automatic", disabled = false, children, child, $$slots, $$events, ...restProps } = $$props;
		const rootState = TabsRootState.create({
			id: boxWith(() => id),
			value: boxWith(() => value, (v) => {
				value = v;
				onValueChange(v);
			}),
			orientation: boxWith(() => orientation),
			loop: boxWith(() => loop),
			activationMode: boxWith(() => activationMode),
			disabled: boxWith(() => disabled),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			ref,
			value
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@opentelemetry+api@1_2f1fbc9e1bceb9eb223fb0fd0b0b58ef/node_modules/bits-ui/dist/bits/tabs/components/tabs-content.svelte
function Tabs_content$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, value, $$slots, $$events, ...restProps } = $$props;
		const contentState = TabsContentState.create({
			value: boxWith(() => value),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/arrow-down-up.svelte
function Arrow_down_up($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "arrow-down-up" },
			props,
			{
				iconNode: [
					["path", { "d": "m3 16 4 4 4-4" }],
					["path", { "d": "M7 20V4" }],
					["path", { "d": "m21 8-4-4-4 4" }],
					["path", { "d": "M17 4v16" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/arrow-left.svelte
function Arrow_left($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "arrow-left" },
			props,
			{
				iconNode: [["path", { "d": "m12 19-7-7 7-7" }], ["path", { "d": "M19 12H5" }]],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/calendar.svelte
function Calendar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "calendar" },
			props,
			{
				iconNode: [
					["path", { "d": "M8 2v4" }],
					["path", { "d": "M16 2v4" }],
					["rect", {
						"width": "18",
						"height": "18",
						"x": "3",
						"y": "4",
						"rx": "2"
					}],
					["path", { "d": "M3 10h18" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/chevron-left.svelte
function Chevron_left($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "chevron-left" },
			props,
			{
				iconNode: [["path", { "d": "m15 18-6-6 6-6" }]],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/circle-alert.svelte
function Circle_alert($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "circle-alert" },
			props,
			{
				iconNode: [
					["circle", {
						"cx": "12",
						"cy": "12",
						"r": "10"
					}],
					["line", {
						"x1": "12",
						"x2": "12",
						"y1": "8",
						"y2": "12"
					}],
					["line", {
						"x1": "12",
						"x2": "12.01",
						"y1": "16",
						"y2": "16"
					}]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/code.svelte
function Code($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "code" },
			props,
			{
				iconNode: [["path", { "d": "m16 18 6-6-6-6" }], ["path", { "d": "m8 6-6 6 6 6" }]],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/download.svelte
function Download($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "download" },
			props,
			{
				iconNode: [
					["path", { "d": "M12 15V3" }],
					["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
					["path", { "d": "m7 10 5 5 5-5" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/ellipsis.svelte
function Ellipsis($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "ellipsis" },
			props,
			{
				iconNode: [
					["circle", {
						"cx": "12",
						"cy": "12",
						"r": "1"
					}],
					["circle", {
						"cx": "19",
						"cy": "12",
						"r": "1"
					}],
					["circle", {
						"cx": "5",
						"cy": "12",
						"r": "1"
					}]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/file-image.svelte
function File_image($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "file-image" },
			props,
			{
				iconNode: [
					["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
					["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
					["circle", {
						"cx": "10",
						"cy": "12",
						"r": "2"
					}],
					["path", { "d": "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/file-text.svelte
function File_text($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "file-text" },
			props,
			{
				iconNode: [
					["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
					["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
					["path", { "d": "M10 9H8" }],
					["path", { "d": "M16 13H8" }],
					["path", { "d": "M16 17H8" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/globe.svelte
function Globe($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "globe" },
			props,
			{
				iconNode: [
					["circle", {
						"cx": "12",
						"cy": "12",
						"r": "10"
					}],
					["path", { "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }],
					["path", { "d": "M2 12h20" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/grid-3x3.svelte
function Grid_3x3($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "grid-3x3" },
			props,
			{
				iconNode: [
					["rect", {
						"width": "18",
						"height": "18",
						"x": "3",
						"y": "3",
						"rx": "2"
					}],
					["path", { "d": "M3 9h18" }],
					["path", { "d": "M3 15h18" }],
					["path", { "d": "M9 3v18" }],
					["path", { "d": "M15 3v18" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/history.svelte
function History($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "history" },
			props,
			{
				iconNode: [
					["path", { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
					["path", { "d": "M3 3v5h5" }],
					["path", { "d": "M12 7v5l4 2" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/image.svelte
function Image($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "image" },
			props,
			{
				iconNode: [
					["rect", {
						"width": "18",
						"height": "18",
						"x": "3",
						"y": "3",
						"rx": "2",
						"ry": "2"
					}],
					["circle", {
						"cx": "9",
						"cy": "9",
						"r": "2"
					}],
					["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/link.svelte
function Link($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "link" },
			props,
			{
				iconNode: [["path", { "d": "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }], ["path", { "d": "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" }]],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/list.svelte
function List($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "list" },
			props,
			{
				iconNode: [
					["path", { "d": "M3 5h.01" }],
					["path", { "d": "M3 12h.01" }],
					["path", { "d": "M3 19h.01" }],
					["path", { "d": "M8 5h13" }],
					["path", { "d": "M8 12h13" }],
					["path", { "d": "M8 19h13" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/maximize-2.svelte
function Maximize_2($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "maximize-2" },
			props,
			{
				iconNode: [
					["path", { "d": "M15 3h6v6" }],
					["path", { "d": "m21 3-7 7" }],
					["path", { "d": "m3 21 7-7" }],
					["path", { "d": "M9 21H3v-6" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/minimize-2.svelte
function Minimize_2($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "minimize-2" },
			props,
			{
				iconNode: [
					["path", { "d": "m14 10 7-7" }],
					["path", { "d": "M20 10h-6V4" }],
					["path", { "d": "m3 21 7-7" }],
					["path", { "d": "M4 14h6v6" }]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/monitor.svelte
function Monitor($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "monitor" },
			props,
			{
				iconNode: [
					["rect", {
						"width": "20",
						"height": "14",
						"x": "2",
						"y": "3",
						"rx": "2"
					}],
					["line", {
						"x1": "8",
						"x2": "16",
						"y1": "21",
						"y2": "21"
					}],
					["line", {
						"x1": "12",
						"x2": "12",
						"y1": "17",
						"y2": "21"
					}]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/smartphone.svelte
function Smartphone($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "smartphone" },
			props,
			{
				iconNode: [["rect", {
					"width": "14",
					"height": "20",
					"x": "5",
					"y": "2",
					"rx": "2",
					"ry": "2"
				}], ["path", { "d": "M12 18h.01" }]],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/square-check-big.svelte
function Square_check_big($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "square-check-big" },
			props,
			{
				iconNode: [["path", { "d": "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" }], ["path", { "d": "m9 11 3 3L22 4" }]],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/tablet.svelte
function Tablet($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "tablet" },
			props,
			{
				iconNode: [["rect", {
					"width": "16",
					"height": "20",
					"x": "4",
					"y": "2",
					"rx": "2",
					"ry": "2"
				}], ["line", {
					"x1": "12",
					"x2": "12.01",
					"y1": "18",
					"y2": "18"
				}]],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/zoom-in.svelte
function Zoom_in($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "zoom-in" },
			props,
			{
				iconNode: [
					["circle", {
						"cx": "11",
						"cy": "11",
						"r": "8"
					}],
					["line", {
						"x1": "21",
						"x2": "16.65",
						"y1": "21",
						"y2": "16.65"
					}],
					["line", {
						"x1": "11",
						"x2": "11",
						"y1": "8",
						"y2": "14"
					}],
					["line", {
						"x1": "8",
						"x2": "14",
						"y1": "11",
						"y2": "11"
					}]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/zoom-out.svelte
function Zoom_out($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "zoom-out" },
			props,
			{
				iconNode: [
					["circle", {
						"cx": "11",
						"cy": "11",
						"r": "8"
					}],
					["line", {
						"x1": "21",
						"x2": "16.65",
						"y1": "21",
						"y2": "16.65"
					}],
					["line", {
						"x1": "8",
						"x2": "14",
						"y1": "11",
						"y2": "11"
					}]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/tabs/tabs.svelte
function Tabs($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = "", class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Tabs$1) {
				$$renderer.push("<!--[-->");
				Tabs$1($$renderer, spread_props([
					{
						"data-slot": "tabs",
						class: cn("flex flex-col gap-2", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						},
						get value() {
							return value;
						},
						set value($$value) {
							value = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			ref,
			value
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/tabs/tabs-content.svelte
function Tabs_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Tabs_content$1) {
				$$renderer.push("<!--[-->");
				Tabs_content$1($$renderer, spread_props([
					{
						"data-slot": "tabs-content",
						class: cn("flex-1 outline-none", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar.svelte
function Calendar_1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = void 0, placeholder = void 0, class: className, weekdayFormat = "short", buttonVariant = "ghost", captionLayout = "label", locale = "en-US", months: monthsProp, years, monthFormat: monthFormatProp, yearFormat = "numeric", day, disableDaysOutsideMonth = false, $$slots, $$events, ...restProps } = $$props;
		const monthFormat = derived(() => {
			if (monthFormatProp) return monthFormatProp;
			if (captionLayout.startsWith("dropdown")) return "short";
			return "long";
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function children($$renderer, { months, weekdays }) {
					if (Calendar_months) {
						$$renderer.push("<!--[-->");
						Calendar_months($$renderer, {
							children: ($$renderer) => {
								if (Calendar_nav) {
									$$renderer.push("<!--[-->");
									Calendar_nav($$renderer, {
										children: ($$renderer) => {
											if (Calendar_prev_button) {
												$$renderer.push("<!--[-->");
												Calendar_prev_button($$renderer, { variant: buttonVariant });
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(` `);
											if (Calendar_next_button) {
												$$renderer.push("<!--[-->");
												Calendar_next_button($$renderer, { variant: buttonVariant });
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` <!--[-->`);
								const each_array = ensure_array_like(months);
								for (let monthIndex = 0, $$length = each_array.length; monthIndex < $$length; monthIndex++) {
									let month = each_array[monthIndex];
									if (Calendar_month) {
										$$renderer.push("<!--[-->");
										Calendar_month($$renderer, {
											children: ($$renderer) => {
												if (Calendar_header) {
													$$renderer.push("<!--[-->");
													Calendar_header($$renderer, {
														children: ($$renderer) => {
															if (Calendar_caption) {
																$$renderer.push("<!--[-->");
																Calendar_caption($$renderer, {
																	captionLayout,
																	months: monthsProp,
																	monthFormat: monthFormat(),
																	years,
																	yearFormat,
																	month: month.value,
																	locale,
																	monthIndex,
																	get placeholder() {
																		return placeholder;
																	},
																	set placeholder($$value) {
																		placeholder = $$value;
																		$$settled = false;
																	}
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
												$$renderer.push(` `);
												if (Calendar_grid) {
													$$renderer.push("<!--[-->");
													Calendar_grid($$renderer, {
														children: ($$renderer) => {
															if (Calendar_grid_head) {
																$$renderer.push("<!--[-->");
																Calendar_grid_head($$renderer, {
																	children: ($$renderer) => {
																		if (Calendar_grid_row) {
																			$$renderer.push("<!--[-->");
																			Calendar_grid_row($$renderer, {
																				class: "select-none",
																				children: ($$renderer) => {
																					$$renderer.push(`<!--[-->`);
																					const each_array_1 = ensure_array_like(weekdays);
																					for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
																						let weekday = each_array_1[$$index];
																						if (Calendar_head_cell) {
																							$$renderer.push("<!--[-->");
																							Calendar_head_cell($$renderer, {
																								children: ($$renderer) => {
																									$$renderer.push(`<!---->${escape_html(weekday.slice(0, 2))}`);
																								},
																								$$slots: { default: true }
																							});
																							$$renderer.push("<!--]-->");
																						} else {
																							$$renderer.push("<!--[!-->");
																							$$renderer.push("<!--]-->");
																						}
																					}
																					$$renderer.push(`<!--]-->`);
																				},
																				$$slots: { default: true }
																			});
																			$$renderer.push("<!--]-->");
																		} else {
																			$$renderer.push("<!--[!-->");
																			$$renderer.push("<!--]-->");
																		}
																	},
																	$$slots: { default: true }
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
															$$renderer.push(` `);
															if (Calendar_grid_body) {
																$$renderer.push("<!--[-->");
																Calendar_grid_body($$renderer, {
																	children: ($$renderer) => {
																		$$renderer.push(`<!--[-->`);
																		const each_array_2 = ensure_array_like(month.weeks);
																		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
																			let weekDates = each_array_2[$$index_2];
																			if (Calendar_grid_row) {
																				$$renderer.push("<!--[-->");
																				Calendar_grid_row($$renderer, {
																					class: "mt-2 w-full",
																					children: ($$renderer) => {
																						$$renderer.push(`<!--[-->`);
																						const each_array_3 = ensure_array_like(weekDates);
																						for (let $$index_1 = 0, $$length = each_array_3.length; $$index_1 < $$length; $$index_1++) {
																							let date = each_array_3[$$index_1];
																							if (Calendar_cell) {
																								$$renderer.push("<!--[-->");
																								Calendar_cell($$renderer, {
																									date,
																									month: month.value,
																									children: ($$renderer) => {
																										if (day) {
																											$$renderer.push("<!--[0-->");
																											day($$renderer, {
																												day: date,
																												outsideMonth: !isEqualMonth(date, month.value)
																											});
																											$$renderer.push(`<!---->`);
																										} else {
																											$$renderer.push("<!--[-1-->");
																											if (Calendar_day) {
																												$$renderer.push("<!--[-->");
																												Calendar_day($$renderer, {});
																												$$renderer.push("<!--]-->");
																											} else {
																												$$renderer.push("<!--[!-->");
																												$$renderer.push("<!--]-->");
																											}
																										}
																										$$renderer.push(`<!--]-->`);
																									},
																									$$slots: { default: true }
																								});
																								$$renderer.push("<!--]-->");
																							} else {
																								$$renderer.push("<!--[!-->");
																								$$renderer.push("<!--]-->");
																							}
																						}
																						$$renderer.push(`<!--]-->`);
																					},
																					$$slots: { default: true }
																				});
																				$$renderer.push("<!--]-->");
																			} else {
																				$$renderer.push("<!--[!-->");
																				$$renderer.push("<!--]-->");
																			}
																		}
																		$$renderer.push(`<!--]-->`);
																	},
																	$$slots: { default: true }
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				}
				if (Calendar$1) {
					$$renderer.push("<!--[-->");
					Calendar$1($$renderer, spread_props([
						{
							weekdayFormat,
							disableDaysOutsideMonth,
							class: cn("bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", className),
							locale,
							monthFormat: monthFormat(),
							yearFormat
						},
						restProps,
						{
							get value() {
								return value;
							},
							set value($$value) {
								value = $$value;
								$$settled = false;
							},
							get ref() {
								return ref;
							},
							set ref($$value) {
								ref = $$value;
								$$settled = false;
							},
							get placeholder() {
								return placeholder;
							},
							set placeholder($$value) {
								placeholder = $$value;
								$$settled = false;
							},
							children,
							$$slots: { default: true }
						}
					]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			ref,
			value,
			placeholder
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-cell.svelte
function Calendar_cell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Calendar_cell$1) {
				$$renderer.push("<!--[-->");
				Calendar_cell$1($$renderer, spread_props([
					{ class: cn("relative size-(--cell-size) p-0 text-center text-sm focus-within:z-20 [&:first-child[data-selected]_[data-bits-day]]:rounded-l-md [&:last-child[data-selected]_[data-bits-day]]:rounded-r-md", className) },
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-day.svelte
function Calendar_day($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Calendar_day$1) {
				$$renderer.push("<!--[-->");
				Calendar_day$1($$renderer, spread_props([
					{ class: cn(buttonVariants({ variant: "ghost" }), "flex size-(--cell-size) flex-col items-center justify-center gap-1 p-0 leading-none font-normal whitespace-nowrap select-none", "[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground [&[data-today][data-disabled]]:text-muted-foreground", "data-[selected]:bg-primary dark:data-[selected]:hover:bg-accent/50 data-[selected]:text-primary-foreground", "[&[data-outside-month]:not([data-selected])]:text-muted-foreground [&[data-outside-month]:not([data-selected])]:hover:text-accent-foreground", "data-[disabled]:text-muted-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", "data-[unavailable]:text-muted-foreground data-[unavailable]:line-through", "dark:hover:text-accent-foreground", "focus:border-ring focus:ring-ring/50 focus:relative", "[&>span]:text-xs [&>span]:opacity-70", className) },
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-grid.svelte
function Calendar_grid($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Calendar_grid$1) {
				$$renderer.push("<!--[-->");
				Calendar_grid$1($$renderer, spread_props([
					{ class: cn("mt-4 flex w-full border-collapse flex-col gap-1", className) },
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-header.svelte
function Calendar_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Calendar_header$1) {
				$$renderer.push("<!--[-->");
				Calendar_header$1($$renderer, spread_props([
					{ class: cn("flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium", className) },
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-months.svelte
function Calendar_months($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			class: clsx(cn("relative flex flex-col gap-4 md:flex-row", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-grid-row.svelte
function Calendar_grid_row($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Calendar_grid_row$1) {
				$$renderer.push("<!--[-->");
				Calendar_grid_row$1($$renderer, spread_props([
					{ class: cn("flex", className) },
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-grid-body.svelte
function Calendar_grid_body($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Calendar_grid_body$1) {
				$$renderer.push("<!--[-->");
				Calendar_grid_body$1($$renderer, spread_props([
					{ class: cn(className) },
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-grid-head.svelte
function Calendar_grid_head($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Calendar_grid_head$1) {
				$$renderer.push("<!--[-->");
				Calendar_grid_head$1($$renderer, spread_props([
					{ class: cn(className) },
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-head-cell.svelte
function Calendar_head_cell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Calendar_head_cell$1) {
				$$renderer.push("<!--[-->");
				Calendar_head_cell$1($$renderer, spread_props([
					{ class: cn("text-muted-foreground w-(--cell-size) rounded-md text-[0.8rem] font-normal", className) },
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-next-button.svelte
function Fallback$1($$renderer) {
	Chevron_right($$renderer, { class: "size-4" });
}
function Calendar_next_button($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, variant = "ghost", $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Calendar_next_button$1) {
				$$renderer.push("<!--[-->");
				Calendar_next_button$1($$renderer, spread_props([
					{
						class: cn(buttonVariants({ variant }), "size-(--cell-size) bg-transparent p-0 select-none disabled:opacity-50 rtl:rotate-180", className),
						children: children || Fallback$1
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-prev-button.svelte
function Fallback($$renderer) {
	Chevron_left($$renderer, { class: "size-4" });
}
function Calendar_prev_button($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, variant = "ghost", $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Calendar_prev_button$1) {
				$$renderer.push("<!--[-->");
				Calendar_prev_button$1($$renderer, spread_props([
					{
						class: cn(buttonVariants({ variant }), "size-(--cell-size) bg-transparent p-0 select-none disabled:opacity-50 rtl:rotate-180", className),
						children: children || Fallback
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-month-select.svelte
function Calendar_month_select($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, value, onchange, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<span${attr_class(clsx(cn("has-focus:border-ring border-input has-focus:ring-ring/50 relative flex rounded-md border shadow-xs has-focus:ring-[3px]", className)))}>`);
			{
				function child($$renderer, { props, monthItems, selectedMonthItem }) {
					$$renderer.select({
						...props,
						value,
						onchange
					}, ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(monthItems);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let monthItem = each_array[$$index];
							$$renderer.option({
								value: monthItem.value,
								selected: value !== void 0 ? monthItem.value === value : monthItem.value === selectedMonthItem.value
							}, ($$renderer) => {
								$$renderer.push(`${escape_html(monthItem.label)}`);
							});
						}
						$$renderer.push(`<!--]-->`);
					});
					$$renderer.push(` <span class="[&amp;>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-sm font-medium select-none [&amp;>svg]:size-3.5" aria-hidden="true">${escape_html(monthItems.find((item) => item.value === value)?.label || selectedMonthItem.label)} `);
					Chevron_down($$renderer, { class: "size-4" });
					$$renderer.push(`<!----></span>`);
				}
				if (Calendar_month_select$1) {
					$$renderer.push("<!--[-->");
					Calendar_month_select$1($$renderer, spread_props([
						{ class: "absolute inset-0 opacity-0" },
						restProps,
						{
							get ref() {
								return ref;
							},
							set ref($$value) {
								ref = $$value;
								$$settled = false;
							},
							child,
							$$slots: { child: true }
						}
					]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			}
			$$renderer.push(`</span>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-year-select.svelte
function Calendar_year_select($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, value, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<span${attr_class(clsx(cn("has-focus:border-ring border-input has-focus:ring-ring/50 relative flex rounded-md border shadow-xs has-focus:ring-[3px]", className)))}>`);
			{
				function child($$renderer, { props, yearItems, selectedYearItem }) {
					$$renderer.select({
						...props,
						value
					}, ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(yearItems);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let yearItem = each_array[$$index];
							$$renderer.option({
								value: yearItem.value,
								selected: value !== void 0 ? yearItem.value === value : yearItem.value === selectedYearItem.value
							}, ($$renderer) => {
								$$renderer.push(`${escape_html(yearItem.label)}`);
							});
						}
						$$renderer.push(`<!--]-->`);
					});
					$$renderer.push(` <span class="[&amp;>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-sm font-medium select-none [&amp;>svg]:size-3.5" aria-hidden="true">${escape_html(yearItems.find((item) => item.value === value)?.label || selectedYearItem.label)} `);
					Chevron_down($$renderer, { class: "size-4" });
					$$renderer.push(`<!----></span>`);
				}
				if (Calendar_year_select$1) {
					$$renderer.push("<!--[-->");
					Calendar_year_select$1($$renderer, spread_props([
						{ class: "absolute inset-0 opacity-0" },
						restProps,
						{
							get ref() {
								return ref;
							},
							set ref($$value) {
								ref = $$value;
								$$settled = false;
							},
							child,
							$$slots: { child: true }
						}
					]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			}
			$$renderer.push(`</span>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-month.svelte
function Calendar_month($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			...restProps,
			class: clsx(cn("flex flex-col", className))
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-nav.svelte
function Calendar_nav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<nav${attributes({
			...restProps,
			class: clsx(cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", className))
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></nav>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/calendar/calendar-caption.svelte
function Calendar_caption($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { captionLayout, months, monthFormat, years, yearFormat, month, locale, placeholder = void 0, monthIndex = 0 } = $$props;
		function formatYear(date) {
			const dateObj = date.toDate(getLocalTimeZone());
			if (typeof yearFormat === "function") return yearFormat(dateObj.getFullYear());
			return new DateFormatter(locale, { year: yearFormat }).format(dateObj);
		}
		function formatMonth(date) {
			const dateObj = date.toDate(getLocalTimeZone());
			if (typeof monthFormat === "function") return monthFormat(dateObj.getMonth() + 1);
			return new DateFormatter(locale, { month: monthFormat }).format(dateObj);
		}
		function MonthSelect($$renderer) {
			Calendar_month_select($$renderer, {
				months,
				monthFormat,
				value: month.month,
				onchange: (e) => {
					if (!placeholder) return;
					const v = Number.parseInt(e.currentTarget.value);
					placeholder = placeholder.set({ month: v }).subtract({ months: monthIndex });
				}
			});
		}
		function YearSelect($$renderer) {
			Calendar_year_select($$renderer, {
				years,
				yearFormat,
				value: month.year
			});
		}
		if (captionLayout === "dropdown") {
			$$renderer.push("<!--[0-->");
			MonthSelect($$renderer);
			$$renderer.push(`<!----> `);
			YearSelect($$renderer);
			$$renderer.push(`<!---->`);
		} else if (captionLayout === "dropdown-months") {
			$$renderer.push("<!--[1-->");
			MonthSelect($$renderer);
			$$renderer.push(`<!----> `);
			if (placeholder) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`${escape_html(formatYear(placeholder))}`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else if (captionLayout === "dropdown-years") {
			$$renderer.push("<!--[2-->");
			if (placeholder) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`${escape_html(formatMonth(placeholder))}`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			YearSelect($$renderer);
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html(formatMonth(month))} ${escape_html(formatYear(month))}`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { placeholder });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/popover/popover-content.svelte
function Popover_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, sideOffset = 4, align = "center", portalProps, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Portal) {
				$$renderer.push("<!--[-->");
				Portal($$renderer, spread_props([portalProps, {
					children: ($$renderer) => {
						if (Popover_content$1) {
							$$renderer.push("<!--[-->");
							Popover_content$1($$renderer, spread_props([
								{
									"data-slot": "popover-content",
									sideOffset,
									align,
									class: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--bits-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden", className)
								},
								restProps,
								{
									get ref() {
										return ref;
									},
									set ref($$value) {
										ref = $$value;
										$$settled = false;
									}
								}
							]));
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				}]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/popover/popover-trigger.svelte
function Popover_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Popover_trigger$1) {
				$$renderer.push("<!--[-->");
				Popover_trigger$1($$renderer, spread_props([
					{
						"data-slot": "popover-trigger",
						class: cn("", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/popover/index.js
var Root = Popover;
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/utils/asset-actions.js
/**
* Copy a URL to the clipboard, showing a toast on success/failure.
*/
async function copyUrlToClipboard(url) {
	try {
		const shareableUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
		await navigator.clipboard.writeText(shareableUrl);
		toast.success("URL copied to clipboard");
		return true;
	} catch {
		toast.error("Failed to copy URL");
		return false;
	}
}
/**
* Download a file by programmatically creating and clicking an anchor element.
*/
function downloadFile(url, filename) {
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/components/admin/MediaBrowser.svelte
function MediaBrowser($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** When true, shows a "Select" button for picking an asset */
		/** When true, allows selecting multiple assets (used with selectable) */
		/** Callback when an asset is selected (single select mode) */
		/** Callback when multiple assets are selected (multi select mode) */
		/** Filter to specific asset type */
		/** Number of assets per page */
		/** Whether this tab is currently active (triggers refetch when becoming active) */
		/** Asset IDs already in use (shown with a tick indicator) */
		let { selectable = false, multiSelect = false, onSelect, onSelectMultiple, assetTypeFilter, pageSize = 30, active = true, existingAssetIds } = $$props;
		let assetList = [];
		let loading = false;
		let searchQuery = "";
		let sortOrder = "newest";
		const perms = usePermissions();
		const canUpload = derived(() => perms.can("asset.upload"));
		const canDeleteAssets = derived(() => perms.can("asset.delete"));
		let selectedAsset = null;
		let lightboxOpen = false;
		let currentPage = 1;
		let totalPages = 1;
		let totalAssets = 0;
		let showUploadModal = false;
		let uploadQueue = [];
		let editTitle = "";
		let editDescription = "";
		let editAlt = "";
		let editCreditLine = "";
		let isSaving = false;
		let selectedIds = (() => selectable && multiSelect && existingAssetIds ? new Set(existingAssetIds) : /* @__PURE__ */ new Set())();
		let isBulkDeleting = false;
		const isSelectMode = derived(() => selectable && multiSelect);
		let referenceCounts = {};
		let selectedRefCount = 0;
		let searchTimeout;
		function handleSearchInput(value) {
			searchQuery = value;
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => {
				currentPage = 1;
				fetchAssets();
			}, 300);
		}
		async function fetchAssets(page = currentPage) {
			loading = true;
			try {
				const offset = (page - 1) * pageSize;
				const result = await assets.list({
					assetType: assetTypeFilter,
					search: searchQuery || void 0,
					limit: pageSize,
					offset
				});
				if (result.success && result.data) {
					assetList = result.data;
					currentPage = page;
					if (result.pagination) {
						totalPages = result.pagination.totalPages;
						totalAssets = result.pagination.total;
					}
					if (!(selectable && multiSelect)) selectedIds = /* @__PURE__ */ new Set();
					fetchReferenceCounts(result.data.map((a) => a.id));
				}
			} catch {
				toast.error("Failed to fetch assets");
			} finally {
				loading = false;
			}
		}
		async function fetchReferenceCounts(assetIds) {
			if (assetIds.length === 0) return;
			try {
				const result = await assets.getReferenceCounts(assetIds);
				if (result.success && result.data) referenceCounts = {
					...referenceCounts,
					...result.data
				};
			} catch {
				toast.error("Failed to fetch reference counts");
			}
		}
		function isSystemAsset(asset) {
			const metadata = asset.metadata;
			return metadata?.system === true || metadata?.fieldPath === "user.image" || metadata?.fieldPath === "organization.metadata.logo";
		}
		function sortAssets(list) {
			const sorted = [...list];
			switch (sortOrder) {
				case "newest": return sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
				case "oldest": return sorted.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
				case "name-asc": return sorted.sort((a, b) => a.originalFilename.localeCompare(b.originalFilename));
				case "name-desc": return sorted.sort((a, b) => b.originalFilename.localeCompare(a.originalFilename));
				default: return sorted;
			}
		}
		const pinnedAssets = derived(() => {
			if (!(selectable && multiSelect && existingAssetIds && existingAssetIds.size > 0)) return [];
			return assetList.filter((a) => !isSystemAsset(a) && existingAssetIds.has(a.id));
		});
		const sortedAssets = derived(() => {
			const visibleAssets = assetList.filter((a) => !isSystemAsset(a));
			if (selectable && multiSelect && existingAssetIds && existingAssetIds.size > 0) return sortAssets(visibleAssets.filter((a) => !existingAssetIds.has(a.id)));
			return sortAssets(visibleAssets);
		});
		derived(() => sortedAssets().length > 0 && sortedAssets().every((a) => selectedIds.has(a.id)));
		function toggleSelect(id) {
			const next = new SvelteSet(selectedIds);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			selectedIds = next;
		}
		function confirmMultiSelect() {
			if (onSelectMultiple) {
				const selected = assetList.filter((a) => selectedIds.has(a.id));
				onSelectMultiple(selected);
				selectedIds = /* @__PURE__ */ new Set();
			}
		}
		async function bulkDelete() {
			if (selectedIds.size === 0) return;
			const idsToCheck = [...selectedIds];
			try {
				const result = await assets.getReferenceCounts(idsToCheck);
				if (result.success && result.data) referenceCounts = {
					...referenceCounts,
					...result.data
				};
			} catch {
				toast.error("Failed to check references");
			}
			const referencedAssets = idsToCheck.filter((id) => (referenceCounts[id] || 0) > 0);
			if (referencedAssets.length > 0) {
				toast.error(`Cannot delete ${referencedAssets.length} asset${referencedAssets.length > 1 ? "s" : ""} — still referenced by documents. Remove the references first.`);
				return;
			}
			const count = selectedIds.size;
			if (!await confirmDialog({
				title: `Delete ${count} asset${count > 1 ? "s" : ""}?`,
				description: "This cannot be undone.",
				confirmText: "Delete",
				variant: "destructive"
			})) return;
			isBulkDeleting = true;
			try {
				if ((await assets.deleteBulk([...selectedIds])).success) {
					if (selectedAsset && selectedIds.has(selectedAsset.id)) selectedAsset = null;
					selectedIds = /* @__PURE__ */ new Set();
					await fetchAssets();
				}
			} catch {
				toast.error("Failed to delete assets");
			} finally {
				isBulkDeleting = false;
			}
		}
		function closeAssetDetail() {
			selectedAsset = null;
		}
		async function saveMetadata() {
			if (!selectedAsset) return;
			isSaving = true;
			try {
				const result = await assets.update(selectedAsset.id, {
					title: editTitle || void 0,
					description: void 0,
					alt: editAlt || void 0,
					creditLine: editCreditLine || void 0
				});
				if (result.success && result.data) {
					assetList = assetList.map((a) => a.id === selectedAsset.id ? result.data : a);
					selectedAsset = result.data;
				}
			} catch {
				toast.error("Failed to save metadata");
			} finally {
				isSaving = false;
			}
		}
		async function deleteAsset(asset) {
			try {
				const result = await assets.getReferenceCounts([asset.id]);
				if (result.success && result.data) referenceCounts = {
					...referenceCounts,
					...result.data
				};
			} catch {}
			const refCount = referenceCounts[asset.id] || 0;
			if (refCount > 0) {
				toast.error(`Cannot delete "${asset.originalFilename}" — referenced by ${refCount} document${refCount > 1 ? "s" : ""}. Remove the references first.`);
				return;
			}
			if (!await confirmDialog({
				title: "Delete asset?",
				description: `"${asset.originalFilename}" will be permanently deleted. This cannot be undone.`,
				confirmText: "Delete",
				variant: "destructive"
			})) return;
			try {
				if ((await assets.delete(asset.id)).success) {
					if (selectedAsset?.id === asset.id) selectedAsset = null;
					await fetchAssets();
				}
			} catch {
				toast.error("Failed to delete asset");
			}
		}
		let copiedUrl = false;
		async function copyAssetUrl(asset) {
			if (await copyUrlToClipboard(getThumbnailUrl(asset))) {
				copiedUrl = true;
				setTimeout(() => copiedUrl = false, 2e3);
			}
		}
		function downloadAsset(asset) {
			downloadFile(getThumbnailUrl(asset), asset.originalFilename);
		}
		function formatSize(bytes) {
			if (bytes < 1024) return `${bytes} B`;
			if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} kB`;
			return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
		}
		function formatDate(date) {
			if (!date) return "";
			return new Date(date).toLocaleDateString("en-US", {
				month: "2-digit",
				day: "2-digit",
				year: "numeric"
			});
		}
		function getThumbnailUrl(asset) {
			return asset.url || `/media/${asset.id}/${asset.filename}`;
		}
		function isImage(asset) {
			return asset.assetType === "image" || asset.mimeType.startsWith("image/");
		}
		const visiblePages = derived(() => {
			const pages = [];
			if (totalPages <= 7) for (let i = 1; i <= totalPages; i++) pages.push(i);
			else {
				pages.push(1);
				if (currentPage > 3) pages.push("...");
				const start = Math.max(2, currentPage - 1);
				const end = Math.min(totalPages - 1, currentPage + 1);
				for (let i = start; i <= end; i++) pages.push(i);
				if (currentPage < totalPages - 2) pages.push("...");
				pages.push(totalPages);
			}
			return pages;
		});
		const sortLabel = derived(() => "Last created: Newest first");
		function failed($$renderer, error, reset) {
			$$renderer.push(`<div class="border-destructive/30 bg-destructive/5 rounded-md border p-4 text-center"><p class="text-destructive font-medium">Media browser encountered an error</p> <p class="text-muted-foreground mt-1 text-sm">${escape_html(error instanceof Error ? error.message : "Unknown error")}</p> <button class="bg-primary text-primary-foreground mt-3 rounded px-4 py-2 text-sm">Retry</button></div>`);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="flex h-full flex-col" role="region">`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="border-border flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4"><h2 class="text-base font-semibold sm:text-lg">Browse Assets</h2> `);
			if (canUpload()) {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					size: "sm",
					onclick: () => {
						showUploadModal = true;
						uploadQueue = [];
					},
					children: ($$renderer) => {
						Upload($$renderer, {
							size: 16,
							class: "sm:mr-2"
						});
						$$renderer.push(`<!----> <span class="hidden sm:inline">Upload assets</span>`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="border-border flex flex-wrap items-center gap-2 border-b px-4 py-2 sm:gap-3 sm:px-6 sm:py-3"><div class="relative min-w-0 flex-1 sm:w-48 sm:flex-none">`);
			Search($$renderer, {
				size: 14,
				class: "text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
			});
			$$renderer.push(`<!----> `);
			Input($$renderer, {
				placeholder: "Search",
				class: "h-8 pl-8 text-sm",
				value: searchQuery,
				oninput: (e) => handleSearchInput(e.target.value)
			});
			$$renderer.push(`<!----></div> `);
			if (totalAssets > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-muted-foreground hidden text-xs sm:inline">${escape_html((currentPage - 1) * pageSize + 1)}–${escape_html(Math.min(currentPage * pageSize, totalAssets))} of ${escape_html(totalAssets)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="hidden flex-1 sm:block"></div> <div class="hidden items-center gap-1.5 sm:flex"><span class="text-muted-foreground text-xs">Show</span> `);
			$$renderer.select({
				value: pageSize,
				onchange: (e) => {
					pageSize = parseInt(e.target.value);
					currentPage = 1;
					fetchAssets(1);
				},
				class: "border-input bg-background text-foreground h-7 rounded-md border px-1.5 text-xs"
			}, ($$renderer) => {
				$$renderer.option({ value: 10 }, ($$renderer) => {
					$$renderer.push(`10`);
				});
				$$renderer.option({ value: 20 }, ($$renderer) => {
					$$renderer.push(`20`);
				});
				$$renderer.option({ value: 30 }, ($$renderer) => {
					$$renderer.push(`30`);
				});
				$$renderer.option({ value: 50 }, ($$renderer) => {
					$$renderer.push(`50`);
				});
				$$renderer.option({ value: 100 }, ($$renderer) => {
					$$renderer.push(`100`);
				});
			});
			$$renderer.push(`</div> <div class="bg-muted flex items-center rounded-md p-0.5"><button${attr_class(`rounded p-1.5 ${stringify("bg-background shadow")}`)} title="Grid view">`);
			Grid_3x3($$renderer, { size: 14 });
			$$renderer.push(`<!----></button> <button${attr_class(`rounded p-1.5 ${stringify("text-muted-foreground")}`)} title="List view">`);
			List($$renderer, { size: 14 });
			$$renderer.push(`<!----></button></div> `);
			if (!selectable && canDeleteAssets()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button${attr_class(`rounded p-1.5 transition-colors ${stringify(isSelectMode() ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}`)}${attr("title", isSelectMode() ? "Exit select mode" : "Select multiple")}>`);
				Square_check_big($$renderer, { size: 14 });
				$$renderer.push(`<!----></button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <button class="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors sm:gap-1.5">`);
			Arrow_down_up($$renderer, { size: 14 });
			$$renderer.push(`<!----> <span class="hidden sm:inline">${escape_html(sortLabel())}</span></button></div> <div class="flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden"><div${attr_class(`min-h-0 flex-1 md:overflow-y-auto ${stringify(selectedAsset ? "hidden md:block" : "")}`)}>`);
			$$renderer.boundary({ failed }, ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				if (loading && assetList.length === 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex h-full items-center justify-center"><p class="text-muted-foreground">Loading assets...</p></div>`);
				} else if (sortedAssets().length === 0) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<div class="flex h-full flex-col items-center justify-center gap-4"><div class="bg-muted/50 flex h-16 w-16 items-center justify-center rounded-full">`);
					Image($$renderer, { class: "text-muted-foreground h-8 w-8" });
					$$renderer.push(`<!----></div> <div class="text-center"><h3 class="mb-1 font-medium">No assets found</h3> <p class="text-muted-foreground text-sm">${escape_html(searchQuery ? "Try a different search term" : "Upload your first asset to get started")}</p></div></div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					if (selectable && multiSelect) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="bg-muted border-border flex items-center gap-3 border-b px-4 py-2"><span class="text-sm font-medium">${escape_html(selectedIds.size)} selected</span> `);
						Button($$renderer, {
							variant: "default",
							size: "sm",
							onclick: confirmMultiSelect,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Done`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div>`);
					} else if (selectedIds.size > 0) {
						$$renderer.push("<!--[1-->");
						$$renderer.push(`<div class="bg-muted border-border flex items-center gap-3 border-b px-4 py-2"><span class="text-sm font-medium">${escape_html(selectedIds.size)} selected</span> `);
						if (canDeleteAssets()) {
							$$renderer.push("<!--[0-->");
							Button($$renderer, {
								variant: "destructive",
								size: "sm",
								onclick: bulkDelete,
								disabled: isBulkDeleting,
								children: ($$renderer) => {
									Trash_2($$renderer, {
										size: 14,
										class: "mr-1.5"
									});
									$$renderer.push(`<!----> ${escape_html(isBulkDeleting ? "Deleting..." : "Delete")}`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> <button class="text-muted-foreground hover:text-foreground text-sm transition-colors">Clear selection</button></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					{
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="grid grid-cols-2 gap-0.5 p-1 sm:grid-cols-5 xl:grid-cols-10"><!--[-->`);
						const each_array = ensure_array_like(pinnedAssets());
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let asset = each_array[$$index];
							$$renderer.push(`<button${attr_class(`group relative flex flex-col overflow-hidden rounded-sm transition-colors ${stringify(selectedIds.has(asset.id) ? "ring-primary ring-2" : selectedAsset?.id === asset.id ? "ring-primary ring-2" : "hover:bg-muted/50")}`)}><div class="bg-muted/30 relative aspect-square overflow-hidden">`);
							if (isImage(asset)) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<img${attr("src", getThumbnailUrl(asset))}${attr("alt", asset.alt || asset.originalFilename)} class="h-full w-full object-contain" loading="lazy"/>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="flex h-full items-center justify-center">`);
								File_text($$renderer, { class: "text-muted-foreground h-10 w-10" });
								$$renderer.push(`<!----></div>`);
							}
							$$renderer.push(`<!--]--> `);
							if (isSelectMode() && !selectable) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="absolute top-1.5 left-1.5">`);
								Checkbox($$renderer, {
									checked: selectedIds.has(asset.id),
									onCheckedChange: () => toggleSelect(asset.id),
									onclick: (e) => e.stopPropagation()
								});
								$$renderer.push(`<!----></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div class="p-1.5"><p class="text-muted-foreground truncate text-xs">${escape_html(asset.originalFilename)}</p></div></button>`);
						}
						$$renderer.push(`<!--]--> <!--[-->`);
						const each_array_1 = ensure_array_like(sortedAssets());
						for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
							let asset = each_array_1[$$index_1];
							$$renderer.push(`<button${attr_class(`group relative flex flex-col overflow-hidden rounded-sm transition-colors ${stringify(selectedIds.has(asset.id) ? "ring-primary ring-2" : selectedAsset?.id === asset.id ? "ring-primary ring-2" : "hover:bg-muted/50")}`)}><div class="bg-muted/30 relative aspect-square overflow-hidden">`);
							if (isImage(asset)) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<img${attr("src", getThumbnailUrl(asset))}${attr("alt", asset.alt || asset.originalFilename)} class="h-full w-full object-contain" loading="lazy"/>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="flex h-full items-center justify-center">`);
								File_text($$renderer, { class: "text-muted-foreground h-10 w-10" });
								$$renderer.push(`<!----></div>`);
							}
							$$renderer.push(`<!--]--> `);
							if (selectable) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div role="button" tabindex="0" class="bg-background/80 absolute top-1.5 right-1.5 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100" title="View details"><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>`);
							} else if (isSelectMode()) {
								$$renderer.push("<!--[1-->");
								$$renderer.push(`<div class="absolute top-1.5 left-1.5">`);
								Checkbox($$renderer, {
									checked: selectedIds.has(asset.id),
									onCheckedChange: () => toggleSelect(asset.id),
									onclick: (e) => e.stopPropagation()
								});
								$$renderer.push(`<!----></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div class="p-1.5"><p class="text-muted-foreground truncate text-xs">${escape_html(asset.originalFilename)}</p></div></button>`);
						}
						$$renderer.push(`<!--]--></div> `);
						if (totalPages > 1) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<div class="border-border flex items-center justify-center gap-1 border-t px-4 py-3"><button${attr("disabled", currentPage <= 1 || loading, true)} class="hover:bg-muted rounded p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-30">`);
							Chevron_left($$renderer, { size: 16 });
							$$renderer.push(`<!----></button> <!--[-->`);
							const each_array_2 = ensure_array_like(visiblePages());
							for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
								let pg = each_array_2[$$index_2];
								if (pg === "...") {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<span class="text-muted-foreground px-1.5 text-sm">...</span>`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<button${attr("disabled", loading, true)}${attr_class(`min-w-[32px] rounded px-2 py-1 text-sm font-medium transition-colors ${stringify(pg === currentPage ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground")}`)}>${escape_html(pg)}</button>`);
								}
								$$renderer.push(`<!--]-->`);
							}
							$$renderer.push(`<!--]--> <button${attr("disabled", currentPage >= totalPages || loading, true)} class="hover:bg-muted rounded p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-30">`);
							Chevron_right($$renderer, { size: 16 });
							$$renderer.push(`<!----></button></div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]-->`);
				$$renderer.push(`<!--]-->`);
			});
			$$renderer.push(`</div> `);
			if (selectedAsset) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="bg-background border-border flex flex-col border-t md:w-[350px] md:shrink-0 md:overflow-y-auto md:border-t-0 md:border-l"><div class="border-border flex items-center justify-between border-b px-4 py-3"><button class="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors md:hidden">`);
				Chevron_left($$renderer, { size: 16 });
				$$renderer.push(`<!----> Back</button> <p class="min-w-0 flex-1 truncate pl-2 text-sm font-medium md:pl-0"${attr("title", selectedAsset.originalFilename)}>${escape_html(selectedAsset.originalFilename)}</p> <div class="flex items-center gap-1">`);
				if (!selectable && canDeleteAssets()) {
					$$renderer.push("<!--[0-->");
					Button($$renderer, {
						variant: "ghost",
						size: "sm",
						class: "h-7 w-7 p-0",
						onclick: () => deleteAsset(selectedAsset),
						title: "Delete asset",
						children: ($$renderer) => {
							Trash_2($$renderer, {
								size: 14,
								class: "text-destructive"
							});
						},
						$$slots: { default: true }
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				Button($$renderer, {
					variant: "ghost",
					size: "sm",
					class: "hidden h-7 w-7 p-0 md:flex",
					onclick: closeAssetDetail,
					title: "Close",
					children: ($$renderer) => {
						X($$renderer, { size: 14 });
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div></div> `);
				if (selectable && !multiSelect && onSelect) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="border-border border-b px-4 py-2">`);
					Button($$renderer, {
						size: "sm",
						class: "w-full",
						onclick: () => {
							if (selectedAsset && onSelect) onSelect(selectedAsset);
						},
						children: ($$renderer) => {
							$$renderer.push(`<!---->Select`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="p-4 pb-0">`);
				if (isImage(selectedAsset)) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<button class="bg-muted/30 mb-3 w-full cursor-zoom-in overflow-hidden rounded-lg" title="Click to enlarge"><img${attr("src", getThumbnailUrl(selectedAsset))}${attr("alt", selectedAsset.alt || selectedAsset.originalFilename)} class="w-full object-contain" style="max-height: 200px;"/></button>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="bg-muted/30 mb-3 flex h-28 items-center justify-center overflow-hidden rounded-lg">`);
					File_text($$renderer, { class: "text-muted-foreground h-12 w-12" });
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]--></div> <div class="border-border flex border-b"><button${attr_class(`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${stringify("border-foreground text-foreground border-b-2")}`)}>Details</button> <button${attr_class(`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${stringify("text-muted-foreground hover:text-foreground")}`)}>References (${escape_html(selectedRefCount)})</button></div> <div class="flex-1 overflow-y-auto p-4">`);
				{
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="mb-4 space-y-2 text-sm"><div class="flex justify-between"><span class="text-muted-foreground">Filename</span> <span class="max-w-[180px] truncate font-medium"${attr("title", selectedAsset.originalFilename)}>${escape_html(selectedAsset.originalFilename)}</span></div> <div class="flex justify-between"><span class="text-muted-foreground">Type</span> <span>${escape_html(selectedAsset.mimeType)}</span></div> <div class="flex justify-between"><span class="text-muted-foreground">Size</span> <span>${escape_html(formatSize(selectedAsset.size))}</span></div> `);
					if (selectedAsset.width && selectedAsset.height) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="flex justify-between"><span class="text-muted-foreground">Dimensions</span> <span>${escape_html(selectedAsset.width)} x ${escape_html(selectedAsset.height)}</span></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="flex justify-between"><span class="text-muted-foreground">Uploaded</span> <span>${escape_html(formatDate(selectedAsset.createdAt))}</span></div></div> <div class="mb-4 flex gap-2">`);
					Button($$renderer, {
						variant: "outline",
						size: "sm",
						class: "flex-1",
						onclick: () => downloadAsset(selectedAsset),
						children: ($$renderer) => {
							Download($$renderer, {
								size: 14,
								class: "mr-1.5"
							});
							$$renderer.push(`<!----> Download`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						variant: "outline",
						size: "sm",
						class: "flex-1",
						onclick: () => copyAssetUrl(selectedAsset),
						children: ($$renderer) => {
							Link($$renderer, {
								size: 14,
								class: "mr-1.5"
							});
							$$renderer.push(`<!----> ${escape_html(copiedUrl ? "Copied!" : "Copy URL")}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> `);
					Separator($$renderer, { class: "my-4" });
					$$renderer.push(`<!----> <div class="space-y-3"><div>`);
					Label($$renderer, {
						for: "asset-title",
						class: "text-xs",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Title`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Input($$renderer, {
						id: "asset-title",
						class: "mt-1 h-8 text-sm",
						placeholder: "Asset title",
						get value() {
							return editTitle;
						},
						set value($$value) {
							editTitle = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----></div> <div>`);
					Label($$renderer, {
						for: "asset-description",
						class: "text-xs",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Description`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> <textarea id="asset-description" class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none" rows="2" placeholder="Description">`);
					const $$body = escape_html(editDescription);
					if ($$body) $$renderer.push(`${$$body}`);
					$$renderer.push(`</textarea></div> <div>`);
					Label($$renderer, {
						for: "asset-alt",
						class: "text-xs",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Alt text`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Input($$renderer, {
						id: "asset-alt",
						class: "mt-1 h-8 text-sm",
						placeholder: "Alternative text",
						get value() {
							return editAlt;
						},
						set value($$value) {
							editAlt = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----></div> <div>`);
					Label($$renderer, {
						for: "asset-credit",
						class: "text-xs",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Credit line`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Input($$renderer, {
						id: "asset-credit",
						class: "mt-1 h-8 text-sm",
						placeholder: "Credit / attribution",
						get value() {
							return editCreditLine;
						},
						set value($$value) {
							editCreditLine = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----></div> `);
					Button($$renderer, {
						onclick: saveMetadata,
						disabled: isSaving,
						size: "sm",
						class: "w-full",
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(isSaving ? "Saving..." : "Save changes")}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> `);
			if (selectedAsset && isImage(selectedAsset)) {
				$$renderer.push("<!--[0-->");
				if (Root$1) {
					$$renderer.push("<!--[-->");
					Root$1($$renderer, {
						get open() {
							return lightboxOpen;
						},
						set open($$value) {
							lightboxOpen = $$value;
							$$settled = false;
						},
						children: ($$renderer) => {
							if (Dialog_content) {
								$$renderer.push("<!--[-->");
								Dialog_content($$renderer, {
									showCloseButton: false,
									class: "!z-[10000] flex max-h-[90vh] max-w-[90vw] flex-col overflow-hidden p-0 sm:max-w-[90vw]",
									overlayClass: "!z-[9999]",
									children: ($$renderer) => {
										if (Dialog_header) {
											$$renderer.push("<!--[-->");
											Dialog_header($$renderer, {
												class: "border-border border-b px-4 py-3",
												children: ($$renderer) => {
													if (Dialog_title) {
														$$renderer.push("<!--[-->");
														Dialog_title($$renderer, {
															class: "truncate text-sm font-medium",
															children: ($$renderer) => {
																$$renderer.push(`<!---->${escape_html(selectedAsset.originalFilename)}`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
										$$renderer.push(` <div class="flex flex-1 items-center justify-center overflow-hidden p-4"><img${attr("src", getThumbnailUrl(selectedAsset))}${attr("alt", selectedAsset.alt || selectedAsset.originalFilename)} class="max-h-[70vh] max-w-full object-contain"/></div> <div class="border-border flex items-center justify-between border-t px-4 py-3"><div class="flex items-center gap-2">`);
										Button($$renderer, {
											variant: "outline",
											size: "sm",
											onclick: () => downloadAsset(selectedAsset),
											children: ($$renderer) => {
												Download($$renderer, {
													size: 14,
													class: "mr-1.5"
												});
												$$renderer.push(`<!----> Download`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Button($$renderer, {
											variant: "outline",
											size: "sm",
											onclick: () => copyAssetUrl(selectedAsset),
											children: ($$renderer) => {
												Link($$renderer, {
													size: 14,
													class: "mr-1.5"
												});
												$$renderer.push(`<!----> ${escape_html(copiedUrl ? "Copied!" : "Copy URL")}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></div> `);
										Button($$renderer, {
											variant: "outline",
											size: "sm",
											onclick: () => lightboxOpen = false,
											children: ($$renderer) => {
												$$renderer.push(`<!---->Close`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></div>`);
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						},
						$$slots: { default: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (Root$1) {
				$$renderer.push("<!--[-->");
				Root$1($$renderer, {
					onOpenChange: (v) => {
						if (!v && true) showUploadModal = false;
					},
					get open() {
						return showUploadModal;
					},
					set open($$value) {
						showUploadModal = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						if (Dialog_content) {
							$$renderer.push("<!--[-->");
							Dialog_content($$renderer, {
								class: "!z-[10000] max-w-lg",
								overlayClass: "!z-[9999]",
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Upload Assets`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` <div${attr_class(`border-border mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${stringify("hover:bg-muted/50")}`)} role="button" tabindex="0">`);
									File_image($$renderer, {
										size: 32,
										class: "text-muted-foreground mb-3"
									});
									$$renderer.push(`<!----> <p class="text-sm font-medium">${escape_html("Drag and drop files here")}</p> <p class="text-muted-foreground mt-1 text-xs">or click to browse</p></div> <input type="file" multiple="" accept="image/*,.pdf,.txt" class="hidden"/> `);
									if (uploadQueue.length > 0) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="mt-4 max-h-48 space-y-2 overflow-y-auto"><!--[-->`);
										const each_array_6 = ensure_array_like(uploadQueue);
										for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
											let item = each_array_6[$$index_6];
											$$renderer.push(`<div class="border-border flex items-center gap-3 rounded-md border px-3 py-2"><div class="min-w-0 flex-1"><p class="truncate text-sm">${escape_html(item.file.name)}</p> <p class="text-muted-foreground text-xs">${escape_html(formatSize(item.file.size))}</p></div> `);
											if (item.status === "uploading") {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<div class="border-primary h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-t-transparent"></div>`);
											} else if (item.status === "done") {
												$$renderer.push("<!--[1-->");
												Circle_check($$renderer, {
													size: 16,
													class: "shrink-0 text-green-500"
												});
											} else if (item.status === "failed") {
												$$renderer.push("<!--[2-->");
												Circle_alert($$renderer, {
													size: 16,
													class: "text-destructive shrink-0"
												});
											} else {
												$$renderer.push("<!--[-1-->");
												$$renderer.push(`<div class="bg-muted h-4 w-4 shrink-0 rounded-full"></div>`);
											}
											$$renderer.push(`<!--]--></div>`);
										}
										$$renderer.push(`<!--]--></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/utils/pluralize.js
/**
* Simple English pluralization.
* Handles common patterns: y→ies, s/sh/ch/x/z→es, otherwise appends s.
*/
function pluralize(word) {
	if (!word) return word;
	if (/[sxz]$/i.test(word) || /[sc]h$/i.test(word)) return word + "es";
	if (/[^aeiou]y$/i.test(word)) return word.slice(0, -1) + "ies";
	return word + "s";
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/document-refresh.svelte.js
var versions = new SvelteMap();
function notifyDocumentChanged(documentId) {
	if (!documentId) return;
	versions.set(documentId, (versions.get(documentId) ?? 0) + 1);
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/save-state-context.svelte.js
var SAVE_STATE_KEY = Symbol("aphex-save-state");
function setSaveStateContext(state) {
	setContext(SAVE_STATE_KEY, state);
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/components/admin/AdminSlot.svelte
function AdminSlot($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { name, id, order = 0, children } = $$props;
		useAdminSlots();
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/components/admin/ScheduleDialog.svelte
function ScheduleDialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* The action to schedule. Derived from the editor's active perspective by the caller:
		* viewing the Draft tab → 'publish' (send this draft live later); viewing the Published
		* tab → 'unpublish' (take it down later). No in-dialog toggle — the tab is the intent.
		*/
		let { open = void 0, documentId, action, onScheduled } = $$props;
		let dateValue = void 0;
		let timeStr = "09:00";
		let pickerOpen = false;
		let submitting = false;
		const actionVerb = derived(() => action === "publish" ? "Publish" : "Unpublish");
		const minDate = today(getLocalTimeZone());
		const tzLabel = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(/* @__PURE__ */ new Date()).find((p) => p.type === "timeZoneName")?.value ?? "";
		/** Combine the picked calendar date + time into a local Date floored to the minute. */
		function buildRunAt() {
			if (!dateValue) return null;
			const [h, m] = timeStr.split(":").map(Number);
			const d = new Date(dateValue.year, dateValue.month - 1, dateValue.day, h ?? 0, m ?? 0, 0, 0);
			return Number.isNaN(d.getTime()) ? null : d;
		}
		const runAtPreview = derived(buildRunAt);
		const fieldLabel = derived(() => runAtPreview() ? runAtPreview().toLocaleString(void 0, {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit"
		}) : "Select date and time");
		async function submit() {
			const runAt = buildRunAt();
			if (!runAt) {
				toast.error("Pick a date and time");
				return;
			}
			runAt.setSeconds(0, 0);
			const currentMinute = /* @__PURE__ */ new Date();
			currentMinute.setSeconds(0, 0);
			if (runAt.getTime() < currentMinute.getTime()) {
				toast.error("Pick a time in the future");
				return;
			}
			submitting = true;
			try {
				const res = await documents.schedule(documentId, {
					action,
					runAt: runAt.toISOString()
				});
				if (res.success) {
					toast.success(`${action === "publish" ? "Publish" : "Unpublish"} scheduled for ${runAt.toLocaleString()}`);
					open = false;
					if (res.data) onScheduled?.(res.data);
				} else toast.error(res.error || res.message || "Failed to schedule");
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to schedule");
			} finally {
				submitting = false;
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Root$1) {
				$$renderer.push("<!--[-->");
				Root$1($$renderer, {
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						if (Dialog_content) {
							$$renderer.push("<!--[-->");
							Dialog_content($$renderer, {
								class: "max-w-md",
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Schedule ${escape_html(actionVerb())}`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
												$$renderer.push(` `);
												if (Dialog_description) {
													$$renderer.push("<!--[-->");
													Dialog_description($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Select when this document should be ${escape_html(action === "publish" ? "published" : "unpublished")}.`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` <div class="space-y-4 py-2"><div class="space-y-1.5">`);
									Label($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Schedule on`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									if (Root) {
										$$renderer.push("<!--[-->");
										Root($$renderer, {
											get open() {
												return pickerOpen;
											},
											set open($$value) {
												pickerOpen = $$value;
												$$settled = false;
											},
											children: ($$renderer) => {
												if (Popover_trigger) {
													$$renderer.push("<!--[-->");
													Popover_trigger($$renderer, {
														class: "border-input bg-background hover:bg-muted/40 focus-visible:ring-ring flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm focus-visible:ring-1 focus-visible:outline-none",
														children: ($$renderer) => {
															$$renderer.push(`<span>${escape_html(fieldLabel())}</span> `);
															Calendar($$renderer, { class: "text-muted-foreground h-4 w-4" });
															$$renderer.push(`<!---->`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
												$$renderer.push(` `);
												if (Popover_content) {
													$$renderer.push("<!--[-->");
													Popover_content($$renderer, {
														class: "z-[70] w-[19rem] p-0",
														align: "start",
														children: ($$renderer) => {
															Calendar_1($$renderer, {
																type: "single",
																minValue: minDate,
																class: "w-full rounded-b-none [--cell-size:2.4rem]",
																get value() {
																	return dateValue;
																},
																set value($$value) {
																	dateValue = $$value;
																	$$settled = false;
																}
															});
															$$renderer.push(`<!----> <div class="border-rule flex flex-wrap items-center gap-x-2 gap-y-1 border-t p-3"><input type="time"${attr("value", timeStr)} class="border-input bg-background focus-visible:ring-ring rounded-md border px-2 py-1 text-sm focus-visible:ring-1 focus-visible:outline-none"/> <button type="button" class="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline">Set to current time</button> <span class="text-muted-foreground ml-auto flex items-center gap-1 text-xs">`);
															Globe($$renderer, { class: "h-3 w-3" });
															$$renderer.push(`<!----> ${escape_html(tzLabel)}</span></div>`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(`</div></div> `);
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													variant: "ghost",
													size: "sm",
													onclick: () => open = false,
													disabled: submitting,
													children: ($$renderer) => {
														$$renderer.push(`<!---->Cancel`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> `);
												Button($$renderer, {
													size: "sm",
													onclick: submit,
													disabled: submitting,
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(submitting ? "Scheduling…" : "Schedule")}`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!---->`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { open });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/richtext-context.svelte.js
var KEY = Symbol("aphex:richtext-editors");
function setRichtextEditorRegistry() {
	const registry = /* @__PURE__ */ new Map();
	setContext(KEY, registry);
	return registry;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/components/admin/DocumentEditor.svelte
function parsedValue($$renderer, key, val, depth) {
	if (val && typeof val === "object") {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<details class="my-0.5"${attr("open", depth < 2, true)}><summary class="cursor-pointer text-xs leading-relaxed">`);
		if (key !== null) {
			$$renderer.push("<!--[0-->");
			if (typeof key === "number" || /^\d+$/.test(String(key))) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-purple-400">${escape_html(key)}:</span>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<span class="text-blue-400">${escape_html(key)}:</span>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (Array.isArray(val)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-muted-foreground">[...] ${escape_html(val.length)} ${escape_html(val.length === 1 ? "item" : "items")}</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-muted-foreground">{...} ${escape_html(Object.keys(val).length)}
						${escape_html(Object.keys(val).length === 1 ? "property" : "properties")}</span>`);
		}
		$$renderer.push(`<!--]--></summary> <div class="border-rule/50 ml-4 border-l pl-3">`);
		if (Array.isArray(val)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(val);
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let item = each_array_1[i];
				parsedValue($$renderer, String(i), item, depth + 1);
			}
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_2 = ensure_array_like(Object.entries(val));
			for (let $$index_7 = 0, $$length = each_array_2.length; $$index_7 < $$length; $$index_7++) {
				let [k, v] = each_array_2[$$index_7];
				parsedValue($$renderer, k, v, depth + 1);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></details>`);
	} else {
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<div class="my-0.5 text-xs leading-relaxed">`);
		if (key !== null) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-blue-400">${escape_html(key)}:</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (typeof val === "string") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-yellow-500">${escape_html(val)}</span>`);
		} else if (typeof val === "number") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<span class="text-green-400">${escape_html(val)}</span>`);
		} else if (typeof val === "boolean") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<span class="text-orange-400">${escape_html(val)}</span>`);
		} else if (val === null || val === void 0) {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<span class="text-red-400">null</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-muted-foreground">${escape_html(JSON.stringify(val))}</span>`);
		}
		$$renderer.push(`<!--]--></div>`);
	}
	$$renderer.push(`<!--]-->`);
}
function DocumentEditor($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** When set, the close control renders as a labelled "← {backLabel}" button
		*  instead of a bare close (✕) icon — used for reference editors so the action
		*  reads as "go back" rather than "close". */
		/** When true, the host has hidden side panels — show a Minimize toggle. */
		/** Toggle host-driven focus mode. Omit to hide the focus button entirely. */
		/** When true, split the editor with a live preview iframe on the right. */
		/**
		* Bump this to ask the preview iframe to re-fetch its server-loaded data
		* (`aphex:refresh` → `invalidateAll` in the overlay). Used when a *different*
		* document — e.g. one this page renders in a list — was edited elsewhere.
		*/
		/** Toggle host-driven presentation mode. Omit to hide the button entirely. */
		/** Organization ID from the host context — used as fallback for new docs that haven't been saved yet. */
		/** Build-time plugins; their document-action parts render in the toolbar. */
		let { schemas, documentType, documentId, isCreating, onBack, backLabel, onSaved, onAutoSaved, onDeleted, onPublished, onUnpublished, onRestored, onOpenReference, onOpenVersionHistory, externalVersionPreview = null, isReadOnly = false, focusMode = false, onToggleFocus, presentationMode = false, refreshToken = 0, onTogglePresentation, organizationId = null, plugins = [] } = $$props;
		setSchemaContext(schemas);
		setRichtextEditorRegistry();
		const perms = usePermissions();
		const canCreate = derived(() => !isReadOnly && perms.can("document.create"));
		const canUpdate = derived(() => !isReadOnly && perms.can("document.update"));
		const canDelete = derived(() => !isReadOnly && perms.can("document.delete"));
		const canPublishDoc = derived(() => !isReadOnly && perms.can("document.publish"));
		const canUnpublishDoc = derived(() => !isReadOnly && perms.can("document.unpublish"));
		derived(() => isCreating ? canCreate() : canUpdate());
		const isViewingReadOnly = derived(() => isReadOnly || !canCreate() && !canUpdate() && !canDelete() && !canPublishDoc() && !canUnpublishDoc());
		let schema = null;
		let documentData = {};
		let fullDocument = null;
		let saving = false;
		let saveError = null;
		let lastSaved = null;
		let publishSuccess = null;
		let perspective = "draft";
		let publishedData = null;
		const isViewingPublished = derived(() => perspective === "published");
		const scheduleAction = derived(() => perspective === "published" ? "unpublish" : "publish");
		const canScheduleNow = derived(() => scheduleAction() === "publish" ? canPublishDoc() : canUnpublishDoc());
		const pluginDocumentActions = derived(() => createPartResolver(plugins).documentActions({
			schemaName: documentType,
			capabilities: [...perms.capabilities],
			overrideAccess: perms.role === "super_admin" || perms.role === "admin"
		}));
		const documentActionContext = derived(() => null);
		function fieldRoleAllowed(list) {
			if (!list) return true;
			const role = perms.role;
			return role !== null && list.includes(role);
		}
		derived(() => new Set([].filter((f) => !fieldRoleAllowed(f.access?.read)).map((f) => f.name)));
		let showInspect = false;
		let fieldsWidth = 500;
		let previewViewport = "desktop";
		let previewZoom = 1;
		const frameStyle = derived(() => {
			return "";
		});
		const resolvedPreviewUrl = derived(() => {
			return null;
		});
		const iframeUrl = derived(() => {
			if (!resolvedPreviewUrl()) return null;
			const base = typeof window !== "undefined" ? window.location.origin : void 0;
			let u;
			try {
				u = new URL(resolvedPreviewUrl(), base);
			} catch {
				return resolvedPreviewUrl();
			}
			if (perspective === "published") u.searchParams.delete("aphex-preview");
			return u.toString();
		});
		let showHeaderMenu = false;
		let showScheduleDialog = false;
		let scheduledJobs = [];
		const nextSchedule = derived(() => [...scheduledJobs].sort((a, b) => new Date(a.runAt).getTime() - new Date(b.runAt).getTime())[0] ?? null);
		async function loadSchedule() {
			if (!documentId) {
				scheduledJobs = [];
				return;
			}
			try {
				const res = await documents.getSchedule(documentId);
				scheduledJobs = res.success ? res.data ?? [] : [];
			} catch {
				scheduledJobs = [];
			}
		}
		function onScheduleCreated(job) {
			scheduledJobs = [job];
			loadSchedule();
		}
		let previewingVersion = null;
		const activePreview = derived(() => externalVersionPreview || previewingVersion);
		const isPreviewingVersion = derived(() => !!activePreview());
		let now = Date.now();
		function timeAgo(date) {
			const seconds = Math.floor((now - date.getTime()) / 1e3);
			if (seconds < 5) return "just now";
			if (seconds < 60) return `${seconds}s ago`;
			const minutes = Math.floor(seconds / 60);
			if (minutes < 60) return `${minutes}m ago`;
			const hours = Math.floor(minutes / 60);
			if (hours < 24) return `${hours}h ago`;
			return date.toLocaleDateString();
		}
		const savedAgoText = derived(() => lastSaved ? `Saved ${timeAgo(lastSaved)}` : null);
		function timeUntil(date) {
			const seconds = Math.floor((date.getTime() - now) / 1e3);
			if (seconds <= 0) return "now";
			if (seconds < 60) return `in ${seconds}s`;
			const minutes = Math.floor(seconds / 60);
			if (minutes < 60) return `in ${minutes}m`;
			const hours = Math.floor(minutes / 60);
			if (hours < 24) return `in ${hours}h`;
			return `in ${Math.floor(hours / 24)}d`;
		}
		function humanizeSchedule(date) {
			const time = date.toLocaleTimeString(void 0, {
				hour: "numeric",
				minute: "2-digit"
			});
			const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
			const days = Math.round((startOfDay(date) - startOfDay(new Date(now))) / 864e5);
			let day;
			if (days <= 0) day = "today";
			else if (days === 1) day = "tomorrow";
			else if (days < 7) day = `on ${date.toLocaleDateString(void 0, { weekday: "long" })}`;
			else day = `on ${date.toLocaleDateString(void 0, {
				month: "short",
				day: "numeric"
			})}`;
			return `${day} at ${time}`;
		}
		let hasUnsavedChanges = false;
		let autoSaveTimer = null;
		let hasValidationErrors = false;
		setSaveStateContext({
			get saving() {
				return saving;
			},
			get hasUnsavedChanges() {
				return hasUnsavedChanges;
			},
			get savedAgoText() {
				return savedAgoText();
			}
		});
		let schemaFields = [];
		const hasUnpublishedContent = derived(() => hasUnpublishedChanges(documentData, fullDocument?._meta?.publishedHash || null));
		const isUnpublished = derived(() => fullDocument?._meta?.status === "unpublished");
		const canPublish = derived(() => (hasUnpublishedContent() || isUnpublished()) && !saving && documentId && !hasValidationErrors);
		const canScheduleActionNow = derived(() => scheduleAction() === "publish" ? Boolean(canPublish()) : !saving);
		function getPreviewTitle() {
			return resolvePreviewTitle(perspective === "published" && publishedData ? publishedData : documentData, schema);
		}
		function sortObjectForComparison(item) {
			if (item === null || typeof item !== "object") return item;
			if (Array.isArray(item)) return item.map(sortObjectForComparison);
			const { _key, ...rest } = item;
			item = rest;
			const sortedKeys = Object.keys(item).sort();
			const sortedObj = {};
			for (const key of sortedKeys) sortedObj[key] = sortObjectForComparison(item[key]);
			return sortedObj;
		}
		async function saveDocument(isAutoSave = false) {
			if (saving) return;
			saving = true;
			saveError = null;
			try {
				let response;
				if (isCreating) {
					cmsLogger.debug("[Document Editor]", "🔄 Creating new document with data:", {
						type: documentType,
						data: documentData
					});
					response = await documents.create({
						type: documentType,
						data: documentData
					});
					cmsLogger.debug("[Document Editor]", "📝 Document creation response:", response);
					if (response.success && response.data) {
						cmsLogger.debug("[Document Editor]", "✅ Document created successfully with ID:", response.data.id);
						fullDocument = response.data;
						onSaved?.(response.data.id);
					} else toast.error(response?.error || "Failed to create document");
				} else if (documentId) {
					response = await documents.updateById(documentId, { data: documentData });
					if (response?.success && response.data) {
						cmsLogger.debug("[Document Editor]", "meta response data:", response.data);
						const { id: responseId, _meta } = response.data;
						fullDocument = {
							id: responseId,
							_meta,
							...documentData
						};
					}
				}
				if (response?.success) {
					lastSaved = /* @__PURE__ */ new Date();
					hasUnsavedChanges = false;
					if (response.data?.id) notifyDocumentChanged(response.data.id);
					if (isAutoSave) {
						validateAllFields();
						schemaFields.forEach((fieldComponent, index) => {});
						if (onAutoSaved && documentId) onAutoSaved(documentId, getPreviewTitle());
					}
				} else throw new Error(response?.error || "Failed to save document");
			} catch (err) {
				toast.error(err instanceof ApiError ? err.message : "Failed to save document");
				if (err instanceof ApiError && err.response?.validationErrors) saveError = `Validation failed: ${err.response.validationErrors.map((ve) => `${ve.field}: ${ve.errors.join(", ")}`).join("; ")}`;
				else saveError = err instanceof ApiError ? err.message : "Failed to save document";
			} finally {
				saving = false;
			}
		}
		async function publishDocument() {
			if (!documentId || saving) return;
			if (autoSaveTimer) {
				clearTimeout(autoSaveTimer);
				autoSaveTimer = null;
			}
			if (hasUnsavedChanges) {
				await saveDocument(false);
				if (saveError) return;
			}
			const invalid = await validateAllFields();
			if (invalid.length > 0) {
				const preview = invalid.slice(0, 3).map((f) => f.title).join(", ");
				const remainder = invalid.length > 3 ? ` and ${invalid.length - 3} more` : "";
				const detail = invalid.map((f) => `${f.title}: ${f.messages.join(", ")}`).join("\n");
				saveError = `Cannot publish — fix: ${preview}${remainder}`;
				toast.error(`Fix ${invalid.length} field${invalid.length === 1 ? "" : "s"} to publish`, { description: detail });
				return;
			}
			const refIds = collectReferenceIds(documentData, schema, schemas);
			if (refIds.length > 0) {
				let fetched = [];
				try {
					const res = await documents.getMany(refIds);
					if (res.success && res.data) fetched = res.data;
				} catch {}
				const fetchedById = new Map(fetched.map((d) => [d.id, d]));
				const blockers = refIds.map((id) => ({
					id,
					doc: fetchedById.get(id) ?? null
				})).filter((c) => !c.doc || c.doc._meta?.status !== "published");
				if (blockers.length > 0) {
					saveError = `Cannot publish — unpublished references: ${blockers.slice(0, 3).map((b) => {
						if (!b.doc) return `Missing (${b.id.slice(0, 8)})`;
						const d = b.doc;
						const label = d.title ?? d.name ?? d.heading ?? d.label ?? b.id;
						const type = d._meta?.type;
						return type ? `"${label}" (${type})` : `"${label}"`;
					}).join(", ")}${blockers.length > 3 ? ` and ${blockers.length - 3} more` : ""}`;
					toast.error(`${blockers.length} referenced document${blockers.length === 1 ? "" : "s"} ${blockers.length === 1 ? "is" : "are"} not published`, { description: "Publish the referenced documents first, then try again." });
					return;
				}
			}
			saving = true;
			saveError = null;
			try {
				const response = await documents.publish(documentId);
				if (response.success && response.data) {
					const { id: _id, _meta: _m, ...syncedData } = response.data;
					documentData = syncedData;
					fullDocument = response.data;
					lastSaved = /* @__PURE__ */ new Date();
					publishSuccess = /* @__PURE__ */ new Date();
					notifyDocumentChanged(documentId);
					cmsLogger.debug("[Document Editor]", "✅ Document published successfully");
					cmsLogger.debug("[Document Editor]", "📄 New published hash:", response.data.publishedHash);
					if (onPublished && documentId) onPublished(documentId);
				} else throw new Error(response.error || "Failed to publish document");
			} catch (err) {
				toast.error(err instanceof ApiError ? err.message : "Failed to publish document");
				if (err instanceof ApiError && err.response?.validationErrors) saveError = `Cannot publish - Validation failed: ${err.response.validationErrors.map((ve) => `${ve.field}: ${ve.errors.join(", ")}`).join("; ")}`;
				else saveError = err instanceof ApiError ? err.message : "Failed to publish document";
			} finally {
				saving = false;
			}
		}
		async function unpublishDocument() {
			if (!documentId || saving) return;
			let backRefDescription = "It will be removed from published queries, but the data is preserved and you can re-publish anytime.";
			try {
				const backRefRes = await documents.getBackReferences(documentId);
				if (backRefRes.success && backRefRes.data) {
					const publishedBackRefs = backRefRes.data.filter((r) => r.status === "published");
					if (publishedBackRefs.length > 0) {
						const count = publishedBackRefs.length;
						backRefDescription = `${count} published document${count === 1 ? "" : "s"} reference${count === 1 ? "s" : ""} this one — their references will be left dangling in the published perspective until you re-publish them. Continue?`;
					}
				}
			} catch {}
			if (!await confirmDialog({
				title: "Unpublish this document?",
				description: backRefDescription,
				confirmText: "Unpublish",
				variant: "destructive"
			})) return;
			saving = true;
			saveError = null;
			try {
				const response = await documents.unpublish(documentId);
				if (response.success) {
					fullDocument = {
						...fullDocument,
						_meta: {
							...fullDocument?._meta,
							status: "unpublished"
						}
					};
					notifyDocumentChanged(documentId);
					toast.success("Document unpublished — you can re-publish anytime");
					if (onUnpublished && documentId) onUnpublished(documentId);
				} else throw new Error(response.error || "Failed to unpublish");
			} catch (err) {
				toast.error(err instanceof ApiError ? err.message : "Failed to unpublish document");
			} finally {
				saving = false;
			}
		}
		async function validateAllFields() {
			hasValidationErrors = false;
			return [];
		}
		async function deleteDocument() {
			if (!documentId || saving) return;
			if (!await confirmDialog({
				title: "Delete this document?",
				description: "This action cannot be undone.",
				confirmText: "Delete",
				variant: "destructive"
			})) return;
			saving = true;
			saveError = null;
			try {
				const response = await documents.deleteById(documentId);
				if (response.success) {
					cmsLogger.debug("[Document Editor]", "✅ Document deleted successfully");
					onDeleted?.();
				} else throw new Error(response.error || "Failed to delete document");
			} catch (err) {
				toast.error(err instanceof ApiError ? err.message : "Failed to delete document");
				saveError = err instanceof ApiError ? err.message : "Failed to delete document";
			} finally {
				saving = false;
			}
		}
		function editorActions($$renderer) {
			$$renderer.push(`<div class="flex shrink-0 items-center gap-2">`);
			if (saving) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-muted-foreground hidden items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase sm:inline-flex"><span class="bg-muted-foreground/60 h-1.5 w-1.5 animate-pulse rounded-full"></span> Saving</span>`);
			} else if (hasUnsavedChanges) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<span class="text-muted-foreground hidden items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase sm:inline-flex"><span class="bg-muted-foreground/60 h-1.5 w-1.5 rounded-full"></span> Unsaved</span>`);
			} else if (savedAgoText()) {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`<span class="text-muted-foreground hidden items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase sm:inline-flex"><span class="bg-muted-foreground/60 h-1.5 w-1.5 rounded-full"></span> Auto-saved</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (documentId && fullDocument?._meta?.publishedHash) {
				$$renderer.push("<!--[0-->");
				const isPublished = fullDocument?._meta?.status === "published" && fullDocument?._meta?.publishedAt;
				const isUnpub = fullDocument?._meta?.status === "unpublished";
				$$renderer.push(`<div class="flex items-center gap-1.5"><button${attr_class(`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase transition-colors ${stringify(perspective === "draft" ? "bg-primary/90 text-primary-foreground border-transparent" : "text-muted-foreground hover:bg-muted")}`)}><span${attr_class(`bg-muted-foreground/60 h-1.5 w-1.5 rounded-full ${stringify(perspective === "draft" ? "bg-primary-foreground/60" : "")}`)}></span> Draft</button> <button${attr_class(`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase transition-colors ${stringify(perspective === "published" ? "bg-primary text-primary-foreground border-transparent" : "text-muted-foreground hover:bg-muted")}`)}>`);
				if (isPublished) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span${attr_class(`h-1.5 w-1.5 rounded-full ${stringify(perspective === "published" ? "bg-primary-foreground/60" : "bg-green-500")}`)}></span> Published · ${escape_html(timeAgo(new Date(fullDocument._meta.publishedAt)))}`);
				} else if (isUnpub) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<span${attr_class(`h-1.5 w-1.5 rounded-full ${stringify(perspective === "published" ? "bg-primary-foreground/60" : "bg-muted-foreground/60")}`)}></span> Unpublished`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`Published`);
				}
				$$renderer.push(`<!--]--></button></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (documentActionContext()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<!--[-->`);
				const each_array = ensure_array_like(pluginDocumentActions());
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					const ActionComponent = each_array[$$index].component;
					if (ActionComponent) {
						$$renderer.push("<!--[-->");
						ActionComponent($$renderer, { action: documentActionContext() });
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (documentId) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="relative">`);
				Button($$renderer, {
					variant: "ghost",
					size: "icon",
					onclick: () => showHeaderMenu = !showHeaderMenu,
					class: "h-8 w-8 cursor-pointer",
					children: ($$renderer) => {
						Ellipsis($$renderer, { class: "h-4 w-4" });
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				if (showHeaderMenu) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="bg-background border-rule absolute top-full right-0 z-[60] mt-1 min-w-[160px] rounded-md border py-1 shadow-lg"><button class="hover:bg-muted flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors">`);
					History($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----> History</button> <button class="hover:bg-muted flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors">`);
					Code($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----> Inspect</button></div>  <div class="fixed inset-0 z-[55]"></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (onToggleFocus && !presentationMode) {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					variant: "ghost",
					size: "icon",
					onclick: onToggleFocus,
					class: "hidden h-8 w-8 hover:cursor-pointer lg:flex",
					title: focusMode ? "Exit focus mode" : "Enter focus mode",
					children: ($$renderer) => {
						if (focusMode) {
							$$renderer.push("<!--[0-->");
							Minimize_2($$renderer, { class: "h-4 w-4" });
						} else {
							$$renderer.push("<!--[-1-->");
							Maximize_2($$renderer, { class: "h-4 w-4" });
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (backLabel) {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					variant: "ghost",
					size: "sm",
					onclick: onBack,
					class: "hidden h-8 gap-1.5 px-2 hover:cursor-pointer lg:flex",
					title: backLabel,
					children: ($$renderer) => {
						Arrow_left($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!----> <span class="text-sm font-medium">${escape_html(backLabel)}</span>`);
					},
					$$slots: { default: true }
				});
			} else if (!presentationMode) {
				$$renderer.push("<!--[1-->");
				Button($$renderer, {
					variant: "ghost",
					size: "icon",
					onclick: onBack,
					class: "hidden h-8 w-8 hover:cursor-pointer lg:flex",
					title: "Close",
					children: ($$renderer) => {
						$$renderer.push(`<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		function editorBreadcrumb($$renderer) {
			$$renderer.push(`<div class="text-muted-foreground flex min-w-0 items-center gap-1.5 text-[11px] font-medium tracking-wider uppercase">`);
			if (presentationMode && onTogglePresentation) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button" class="hover:text-foreground hover:bg-muted -ml-1 flex shrink-0 cursor-pointer items-center rounded p-1 transition-colors" title="Exit visual editing" aria-label="Exit visual editing">`);
				Arrow_left($$renderer, { class: "h-4 w-4" });
				$$renderer.push(`<!----></button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <span class="shrink-0 whitespace-nowrap">${escape_html(documentType)}</span> `);
			if (presentationMode) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="shrink-0" aria-hidden="true">·</span> <span class="max-w-[24rem] min-w-0 truncate">${escape_html(getPreviewTitle())}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (presentationMode) {
				$$renderer.push("<!--[0-->");
				AdminSlot($$renderer, {
					name: "navbar-start",
					id: "editor-breadcrumb",
					children: ($$renderer) => {
						editorBreadcrumb($$renderer);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				AdminSlot($$renderer, {
					name: "navbar-end",
					id: "editor-actions",
					children: ($$renderer) => {
						editorActions($$renderer);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="relative flex h-full w-full min-w-0 flex-col overflow-hidden">`);
			if (!presentationMode && nextSchedule()) {
				$$renderer.push("<!--[0-->");
				const isPub = nextSchedule().type === "document.publish";
				const runAtDate = new Date(nextSchedule().runAt);
				$$renderer.push(`<div class="border-primary/15 bg-primary/5 text-primary flex w-full flex-wrap items-center gap-x-2 gap-y-1 border-b px-4 py-2.5 lg:px-6">`);
				Lock($$renderer, { class: "h-4 w-4 shrink-0" });
				$$renderer.push(`<!----> <span class="min-w-0 text-[0.9375rem] leading-tight font-medium">Scheduled to be ${escape_html(isPub ? "published" : "unpublished")}
				${escape_html(humanizeSchedule(runAtDate))} <span class="text-primary/50 font-normal">· ${escape_html(timeUntil(runAtDate))}</span></span> <div class="ml-auto flex items-center gap-1"><button type="button" class="hover:bg-primary/10 rounded px-2 py-1 text-xs font-medium transition-colors">Reschedule</button> <button type="button" class="hover:bg-primary/10 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors">`);
				X($$renderer, { class: "h-3 w-3" });
				$$renderer.push(`<!----> Cancel</button></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (!presentationMode) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="bg-background w-full min-w-0 overflow-x-clip px-4 pt-4 pb-5 lg:px-6 lg:pt-5"><div class="w-full"><div${attr_class(`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 ${stringify(presentationMode ? "" : "mb-4")}`)}>`);
				editorBreadcrumb($$renderer);
				$$renderer.push(`<!----> `);
				editorActions($$renderer);
				$$renderer.push(`<!----></div>  <h1 class="block w-full min-w-0 truncate text-2xl font-semibold tracking-tight lg:text-4xl">${escape_html(getPreviewTitle())}</h1> <div class="mt-3 flex items-center justify-between gap-3 sm:hidden"><div class="flex flex-wrap items-center gap-2">`);
				if (!fullDocument?._meta?.publishedHash && documentId && fullDocument?._meta?.status !== "unpublished") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase"><span class="bg-muted-foreground/60 h-1.5 w-1.5 rounded-full"></span> Draft</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> `);
				if (saving) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-muted-foreground inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase"><span class="bg-muted-foreground/60 h-1.5 w-1.5 animate-pulse rounded-full"></span> Saving</span>`);
				} else if (hasUnsavedChanges) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<span class="text-muted-foreground inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase"><span class="bg-muted-foreground/60 h-1.5 w-1.5 rounded-full"></span> Unsaved</span>`);
				} else if (savedAgoText()) {
					$$renderer.push("<!--[2-->");
					$$renderer.push(`<span class="text-muted-foreground inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase"><span class="bg-muted-foreground/60 h-1.5 w-1.5 rounded-full"></span> Auto-saved</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div data-document-editor=""${attr_class(`relative flex min-h-0 flex-1 ${stringify(presentationMode ? "flex-row" : "flex-col")}`)}><div${attr_class(`relative flex min-h-0 flex-col ${stringify(presentationMode ? "shrink-0" : "flex-1")}`)}${attr_style(presentationMode ? `width: ${fieldsWidth}px; min-width: 500px` : void 0)}>`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="min-h-0 w-full flex-1 overflow-y-auto"><div class="flex flex-col gap-8 p-4 lg:p-6">`);
			if (saveError) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="bg-destructive/10 border-destructive/20 rounded-md border p-3"><p class="text-destructive text-sm">${escape_html(saveError)}</p></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="border-muted-foreground/30 rounded-md border border-dashed p-4"><p class="text-muted-foreground text-center text-sm">No schema found for document type: ${escape_html(documentType)}</p></div>`);
			$$renderer.push(`<!--]--></div></div></div> `);
			if (presentationMode) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div role="separator" aria-orientation="vertical" class="hover:bg-primary/20 active:bg-primary/30 w-1 shrink-0 cursor-ew-resize transition-colors"></div> <div class="flex min-h-0 flex-1 flex-col">`);
				if (iframeUrl()) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="border-rule bg-background flex h-10 shrink-0 items-center gap-1 border-b px-2"><button class="hover:bg-muted flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 transition-colors"${attr("title", "Disable edit mode")}><div${attr_class(`relative h-[14px] w-6 rounded-full transition-colors ${stringify("bg-primary")}`)}><div${attr_class(`absolute top-[2px] h-[10px] w-[10px] rounded-full bg-white shadow transition-all ${stringify("left-[12px]")}`)}></div></div> <span${attr_class(`text-[11px] font-medium tracking-wide ${stringify("text-foreground")}`)}>Edit</span></button> <button class="hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded p-1.5 transition-colors" title="Refresh preview">`);
					Refresh_cw($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----></button> <div class="bg-muted mx-1 min-w-0 flex-1 rounded px-2.5 py-1"><span class="text-muted-foreground block truncate text-center font-mono text-[11px]">${escape_html(iframeUrl())}</span></div> <div class="bg-muted flex items-center gap-0.5 rounded p-0.5"><!--[-->`);
					const each_array_6 = ensure_array_like([
						{
							v: "desktop",
							Icon: Monitor,
							label: "Desktop"
						},
						{
							v: "tablet",
							Icon: Tablet,
							label: "Tablet"
						},
						{
							v: "mobile",
							Icon: Smartphone,
							label: "Mobile"
						}
					]);
					for (let $$index_4 = 0, $$length = each_array_6.length; $$index_4 < $$length; $$index_4++) {
						let { v, Icon, label } = each_array_6[$$index_4];
						$$renderer.push(`<button${attr_class(`cursor-pointer rounded p-1 transition-colors ${stringify(previewViewport === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}`)}${attr("title", label)}${attr("aria-pressed", previewViewport === v)}>`);
						if (Icon) {
							$$renderer.push("<!--[-->");
							Icon($$renderer, { class: "h-3.5 w-3.5" });
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(`</button>`);
					}
					$$renderer.push(`<!--]--></div> <div class="ml-1 flex items-center gap-0.5"><button${attr("disabled", false, true)} class="hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded p-1.5 transition-colors disabled:cursor-default disabled:opacity-40" title="Zoom out">`);
					Zoom_out($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----></button> <button class="text-muted-foreground hover:text-foreground w-9 cursor-pointer text-center font-mono text-[11px] tabular-nums transition-colors" title="Reset zoom">${escape_html(Math.round(previewZoom * 100))}%</button> <button${attr("disabled", false, true)} class="hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded p-1.5 transition-colors disabled:cursor-default disabled:opacity-40" title="Zoom in">`);
					Zoom_in($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----></button></div> <button class="hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded p-1.5 transition-colors" title="Open in new tab">`);
					External_link($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----></button></div> <div${attr_class(`bg-muted/20 relative flex min-h-0 flex-1 [justify-content:safe_center] ${stringify("overflow-hidden")}`)}><div${attr_class(clsx("h-full w-full"))}${attr_style(frameStyle())}><iframe${attr("src", iframeUrl())} class="h-full w-full border-none" title="Page preview"></iframe></div> `);
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">`);
					Monitor($$renderer, { class: "text-muted-foreground/30 h-10 w-10" });
					$$renderer.push(`<!----> <p class="text-muted-foreground text-sm">No preview URL yet.</p> <p class="text-muted-foreground/50 text-xs">Fill in the required fields to enable preview.</p></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (documentId) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="border-rule bg-background relative z-50 border-t p-4">`);
				if (isPreviewingVersion() && activePreview()) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex items-center justify-between"><p class="text-muted-foreground text-sm">Revision from ${escape_html(new Date(activePreview().createdAt || Date.now()).toLocaleString(void 0, {
						month: "short",
						day: "numeric",
						hour: "numeric",
						minute: "2-digit",
						hour12: true
					}))}</p> `);
					Button($$renderer, {
						size: "sm",
						onclick: async () => {
							if (!documentId || !activePreview()) return;
							try {
								await documents.restoreVersion(documentId, activePreview().versionNumber);
								const docRes = await documents.getById(documentId);
								if (docRes.success && docRes.data) {
									fullDocument = docRes.data;
									documentData = {};
									hasUnsavedChanges = false;
									lastSaved = /* @__PURE__ */ new Date();
								}
								previewingVersion = null;
								perspective = "draft";
								publishedData = null;
								toast.success("Revision restored");
								if (onRestored && documentId) onRestored(documentId);
							} catch {
								toast.error("Failed to restore revision");
							}
						},
						children: ($$renderer) => {
							$$renderer.push(`<!---->Restore`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				} else if (isViewingPublished()) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<div class="flex items-center justify-between"><p class="text-muted-foreground text-sm">`);
					if (fullDocument?._meta?.status === "unpublished") {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`Unpublished`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`Published on ${escape_html(fullDocument?._meta?.publishedAt ? new Date(fullDocument._meta.publishedAt).toLocaleString(void 0, {
							month: "short",
							day: "numeric",
							year: "numeric",
							hour: "numeric",
							minute: "2-digit",
							hour12: true
						}) : "Unknown")}`);
					}
					$$renderer.push(`<!--]--></p> <div class="flex items-center gap-2">`);
					if (documentId && canScheduleNow()) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							variant: "ghost",
							size: "icon",
							disabled: !canScheduleActionNow(),
							onclick: () => showScheduleDialog = true,
							class: `h-8 w-8 ${stringify(canScheduleActionNow() ? "cursor-pointer" : "")} ${stringify(nextSchedule() ? "text-primary" : "")}`,
							title: !canScheduleActionNow() ? "Nothing to publish — make a change first" : nextSchedule() ? "Reschedule" : scheduleAction() === "publish" ? "Schedule publish" : "Schedule unpublish",
							children: ($$renderer) => {
								Calendar_clock($$renderer, { class: "h-4 w-4" });
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (fullDocument?._meta?.status === "unpublished") {
						$$renderer.push("<!--[0-->");
						if (canPublishDoc()) {
							$$renderer.push("<!--[0-->");
							Button($$renderer, {
								size: "sm",
								onclick: publishDocument,
								disabled: saving,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Publish`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					} else if (canUnpublishDoc()) {
						$$renderer.push("<!--[1-->");
						Button($$renderer, {
							size: "sm",
							variant: "secondary",
							onclick: unpublishDocument,
							disabled: saving,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Unpublish`);
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="flex items-center justify-between"><div class="flex items-center gap-2">`);
					if (publishSuccess && now - publishSuccess.getTime() < 3e3) {
						$$renderer.push("<!--[0-->");
						Badge($$renderer, {
							variant: "default",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Published!`);
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <div class="flex items-center gap-2">`);
					if (documentId && canScheduleNow()) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							variant: "ghost",
							size: "icon",
							disabled: !canScheduleActionNow(),
							onclick: () => showScheduleDialog = true,
							class: `h-8 w-8 ${stringify(canScheduleActionNow() ? "cursor-pointer" : "")} ${stringify(nextSchedule() ? "text-primary" : "")}`,
							title: !canScheduleActionNow() ? "Nothing to publish — make a change first" : nextSchedule() ? "Reschedule" : "Schedule publish",
							children: ($$renderer) => {
								Calendar_clock($$renderer, { class: "h-4 w-4" });
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (canPublishDoc() && !isViewingPublished()) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							onclick: publishDocument,
							disabled: !canPublish(),
							size: "sm",
							variant: canPublish() ? "default" : "secondary",
							class: "cursor-pointer",
							children: ($$renderer) => {
								if (saving) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`Publishing...`);
								} else if (isUnpublished()) {
									$$renderer.push("<!--[1-->");
									$$renderer.push(`Publish`);
								} else if (!hasUnpublishedContent()) {
									$$renderer.push("<!--[2-->");
									$$renderer.push(`Published`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`Publish Changes`);
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
					} else if (isViewingReadOnly()) {
						$$renderer.push("<!--[1-->");
						Badge($$renderer, {
							variant: "secondary",
							class: "text-xs",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Read Only`);
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (canDelete() && true) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							variant: "ghost",
							size: "icon",
							class: "text-muted-foreground hover:text-destructive h-8 w-8",
							onclick: deleteDocument,
							title: "Delete document",
							children: ($$renderer) => {
								Trash_2($$renderer, { class: "h-4 w-4" });
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (documentId) {
				$$renderer.push("<!--[0-->");
				ScheduleDialog($$renderer, {
					documentId,
					action: scheduleAction(),
					onScheduled: onScheduleCreated,
					get open() {
						return showScheduleDialog;
					},
					set open($$value) {
						showScheduleDialog = $$value;
						$$settled = false;
					}
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (showInspect) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="absolute inset-0 z-50 flex items-center justify-center bg-black/50"><div class="bg-background border-rule mx-4 flex h-[80%] w-full max-w-3xl flex-col rounded-lg border shadow-xl"><div class="flex items-center justify-between border-b px-4 py-3"><div><h3 class="text-sm font-semibold">Inspecting <em>${escape_html(getPreviewTitle())}</em></h3></div> `);
				Button($$renderer, {
					variant: "ghost",
					class: "hover:bg-muted rounded p-1 transition-colors",
					onclick: () => showInspect = false,
					children: ($$renderer) => {
						$$renderer.push(`<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <div class="flex items-center justify-between border-b"><div class="flex"><button${attr_class(`px-4 py-2 text-sm font-medium transition-colors ${stringify("border-primary text-foreground border-b-2")}`)}>Parsed</button> <button${attr_class(`px-4 py-2 text-sm font-medium transition-colors ${stringify("text-muted-foreground hover:text-foreground")}`)}>Raw JSON</button></div> <div class="flex gap-1 pr-2"><button${attr_class(`rounded px-2 py-1 text-xs font-medium transition-colors ${stringify("bg-muted text-foreground")}`)}>Draft</button> <button${attr_class(`rounded px-2 py-1 text-xs font-medium transition-colors ${stringify("text-muted-foreground hover:text-foreground")}`)}>Published</button></div></div> <div class="flex-1 overflow-auto p-4 font-mono text-sm">`);
				{
					$$renderer.push("<!--[-1-->");
					const inspectData = {
						id: documentId,
						_meta: fullDocument?._meta,
						...documentData
					};
					$$renderer.push("<!--[-1-->");
					parsedValue($$renderer, null, inspectData, 0);
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]--></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/components/admin/DocumentVersionPanel.svelte
function DocumentVersionPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { documentId, onClose, onPreviewVersion } = $$props;
		let versions = [];
		let loading = true;
		let filter = "all";
		const filteredVersions = derived(() => filter === "all" ? versions : versions.filter((v) => v.eventType === filter));
		function refresh() {
			return loadVersions();
		}
		async function loadVersions() {
			loading = true;
			try {
				const res = await documents.listVersions(documentId, { limit: 100 });
				if (res.success && res.data) versions = res.data;
			} catch {
				toast.error("Failed to load versions");
			} finally {
				loading = false;
			}
		}
		$$renderer.push(`<div class="flex h-full flex-col"><div class="border-border bg-background flex h-14 items-center justify-between border-b px-3"><h3 class="text-sm font-medium">History</h3> `);
		Button($$renderer, {
			class: "hover:bg-muted rounded p-1 transition-colors",
			variant: "ghost",
			onclick: onClose,
			children: ($$renderer) => {
				$$renderer.push(`<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div> <div class="border-border flex border-b"><!--[-->`);
		const each_array = ensure_array_like([
			{
				value: "all",
				label: "All"
			},
			{
				value: "publish",
				label: "Published"
			},
			{
				value: "draft",
				label: "Drafts"
			}
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let tab = each_array[$$index];
			Button($$renderer, {
				variant: "ghost",
				class: `flex-1 cursor-pointer rounded-none px-2 py-2 text-xs font-medium transition-colors ${stringify(filter === tab.value ? "border-primary text-foreground border-b-2" : "text-muted-foreground hover:text-foreground")}`,
				onclick: () => {
					filter = tab.value;
				},
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(tab.label)}`);
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]--></div> <div class="flex-1 overflow-auto">`);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="p-4 text-center"><span class="text-muted-foreground text-xs">Loading...</span></div>`);
		} else if (filteredVersions().length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="p-4 text-center"><span class="text-muted-foreground text-xs">No ${escape_html(filter === "all" ? "" : filter)} versions</span></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(filteredVersions());
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let version = each_array_1[i];
				$$renderer.push(`<div${attr("data-version-id", i)}${attr_class(`hover:bg-muted w-full cursor-pointer border-b px-3 py-2.5 text-left transition-colors ${stringify(void 0 === version.versionNumber ? "bg-muted border-l-primary border-l-2" : "")}`)}><div class="flex items-center justify-between"><span class="text-muted-foreground text-[11px]">${escape_html(new Date(version.createdAt).toLocaleString(void 0, {
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit",
					hour12: true
				}))}</span> `);
				Badge($$renderer, {
					variant: version.eventType === "publish" ? "default" : "secondary",
					class: "px-1.5 py-0 text-[9px]",
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(version.eventType)}`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> `);
				if (version.createdByName) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-muted-foreground mt-0.5 truncate text-[10px]">${escape_html(version.createdByName)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div>`);
		bind_props($$props, { refresh });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/components/AdminApp.svelte
function AdminApp($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* AdminApp - Complete CMS Admin Interface
		* A packaged, reusable Sanity-style admin UI
		*/
		/**
		* Capabilities resolved for the current session. Used for per-action UI
		* gating. When absent, all actions are shown and the server remains the
		* enforcement surface.
		*/
		/** Effective organization role name, for role-list style checks. */
		/**
		* Build-time plugins, imported client-side (component parts can't cross
		* SvelteKit `load`). Their document-action parts render in the editor toolbar.
		*/
		/**
		* Inline editor previews for custom rich-text block types, keyed by `_type`.
		* Without one, a block renders as a generic card (title/subtitle from its
		* `preview` config); with one, the real block renders inline as you write.
		* App-owned on purpose — the app owns presentation.
		*/
		let { schemas: appSchemas, documentTypes: documentTypesFromServer, schemaError = null, title = "Aphex CMS", graphqlSettings = null, isReadOnly = false, capabilities = [], rbacRole = null, activeTab = { value: "structure" }, handleTabChange = () => {}, userPreferences = null, plugins = [], blockPreviews = {} } = $$props;
		const partResolver = derived(() => createPartResolver(plugins));
		const schemas = derived(() => partResolver().applySchemaTransforms([...appSchemas, ...partResolver().schemaTypes()]));
		setFieldComponents((input) => partResolver().fieldComponent(input)?.component);
		setBlockPreviews((type) => blockPreviews[type]);
		const perms = setPermissionsContext(() => capabilities, () => rbacRole);
		const adminTools = derived(() => partResolver().adminTools({
			capabilities: [...capabilities],
			overrideAccess: rbacRole === "super_admin" || rbacRole === "admin"
		}));
		const tabTools = derived(() => adminTools().filter((t) => (t.placement ?? "tab") === "tab"));
		const nav = setAdminNav();
		let currentOrgId = page.url.searchParams.get("orgId");
		const adminToolContext = derived(() => ({
			organizationId: currentOrgId,
			capabilities,
			role: rbacRole,
			can: (capability) => rbacRole === "super_admin" || rbacRole === "admin" || capabilities.includes(capability),
			schemas: schemas(),
			navigate: (area) => {
				activeTab.value = area;
			},
			openDocument: (documentType, documentId) => {
				if (!documentType || !documentId) {
					cmsLogger.warn("[AdminApp]", "openDocument called without type/id", {
						documentType,
						documentId
					});
					return;
				}
				if (activeTab.value !== "structure") handleTabChange("structure");
				navigateToEditDocument(documentId, documentType);
			}
		}));
		const documentTypes = derived(() => documentTypesFromServer.map((docType) => {
			const schema = schemas().find((s) => s.name === docType.name);
			return {
				...docType,
				icon: schema?.icon,
				group: schema?.group,
				access: schema?.access,
				singleton: schema?.singleton ?? false
			};
		}).filter((docType) => {
			const readList = docType.access?.read;
			if (!readList) return true;
			if (typeof readList === "function") return true;
			const role = perms.role;
			return role !== null && readList.includes(role);
		}));
		const hasDocumentTypes = derived(() => documentTypes().length > 0);
		const groupedDocumentTypes = derived(() => {
			const buckets = /* @__PURE__ */ new Map();
			buckets.set(null, []);
			for (const dt of documentTypes()) {
				const key = dt.group ?? null;
				if (!buckets.has(key)) buckets.set(key, []);
				buckets.get(key).push(dt);
			}
			return Array.from(buckets.entries()).filter(([, items]) => items.length > 0).map(([name, items]) => ({
				name,
				items
			}));
		});
		let selectedDocumentType = null;
		let documentsList = [];
		let mobileView = "types";
		let windowWidth = typeof window !== "undefined" ? window.innerWidth : 375;
		let editingDocumentId = null;
		let isCreatingDocument = false;
		let focusModeOn = false;
		function toggleFocusMode() {
			focusModeOn = !focusModeOn;
			nav.patch({ focus: focusModeOn ? "1" : null });
		}
		let presentationModeOn = false;
		const sidebar = useSidebar();
		function togglePresentationMode() {
			presentationModeOn = !presentationModeOn;
			if (presentationModeOn) sidebar?.setOpen(false);
		}
		let showVersionPanel = false;
		let versionPanelDocId = null;
		let versionPreviewData = null;
		let currentSortName = "updatedAtDesc";
		const availableOrderings = derived(() => {
			return [];
		});
		const currentOrdering = derived(() => {
			let ordering = availableOrderings().find((o) => o.name === currentSortName);
			if (!ordering && currentSortName) {
				const isAsc = currentSortName.endsWith("Asc");
				const baseName = currentSortName.replace("Desc", "").replace("Asc", "");
				const descVersion = availableOrderings().find((o) => o.name === `${baseName}Desc`);
				if (descVersion && isAsc) ordering = {
					...descVersion,
					name: currentSortName,
					by: descVersion.by.map((rule) => ({
						...rule,
						direction: "asc"
					}))
				};
			}
			return ordering || availableOrderings()[0];
		});
		derived(() => {
			if (!currentOrdering()) return void 0;
			const sortFields = currentOrdering().by.map((rule) => rule.direction === "desc" ? `-${rule.field}` : rule.field);
			return sortFields.length === 1 ? sortFields[0] : sortFields;
		});
		let editorStack = [];
		let baseRefreshToken = 0;
		function typeLabel(name) {
			if (!name) return "";
			return schemas().find((s) => s.name === name)?.title ?? name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, " ");
		}
		let activeEditorIndex = 0;
		const MIN_EDITOR_WIDTH = 650;
		const COLLAPSED_WIDTH = 60;
		const TYPES_WIDTH = 350;
		let layoutConfig = derived(() => {
			const totalEditors = 0 + (editorStack.length > 0 ? 1 : 0);
			if (totalEditors === 0) return {
				totalEditors: 0,
				expandedCount: 0,
				collapsedCount: 0,
				typesCollapsed: false,
				docsCollapsed: false,
				expandedIndices: [],
				activeIndex: activeEditorIndex,
				typesExpanded: true,
				docsExpanded: true
			};
			const validActiveIndex = activeEditorIndex < 0 ? activeEditorIndex : Math.max(0, Math.min(activeEditorIndex, totalEditors - 1));
			const typesActive = activeEditorIndex === -1;
			const docsActive = activeEditorIndex === -2;
			let typesExpanded = typesActive || totalEditors < 2;
			let docsExpanded = docsActive || totalEditors < 2;
			let panelsWidth = (typesExpanded ? TYPES_WIDTH : COLLAPSED_WIDTH) + 0;
			let editorSpace = windowWidth - panelsWidth;
			let maxEditors = Math.floor(editorSpace / MIN_EDITOR_WIDTH);
			if (totalEditors === 1 && !typesActive && !docsActive) {
				if (maxEditors < 1) {
					typesExpanded = false;
					panelsWidth = 60;
					editorSpace = windowWidth - panelsWidth;
					maxEditors = Math.floor(editorSpace / MIN_EDITOR_WIDTH);
				}
			}
			if (maxEditors < 1) maxEditors = 1;
			let expandedIndices = [validActiveIndex];
			if (maxEditors > 1) {
				for (let i = totalEditors - 1; i >= 0 && expandedIndices.length < maxEditors; i--) if (i !== validActiveIndex) expandedIndices.push(i);
			}
			return {
				totalEditors,
				expandedCount: expandedIndices.length,
				collapsedCount: totalEditors - expandedIndices.length,
				typesCollapsed: !typesExpanded,
				docsCollapsed: !docsExpanded,
				expandedIndices,
				activeIndex: validActiveIndex,
				typesExpanded,
				docsExpanded
			};
		});
		let typesPanel = derived(() => {
			if (focusModeOn || presentationModeOn) return "hidden";
			if (windowWidth < 620) return mobileView === "types" ? "w-full" : "hidden";
			return layoutConfig().typesExpanded ? "w-[350px]" : "w-[60px]";
		});
		const currentTypeIsSingleton = derived(() => false);
		derived(() => {
			if (focusModeOn || presentationModeOn) return {
				visible: false,
				width: "none"
			};
			if (currentTypeIsSingleton()) return {
				visible: false,
				width: "none"
			};
			if (windowWidth < 620) {
				const state = {
					visible: mobileView === "documents",
					width: "full"
				};
				cmsLogger.debug("[Mobile Documents Panel]", {
					windowWidth,
					mobileView,
					state
				});
				return state;
			}
			return {
				visible: false,
				width: "none"
			};
		});
		let primaryEditorState = derived(() => {
			if (windowWidth < 620) return {
				visible: mobileView === "editor",
				expanded: true
			};
			return {
				visible: false,
				expanded: false
			};
		});
		async function navigateToEditDocument(docId, docType, replace = false) {
			await nav.openDocument(docId, docType, { replace });
			mobileView = "editor";
		}
		async function navigateBack() {
			if (focusModeOn) focusModeOn = false;
			if (presentationModeOn) presentationModeOn = false;
			const fromDocId = page.url.searchParams.get("fromDocId");
			const fromDocType = page.url.searchParams.get("fromDocType");
			if (fromDocId && fromDocType) await navigateToEditDocument(fromDocId, fromDocType, false);
			else {
				await nav.goHome();
				mobileView = "types";
			}
		}
		function handleOpenVersionHistory(docId) {
			showVersionPanel = true;
			versionPanelDocId = docId;
			nav.patch({ history: "1" });
		}
		function handleCloseVersionPanel() {
			showVersionPanel = false;
			versionPanelDocId = null;
			versionPreviewData = null;
			nav.patch({ history: null });
		}
		async function handleOpenReference(documentId, documentType) {
			if (windowWidth < 620) {
				const params = new SvelteURLSearchParams({
					docId: documentId,
					docType: documentType
				});
				if (editingDocumentId) params.set("fromDocId", editingDocumentId);
				await goto(`/admin?${params.toString()}`, { replaceState: false });
				mobileView = "editor";
				return;
			}
			if (editingDocumentId === documentId) {
				activeEditorIndex = 0;
				return;
			}
			const newEntry = {
				documentId,
				documentType,
				isCreating: false
			};
			const stackParam = (activeEditorIndex === 0 && editorStack.length > 0 ? [newEntry] : [...editorStack, newEntry]).map((item) => `${item.documentType}:${item.documentId}`).join(",");
			const params = new SvelteURLSearchParams(page.url.searchParams);
			params.set("stack", stackParam);
			await goto(`/admin?${params.toString()}`, { replaceState: false });
			activeEditorIndex = 1;
		}
		async function handleStackedEditorBack() {
			const newStack = editorStack.slice(0, -1);
			const params = new SvelteURLSearchParams(page.url.searchParams);
			if (newStack.length > 0) {
				const stackParam = newStack.map((item) => `${item.documentType}:${item.documentId}`).join(",");
				params.set("stack", stackParam);
			} else params.delete("stack");
			await goto(`/admin?${params.toString()}`, { replaceState: false });
			activeEditorIndex = newStack.length > 0 ? 1 : 0;
		}
		async function handleCloseStackedEditor(_index) {
			const params = new SvelteURLSearchParams(page.url.searchParams);
			params.delete("stack");
			params.delete("history");
			await goto(`/admin?${params.toString()}`, { replaceState: false });
			activeEditorIndex = 0;
		}
		function handleAutoSave(documentId, title) {
			if (documentsList.length > 0) documentsList = documentsList.map((doc) => doc.id === documentId ? {
				...doc,
				title
			} : doc);
			if (showVersionPanel && versionPanelDocId === documentId) {}
			if (editorStack.some((e) => e.documentId === documentId)) baseRefreshToken++;
		}
		function referenceEditorBody($$renderer, currentRef) {
			DocumentEditor($$renderer, {
				schemas: schemas(),
				plugins,
				documentType: currentRef.documentType,
				documentId: currentRef.documentId,
				isCreating: currentRef.isCreating,
				organizationId: currentOrgId,
				onBack: handleStackedEditorBack,
				backLabel: "Back",
				onOpenReference: handleOpenReference,
				onOpenVersionHistory: handleOpenVersionHistory,
				externalVersionPreview: versionPanelDocId === currentRef.documentId ? versionPreviewData : null,
				onSaved: async () => {},
				onAutoSaved: handleAutoSave,
				onPublished: async (docId) => {},
				onUnpublished: async (docId) => {},
				onRestored: async (docId) => {},
				onDeleted: async () => {
					handleCloseStackedEditor(0);
				},
				isReadOnly
			});
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1lkapyb", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html(activeTab.value === "structure" ? "Content" : activeTab.value === "media" ? "Media" : "Vision")} - ${escape_html(title)}</title>`);
				});
			});
			if (tabTools().length > 0) {
				$$renderer.push("<!--[0-->");
				AdminSlot($$renderer, {
					name: "admin-tabs",
					id: "plugin-admin-tools",
					children: ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(tabTools());
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let tool = each_array[$$index];
							$$renderer.push(`<button${attr_class(`${stringify(activeTab.value === `plugin:${tool.id}` ? "bg-background text-foreground shadow" : "text-muted-foreground")} ring-offset-background focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none`)}>`);
							if (tool.icon) {
								$$renderer.push("<!--[0-->");
								const Icon = tool.icon;
								if (Icon) {
									$$renderer.push("<!--[-->");
									Icon($$renderer, { class: "h-4 w-4" });
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> ${escape_html(tool.title)}</button>`);
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->  <div class="flex h-full flex-col overflow-hidden">`);
			if ((windowWidth < 620 || focusModeOn) && activeTab.value === "structure") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="border-border bg-background border-b"><div class="flex h-12 items-center px-4">`);
				if (mobileView === "editor") {
					$$renderer.push("<!--[1-->");
					Button($$renderer, {
						onclick: navigateBack,
						variant: "ghost",
						class: "text-muted-foreground hover:text-foreground text-sm",
						children: ($$renderer) => {
							$$renderer.push(`<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> <span class="ml-3 text-sm font-medium">${escape_html("Document")}</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="text-sm font-medium">Content</span>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex-1 overflow-hidden">`);
			if (Tabs) {
				$$renderer.push("<!--[-->");
				Tabs($$renderer, {
					value: activeTab.value,
					onValueChange: handleTabChange,
					class: "h-full",
					children: ($$renderer) => {
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "structure",
								class: "h-full overflow-hidden",
								children: ($$renderer) => {
									$$renderer.push(`<!---->`);
									$$renderer.push(`<div${attr_class(clsx(windowWidth < 620 ? "h-full w-full" : "flex h-full w-full overflow-hidden"))}>`);
									if (schemaError) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="bg-destructive/5 flex flex-1 items-center justify-center p-8"><div class="w-full max-w-2xl">`);
										Alert($$renderer, {
											variant: "destructive",
											children: ($$renderer) => {
												$$renderer.push(`<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.704-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>`);
												Alert_title($$renderer, {
													children: ($$renderer) => {
														$$renderer.push(`<!---->Schema Validation Error`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!---->`);
												Alert_description($$renderer, {
													class: "whitespace-pre-line",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(schemaError.message)}`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!---->`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></div></div>`);
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<div${attr_class(`border-rule border-r transition-all duration-200 ${stringify(windowWidth < 620 ? typesPanel() === "hidden" ? "hidden" : "h-full w-screen" : typesPanel())} ${stringify(typesPanel() === "hidden" ? "hidden" : "block")} h-full overflow-hidden`)}>`);
										if (typesPanel() === "w-[60px]") {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<button class="hover:bg-muted/30 flex h-full w-full cursor-pointer flex-col transition-colors" title="Click to expand content types"><div class="flex flex-1 items-start justify-center p-2 pt-8 text-left"><div class="text-foreground -mt-2 text-sm font-medium whitespace-nowrap [writing-mode:vertical-rl]">Content</div></div></button>`);
										} else {
											$$renderer.push("<!--[-1-->");
											$$renderer.push(`<div class="h-full overflow-y-auto p-3">`);
											if (hasDocumentTypes()) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<h2 class="text-muted-foreground border-rule mt-2 mb-3 hidden px-2 pb-3 text-sm font-medium sm:block sm:border-b">Content</h2> <!--[-->`);
												const each_array_1 = ensure_array_like(groupedDocumentTypes());
												for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
													let bucket = each_array_1[$$index_2];
													if (bucket.name) {
														$$renderer.push("<!--[0-->");
														$$renderer.push(`<div class="text-muted-foreground mt-3 mb-1 px-2 text-xs font-semibold tracking-wide uppercase first:mt-0">${escape_html(bucket.name)}</div>`);
													} else $$renderer.push("<!--[-1-->");
													$$renderer.push(`<!--]--> <!--[-->`);
													const each_array_2 = ensure_array_like(bucket.items);
													for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
														let docType = each_array_2[$$index_1];
														$$renderer.push(`<button${attr_class(`hover:bg-muted/50 group flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-2.5 text-left transition-colors ${stringify(selectedDocumentType === docType.name ? "bg-muted/50" : "")}`)}${attr("title", docType.description || "")}><div class="flex items-center gap-2"><div class="text-muted-foreground flex h-5 w-5 items-center justify-center">`);
														if (docType.icon) {
															$$renderer.push("<!--[0-->");
															const Icon = docType.icon;
															if (Icon) {
																$$renderer.push("<!--[-->");
																Icon($$renderer, { class: "h-4 w-4" });
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
														} else {
															$$renderer.push("<!--[-1-->");
															File_text($$renderer, { class: "h-4 w-4" });
														}
														$$renderer.push(`<!--]--></div> <span class="text-sm">${escape_html(docType.singleton ? docType.title : pluralize(docType.title))}</span></div> <svg class="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>`);
													}
													$$renderer.push(`<!--]-->`);
												}
												$$renderer.push(`<!--]-->`);
											} else {
												$$renderer.push("<!--[-1-->");
												$$renderer.push(`<div class="p-6 text-center"><div class="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">`);
												File_text($$renderer, { class: "text-muted-foreground h-8 w-8" });
												$$renderer.push(`<!----></div> <h3 class="mb-2 font-medium">No content types found</h3> <p class="text-muted-foreground mb-4 text-sm">Get started by defining your first schema type</p> <p class="text-muted-foreground text-xs">Add schemas in <code class="bg-muted rounded px-1.5 py-0.5 text-xs">src/lib/schemaTypes/</code></p></div>`);
											}
											$$renderer.push(`<!--]--></div>`);
										}
										$$renderer.push(`<!--]--></div> `);
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										if (primaryEditorState().visible) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<div${attr_class(`relative transition-all duration-200 ${stringify(windowWidth < 620 ? "w-screen" : "flex-1")} h-full overflow-x-hidden overflow-y-auto ${stringify(primaryEditorState().expanded ? "" : "hidden")}`)}${attr_style(windowWidth >= 620 ? "min-width: 0;" : "")}>`);
											DocumentEditor($$renderer, {
												schemas: schemas(),
												plugins,
												documentType: selectedDocumentType,
												documentId: editingDocumentId,
												isCreating: isCreatingDocument,
												focusMode: focusModeOn,
												onToggleFocus: toggleFocusMode,
												presentationMode: presentationModeOn,
												onTogglePresentation: togglePresentationMode,
												refreshToken: baseRefreshToken,
												organizationId: currentOrgId,
												onBack: navigateBack,
												onOpenReference: handleOpenReference,
												onOpenVersionHistory: handleOpenVersionHistory,
												externalVersionPreview: versionPanelDocId === editingDocumentId ? versionPreviewData : null,
												onSaved: async (docId) => {
													if (isCreatingDocument) {
														isCreatingDocument = false;
														editingDocumentId = docId;
														const params = new SvelteURLSearchParams(page.url.searchParams);
														params.set("docId", docId);
														params.delete("action");
														await goto(`/admin?${params.toString()}`, {
															replaceState: true,
															keepFocus: true,
															noScroll: true
														});
													} else navigateToEditDocument(docId, selectedDocumentType);
												},
												onAutoSaved: handleAutoSave,
												onPublished: async (docId) => {},
												onUnpublished: async (docId) => {},
												onRestored: async (docId) => {},
												onDeleted: async () => {
													{
														const orgId = page.url.searchParams.get("orgId");
														await goto(orgId ? `/admin?orgId=${orgId}` : "/admin", { replaceState: false });
													}
												},
												isReadOnly
											});
											$$renderer.push(`<!----> `);
											if (presentationModeOn && editorStack.length > 0) {
												$$renderer.push("<!--[0-->");
												const currentRef = editorStack[editorStack.length - 1];
												$$renderer.push(`<div class="border-rule bg-background absolute inset-y-0 left-0 z-40 flex w-full max-w-[520px] flex-col border-r shadow-2xl">`);
												referenceEditorBody($$renderer, currentRef);
												$$renderer.push(`<!----></div>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> `);
											if (!primaryEditorState().expanded && !focusModeOn && !presentationModeOn) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<button class="border-rule hover:bg-muted/50 flex h-full w-[60px] cursor-pointer flex-col border-l transition-colors"${attr("title", `Click to expand ${stringify(typeLabel(selectedDocumentType))}`)}><div class="flex flex-1 items-start justify-center p-2 pt-8 text-left"><div class="text-foreground -mt-2 text-sm font-medium whitespace-nowrap [writing-mode:vertical-rl]">${escape_html(typeLabel(selectedDocumentType))}</div></div></button>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]-->`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										if (editorStack.length > 0 && !presentationModeOn) {
											$$renderer.push("<!--[0-->");
											const currentRef = editorStack[editorStack.length - 1];
											if (focusModeOn ? activeEditorIndex === 1 : layoutConfig().expandedIndices.includes(1)) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<div class="border-rule h-full flex-1 overflow-x-hidden overflow-y-auto border-l transition-all duration-200" style="min-width: 0;">`);
												referenceEditorBody($$renderer, currentRef);
												$$renderer.push(`<!----></div>`);
											} else if (!focusModeOn) {
												$$renderer.push("<!--[1-->");
												$$renderer.push(`<button class="border-rule hover:bg-muted/50 flex h-full w-[60px] cursor-pointer flex-col border-l transition-colors"${attr("title", `Click to expand ${stringify(typeLabel(currentRef.documentType))}`)}><div class="flex h-full flex-1 items-start justify-center p-2 pt-8 text-left"><div class="text-foreground text-sm font-medium whitespace-nowrap [writing-mode:vertical-rl]">${escape_html(typeLabel(currentRef.documentType))}</div></div></button>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]-->`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]-->`);
									}
									$$renderer.push(`<!--]--> `);
									if (showVersionPanel && versionPanelDocId) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="border-rule h-full w-[280px] shrink-0 overflow-y-auto border-l transition-all duration-200">`);
										DocumentVersionPanel($$renderer, {
											documentId: versionPanelDocId,
											onClose: handleCloseVersionPanel,
											onPreviewVersion: (v) => {
												versionPreviewData = v;
											},
											onRestored: async () => {
												versionPreviewData = null;
											}
										});
										$$renderer.push(`<!----></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div>`);
									$$renderer.push(`<!---->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (graphqlSettings?.enableGraphiQL) {
							$$renderer.push("<!--[0-->");
							if (Tabs_content) {
								$$renderer.push("<!--[-->");
								Tabs_content($$renderer, {
									value: "vision",
									class: "m-0 h-full p-0",
									children: ($$renderer) => {
										$$renderer.push(`<div class="bg-muted/10 flex h-full items-center justify-center"><div class="space-y-4 text-center"><div class="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full"><svg class="text-primary h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg></div> <div><h3 class="mb-2 text-lg font-semibold">GraphQL Playground</h3> <p class="text-muted-foreground mb-4">Query your CMS data with the GraphQL API</p> <a${attr("href", graphqlSettings.endpoint)} target="_blank" class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 transition-colors">Open Playground <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a></div></div></div>`);
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (Tabs_content) {
							$$renderer.push("<!--[-->");
							Tabs_content($$renderer, {
								value: "media",
								class: "m-0 h-full p-0",
								children: ($$renderer) => {
									MediaBrowser($$renderer, { active: activeTab.value === "media" });
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` <!--[-->`);
						const each_array_6 = ensure_array_like(adminTools());
						for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
							let tool = each_array_6[$$index_6];
							const Tool = tool.component;
							if (Tabs_content) {
								$$renderer.push("<!--[-->");
								Tabs_content($$renderer, {
									value: `plugin:${tool.id}`,
									class: "m-0 h-full overflow-auto p-0",
									children: ($$renderer) => {
										if (Tool) {
											$$renderer.push("<!--[-->");
											Tool($$renderer, { tool: adminToolContext() });
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(`</div></div> `);
			ConfirmDialogHost($$renderer, {});
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/routes/(protected)/admin/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const blockPreviews = {};
		let { data } = $$props;
		const capabilities = derived(() => page.data.rbac?.capabilities ?? []);
		const rbacRole = derived(() => page.data.rbac?.role ?? null);
		function handleTabChange(value) {
			if (activeTabState) activeTabState.value = value;
		}
		AdminApp($$renderer, {
			schemas: schemaTypes,
			plugins,
			blockPreviews,
			documentTypes: data.documentTypes,
			schemaError: data.schemaError,
			graphqlSettings: data.graphqlSettings,
			isReadOnly: data.isReadOnly,
			capabilities: capabilities(),
			rbacRole: rbacRole(),
			userPreferences: data.userPreferences,
			activeTab: activeTabState,
			handleTabChange,
			title: "Aphex CMS"
		});
	});
}
//#endregion
export { _page as default };
