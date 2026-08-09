import { D as attr, a as derived, d as spread_props, f as stringify, k as escape_html, s as ensure_array_like, t as attr_class } from "./server2.js";
import "./internal.js";
import "./validator.js";
import "./schema-utils.js";
import { A as Triangle_alert, O as Calendar_clock, R as Icon, _ as Refresh_cw, k as toast, m as Sparkles } from "./stega.js";
import "./utils2.js";
import { u as apiClient } from "./api.js";
import { t as Button } from "./button.js";
import { t as Badge } from "./badge.js";
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/ban.svelte
function Ban($$renderer, $$props) {
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
			{ name: "ban" },
			props,
			{
				iconNode: [["path", { "d": "M4.929 4.929 19.07 19.071" }], ["circle", {
					"cx": "12",
					"cy": "12",
					"r": "10"
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
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/radio.svelte
function Radio($$renderer, $$props) {
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
			{ name: "radio" },
			props,
			{
				iconNode: [
					["path", { "d": "M16.247 7.761a6 6 0 0 1 0 8.478" }],
					["path", { "d": "M19.075 4.933a10 10 0 0 1 0 14.134" }],
					["path", { "d": "M4.925 19.067a10 10 0 0 1 0-14.134" }],
					["path", { "d": "M7.753 16.239a6 6 0 0 1 0-8.478" }],
					["circle", {
						"cx": "12",
						"cy": "12",
						"r": "2"
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
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/rotate-ccw.svelte
function Rotate_ccw($$renderer, $$props) {
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
			{ name: "rotate-ccw" },
			props,
			{
				iconNode: [["path", { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }], ["path", { "d": "M3 3v5h5" }]],
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
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.9.0_173235d9579f197e78425a9e1db71cc6/node_modules/@aphexcms/cms-core/dist/components/admin/ActivityView.svelte
function ActivityView($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* May the viewer retry/cancel jobs? `org.settings` — see `requireJobControl` in the
		* route. Gating here only hides buttons; the server is what enforces it.
		*/
		/**
		* May the viewer retry/cancel jobs? `org.settings` — see `requireJobControl` in the
		* route. Gating here only hides buttons; the server is what enforces it.
		*/
		/** Super admins can widen jobs/events past their active organization (`?scope=all`). */
		let { canControlJobs = false, isSuperAdmin = false } = $$props;
		let jobs = [];
		let events = [];
		let health = null;
		let actingJobId = null;
		let changeSets = [];
		let loading = false;
		let error = null;
		let total = 0;
		const statuses = [
			"all",
			"pending",
			"leased",
			"completed",
			"failed",
			"cancelled"
		];
		let statusFilter = "all";
		const statusVariant = {
			pending: "secondary",
			leased: "secondary",
			completed: "default",
			failed: "destructive",
			cancelled: "outline"
		};
		function fmt(d) {
			if (!d) return "—";
			const date = typeof d === "string" ? new Date(d) : d;
			return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
		}
		/** "3m", "2h", "4d" — coarse on purpose; this is a staleness signal, not a stopwatch. */
		function age(d) {
			const ms = Date.now() - new Date(d).getTime();
			if (ms < 6e4) return `${Math.max(0, Math.round(ms / 1e3))}s`;
			if (ms < 36e5) return `${Math.round(ms / 6e4)}m`;
			if (ms < 864e5) return `${Math.round(ms / 36e5)}h`;
			return `${Math.round(ms / 864e5)}d`;
		}
		const RELAY_STALE_MS = 6e4;
		/**
		* The backlog, pre-chewed into exactly what the banner renders — or null when there's
		* nothing to say. Deriving the whole object (rather than a `stalled` flag beside the raw
		* `health`) is what lets the markup read `oldestAge` without re-proving that
		* `oldestPendingAt` is non-null: `pending > 0` implies a row exists, but only this
		* narrowing tells the compiler so.
		*/
		const relayBacklog = derived(() => {
			const oldest = health?.oldestPendingAt;
			if (!health || health.pending === 0 || !oldest) return null;
			return {
				pending: health.pending,
				oldestAge: age(oldest),
				stalled: Date.now() - new Date(oldest).getTime() > RELAY_STALE_MS
			};
		});
		/**
		* A job whose lease has run out but which is still marked `leased` — the worker holding
		* it died mid-run. It isn't lost (the next `claimDueJobs` reclaims expired leases), but
		* it looks identical to healthy in-flight work without this.
		*/
		function leaseExpired(job) {
			return job.status === "leased" && !!job.leaseExpiresAt && new Date(job.leaseExpiresAt) < /* @__PURE__ */ new Date();
		}
		/** Requeue puts a dead letter back with a fresh attempt budget; cancel retires it. */
		const canRetry = (job) => job.status === "failed" || job.status === "cancelled";
		const canCancel = (job) => job.status === "pending" || job.status === "failed";
		/** Only send `scope` when it's actually widened — keeps the default request unchanged. */
		function scopeParam() {
			return {};
		}
		async function load() {
			loading = true;
			error = null;
			try {
				{
					const params = {
						limit: "100",
						...scopeParam()
					};
					const [res, healthRes] = await Promise.all([apiClient.get("/jobs", params), apiClient.get("/jobs/health", scopeParam())]);
					if (res.success) {
						jobs = res.data ?? [];
						total = res.pagination?.total ?? jobs.length;
					} else error = res.error ?? "Failed to load jobs";
					health = healthRes.success ? healthRes.data ?? null : null;
				}
			} catch (err) {
				error = err instanceof Error ? err.message : "Failed to load";
			} finally {
				loading = false;
			}
		}
		/**
		* Retry and cancel share everything but the verb and the past-tense confirmation, so they
		* share a body. `organizationId` is always sent: in the instance-wide view the job may
		* belong to a tenant the caller isn't switched into, and the server needs to be told which
		* one (it rejects the mismatch unless you're a super admin).
		*/
		async function actOnJob(job, action) {
			if (actingJobId) return;
			actingJobId = job.id;
			try {
				const res = await apiClient.post(`/jobs/${job.id}/${action}`, { organizationId: job.organizationId });
				if (!res.success) {
					toast.error(res.error ?? `Could not ${action} this job`);
					return;
				}
				toast.success(action === "retry" ? "Job requeued — it runs on the next tick." : "Job cancelled.");
				await load();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : `Could not ${action} this job`);
			} finally {
				actingJobId = null;
			}
		}
		$$renderer.push(`<div class="mx-auto w-full max-w-5xl p-4 sm:p-6"><div class="mb-4 flex items-center justify-between gap-3"><div><h1 class="text-lg font-semibold">Activity</h1> <p class="text-muted-foreground text-sm">Scheduled jobs, the domain-event log, and the AI assistant's audit trail.</p></div> <div class="flex items-center gap-2">`);
		if (isSuperAdmin && true) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="border-rule flex items-center rounded-md border p-0.5 text-xs"><button${attr_class(`rounded px-2 py-1 transition-colors ${stringify("bg-muted text-foreground")}`)}>This workspace</button> <button${attr_class(`rounded px-2 py-1 transition-colors ${stringify("text-muted-foreground hover:text-foreground")}`)}>All workspaces</button></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		Button($$renderer, {
			variant: "outline",
			size: "sm",
			onclick: load,
			disabled: loading,
			class: "gap-1.5",
			children: ($$renderer) => {
				Refresh_cw($$renderer, { class: `h-3.5 w-3.5 ${stringify(loading ? "animate-spin" : "")}` });
				$$renderer.push(`<!----> Refresh`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div> <div class="border-rule mb-3 flex gap-1 border-b"><button${attr_class(`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors ${stringify("border-primary text-foreground")}`)}>`);
		Calendar_clock($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> Jobs</button> <button${attr_class(`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors ${stringify("text-muted-foreground hover:text-foreground border-transparent")}`)}>`);
		Radio($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> Events</button> <button${attr_class(`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors ${stringify("text-muted-foreground hover:text-foreground border-transparent")}`)}>`);
		Sparkles($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> Agent Changes</button></div> `);
		{
			$$renderer.push("<!--[0-->");
			if (relayBacklog()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(`mb-3 flex items-start gap-2 rounded-md border p-3 text-sm ${stringify(relayBacklog().stalled ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-rule text-muted-foreground")}`)}>`);
				if (relayBacklog().stalled) {
					$$renderer.push("<!--[0-->");
					Triangle_alert($$renderer, { class: "mt-0.5 h-4 w-4 shrink-0" });
				} else {
					$$renderer.push("<!--[-1-->");
					Radio($$renderer, { class: "mt-0.5 h-4 w-4 shrink-0" });
				}
				$$renderer.push(`<!--]--> <div>`);
				if (relayBacklog().stalled) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="font-medium">The relay looks stopped — ${escape_html(relayBacklog().pending)} event${escape_html(relayBacklog().pending === 1 ? "" : "s")} waiting, oldest ${escape_html(relayBacklog().oldestAge)} old.</p> <p class="mt-0.5 text-xs">Nothing is reacting to events: scheduled publishes, erasure and plugin consumers are
							all paused until a worker calls <code>POST /api/internal/workers/run</code> again.</p>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<p>${escape_html(relayBacklog().pending)} event${escape_html(relayBacklog().pending === 1 ? "" : "s")} waiting to fan out,
							oldest ${escape_html(relayBacklog().oldestAge)} old — the relay is keeping up.</p>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="mb-3 flex flex-wrap items-center gap-1.5"><!--[-->`);
			const each_array = ensure_array_like(statuses);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let s = each_array[$$index];
				$$renderer.push(`<button${attr_class(`rounded-full border px-2.5 py-1 text-xs capitalize transition-colors ${stringify(statusFilter === s ? "bg-primary text-primary-foreground border-transparent" : "text-muted-foreground hover:bg-muted")}`)}>${escape_html(s)}</button>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="border-destructive/40 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">${escape_html(error)}</div>`);
		} else if (loading && jobs.length === 0 && events.length === 0 && changeSets.length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="text-muted-foreground p-8 text-center text-sm">Loading…</div>`);
		} else {
			$$renderer.push("<!--[2-->");
			if (jobs.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-muted-foreground p-8 text-center text-sm">No jobs.</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="border-rule overflow-x-auto rounded-md border"><table class="w-full text-sm"><thead class="bg-muted/50 text-muted-foreground text-xs"><tr><th class="px-3 py-2 text-left font-medium">Type</th>`);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--><th class="px-3 py-2 text-left font-medium">Status</th><th class="px-3 py-2 text-left font-medium">Run at</th><th class="px-3 py-2 text-left font-medium">Attempts</th><th class="px-3 py-2 text-left font-medium">Last error</th><th class="px-3 py-2 text-left font-medium">Created</th>`);
				if (canControlJobs) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<th class="px-3 py-2 text-right font-medium">Actions</th>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></tr></thead><tbody><!--[-->`);
				const each_array_1 = ensure_array_like(jobs);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let job = each_array_1[$$index_1];
					$$renderer.push(`<tr class="border-rule border-t"><td class="px-3 py-2 font-mono text-xs">${escape_html(job.type)}</td>`);
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--><td class="px-3 py-2 whitespace-nowrap">`);
					Badge($$renderer, {
						variant: statusVariant[job.status],
						class: "capitalize",
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(job.status)}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					if (leaseExpired(job)) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="text-destructive ml-1.5 text-xs"${attr("title", `Lease expired ${stringify(age(job.leaseExpiresAt ?? /* @__PURE__ */ new Date()))} ago — the worker holding this job stopped. It will be reclaimed on the next tick.`)}>stalled</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></td><td class="px-3 py-2 whitespace-nowrap">${escape_html(fmt(job.runAt))}</td><td class="px-3 py-2">${escape_html(job.attempts)}/${escape_html(job.maxAttempts)}</td><td class="text-muted-foreground max-w-[220px] truncate px-3 py-2"${attr("title", job.lastError ?? "")}>${escape_html(job.lastError ?? "—")}</td><td class="text-muted-foreground px-3 py-2 whitespace-nowrap">${escape_html(fmt(job.createdAt))}</td>`);
					if (canControlJobs) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<td class="px-3 py-2 text-right whitespace-nowrap">`);
						if (canRetry(job)) {
							$$renderer.push("<!--[0-->");
							Button($$renderer, {
								variant: "ghost",
								size: "sm",
								class: "h-7 gap-1 px-2 text-xs",
								disabled: actingJobId !== null,
								onclick: () => actOnJob(job, "retry"),
								children: ($$renderer) => {
									Rotate_ccw($$renderer, { class: "h-3 w-3" });
									$$renderer.push(`<!----> Retry`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (canCancel(job)) {
							$$renderer.push("<!--[0-->");
							Button($$renderer, {
								variant: "ghost",
								size: "sm",
								class: "text-muted-foreground h-7 gap-1 px-2 text-xs",
								disabled: actingJobId !== null,
								onclick: () => actOnJob(job, "cancel"),
								children: ($$renderer) => {
									Ban($$renderer, { class: "h-3 w-3" });
									$$renderer.push(`<!----> Cancel`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (!canRetry(job) && !canCancel(job)) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<span class="text-muted-foreground text-xs">—</span>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></td>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div> <p class="text-muted-foreground mt-2 text-xs">Showing ${escape_html(jobs.length)} of ${escape_html(total)}.</p>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { ActivityView as t };
