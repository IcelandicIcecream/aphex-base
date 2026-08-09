import { A as noop, C as escaped, D as stringify_key, E as is_primitive, O as stringify_string, S as enumerable_symbols, T as is_plain_object, d as get_message, f as get_status, k as valid_array_indices, u as coalesce_to_error, w as get_type, x as DevalueError, y as parse } from "./shared.js";
import { json, text } from "@sveltejs/kit";
import { HttpError, SvelteKitError } from "@sveltejs/kit/internal";
import { with_request_store } from "@sveltejs/kit/internal/server";
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+vite-plugin-svelte@7.2.0_svelte_da459b376329cf0681195252eb508031/node_modules/@sveltejs/kit/src/constants.js
/**
* A fake asset path used in `vite dev` and `vite preview`, so that we can
* serve local assets while verifying that requests are correctly prefixed
*/
var SVELTE_KIT_ASSETS = "/_svelte_kit_assets";
var ENDPOINT_METHODS = [
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE",
	"OPTIONS",
	"HEAD"
];
var MUTATIVE_METHODS = [
	"POST",
	"PUT",
	"PATCH",
	"DELETE"
];
var PAGE_METHODS = [
	"GET",
	"POST",
	"HEAD"
];
//#endregion
//#region ../../node_modules/.pnpm/set-cookie-parser@3.1.0/node_modules/set-cookie-parser/lib/set-cookie.js
var defaultParseOptions = {
	decodeValues: true,
	map: false,
	silent: false,
	split: "auto"
};
function isForbiddenKey(key) {
	return typeof key !== "string" || key in {};
}
function createNullObj() {
	return Object.create(null);
}
function isNonEmptyString(str) {
	return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options) {
	var parts = setCookieValue.split(";").filter(isNonEmptyString);
	var parsed = parseNameValuePair(parts.shift());
	var name = parsed.name;
	var value = parsed.value;
	options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
	if (isForbiddenKey(name)) return null;
	try {
		value = options.decodeValues ? decodeURIComponent(value) : value;
	} catch (e) {
		console.error("set-cookie-parser: failed to decode cookie value. Set options.decodeValues=false to disable decoding.", e);
	}
	var cookie = createNullObj();
	cookie.name = name;
	cookie.value = value;
	parts.forEach(function(part) {
		var sides = part.split("=");
		var key = sides.shift().trimLeft().toLowerCase();
		if (isForbiddenKey(key)) return;
		var value = sides.join("=");
		if (key === "expires") cookie.expires = new Date(value);
		else if (key === "max-age") {
			var n = parseInt(value, 10);
			if (!Number.isNaN(n)) cookie.maxAge = n;
		} else if (key === "secure") cookie.secure = true;
		else if (key === "httponly") cookie.httpOnly = true;
		else if (key === "samesite") cookie.sameSite = value;
		else if (key === "partitioned") cookie.partitioned = true;
		else if (key) cookie[key] = value;
	});
	return cookie;
}
function parseNameValuePair(nameValuePairStr) {
	var name = "";
	var value = "";
	var nameValueArr = nameValuePairStr.split("=");
	if (nameValueArr.length > 1) {
		name = nameValueArr.shift();
		value = nameValueArr.join("=");
	} else value = nameValuePairStr;
	return {
		name,
		value
	};
}
function parseSetCookie(input, options) {
	options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
	if (!input) if (!options.map) return [];
	else return createNullObj();
	if (input.headers) if (typeof input.headers.getSetCookie === "function") input = input.headers.getSetCookie();
	else if (input.headers["set-cookie"]) input = input.headers["set-cookie"];
	else {
		var sch = input.headers[Object.keys(input.headers).find(function(key) {
			return key.toLowerCase() === "set-cookie";
		})];
		if (!sch && input.headers.cookie && !options.silent) console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
		input = sch;
	}
	var split = options.split;
	var isArray = Array.isArray(input);
	if (split === "auto") split = !isArray;
	if (!isArray) input = [input];
	input = input.filter(isNonEmptyString);
	if (split) input = input.map(splitCookiesString).flat();
	if (!options.map) return input.map(function(str) {
		return parseString(str, options);
	}).filter(Boolean);
	else {
		var cookies = createNullObj();
		return input.reduce(function(cookies, str) {
			var cookie = parseString(str, options);
			if (cookie && !isForbiddenKey(cookie.name)) cookies[cookie.name] = cookie;
			return cookies;
		}, cookies);
	}
}
function splitCookiesString(cookiesString) {
	if (Array.isArray(cookiesString)) return cookiesString;
	if (typeof cookiesString !== "string") return [];
	var cookiesStrings = [];
	var pos = 0;
	var start;
	var ch;
	var lastComma;
	var nextStart;
	var cookiesSeparatorFound;
	function skipWhitespace() {
		while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) pos += 1;
		return pos < cookiesString.length;
	}
	function notSpecialChar() {
		ch = cookiesString.charAt(pos);
		return ch !== "=" && ch !== ";" && ch !== ",";
	}
	while (pos < cookiesString.length) {
		start = pos;
		cookiesSeparatorFound = false;
		while (skipWhitespace()) {
			ch = cookiesString.charAt(pos);
			if (ch === ",") {
				lastComma = pos;
				pos += 1;
				skipWhitespace();
				nextStart = pos;
				while (pos < cookiesString.length && notSpecialChar()) pos += 1;
				if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
					cookiesSeparatorFound = true;
					pos = nextStart;
					cookiesStrings.push(cookiesString.substring(start, lastComma));
					start = pos;
				} else pos = lastComma + 1;
			} else pos += 1;
		}
		if (!cookiesSeparatorFound || pos >= cookiesString.length) cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
	}
	return cookiesStrings;
}
parseSetCookie.parseSetCookie = parseSetCookie;
parseSetCookie.parse = parseSetCookie;
parseSetCookie.parseString = parseString;
parseSetCookie.splitCookiesString = splitCookiesString;
//#endregion
//#region ../../node_modules/.pnpm/devalue@5.9.0/node_modules/devalue/src/uneval.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafe_chars = /[<\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
/**
* Turn a value into the JavaScript that creates an equivalent value
* @param {any} value
* @param {(value: any, uneval: (value: any) => string) => string | void} [replacer]
*/
function uneval(value, replacer) {
	const counts = /* @__PURE__ */ new Map();
	/** @type {string[]} */
	const keys = [];
	const custom = /* @__PURE__ */ new Map();
	/** @param {any} thing */
	function walk(thing) {
		if (!is_primitive(thing)) {
			if (counts.has(thing)) {
				counts.set(thing, counts.get(thing) + 1);
				return;
			}
			counts.set(thing, 1);
			if (replacer) {
				const str = replacer(thing, (value) => uneval(value, replacer));
				if (typeof str === "string") {
					custom.set(thing, str);
					return;
				}
			}
			if (typeof thing === "function") throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
			switch (get_type(thing)) {
				case "Number":
				case "BigInt":
				case "String":
				case "Boolean":
				case "Date":
				case "RegExp":
				case "URL":
				case "URLSearchParams": return;
				case "Array":
					/** @type {any[]} */ thing.forEach((value, i) => {
						keys.push(`[${i}]`);
						walk(value);
						keys.pop();
					});
					break;
				case "Set":
					Array.from(thing).forEach(walk);
					break;
				case "Map":
					for (const [key, value] of thing) {
						keys.push(`.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`);
						walk(key);
						walk(value);
						keys.pop();
					}
					break;
				case "Int8Array":
				case "Uint8Array":
				case "Uint8ClampedArray":
				case "Int16Array":
				case "Uint16Array":
				case "Float16Array":
				case "Int32Array":
				case "Uint32Array":
				case "Float32Array":
				case "Float64Array":
				case "BigInt64Array":
				case "BigUint64Array":
				case "DataView":
					walk(thing.buffer);
					return;
				case "ArrayBuffer": return;
				case "Temporal.Duration":
				case "Temporal.Instant":
				case "Temporal.PlainDate":
				case "Temporal.PlainTime":
				case "Temporal.PlainDateTime":
				case "Temporal.PlainMonthDay":
				case "Temporal.PlainYearMonth":
				case "Temporal.ZonedDateTime": return;
				default:
					if (!is_plain_object(thing)) throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
					if (enumerable_symbols(thing).length > 0) throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
					for (const key of Object.keys(thing)) {
						if (key === "__proto__") throw new DevalueError(`Cannot stringify objects with __proto__ keys`, keys, thing, value);
						keys.push(stringify_key(key));
						walk(thing[key]);
						keys.pop();
					}
			}
		} else if (typeof thing === "symbol") throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
	}
	walk(value);
	const names = /* @__PURE__ */ new Map();
	Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
		names.set(entry[0], get_name(i));
	});
	/**
	* @param {any} thing
	* @returns {string}
	*/
	function stringify(thing) {
		if (names.has(thing)) return names.get(thing);
		if (is_primitive(thing)) return stringify_primitive(thing);
		if (custom.has(thing)) return custom.get(thing);
		const type = get_type(thing);
		switch (type) {
			case "Number":
			case "String":
			case "Boolean":
			case "BigInt": return `Object(${stringify(thing.valueOf())})`;
			case "RegExp":
				const { source, flags } = thing;
				return flags ? `new RegExp(${stringify_string(source)},"${flags}")` : `new RegExp(${stringify_string(source)})`;
			case "Date": return `new Date(${thing.getTime()})`;
			case "URL": return `new URL(${stringify_string(thing.toString())})`;
			case "URLSearchParams": return `new URLSearchParams(${stringify_string(thing.toString())})`;
			case "Array": {
				let has_holes = false;
				let result = "[";
				for (let i = 0; i < thing.length; i += 1) {
					if (i > 0) result += ",";
					if (Object.hasOwn(thing, i)) result += stringify(thing[i]);
					else if (!has_holes) {
						const populated_keys = valid_array_indices(thing);
						const population = populated_keys.length;
						const d = String(thing.length).length;
						if (thing.length + 2 > 25 + d + population * (d + 2)) {
							const entries = populated_keys.map((k) => `${k}:${stringify(thing[k])}`).join(",");
							return `Object.assign(Array(${thing.length}),{${entries}})`;
						}
						has_holes = true;
					}
				}
				const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
				return result + tail + "]";
			}
			case "Set":
			case "Map": return `new ${type}([${Array.from(thing).map(stringify).join(",")}])`;
			case "Int8Array":
			case "Uint8Array":
			case "Uint8ClampedArray":
			case "Int16Array":
			case "Uint16Array":
			case "Float16Array":
			case "Int32Array":
			case "Uint32Array":
			case "Float32Array":
			case "Float64Array":
			case "BigInt64Array":
			case "BigUint64Array": {
				let str = `new ${type}`;
				if (!names.has(thing.buffer)) str += `([${stringify_typed_array_elements(new thing.constructor(thing.buffer))}])`;
				else str += `(${stringify(thing.buffer)})`;
				if (thing.byteLength !== thing.buffer.byteLength) {
					const start = thing.byteOffset / thing.BYTES_PER_ELEMENT;
					const end = start + thing.length;
					str += `.subarray(${start},${end})`;
				}
				return str;
			}
			case "DataView": {
				let str = `new DataView`;
				if (!names.has(thing.buffer)) str += `(new Uint8Array([${new Uint8Array(thing.buffer)}]).buffer`;
				else str += `(${stringify(thing.buffer)}`;
				if (thing.byteLength !== thing.buffer.byteLength) str += `,${thing.byteOffset},${thing.byteLength}`;
				return str + ")";
			}
			case "ArrayBuffer": return `new Uint8Array([${new Uint8Array(thing).toString()}]).buffer`;
			case "Temporal.Duration":
			case "Temporal.Instant":
			case "Temporal.PlainDate":
			case "Temporal.PlainTime":
			case "Temporal.PlainDateTime":
			case "Temporal.PlainMonthDay":
			case "Temporal.PlainYearMonth":
			case "Temporal.ZonedDateTime": return `${type}.from(${stringify_string(thing.toString())})`;
			default:
				const keys = Object.keys(thing);
				const obj = keys.map((key) => `${safe_key(key)}:${stringify(thing[key])}`).join(",");
				if (Object.getPrototypeOf(thing) === null) return keys.length > 0 ? `{${obj},__proto__:null}` : `{__proto__:null}`;
				return `{${obj}}`;
		}
	}
	const str = stringify(value);
	if (names.size) {
		/** @type {string[]} */
		const params = [];
		/** @type {string[]} */
		const statements = [];
		/** @type {string[]} */
		const values = [];
		/** @type {string[]} */
		const reconstructions = [];
		names.forEach((name, thing) => {
			params.push(name);
			if (custom.has(thing)) {
				values.push(custom.get(thing));
				return;
			}
			if (is_primitive(thing)) {
				values.push(stringify_primitive(thing));
				return;
			}
			const type = get_type(thing);
			switch (type) {
				case "Number":
				case "String":
				case "Boolean":
				case "BigInt":
					values.push(`Object(${stringify(thing.valueOf())})`);
					break;
				case "RegExp":
					const { source, flags } = thing;
					const regexp = flags ? `new RegExp(${stringify_string(source)},"${flags}")` : `new RegExp(${stringify_string(source)})`;
					values.push(regexp);
					break;
				case "Date":
					values.push(`new Date(${thing.getTime()})`);
					break;
				case "URL":
					values.push(`new URL(${stringify_string(thing.toString())})`);
					break;
				case "URLSearchParams":
					values.push(`new URLSearchParams(${stringify_string(thing.toString())})`);
					break;
				case "Array":
					values.push(`Array(${thing.length})`);
					/** @type {any[]} */ thing.forEach((v, i) => {
						statements.push(`${name}[${i}]=${stringify(v)}`);
					});
					break;
				case "Set": {
					values.push(`new Set`);
					const adds = Array.from(thing).map((v) => `.add(${stringify(v)})`);
					if (adds.length > 0) statements.push(name + adds.join(""));
					break;
				}
				case "Map": {
					values.push(`new Map`);
					const sets = Array.from(thing).map(([k, v]) => `.set(${stringify(k)}, ${stringify(v)})`);
					if (sets.length > 0) statements.push(name + sets.join(""));
					break;
				}
				case "Int8Array":
				case "Uint8Array":
				case "Uint8ClampedArray":
				case "Int16Array":
				case "Uint16Array":
				case "Float16Array":
				case "Int32Array":
				case "Uint32Array":
				case "Float32Array":
				case "Float64Array":
				case "BigInt64Array":
				case "BigUint64Array": {
					let str = `new ${type}`;
					if (!names.has(thing.buffer)) str += `([${stringify_typed_array_elements(new thing.constructor(thing.buffer))}])`;
					else str += `(${stringify(thing.buffer)})`;
					if (thing.byteLength !== thing.buffer.byteLength) {
						const start = thing.byteOffset / thing.BYTES_PER_ELEMENT;
						const end = start + thing.length;
						str += `.subarray(${start},${end})`;
					}
					values.push(`{}`);
					reconstructions.push(`${name}=${str}`);
					break;
				}
				case "DataView": {
					let str = `new DataView`;
					if (!names.has(thing.buffer)) str += `(new Uint8Array([${new Uint8Array(thing.buffer)}]).buffer`;
					else str += `(${stringify(thing.buffer)}`;
					if (thing.byteLength !== thing.buffer.byteLength) str += `,${thing.byteOffset},${thing.byteLength}`;
					str += ")";
					values.push(`{}`);
					reconstructions.push(`${name}=${str}`);
					break;
				}
				case "ArrayBuffer":
					values.push(`new Uint8Array([${new Uint8Array(thing)}]).buffer`);
					break;
				case "Temporal.Duration":
				case "Temporal.Instant":
				case "Temporal.PlainDate":
				case "Temporal.PlainTime":
				case "Temporal.PlainDateTime":
				case "Temporal.PlainMonthDay":
				case "Temporal.PlainYearMonth":
				case "Temporal.ZonedDateTime":
					values.push(`${type}.from(${stringify_string(thing.toString())})`);
					break;
				default:
					values.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
					Object.keys(thing).forEach((key) => {
						statements.push(`${name}${safe_prop(key)}=${stringify(thing[key])}`);
					});
			}
		});
		statements.push(`return ${str}`);
		const body = [...reconstructions, ...statements].join(";");
		return `(function(${params.join(",")}){${body}}(${values.join(",")}))`;
	} else return str;
}
/**
* Serialize the elements of a typed array as a comma-separated list.
* `BigInt64Array`/`BigUint64Array` elements are bigints and must be written
* with an `n` suffix, otherwise the emitted `new BigInt64Array([...])` throws.
* @param {import('./types.js').TypedArray} array
*/
function stringify_typed_array_elements(array) {
	if (array instanceof BigInt64Array || array instanceof BigUint64Array) return Array.from(array, (element) => `${element}n`).join(",");
	return array.toString();
}
/** @param {number} num */
function get_name(num) {
	let name = "";
	do {
		name = chars[num % 54] + name;
		num = ~~(num / 54) - 1;
	} while (num >= 0);
	return reserved.test(name) ? `${name}0` : name;
}
/** @param {string} c */
function escape_unsafe_char(c) {
	return escaped[c] || c;
}
/** @param {string} str */
function escape_unsafe_chars(str) {
	return str.replace(unsafe_chars, escape_unsafe_char);
}
/** @param {string} key */
function safe_key(key) {
	return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escape_unsafe_chars(JSON.stringify(key));
}
/** @param {string} key */
function safe_prop(key) {
	return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? `.${key}` : `[${escape_unsafe_chars(JSON.stringify(key))}]`;
}
/** @param {any} thing */
function stringify_primitive(thing) {
	const type = typeof thing;
	if (type === "string") return stringify_string(thing);
	if (thing === void 0) return "void 0";
	if (thing === 0 && 1 / thing < 0) return "-0";
	const str = String(thing);
	if (type === "number") return str.replace(/^(-)?0\./, "$1.");
	if (type === "bigint") return thing + "n";
	return str;
}
//#endregion
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+vite-plugin-svelte@7.2.0_svelte_da459b376329cf0681195252eb508031/node_modules/@sveltejs/kit/src/runtime/form-utils.js
/** @import { RemoteForm } from '@sveltejs/kit' */
/** @import { BinaryFormMeta, InternalRemoteFormIssue } from 'types' */
/** @import { StandardSchemaV1 } from '@standard-schema/spec' */
var decoder = new TextDecoder();
/**
* Sets a value in a nested object using a path string, mutating the original object
* @param {Record<string, any>} object
* @param {string} path_string
* @param {any} value
*/
function set_nested_value(object, path_string, value) {
	if (path_string.startsWith("n:")) {
		path_string = path_string.slice(2);
		value = value === "" ? void 0 : parseFloat(value);
	} else if (path_string.startsWith("b:")) {
		path_string = path_string.slice(2);
		value = value === "on";
	}
	deep_set(object, split_path(path_string), value);
}
/** Pass this to set_nested_value to delete the last part of the given path */
var DELETE_KEY = {};
/**
* Convert `FormData` into a POJO
* @param {FormData} data
*/
function convert_formdata(data) {
	/** @type {Record<string, any>} */
	const result = {};
	for (let key of data.keys()) {
		const is_array = key.endsWith("[]");
		/** @type {any[]} */
		let values = data.getAll(key);
		if (is_array) key = key.slice(0, -2);
		values = values.filter((entry) => typeof entry === "string" || entry.name !== "" || entry.size > 0);
		if (values.length === 0 && !is_array) continue;
		if (key.startsWith("n:")) {
			key = key.slice(2);
			values = values.map((v) => v === "" ? void 0 : parseFloat(v));
		} else if (key.startsWith("b:")) {
			key = key.slice(2);
			values = values.map((v) => v === "on");
		}
		if (values.length > 1 && !is_array) throw new Error(`Form cannot contain duplicated keys — "${key}" has ${values.length} values`);
		set_nested_value(result, key, is_array ? values : values[0]);
	}
	return result;
}
var BINARY_FORM_CONTENT_TYPE = "application/x-sveltekit-formdata";
var BINARY_FORM_VERSION = 0;
var HEADER_BYTES = 7;
/**
* @param {Request} request
* @returns {Promise<{ data: Record<string, any>; meta: BinaryFormMeta; form_data: FormData | null }>}
*/
async function deserialize_binary_form(request) {
	if (request.headers.get("content-type") !== "application/x-sveltekit-formdata") {
		const form_data = await request.formData();
		return {
			data: convert_formdata(form_data),
			meta: {},
			form_data
		};
	}
	if (!request.body) throw deserialize_error("no body");
	const reader = request.body.getReader();
	/** @type {Array<Promise<Uint8Array<ArrayBuffer> | undefined>>} */
	const chunks = [];
	/**
	* @param {number} index
	* @returns {Promise<Uint8Array<ArrayBuffer> | undefined>}
	*/
	function get_chunk(index) {
		if (index in chunks) return chunks[index];
		let i = chunks.length;
		while (i <= index) {
			chunks[i] = reader.read().then((chunk) => chunk.value);
			i++;
		}
		return chunks[index];
	}
	/**
	* @param {number} offset
	* @param {number} length
	* @returns {Promise<Uint8Array | null>}
	*/
	async function get_buffer(offset, length) {
		/** @type {Uint8Array} */
		let start_chunk;
		let chunk_start = 0;
		/** @type {number} */
		let chunk_index;
		for (chunk_index = 0;; chunk_index++) {
			const chunk = await get_chunk(chunk_index);
			if (!chunk) return null;
			const chunk_end = chunk_start + chunk.byteLength;
			if (offset >= chunk_start && offset < chunk_end) {
				start_chunk = chunk;
				break;
			}
			chunk_start = chunk_end;
		}
		if (offset + length <= chunk_start + start_chunk.byteLength) return start_chunk.subarray(offset - chunk_start, offset + length - chunk_start);
		const chunks = [start_chunk.subarray(offset - chunk_start)];
		let cursor = start_chunk.byteLength - offset + chunk_start;
		while (cursor < length) {
			chunk_index++;
			let chunk = await get_chunk(chunk_index);
			if (!chunk) return null;
			if (chunk.byteLength > length - cursor) chunk = chunk.subarray(0, length - cursor);
			chunks.push(chunk);
			cursor += chunk.byteLength;
		}
		const buffer = new Uint8Array(length);
		cursor = 0;
		for (const chunk of chunks) {
			buffer.set(chunk, cursor);
			cursor += chunk.byteLength;
		}
		return buffer;
	}
	const header = await get_buffer(0, HEADER_BYTES);
	if (!header) throw deserialize_error("too short");
	if (header[0] !== BINARY_FORM_VERSION) throw deserialize_error(`got version ${header[0]}, expected version ${BINARY_FORM_VERSION}`);
	const header_view = new DataView(header.buffer, header.byteOffset, header.byteLength);
	const data_length = header_view.getUint32(1, true);
	const file_offsets_length = header_view.getUint16(5, true);
	const data_buffer = await get_buffer(HEADER_BYTES, data_length);
	if (!data_buffer) throw deserialize_error("data too short");
	/** @type {Array<number | undefined>} */
	let file_offsets;
	/** @type {number} */
	let files_start_offset;
	if (file_offsets_length > 0) {
		const file_offsets_buffer = await get_buffer(HEADER_BYTES + data_length, file_offsets_length);
		if (!file_offsets_buffer) throw deserialize_error("file offset table too short");
		const parsed_offsets = JSON.parse(decoder.decode(file_offsets_buffer));
		if (!Array.isArray(parsed_offsets) || parsed_offsets.some((n) => typeof n !== "number" || !Number.isInteger(n) || n < 0)) throw deserialize_error("invalid file offset table");
		file_offsets = parsed_offsets;
		files_start_offset = HEADER_BYTES + data_length + file_offsets_length;
	}
	/** @type {Array<{ offset: number, size: number }>} */
	const file_spans = [];
	const [data, meta] = parse(decoder.decode(data_buffer), { File: ([name, type, size, last_modified, index]) => {
		if (typeof name !== "string" || typeof type !== "string" || typeof size !== "number" || typeof last_modified !== "number" || typeof index !== "number") throw deserialize_error("invalid file metadata");
		let offset = file_offsets[index];
		if (offset === void 0) throw deserialize_error("duplicate file offset table index");
		file_offsets[index] = void 0;
		offset += files_start_offset;
		file_spans.push({
			offset,
			size
		});
		return new Proxy(new LazyFile(name, type, size, last_modified, get_chunk, offset), { getPrototypeOf() {
			return File.prototype;
		} });
	} });
	file_spans.sort((a, b) => a.offset - b.offset || a.size - b.size);
	for (let i = 1; i < file_spans.length; i++) {
		const previous = file_spans[i - 1];
		const current = file_spans[i];
		const previous_end = previous.offset + previous.size;
		if (previous_end < current.offset) throw deserialize_error("gaps in file data");
		if (previous_end > current.offset) throw deserialize_error("overlapping file data");
	}
	(async () => {
		let has_more = true;
		while (has_more) has_more = !!await get_chunk(chunks.length);
	})().catch(noop);
	return {
		data,
		meta,
		form_data: null
	};
}
/**
* @param {string} message
*/
function deserialize_error(message) {
	return new SvelteKitError(400, "Bad Request", `Could not deserialize binary form: ${message}`);
}
/** @implements {File} */
var LazyFile = class LazyFile {
	/** @type {(index: number) => Promise<Uint8Array<ArrayBuffer> | undefined>} */
	#get_chunk;
	/** @type {number} */
	#offset;
	/**
	* @param {string} name
	* @param {string} type
	* @param {number} size
	* @param {number} last_modified
	* @param {(index: number) => Promise<Uint8Array<ArrayBuffer> | undefined>} get_chunk
	* @param {number} offset
	*/
	constructor(name, type, size, last_modified, get_chunk, offset) {
		this.name = name;
		this.type = type;
		this.size = size;
		this.lastModified = last_modified;
		this.webkitRelativePath = "";
		this.#get_chunk = get_chunk;
		this.#offset = offset;
		this.arrayBuffer = this.arrayBuffer.bind(this);
		this.bytes = this.bytes.bind(this);
		this.slice = this.slice.bind(this);
		this.stream = this.stream.bind(this);
		this.text = this.text.bind(this);
	}
	/** @type {ArrayBuffer | undefined} */
	#buffer;
	async arrayBuffer() {
		this.#buffer ??= await new Response(this.stream()).arrayBuffer();
		return this.#buffer;
	}
	async bytes() {
		return new Uint8Array(await this.arrayBuffer());
	}
	/**
	* @param {number=} start
	* @param {number=} end
	* @param {string=} contentType
	*/
	slice(start = 0, end = this.size, contentType = this.type) {
		if (start < 0) start = Math.max(this.size + start, 0);
		else start = Math.min(start, this.size);
		if (end < 0) end = Math.max(this.size + end, 0);
		else end = Math.min(end, this.size);
		const size = Math.max(end - start, 0);
		return new LazyFile(this.name, contentType, size, this.lastModified, this.#get_chunk, this.#offset + start);
	}
	stream() {
		let cursor = 0;
		let chunk_index = 0;
		return new ReadableStream({
			start: async (controller) => {
				let chunk_start = 0;
				/** @type {Uint8Array} */
				let start_chunk;
				for (chunk_index = 0;; chunk_index++) {
					const chunk = await this.#get_chunk(chunk_index);
					if (!chunk) return null;
					const chunk_end = chunk_start + chunk.byteLength;
					if (this.#offset >= chunk_start && this.#offset < chunk_end) {
						start_chunk = chunk;
						break;
					}
					chunk_start = chunk_end;
				}
				if (this.#offset + this.size <= chunk_start + start_chunk.byteLength) {
					controller.enqueue(start_chunk.subarray(this.#offset - chunk_start, this.#offset + this.size - chunk_start));
					controller.close();
				} else {
					controller.enqueue(start_chunk.subarray(this.#offset - chunk_start));
					cursor = start_chunk.byteLength - this.#offset + chunk_start;
				}
			},
			pull: async (controller) => {
				chunk_index++;
				let chunk = await this.#get_chunk(chunk_index);
				if (!chunk) {
					controller.error("incomplete file data");
					controller.close();
					return;
				}
				if (chunk.byteLength > this.size - cursor) chunk = chunk.subarray(0, this.size - cursor);
				controller.enqueue(chunk);
				cursor += chunk.byteLength;
				if (cursor >= this.size) controller.close();
			}
		});
	}
	async text() {
		return decoder.decode(await this.arrayBuffer());
	}
};
var path_regex = /^[a-zA-Z_$]\w*(\.[a-zA-Z_$]\w*|\[\d+\])*$/;
/**
* @param {string} path
*/
function split_path(path) {
	if (!path_regex.test(path)) throw new Error(`Invalid path ${path}`);
	return path.split(/\.|\[|\]/).filter(Boolean);
}
/**
* Check if a property key is dangerous and could lead to prototype pollution
* @param {string} key
*/
function check_prototype_pollution(key) {
	if (key === "__proto__" || key === "constructor" || key === "prototype") throw new Error(`Invalid key "${key}"`);
}
/**
* Sets a value in a nested object using an array of keys, mutating the original object.
* @param {Record<string, any>} object
* @param {string[]} keys
* @param {any} value
*/
function deep_set(object, keys, value) {
	let current = object;
	for (let i = 0; i < keys.length - 1; i += 1) {
		const key = keys[i];
		check_prototype_pollution(key);
		const is_array = /^\d+$/.test(keys[i + 1]);
		const inner = Object.hasOwn(current, key) ? current[key] : void 0;
		const exists = inner != null;
		if (exists && is_array !== Array.isArray(inner)) throw new Error(`Invalid array key ${keys[i + 1]}`);
		if (!exists) {
			if (value === DELETE_KEY) return;
			current[key] = is_array ? [] : {};
		}
		current = current[key];
	}
	const final_key = keys[keys.length - 1];
	check_prototype_pollution(final_key);
	if (value === DELETE_KEY) delete current[final_key];
	else current[final_key] = value;
}
/**
* @param {StandardSchemaV1.Issue} issue
* @param {boolean} server Whether this issue came from server validation
*/
function normalize_issue(issue, server = false) {
	/** @type {InternalRemoteFormIssue} */
	const normalized = {
		name: "",
		path: [],
		message: issue.message,
		server
	};
	if (issue.path !== void 0) {
		let name = "";
		for (const segment of issue.path) {
			const key = typeof segment === "object" ? segment.key : segment;
			normalized.path.push(key);
			if (typeof key === "number") name += `[${key}]`;
			else if (typeof key === "string") name += name === "" ? key : "." + key;
		}
		normalized.name = name;
	}
	return normalized;
}
/**
* @param {InternalRemoteFormIssue[]} issues
*/
function flatten_issues(issues) {
	/** @type {Record<string, InternalRemoteFormIssue[]>} */
	const result = {};
	for (const issue of issues) {
		(result.$ ??= []).push(issue);
		let name = "";
		if (issue.path !== void 0) for (const key of issue.path) {
			if (typeof key === "number") name += `[${key}]`;
			else if (typeof key === "string") name += name === "" ? key : "." + key;
			(result[name] ??= []).push(issue);
		}
	}
	return result;
}
/**
* Gets a nested value from an object using a path array
* @param {Record<string, any>} object
* @param {(string | number)[]} path
* @returns {any}
*/
function deep_get(object, path) {
	let current = object;
	for (const key of path) {
		if (current == null || typeof current !== "object") return current;
		current = current[key];
	}
	return current;
}
/**
*
* @param {string} field_type
* @param {boolean} is_array
* @param {unknown} input_value
*/
function get_type_prefix(field_type, is_array, input_value) {
	if (field_type === "number" || field_type === "range") return "n:";
	if (field_type === "checkbox" && !is_array) return "b:";
	if (field_type === "hidden" || field_type === "submit") {
		const input_type = typeof input_value;
		if (input_type === "number") return "n:";
		if (input_type === "boolean") return "b:";
	}
	return "";
}
/**
* A deep-clone implementation specifically for form data, where
* we don't need to worry about cycles and whatnot
* @param {any} value
* @returns {any}
*/
function deep_clone(value) {
	if (value !== null && typeof value === "object") {
		if (value instanceof File) return value;
		if (Array.isArray(value)) return value.map(deep_clone);
		/** @type {Record<string, any>} */
		const clone = {};
		for (const key of Object.keys(value)) clone[key] = deep_clone(value[key]);
		return clone;
	}
	return value;
}
/**
* Creates a proxy-based field accessor for form data
* @param {any} target - Function or empty POJO
* @param {() => Record<string, any>} get_input - Function to get current input data
* @param {(path: (string | number)[], value: any) => void} set_input - Function to set input data
* @param {(path?: (string | number)[], all?: boolean) => Record<string, InternalRemoteFormIssue[]>} get_issues - Function to get current issues
* @param {(string | number)[]} path - Current access path
* @returns {any} Proxy object with name(), value(), and issues() methods
*/
function create_field_proxy(target, get_input, set_input, get_issues, path = []) {
	const get_value = () => {
		return deep_clone(deep_get(get_input(), path));
	};
	return new Proxy(target, { get(target, prop) {
		if (typeof prop === "symbol") return target[prop];
		if (/^\d+$/.test(prop)) return create_field_proxy({}, get_input, set_input, get_issues, [...path, parseInt(prop, 10)]);
		const key = build_path_string(path);
		if (prop === "set") {
			const set_func = function(newValue) {
				set_input(path, newValue);
				return newValue;
			};
			return create_field_proxy(set_func, get_input, set_input, get_issues, [...path, prop]);
		}
		if (prop === "value") return create_field_proxy(get_value, get_input, set_input, get_issues, [...path, prop]);
		if (prop === "issues" || prop === "allIssues") {
			const issues_func = () => {
				const all_issues = get_issues(path, prop === "allIssues")[key === "" ? "$" : key];
				if (prop === "allIssues") return all_issues?.map((issue) => ({
					path: issue.path,
					message: issue.message
				}));
				const issues = all_issues?.filter((issue) => issue.name === key)?.map((issue) => ({
					path: issue.path,
					message: issue.message
				}));
				return issues?.length ? issues : void 0;
			};
			return create_field_proxy(issues_func, get_input, set_input, get_issues, [...path, prop]);
		}
		if (prop === "as") {
			/**
			* @param {string} type
			* @param {unknown} [input_value]
			*/
			const as_func = (type, input_value) => {
				const is_array = type === "file multiple" || type === "select multiple" || type === "checkbox" && typeof input_value === "string";
				/** @type {Record<string, any>} */
				const base_props = {
					name: get_type_prefix(type, is_array, input_value) + key + (is_array ? "[]" : ""),
					get "aria-invalid"() {
						const issues = get_issues();
						return key in issues ? "true" : void 0;
					}
				};
				if (type !== "text" && type !== "select" && type !== "select multiple") base_props.type = type === "file multiple" ? "file" : type;
				if (type === "submit" || type === "hidden") return Object.defineProperties(base_props, { value: {
					value: typeof input_value === "boolean" ? input_value ? "on" : "off" : input_value,
					enumerable: true
				} });
				if (type === "select" || type === "select multiple") return Object.defineProperties(base_props, {
					multiple: {
						value: is_array,
						enumerable: true
					},
					value: {
						enumerable: true,
						get() {
							return get_value() ?? input_value;
						}
					}
				});
				if (type === "checkbox" || type === "radio") {
					if (type === "checkbox" && !is_array) return Object.defineProperties(base_props, {
						defaultChecked: {
							enumerable: true,
							get() {
								return input_value;
							}
						},
						checked: {
							enumerable: true,
							get() {
								return get_value() ?? input_value;
							}
						}
					});
					return Object.defineProperties(base_props, {
						value: {
							value: input_value ?? "on",
							enumerable: true
						},
						checked: {
							enumerable: true,
							get() {
								const value = get_value();
								if (type === "radio") return value === input_value;
								return (value ?? []).includes(input_value);
							}
						}
					});
				}
				if (type === "file" || type === "file multiple") return Object.defineProperties(base_props, {
					multiple: {
						value: is_array,
						enumerable: true
					},
					files: {
						enumerable: true,
						get() {
							const value = get_value();
							if (value instanceof File) {
								if (typeof DataTransfer !== "undefined") {
									const fileList = new DataTransfer();
									fileList.items.add(value);
									return fileList.files;
								}
								return {
									0: value,
									length: 1
								};
							}
							if (Array.isArray(value) && value.every((f) => f instanceof File)) {
								if (typeof DataTransfer !== "undefined") {
									const fileList = new DataTransfer();
									value.forEach((file) => fileList.items.add(file));
									return fileList.files;
								}
								/** @type {any} */
								const fileListLike = { length: value.length };
								value.forEach((file, index) => {
									fileListLike[index] = file;
								});
								return fileListLike;
							}
							return null;
						}
					}
				});
				return Object.defineProperties(base_props, {
					defaultValue: {
						enumerable: true,
						get() {
							return input_value;
						}
					},
					value: {
						enumerable: true,
						get() {
							const value = get_value() ?? input_value;
							return value != null ? String(value) : "";
						}
					}
				});
			};
			return create_field_proxy(as_func, get_input, set_input, get_issues, [...path, "as"]);
		}
		return create_field_proxy({}, get_input, set_input, get_issues, [...path, prop]);
	} });
}
/**
* Builds a path string from an array of path segments
* @param {(string | number)[]} path
* @returns {string}
*/
function build_path_string(path) {
	let result = "";
	for (const segment of path) if (typeof segment === "number") result += `[${segment}]`;
	else result += result === "" ? segment : "." + segment;
	return result;
}
/**
* @param {RemoteForm<any, any>} instance
* @deprecated remove in 3.0
*/
function throw_on_old_property_access(instance) {
	Object.defineProperty(instance, "field", { value: (name) => {
		const new_name = name.endsWith("[]") ? name.slice(0, -2) : name;
		throw new Error(`\`form.field\` has been removed: Instead of \`<input name={form.field('${name}')} />\` do \`<input {...form.fields.${new_name}.as(type)} />\``);
	} });
	for (const property of ["input", "issues"]) Object.defineProperty(instance, property, { get() {
		const new_name = property === "issues" ? "issues" : "value";
		return new Proxy({}, { get(_, prop) {
			const prop_string = typeof prop === "string" ? prop : String(prop);
			const old = prop_string.includes("[") || prop_string.includes(".") ? `['${prop_string}']` : `.${prop_string}`;
			const replacement = `.${prop_string}.${new_name}()`;
			throw new Error(`\`form.${property}\` has been removed: Instead of \`form.${property}${old}\` write \`form.fields${replacement}\``);
		} });
	} });
}
//#endregion
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+vite-plugin-svelte@7.2.0_svelte_da459b376329cf0681195252eb508031/node_modules/@sveltejs/kit/src/utils/http.js
/**
* Given an Accept header and a list of possible content types, pick
* the most suitable one to respond with
* @param {string} accept
* @param {string[]} types
*/
function negotiate(accept, types) {
	/** @type {Array<{ type: string, subtype: string, q: number, i: number }>} */
	const parts = [];
	accept.split(",").forEach((str, i) => {
		const match = /^[ \t]*([^/ \t]+)\/([^; \t]+)[ \t]*(?:;[ \t]*q=([0-9.]+))?/.exec(str);
		if (match) {
			const [, type, subtype, q = "1"] = match;
			parts.push({
				type,
				subtype,
				q: +q,
				i
			});
		}
	});
	parts.sort((a, b) => {
		if (a.q !== b.q) return b.q - a.q;
		if (a.subtype === "*" !== (b.subtype === "*")) return a.subtype === "*" ? 1 : -1;
		if (a.type === "*" !== (b.type === "*")) return a.type === "*" ? 1 : -1;
		return a.i - b.i;
	});
	let accepted;
	let min_priority = Infinity;
	for (const mimetype of types) {
		const [type, subtype] = mimetype.split("/");
		const priority = parts.findIndex((part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*"));
		if (priority !== -1 && priority < min_priority) {
			accepted = mimetype;
			min_priority = priority;
		}
	}
	return accepted;
}
/**
* Reads all `Set-Cookie` headers as separate values. `Headers.get('set-cookie')`
* collapses them into a single comma-joined string that browsers cannot parse, so
* we use `Headers.getSetCookie()` where available and fall back to splitting the
* joined string otherwise.
*
* TODO 3.0 `getSetCookie` is available in Node 19.7+; once we drop support for
* older versions we can use it directly and remove the `splitCookiesString` fallback
* @param {Headers} headers
* @returns {string[]}
*/
function get_set_cookies(headers) {
	if (typeof headers.getSetCookie === "function") return headers.getSetCookie();
	const set_cookie = headers.get("set-cookie");
	return set_cookie ? splitCookiesString(set_cookie) : [];
}
/**
* Returns `true` if the request contains a `content-type` header with the given type
* @param {Request} request
* @param  {...string} types
*/
function is_content_type(request, ...types) {
	const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
	return types.includes(type.toLowerCase());
}
/**
* @param {Request} request
*/
function is_form_content_type(request) {
	return is_content_type(request, "application/x-www-form-urlencoded", "multipart/form-data", "text/plain", BINARY_FORM_CONTENT_TYPE);
}
//#endregion
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+vite-plugin-svelte@7.2.0_svelte_da459b376329cf0681195252eb508031/node_modules/@sveltejs/kit/src/utils/escape.js
/**
* When inside a double-quoted attribute value, only `&` and `"` hold special meaning.
* @see https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state
* @type {Record<string, string>}
*/
var escape_html_attr_dict = {
	"&": "&amp;",
	"\"": "&quot;"
};
/**
* @type {Record<string, string>}
*/
var escape_html_dict = {
	"&": "&amp;",
	"<": "&lt;"
};
var escape_html_attr_regex = new RegExp(`[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
var escape_html_regex = new RegExp(`[${Object.keys(escape_html_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
/**
* Escapes unpaired surrogates (which are allowed in js strings but invalid in HTML) and
* escapes characters that are special.
*
* @param {string} str
* @param {boolean} [is_attr]
* @returns {string} escaped string
* @example const html = `<tag data-value="${escape_html('value', true)}">...</tag>`;
*/
function escape_html(str, is_attr) {
	const dict = is_attr ? escape_html_attr_dict : escape_html_dict;
	return str.replace(is_attr ? escape_html_attr_regex : escape_html_regex, (match) => {
		if (match.length === 2) return match;
		return dict[match] ?? `&#${match.charCodeAt(0)};`;
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+vite-plugin-svelte@7.2.0_svelte_da459b376329cf0681195252eb508031/node_modules/@sveltejs/kit/src/runtime/server/utils.js
/** @import { ServerHooks } from 'types' */
/**
* @param {Partial<Record<import('types').HttpMethod, any>>} mod
* @param {import('types').HttpMethod} method
*/
function method_not_allowed(mod, method) {
	return text(`${method} method not allowed`, {
		status: 405,
		headers: { allow: allowed_methods(mod).join(", ") }
	});
}
/** @param {Partial<Record<import('types').HttpMethod, any>>} mod */
function allowed_methods(mod) {
	const allowed = ENDPOINT_METHODS.filter((method) => method in mod);
	if ("GET" in mod && !("HEAD" in mod)) allowed.push("HEAD");
	return allowed;
}
/**
* @param {import('types').SSROptions} options
*/
function get_global_name(options) {
	return `__sveltekit_${options.version_hash}`;
}
/**
* Return as a response that renders the error.html
*
* @param {import('types').SSROptions} options
* @param {number} status
* @param {string} message
*/
function static_error_page(options, status, message) {
	return text(options.templates.error({
		status,
		message: escape_html(message)
	}), {
		headers: { "content-type": "text/html; charset=utf-8" },
		status
	});
}
/**
* @param {import('@sveltejs/kit').RequestEvent} event
* @param {import('types').RequestState} state
* @param {import('types').SSROptions} options
* @param {unknown} error
*/
async function handle_fatal_error(event, state, options, error) {
	error = error instanceof HttpError ? error : coalesce_to_error(error);
	const status = get_status(error);
	const body = await handle_error_and_jsonify(event, state, options, error);
	const type = negotiate(event.request.headers.get("accept") || "text/html", ["application/json", "text/html"]);
	if (event.isDataRequest || type === "application/json") return json(body, { status });
	return static_error_page(options, status, body.message);
}
/**
* @param {import('@sveltejs/kit').RequestEvent} event
* @param {import('types').RequestState} state
* @param {import('types').SSROptions} options
* @param {any} error
* @returns {Promise<App.Error>}
*/
async function handle_error_and_jsonify(event, state, options, error) {
	if (error instanceof HttpError) return {
		message: "Unknown Error",
		...error.body
	};
	const status = get_status(error);
	const message = get_message(error);
	return await with_request_store({
		event,
		state
	}, () => options.hooks.handleError({
		error,
		event,
		status,
		message
	})) ?? { message };
}
/**
* @param {number} status
* @param {string} location
*/
function redirect_response(status, location) {
	return new Response(void 0, {
		status,
		headers: { location }
	});
}
/**
* @param {import('@sveltejs/kit').RequestEvent} event
* @param {Error & { path: string }} error
*/
function clarify_devalue_error(event, error) {
	if (error.path) return `Data returned from \`load\` while rendering ${event.route.id} is not serializable: ${error.message} (${error.path}). If you need to serialize/deserialize custom types, use transport hooks: https://svelte.dev/docs/kit/hooks#transport.`;
	if (error.path === "") return `Data returned from \`load\` while rendering ${event.route.id} is not a plain object`;
	return error.message;
}
/**
* @param {import('types').ServerDataNode} node
*/
function serialize_uses(node) {
	const uses = {};
	if (node.uses && node.uses.dependencies.size > 0) uses.dependencies = Array.from(node.uses.dependencies);
	if (node.uses && node.uses.search_params.size > 0) uses.search_params = Array.from(node.uses.search_params);
	if (node.uses && node.uses.params.size > 0) uses.params = Array.from(node.uses.params);
	if (node.uses?.parent) uses.parent = 1;
	if (node.uses?.route) uses.route = 1;
	if (node.uses?.url) uses.url = 1;
	return uses;
}
/**
* Returns `true` if the given path was prerendered
* @param {import('@sveltejs/kit').SSRManifest} manifest
* @param {string} pathname Should include the base and be decoded
*/
function has_prerendered_path(manifest, pathname) {
	return manifest._.prerendered_routes.has(pathname) || pathname.at(-1) === "/" && manifest._.prerendered_routes.has(pathname.slice(0, -1));
}
/**
* Formats the error into a nice message with sanitized stack trace
* @param {number} status
* @param {Error} error
* @param {import('@sveltejs/kit').RequestEvent} event
*/
function format_server_error(status, error, event) {
	const formatted_text = `\n\x1b[1;31m[${status}] ${event.request.method} ${event.url.pathname}\x1b[0m`;
	if (status === 404) return formatted_text;
	return `${formatted_text}\n${error.stack}`;
}
/**
* Returns the filename without the extension. e.g., `+page.server`, `+page`, etc.
* @param {string | undefined} node_id
* @returns {string}
*/
function get_node_type(node_id) {
	const filename = (node_id?.split("/"))?.at(-1);
	if (!filename) return "unknown";
	return filename.split(".").slice(0, -1).join(".");
}
/**
* Counts HTML comments that are not SSI directives (which start with `<!--#`).
* Used to detect when `transformPageChunk` removes comments that Svelte needs for hydration.
* @param {string} str
* @returns {number}
*/
function count_non_ssi_comments(str) {
	return (str.match(/<!--(?!#)/g) ?? []).length;
}
/**
* Creates a serialiser for non-arbitrary POJOs using the app's transport hook
* @param {ServerHooks['transport']} transport
* @returns {(thing: unknown) => string | undefined}
*/
function create_replacer(transport) {
	/** @param {unknown} thing */
	const replacer = (thing) => {
		for (const key in transport) {
			const encoded = transport[key].encode(thing);
			if (encoded) return `app.decode('${key}', ${uneval(encoded, replacer)})`;
		}
	};
	return replacer;
}
//#endregion
export { SVELTE_KIT_ASSETS as A, set_nested_value as C, ENDPOINT_METHODS as D, parseString as E, MUTATIVE_METHODS as O, normalize_issue as S, uneval as T, negotiate as _, get_global_name as a, deserialize_binary_form as b, handle_fatal_error as c, redirect_response as d, serialize_uses as f, is_form_content_type as g, get_set_cookies as h, format_server_error as i, PAGE_METHODS as k, has_prerendered_path as l, escape_html as m, count_non_ssi_comments as n, get_node_type as o, static_error_page as p, create_replacer as r, handle_error_and_jsonify as s, clarify_devalue_error as t, method_not_allowed as u, create_field_proxy as v, throw_on_old_property_access as w, flatten_issues as x, deep_set as y };
