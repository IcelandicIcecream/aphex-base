//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.10.0_173235d9579f197e78425a9e1db71cc6/node_modules/@aphexcms/cms-core/dist/utils/logger.js
var LEVELS = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
	none: 4
};
var currentLevel = typeof process !== "undefined" && process.env.NODE_ENV === "production" ? "warn" : "debug";
function setLogLevel(level) {
	currentLevel = level;
}
function createMethod(level, consoleFn) {
	return (...args) => {
		if (LEVELS[currentLevel] > LEVELS[level]) return;
		if (args.length > 0 && typeof args[0] === "object" && args[0] !== null && !(args[0] instanceof Error)) {
			const ctx = args[0];
			const rest = args.slice(1);
			consoleFn(`[${level.toUpperCase()}]`, ...rest, ctx);
		} else consoleFn(`[${level.toUpperCase()}]`, ...args);
	};
}
var activeLogger = {
	debug: createMethod("debug", console.log),
	info: createMethod("info", console.log),
	warn: createMethod("warn", console.warn),
	error: createMethod("error", console.error)
};
function setLogger(logger) {
	activeLogger = logger;
}
var cmsLogger = {
	debug: (...args) => activeLogger.debug(...args),
	info: (...args) => activeLogger.info(...args),
	warn: (...args) => activeLogger.warn(...args),
	error: (...args) => activeLogger.error(...args)
};
//#endregion
export { setLogLevel as n, setLogger as r, cmsLogger as t };
