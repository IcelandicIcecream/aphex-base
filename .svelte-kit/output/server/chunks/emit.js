import { n as documentPublished } from "./resolver.js";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/events/emit.js
/**
* Emit `document.published` (and its outbox row) for a freshly published document. MUST be
* called on a TRANSACTION handle (from `withTransaction`) so the event commits atomically with
* the publish it describes — the transactional-outbox guarantee. Shared by every publish path,
* versioned and non-versioned alike, so the fact fires whenever a publish happens regardless of
* whether a version snapshot was taken.
*/
async function emitDocumentPublished(tx, organizationId, doc) {
	await tx.appendEvent({
		organizationId,
		type: documentPublished.type,
		payload: documentPublished.parse({
			documentId: doc.id,
			documentType: doc.type,
			publishedHash: doc.publishedHash ?? null
		}),
		createdBy: doc.updatedBy
	});
}
//#endregion
export { emitDocumentPublished as t };
