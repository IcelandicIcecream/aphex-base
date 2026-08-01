import { z } from "zod";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/events/define-event.js
function defineEvent(type, schema) {
	return {
		type,
		schema,
		parse: (payload) => schema.parse(payload)
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/events/catalog.js
/** Emitted after a document's draft is copied to published, inside the publish transaction. */
var documentPublished = defineEvent("document.published", z.object({
	documentId: z.string(),
	documentType: z.string(),
	publishedHash: z.string().nullable()
}));
//#endregion
export { documentPublished as t };
