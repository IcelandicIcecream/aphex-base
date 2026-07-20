import { c as mergeCapabilityCatalog, i as defineCapability } from "./capabilities.js";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/plugins/resolver.js
function createPartResolver(plugins = []) {
	const allParts = plugins.flatMap((p) => p.parts ?? []);
	const seen = /* @__PURE__ */ new Map();
	for (const part of allParts) if ("id" in part && typeof part.id === "string") {
		const bucket = seen.get(part.implements) ?? /* @__PURE__ */ new Set();
		if (bucket.has(part.id)) throw new Error(`Duplicate plugin part id "${part.id}" for ${part.implements}. Part ids must be unique per extension point.`);
		bucket.add(part.id);
		seen.set(part.implements, bucket);
	}
	const settingsIds = /* @__PURE__ */ new Set();
	for (const part of allParts) {
		if (part.implements !== "aphex/settings") continue;
		if (settingsIds.has(part.pluginId)) throw new Error(`Duplicate plugin settings declaration for "${part.pluginId}". Each plugin may declare settings once.`);
		settingsIds.add(part.pluginId);
	}
	const getParts = (kind) => allParts.filter((p) => p.implements === kind);
	const hasCaps = (required, caps, overrideAccess) => overrideAccess || !required || required.length === 0 || required.every((c) => caps.includes(c));
	return {
		plugins,
		getParts,
		schemaTypes: () => getParts("aphex/schema").flatMap((p) => p.schemas),
		applySchemaTransforms: (schemas) => getParts("aphex/schema/transform").reduce((acc, part) => part.transform(acc), schemas),
		serverRoutes: () => getParts("aphex/server/route"),
		capabilities: () => {
			const set = /* @__PURE__ */ new Set();
			for (const p of getParts("aphex/capabilities")) for (const c of p.capabilities) set.add(typeof c === "string" ? c : c.id);
			return [...set];
		},
		capabilityCatalog: () => {
			const pluginDefs = [];
			for (const p of getParts("aphex/capabilities")) for (const c of p.capabilities) pluginDefs.push(typeof c === "string" ? defineCapability(c) : c);
			return mergeCapabilityCatalog(pluginDefs);
		},
		documentActions: ({ schemaName, capabilities = [], overrideAccess = false }) => getParts("aphex/document/action").filter((a) => !a.appliesTo || a.appliesTo.includes(schemaName)).filter((a) => hasCaps(a.requiredCapabilities, capabilities, overrideAccess)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		adminTools: ({ capabilities = [], overrideAccess = false } = {}) => getParts("aphex/admin/tool").filter((t) => hasCaps(t.requiredCapabilities, capabilities, overrideAccess)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		fieldComponent: (input) => getParts("aphex/field/component").find((f) => f.input === input),
		settingsDeclarations: () => getParts("aphex/settings"),
		settingsDeclaration: (pluginId) => getParts("aphex/settings").find((s) => s.pluginId === pluginId),
		jobHandlers: () => getParts("aphex/job/handler").reduce((acc, part) => ({
			...acc,
			...part.handlers
		}), {}),
		eventConsumers: () => getParts("aphex/event/consumer"),
		consumersForEvent: (eventType) => getParts("aphex/event/consumer").filter((c) => c.events.includes(eventType))
	};
}
//#endregion
export { createPartResolver as t };
