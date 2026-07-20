import { z } from "zod";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/events/consumer.js
/**
* Reserved job-type prefix for consumer deliveries. Namespaced so a delivery job can never
* collide with a document job or a plugin's own `aphex/job/handler` type. The relay enqueues
* `consumerJobType(id)`; the resolver registers the matching handler under the same key.
*/
var CONSUMER_JOB_PREFIX = "aphex/consumer:";
/** The delivery job type for a consumer id. */
function consumerJobType(consumerId) {
	return `${CONSUMER_JOB_PREFIX}${consumerId}`;
}
/**
* The delivery job's payload envelope. The relay serializes the triggering event into this
* shape; `toConsumerJobHandler` parses it back out — parsing (not casting) so a malformed
* payload fails loudly at the handler boundary rather than reaching consumer code as `any`.
* `createdAt` crosses the DB as a JSON string and is coerced back to a `Date`.
*/
var deliveryEnvelope = z.object({ event: z.object({
	id: z.string(),
	type: z.string(),
	organizationId: z.string(),
	payload: z.record(z.string(), z.unknown()).default({}),
	correlationId: z.string().nullable().default(null),
	causationId: z.string().nullable().default(null),
	createdBy: z.string().nullable().default(null),
	createdAt: z.coerce.date()
}) });
/** Build the delivery job payload for an event (the relay's side of the envelope). */
function toDeliveryPayload(event) {
	return { event: {
		id: event.id,
		type: event.type,
		organizationId: event.organizationId,
		payload: event.payload,
		correlationId: event.correlationId,
		causationId: event.causationId,
		createdBy: event.createdBy,
		createdAt: event.createdAt.toISOString()
	} };
}
/**
* Adapt an `EventConsumerHandler` into a `JobHandler`. The runner calls the returned function
* with a claimed delivery job; it reconstructs the `ConsumedEvent` from the job payload, binds
* a settings reader to the event's org, and invokes the consumer. Throwing propagates to the
* runner as a retryable failure. `deps` is injected by the runner (`runJobsBatch`), which is
* where the live services live — the resolver only knows which consumers exist, not how to run them.
*/
function toConsumerJobHandler(handler, deps) {
	return async ({ job, databaseAdapter, logger }) => {
		const { event } = deliveryEnvelope.parse(job.payload);
		await handler({
			event,
			databaseAdapter,
			logger,
			settings: { get: (pluginId) => deps.pluginSettingsService.get(event.organizationId, pluginId) },
			emailAdapter: deps.emailAdapter ?? null
		});
	};
}
//#endregion
export { toConsumerJobHandler as n, toDeliveryPayload as r, consumerJobType as t };
