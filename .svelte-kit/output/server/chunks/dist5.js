import { s as __toESM, t as __commonJSMin } from "./rolldown-runtime.js";
import "./index-server.js";
import { $ as attr, h as html, mt as run, s as derived, u as head } from "./dev.js";
import { a as on } from "./internal.js";
import "clsx";
globalThis.Date;
var SvelteSet = globalThis.Set;
var SvelteMap = globalThis.Map;
globalThis.URL;
var SvelteURLSearchParams = globalThis.URLSearchParams;
var MediaQuery = class {
	current;
	/**
	* @param {string} query
	* @param {boolean} [matches]
	*/
	constructor(query, matches = false) {
		this.current = matches;
	}
};
/**
* @param {any} _
*/
function createSubscriber(_) {
	return () => {};
}
//#endregion
//#region ../../node_modules/.pnpm/runed@0.25.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/runed/dist/internal/configurable-globals.js
var defaultWindow$1 = void 0;
//#endregion
//#region ../../node_modules/.pnpm/runed@0.25.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/runed/dist/internal/utils/dom.js
/**
* Handles getting the active element in a document or shadow root.
* If the active element is within a shadow root, it will traverse the shadow root
* to find the active element.
* If not, it will return the active element in the document.
*
* @param document A document or shadow root to get the active element from.
* @returns The active element in the document or shadow root.
*/
function getActiveElement$1(document) {
	let activeElement = document.activeElement;
	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement;
		if (node === activeElement) break;
		else activeElement = node;
	}
	return activeElement;
}
//#endregion
//#region ../../node_modules/.pnpm/runed@0.25.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/runed/dist/utilities/active-element/active-element.svelte.js
var ActiveElement$1 = class {
	#document;
	#subscribe;
	constructor(options = {}) {
		const { window = defaultWindow$1, document = window?.document } = options;
		if (window === void 0) return;
		this.#document = document;
		this.#subscribe = createSubscriber((update) => {
			const cleanupFocusIn = on(window, "focusin", update);
			const cleanupFocusOut = on(window, "focusout", update);
			return () => {
				cleanupFocusIn();
				cleanupFocusOut();
			};
		});
	}
	get current() {
		this.#subscribe?.();
		if (!this.#document) return null;
		return getActiveElement$1(this.#document);
	}
};
new ActiveElement$1();
//#endregion
//#region ../../node_modules/.pnpm/runed@0.25.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/runed/dist/utilities/watch/watch.svelte.js
function runWatcher$1(sources, flush, effect, options = {}) {
	const { lazy = false } = options;
}
function watch$1(sources, effect, options) {
	runWatcher$1(sources, "post", effect, options);
}
function watchPre$1(sources, effect, options) {
	runWatcher$1(sources, "pre", effect, options);
}
watch$1.pre = watchPre$1;
function watchOnce$1(source, effect) {}
function watchOncePre$1(source, effect) {}
watchOnce$1.pre = watchOncePre$1;
//#endregion
//#region ../../node_modules/.pnpm/runed@0.25.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/runed/dist/utilities/persisted-state/persisted-state.svelte.js
function getStorage(storageType, window) {
	switch (storageType) {
		case "local": return window.localStorage;
		case "session": return window.sessionStorage;
	}
}
/**
* Creates reactive state that is persisted and synchronized across browser sessions and tabs using Web Storage.
* @param key The unique key used to store the state in the storage.
* @param initialValue The initial value of the state if not already present in the storage.
* @param options Configuration options including storage type, serializer for complex data types, and whether to sync state changes across tabs.
*
* @see {@link https://runed.dev/docs/utilities/persisted-state}
*/
var PersistedState = class {
	#current;
	#key;
	#serializer;
	#storage;
	#subscribe;
	#version = 0;
	constructor(key, initialValue, options = {}) {
		const { storage: storageType = "local", serializer = {
			serialize: JSON.stringify,
			deserialize: JSON.parse
		}, syncTabs = true, window = defaultWindow$1 } = options;
		this.#current = initialValue;
		this.#key = key;
		this.#serializer = serializer;
		if (window === void 0) return;
		const storage = getStorage(storageType, window);
		this.#storage = storage;
		const existingValue = storage.getItem(key);
		if (existingValue !== null) this.#current = this.#deserialize(existingValue);
		else this.#serialize(initialValue);
		if (syncTabs && storageType === "local") this.#subscribe = createSubscriber(() => {
			return on(window, "storage", this.#handleStorageEvent);
		});
	}
	get current() {
		this.#subscribe?.();
		this.#version;
		const root = this.#deserialize(this.#storage?.getItem(this.#key)) ?? this.#current;
		const proxies = /* @__PURE__ */ new WeakMap();
		const proxy = (value) => {
			if (value === null || value?.constructor.name === "Date" || typeof value !== "object") return value;
			let p = proxies.get(value);
			if (!p) {
				p = new Proxy(value, {
					get: (target, property) => {
						this.#version;
						return proxy(Reflect.get(target, property));
					},
					set: (target, property, value) => {
						this.#version += 1;
						Reflect.set(target, property, value);
						this.#serialize(root);
						return true;
					}
				});
				proxies.set(value, p);
			}
			return p;
		};
		return proxy(root);
	}
	set current(newValue) {
		this.#serialize(newValue);
		this.#version += 1;
	}
	#handleStorageEvent = (event) => {
		if (event.key !== this.#key || event.newValue === null) return;
		this.#current = this.#deserialize(event.newValue);
		this.#version += 1;
	};
	#deserialize(value) {
		try {
			return this.#serializer.deserialize(value);
		} catch (error) {
			console.error(`Error when parsing "${value}" from persisted store "${this.#key}"`, error);
			return;
		}
	}
	#serialize(value) {
		try {
			if (value != void 0) this.#storage?.setItem(this.#key, this.#serializer.serialize(value));
		} catch (error) {
			console.error(`Error when writing value from persisted store "${this.#key}" to ${this.#storage}`, error);
		}
	}
};
//#endregion
//#region ../../node_modules/.pnpm/runed@0.25.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/runed/dist/utilities/resource/resource.svelte.js
function debounce(fn, delay) {
	let timeoutId;
	let lastResolve = null;
	return (...args) => {
		return new Promise((resolve) => {
			if (lastResolve) lastResolve(void 0);
			lastResolve = resolve;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(async () => {
				const result = await fn(...args);
				if (lastResolve) {
					lastResolve(result);
					lastResolve = null;
				}
			}, delay);
		});
	};
}
function throttle(fn, delay) {
	let lastRun = 0;
	let lastPromise = null;
	return (...args) => {
		const now = Date.now();
		if (lastRun && now - lastRun < delay) return lastPromise ?? Promise.resolve(void 0);
		lastRun = now;
		lastPromise = fn(...args);
		return lastPromise;
	};
}
function runResource(source, fetcher, options = {}, effectFn) {
	const { lazy = false, once = false, initialValue, debounce: debounceTime, throttle: throttleTime } = options;
	let current = initialValue;
	let loading = false;
	let error = void 0;
	let cleanupFns = [];
	const runCleanup = () => {
		cleanupFns.forEach((fn) => fn());
		cleanupFns = [];
	};
	const onCleanup = (fn) => {
		cleanupFns = [...cleanupFns, fn];
	};
	const baseFetcher = async (value, previousValue, refetching = false) => {
		try {
			loading = true;
			error = void 0;
			runCleanup();
			const controller = new AbortController();
			onCleanup(() => controller.abort());
			const result = await fetcher(value, previousValue, {
				data: current,
				refetching,
				onCleanup,
				signal: controller.signal
			});
			current = result;
			return result;
		} catch (e) {
			if (!(e instanceof DOMException && e.name === "AbortError")) error = e;
			return;
		} finally {
			loading = false;
		}
	};
	const runFetcher = debounceTime ? debounce(baseFetcher, debounceTime) : throttleTime ? throttle(baseFetcher, throttleTime) : baseFetcher;
	const sources = Array.isArray(source) ? source : [source];
	let prevValues;
	effectFn((values, previousValues) => {
		if (once && prevValues) return;
		if (prevValues && JSON.stringify(values) === JSON.stringify(prevValues)) return;
		prevValues = values;
		runFetcher(Array.isArray(source) ? values : values[0], Array.isArray(source) ? previousValues : previousValues?.[0]);
	}, { lazy });
	return {
		get current() {
			return current;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		mutate: (value) => {
			current = value;
		},
		refetch: (info) => {
			const values = sources.map((s) => s());
			return runFetcher(Array.isArray(source) ? values : values[0], Array.isArray(source) ? values : values[0], info ?? true);
		}
	};
}
function resource(source, fetcher, options) {
	return runResource(source, fetcher, options, (fn, options) => {
		const sources = Array.isArray(source) ? source : [source];
		const getters = () => sources.map((s) => s());
		watch$1(getters, (values, previousValues) => {
			fn(values, previousValues ?? []);
		}, options);
	});
}
function resourcePre(source, fetcher, options) {
	return runResource(source, fetcher, options, (fn, options) => {
		const sources = Array.isArray(source) ? source : [source];
		const getter = () => sources.map((s) => s());
		watch$1.pre(getter, (values, previousValues) => {
			fn(values, previousValues ?? []);
		}, options);
	});
}
resource.pre = resourcePre;
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/utils.js
/**
* Sanitizes an array of classnames by removing any empty strings.
*/
function sanitizeClassNames(classNames) {
	return classNames.filter((className) => className.length > 0);
}
var noopStorage = {
	getItem: (_key) => null,
	setItem: (_key, _value) => {}
};
var isBrowser = typeof document !== "undefined";
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/svelte-toolbelt/dist/utils/is.js
function isFunction(value) {
	return typeof value === "function";
}
function isObject(value) {
	return value !== null && typeof value === "object";
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/svelte-toolbelt/dist/box/box.svelte.js
var BoxSymbol = Symbol("box");
var isWritableSymbol = Symbol("is-writable");
function isBox(value) {
	return isObject(value) && BoxSymbol in value;
}
/**
* @returns Whether the value is a WritableBox
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function isWritableBox(value) {
	return box.isBox(value) && isWritableSymbol in value;
}
function box(initialValue) {
	let current = initialValue;
	return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return current;
		},
		set current(v) {
			current = v;
		}
	};
}
function boxWith(getter, setter) {
	const derived$1 = derived(getter);
	if (setter) return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return derived$1();
		},
		set current(v) {
			setter(v);
		}
	};
	return {
		[BoxSymbol]: true,
		get current() {
			return getter();
		}
	};
}
function boxFrom(value) {
	if (box.isBox(value)) return value;
	if (isFunction(value)) return box.with(value);
	return box(value);
}
/**
* Function that gets an object of boxes, and returns an object of reactive values
*
* @example
* const count = box(0)
* const flat = box.flatten({ count, double: box.with(() => count.current) })
* // type of flat is { count: number, readonly double: number }
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function boxFlatten(boxes) {
	return Object.entries(boxes).reduce((acc, [key, b]) => {
		if (!box.isBox(b)) return Object.assign(acc, { [key]: b });
		if (box.isWritableBox(b)) Object.defineProperty(acc, key, {
			get() {
				return b.current;
			},
			set(v) {
				b.current = v;
			}
		});
		else Object.defineProperty(acc, key, { get() {
			return b.current;
		} });
		return acc;
	}, {});
}
/**
* Function that converts a box to a readonly box.
*
* @example
* const count = box(0) // WritableBox<number>
* const countReadonly = box.readonly(count) // ReadableBox<number>
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function toReadonlyBox(b) {
	if (!box.isWritableBox(b)) return b;
	return {
		[BoxSymbol]: true,
		get current() {
			return b.current;
		}
	};
}
box.from = boxFrom;
box.with = boxWith;
box.flatten = boxFlatten;
box.readonly = toReadonlyBox;
box.isBox = isBox;
box.isWritableBox = isWritableBox;
//#endregion
//#region ../../node_modules/.pnpm/inline-style-parser@0.2.4/node_modules/inline-style-parser/index.js
var require_inline_style_parser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
	var NEWLINE_REGEX = /\n/g;
	var WHITESPACE_REGEX = /^\s*/;
	var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
	var COLON_REGEX = /^:\s*/;
	var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
	var SEMICOLON_REGEX = /^[;\s]*/;
	var TRIM_REGEX = /^\s+|\s+$/g;
	var NEWLINE = "\n";
	var FORWARD_SLASH = "/";
	var ASTERISK = "*";
	var EMPTY_STRING = "";
	var TYPE_COMMENT = "comment";
	var TYPE_DECLARATION = "declaration";
	/**
	* @param {String} style
	* @param {Object} [options]
	* @return {Object[]}
	* @throws {TypeError}
	* @throws {Error}
	*/
	module.exports = function(style, options) {
		if (typeof style !== "string") throw new TypeError("First argument must be a string");
		if (!style) return [];
		options = options || {};
		/**
		* Positional.
		*/
		var lineno = 1;
		var column = 1;
		/**
		* Update lineno and column based on `str`.
		*
		* @param {String} str
		*/
		function updatePosition(str) {
			var lines = str.match(NEWLINE_REGEX);
			if (lines) lineno += lines.length;
			var i = str.lastIndexOf(NEWLINE);
			column = ~i ? str.length - i : column + str.length;
		}
		/**
		* Mark position and patch `node.position`.
		*
		* @return {Function}
		*/
		function position() {
			var start = {
				line: lineno,
				column
			};
			return function(node) {
				node.position = new Position(start);
				whitespace();
				return node;
			};
		}
		/**
		* Store position information for a node.
		*
		* @constructor
		* @property {Object} start
		* @property {Object} end
		* @property {undefined|String} source
		*/
		function Position(start) {
			this.start = start;
			this.end = {
				line: lineno,
				column
			};
			this.source = options.source;
		}
		/**
		* Non-enumerable source string.
		*/
		Position.prototype.content = style;
		var errorsList = [];
		/**
		* Error `msg`.
		*
		* @param {String} msg
		* @throws {Error}
		*/
		function error(msg) {
			var err = /* @__PURE__ */ new Error(options.source + ":" + lineno + ":" + column + ": " + msg);
			err.reason = msg;
			err.filename = options.source;
			err.line = lineno;
			err.column = column;
			err.source = style;
			if (options.silent) errorsList.push(err);
			else throw err;
		}
		/**
		* Match `re` and return captures.
		*
		* @param {RegExp} re
		* @return {undefined|Array}
		*/
		function match(re) {
			var m = re.exec(style);
			if (!m) return;
			var str = m[0];
			updatePosition(str);
			style = style.slice(str.length);
			return m;
		}
		/**
		* Parse whitespace.
		*/
		function whitespace() {
			match(WHITESPACE_REGEX);
		}
		/**
		* Parse comments.
		*
		* @param {Object[]} [rules]
		* @return {Object[]}
		*/
		function comments(rules) {
			var c;
			rules = rules || [];
			while (c = comment()) if (c !== false) rules.push(c);
			return rules;
		}
		/**
		* Parse comment.
		*
		* @return {Object}
		* @throws {Error}
		*/
		function comment() {
			var pos = position();
			if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;
			var i = 2;
			while (EMPTY_STRING != style.charAt(i) && (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))) ++i;
			i += 2;
			if (EMPTY_STRING === style.charAt(i - 1)) return error("End of comment missing");
			var str = style.slice(2, i - 2);
			column += 2;
			updatePosition(str);
			style = style.slice(i);
			column += 2;
			return pos({
				type: TYPE_COMMENT,
				comment: str
			});
		}
		/**
		* Parse declaration.
		*
		* @return {Object}
		* @throws {Error}
		*/
		function declaration() {
			var pos = position();
			var prop = match(PROPERTY_REGEX);
			if (!prop) return;
			comment();
			if (!match(COLON_REGEX)) return error("property missing ':'");
			var val = match(VALUE_REGEX);
			var ret = pos({
				type: TYPE_DECLARATION,
				property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
				value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING
			});
			match(SEMICOLON_REGEX);
			return ret;
		}
		/**
		* Parse declarations.
		*
		* @return {Object[]}
		*/
		function declarations() {
			var decls = [];
			comments(decls);
			var decl;
			while (decl = declaration()) if (decl !== false) {
				decls.push(decl);
				comments(decls);
			}
			return decls;
		}
		whitespace();
		return declarations();
	};
	/**
	* Trim `str`.
	*
	* @param {String} str
	* @return {String}
	*/
	function trim(str) {
		return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/style-to-object@1.0.9/node_modules/style-to-object/esm/index.mjs
var import_cjs = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = StyleToObject;
	var inline_style_parser_1 = __importDefault(require_inline_style_parser());
	/**
	* Parses inline style to object.
	*
	* @param style - Inline style.
	* @param iterator - Iterator.
	* @returns - Style object or null.
	*
	* @example Parsing inline style to object:
	*
	* ```js
	* import parse from 'style-to-object';
	* parse('line-height: 42;'); // { 'line-height': '42' }
	* ```
	*/
	function StyleToObject(style, iterator) {
		var styleObject = null;
		if (!style || typeof style !== "string") return styleObject;
		var declarations = (0, inline_style_parser_1.default)(style);
		var hasIterator = typeof iterator === "function";
		declarations.forEach(function(declaration) {
			if (declaration.type !== "declaration") return;
			var property = declaration.property, value = declaration.value;
			if (hasIterator) iterator(property, value, declaration);
			else if (value) {
				styleObject = styleObject || {};
				styleObject[property] = value;
			}
		});
		return styleObject;
	}
})))(), 1);
import_cjs.default.default || import_cjs.default;
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/svelte-toolbelt/dist/utils/style-to-css.js
function createParser(matcher, replacer) {
	const regex = RegExp(matcher, "g");
	return (str) => {
		if (typeof str !== "string") throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
		if (!str.match(regex)) return str;
		return str.replace(regex, replacer);
	};
}
var camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
function styleToCSS(styleObj) {
	if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
	return Object.keys(styleObj).map((property) => `${camelToKebab(property)}: ${styleObj[property]};`).join("\n");
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/svelte-toolbelt/dist/utils/style.js
function styleToString(style = {}) {
	return styleToCSS(style).replace("\n", " ");
}
styleToString({
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0",
	transform: "translateX(-100%)"
});
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/runed/dist/internal/configurable-globals.js
var defaultWindow = void 0;
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/runed/dist/internal/utils/dom.js
/**
* Handles getting the active element in a document or shadow root.
* If the active element is within a shadow root, it will traverse the shadow root
* to find the active element.
* If not, it will return the active element in the document.
*
* @param document A document or shadow root to get the active element from.
* @returns The active element in the document or shadow root.
*/
function getActiveElement(document) {
	let activeElement = document.activeElement;
	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement;
		if (node === activeElement) break;
		else activeElement = node;
	}
	return activeElement;
}
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/runed/dist/utilities/active-element/active-element.svelte.js
var ActiveElement = class {
	#document;
	#subscribe;
	constructor(options = {}) {
		const { window = defaultWindow, document = window?.document } = options;
		if (window === void 0) return;
		this.#document = document;
		this.#subscribe = createSubscriber((update) => {
			const cleanupFocusIn = on(window, "focusin", update);
			const cleanupFocusOut = on(window, "focusout", update);
			return () => {
				cleanupFocusIn();
				cleanupFocusOut();
			};
		});
	}
	get current() {
		this.#subscribe?.();
		if (!this.#document) return null;
		return getActiveElement(this.#document);
	}
};
new ActiveElement();
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/runed/dist/utilities/watch/watch.svelte.js
function runWatcher(sources, flush, effect, options = {}) {
	const { lazy = false } = options;
}
function watch(sources, effect, options) {
	runWatcher(sources, "post", effect, options);
}
function watchPre(sources, effect, options) {
	runWatcher(sources, "pre", effect, options);
}
watch.pre = watchPre;
function watchOnce(source, effect) {}
function watchOncePre(source, effect) {}
watchOnce.pre = watchOncePre;
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/storage-keys.svelte.js
var modeStorageKey = box("mode-watcher-mode");
var themeStorageKey = box("mode-watcher-theme");
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/modes.js
/**
* the modes that are supported, used for validation & type
* derivation
*/
var modes = [
	"dark",
	"light",
	"system"
];
function isValidMode(value) {
	if (typeof value !== "string") return false;
	return modes.includes(value);
}
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/mode-states.svelte.js
var UserPrefersMode = class {
	#defaultValue = "system";
	#storage = isBrowser ? localStorage : noopStorage;
	#initialValue = this.#storage.getItem(modeStorageKey.current);
	#value = isValidMode(this.#initialValue) ? this.#initialValue : this.#defaultValue;
	#persisted = this.#makePersisted();
	#makePersisted(value = this.#value) {
		return new PersistedState(modeStorageKey.current, value, { serializer: {
			serialize: (v) => v,
			deserialize: (v) => {
				if (isValidMode(v)) return v;
				return this.#defaultValue;
			}
		} });
	}
	constructor() {}
	get current() {
		return this.#persisted.current;
	}
	set current(newValue) {
		this.#persisted.current = newValue;
	}
};
var SystemPrefersMode = class {
	#defaultValue = void 0;
	#track = true;
	#current = this.#defaultValue;
	#mediaQueryState = typeof window !== "undefined" && typeof window.matchMedia === "function" ? new MediaQuery("prefers-color-scheme: light") : { current: false };
	query() {
		if (!isBrowser) return;
		this.#current = this.#mediaQueryState.current ? "light" : "dark";
	}
	tracking(active) {
		this.#track = active;
	}
	constructor() {
		this.query = this.query.bind(this);
		this.tracking = this.tracking.bind(this);
	}
	get current() {
		return this.#current;
	}
};
/**
* Writable state that represents the user's preferred mode
* (`"dark"`, `"light"` or `"system"`)
*/
var userPrefersMode = new UserPrefersMode();
/**
* Readable store that represents the system's preferred mode (`"dark"`, `"light"` or `undefined`)
*/
var systemPrefersMode = new SystemPrefersMode();
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/theme-state.svelte.js
var CustomTheme = class {
	#storage = isBrowser ? localStorage : noopStorage;
	#initialValue = this.#storage.getItem(themeStorageKey.current);
	#value = this.#initialValue === null || this.#initialValue === void 0 ? "" : this.#initialValue;
	#persisted = this.#makePersisted();
	#makePersisted(value = this.#value) {
		return new PersistedState(themeStorageKey.current, value, { serializer: {
			serialize: (v) => {
				if (typeof v !== "string") return "";
				return v;
			},
			deserialize: (v) => v
		} });
	}
	constructor() {}
	/**
	* The current theme.
	* @returns The current theme.
	*/
	get current() {
		return this.#persisted.current;
	}
	/**
	* Set the current theme.
	* @param newValue The new theme to set.
	*/
	set current(newValue) {
		this.#persisted.current = newValue;
	}
};
/**
* A custom theme to apply and persist to the root `html` element.
*/
var customTheme = new CustomTheme();
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/without-transition.js
var timeoutAction;
var timeoutEnable;
/**
* Whether this is the first time the function has been
* called, which will be true for the initial load, where
* we shouldn't need to disable any transitions, as there
* is nothing to transition from.
*/
var hasLoaded = false;
var styleElement = null;
function getStyleElement() {
	if (styleElement) return styleElement;
	styleElement = document.createElement("style");
	styleElement.appendChild(document.createTextNode(`* {
		-webkit-transition: none !important;
		-moz-transition: none !important;
		-o-transition: none !important;
		-ms-transition: none !important;
		transition: none !important;
	}`));
	return styleElement;
}
function withoutTransition(action, synchronous = false) {
	if (typeof document === "undefined") return;
	if (!hasLoaded) {
		hasLoaded = true;
		action();
		return;
	}
	if (typeof process !== "undefined" && process.env.NODE_ENV === "test" || typeof window !== "undefined" && window.__vitest_worker__) {
		action();
		return;
	}
	clearTimeout(timeoutAction);
	clearTimeout(timeoutEnable);
	const style = getStyleElement();
	const disable = () => document.head.appendChild(style);
	const enable = () => {
		if (style.parentNode) document.head.removeChild(style);
	};
	function executeAction() {
		action();
		window.requestAnimationFrame(enable);
	}
	if (typeof window.requestAnimationFrame !== "undefined") {
		disable();
		if (synchronous) executeAction();
		else window.requestAnimationFrame(() => {
			executeAction();
		});
		return;
	}
	disable();
	timeoutAction = window.setTimeout(() => {
		action();
		timeoutEnable = window.setTimeout(enable, 16);
	}, 16);
}
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/states.svelte.js
var themeColors = box(void 0);
var disableTransitions = box(true);
var synchronousModeChanges = box(false);
var darkClassNames = box([]);
var lightClassNames = box([]);
function createDerivedMode() {
	const current = derived(() => {
		if (!isBrowser) return void 0;
		const derivedMode = userPrefersMode.current === "system" ? systemPrefersMode.current : userPrefersMode.current;
		const sanitizedDarkClassNames = sanitizeClassNames(darkClassNames.current);
		const sanitizedLightClassNames = sanitizeClassNames(lightClassNames.current);
		function update() {
			const htmlEl = document.documentElement;
			const themeColorEl = document.querySelector("meta[name=\"theme-color\"]");
			if (derivedMode === "light") {
				if (sanitizedDarkClassNames.length) htmlEl.classList.remove(...sanitizedDarkClassNames);
				if (sanitizedLightClassNames.length) htmlEl.classList.add(...sanitizedLightClassNames);
				htmlEl.style.colorScheme = "light";
				if (themeColorEl && themeColors.current) themeColorEl.setAttribute("content", themeColors.current.light);
			} else {
				if (sanitizedLightClassNames.length) htmlEl.classList.remove(...sanitizedLightClassNames);
				if (sanitizedDarkClassNames.length) htmlEl.classList.add(...sanitizedDarkClassNames);
				htmlEl.style.colorScheme = "dark";
				if (themeColorEl && themeColors.current) themeColorEl.setAttribute("content", themeColors.current.dark);
			}
		}
		if (disableTransitions.current) withoutTransition(update, synchronousModeChanges.current);
		else update();
		return derivedMode;
	});
	return { get current() {
		return current();
	} };
}
function createDerivedTheme() {
	const current = derived(() => {
		customTheme.current;
		if (!isBrowser) return void 0;
		function update() {
			document.documentElement.setAttribute("data-theme", customTheme.current);
		}
		if (disableTransitions.current) withoutTransition(update, run(() => synchronousModeChanges.current));
		else update();
		return customTheme.current;
	});
	return { get current() {
		return current();
	} };
}
/**
* Derived store that represents the current mode (`"dark"`, `"light"` or `undefined`)
*/
var derivedMode = createDerivedMode();
createDerivedTheme();
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/mode.js
/** Toggle between light and dark mode */
function toggleMode() {
	userPrefersMode.current = derivedMode.current === "dark" ? "light" : "dark";
}
function defineConfig(config) {
	return config;
}
/** Used to set the mode on initial page load to prevent FOUC */
function setInitialMode({ defaultMode = "system", themeColors, darkClassNames = ["dark"], lightClassNames = [], defaultTheme = "", modeStorageKey = "mode-watcher-mode", themeStorageKey = "mode-watcher-theme" }) {
	const rootEl = document.documentElement;
	const mode = localStorage.getItem(modeStorageKey) ?? defaultMode;
	const theme = localStorage.getItem(themeStorageKey) ?? defaultTheme;
	const light = mode === "light" || mode === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
	if (light) {
		if (darkClassNames.length) rootEl.classList.remove(...darkClassNames.filter(Boolean));
		if (lightClassNames.length) rootEl.classList.add(...lightClassNames.filter(Boolean));
	} else {
		if (lightClassNames.length) rootEl.classList.remove(...lightClassNames.filter(Boolean));
		if (darkClassNames.length) rootEl.classList.add(...darkClassNames.filter(Boolean));
	}
	rootEl.style.colorScheme = light ? "light" : "dark";
	if (themeColors) {
		const themeMetaEl = document.querySelector("meta[name=\"theme-color\"]");
		if (themeMetaEl) themeMetaEl.setAttribute("content", mode === "light" ? themeColors.light : themeColors.dark);
	}
	if (theme) {
		rootEl.setAttribute("data-theme", theme);
		localStorage.setItem(themeStorageKey, theme);
	}
	localStorage.setItem(modeStorageKey, mode);
}
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/components/mode-watcher-lite.svelte
function Mode_watcher_lite($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { themeColors } = $$props;
		if (themeColors) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<meta name="theme-color"${attr("content", themeColors.dark)}/>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/components/mode-watcher-full.svelte
function Mode_watcher_full($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { trueNonce = "", initConfig, themeColors } = $$props;
		head("1tzlcz5", $$renderer, ($$renderer) => {
			if (themeColors) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<meta name="theme-color"${attr("content", themeColors.dark)}/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> ${html(`<script${trueNonce ? ` nonce=${trueNonce}` : ""}>(` + setInitialMode.toString() + `)(` + JSON.stringify(initConfig) + `);<\/script>`)}`);
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/mode-watcher@1.1.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/mode-watcher/dist/components/mode-watcher.svelte
function Mode_watcher($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { track = true, defaultMode = "system", themeColors: themeColorsProp, disableTransitions: disableTransitionsProp = true, darkClassNames: darkClassNamesProp = ["dark"], lightClassNames: lightClassNamesProp = [], defaultTheme = "", nonce = "", themeStorageKey: themeStorageKeyProp = "mode-watcher-theme", modeStorageKey: modeStorageKeyProp = "mode-watcher-mode", disableHeadScriptInjection = false, synchronousModeChanges: synchronousModeChangesProp = false } = $$props;
		modeStorageKey.current = modeStorageKeyProp;
		themeStorageKey.current = themeStorageKeyProp;
		darkClassNames.current = darkClassNamesProp;
		lightClassNames.current = lightClassNamesProp;
		disableTransitions.current = disableTransitionsProp;
		themeColors.current = themeColorsProp;
		synchronousModeChanges.current = synchronousModeChangesProp;
		const initConfig = defineConfig({
			defaultMode,
			themeColors: themeColorsProp,
			darkClassNames: darkClassNamesProp,
			lightClassNames: lightClassNamesProp,
			defaultTheme,
			modeStorageKey: modeStorageKeyProp,
			themeStorageKey: themeStorageKeyProp
		});
		const trueNonce = derived(() => typeof window === "undefined" ? nonce : "");
		if (disableHeadScriptInjection) {
			$$renderer.push("<!--[0-->");
			Mode_watcher_lite($$renderer, { themeColors: themeColors.current });
		} else {
			$$renderer.push("<!--[-1-->");
			Mode_watcher_full($$renderer, {
				trueNonce: trueNonce(),
				initConfig,
				themeColors: themeColors.current
			});
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { SvelteMap as a, createSubscriber as c, MediaQuery as i, toggleMode as n, SvelteSet as o, derivedMode as r, SvelteURLSearchParams as s, Mode_watcher as t };
