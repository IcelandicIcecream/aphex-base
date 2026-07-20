import "./index-server.js";
import { Q as attr, c as ensure_array_like, et as escape_html, f as spread_props, n as attr_class, p as stringify } from "./dev.js";
import "./validator.js";
import "./schema-utils.js";
import "./utils2.js";
import { u as apiClient } from "./api.js";
import { E as Icon, _ as Calendar_clock, f as Refresh_cw } from "./stega.js";
import { t as Button } from "./button.js";
import { t as Badge } from "./badge.js";
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
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/components/admin/ActivityView.svelte
function ActivityView($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let jobs = [];
		let events = [];
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
		async function load() {
			loading = true;
			error = null;
			try {
				{
					const res = await apiClient.get("/jobs", { limit: "100" });
					if (res.success) {
						jobs = res.data ?? [];
						total = res.pagination?.total ?? jobs.length;
					} else error = res.error ?? "Failed to load jobs";
				}
			} catch (err) {
				error = err instanceof Error ? err.message : "Failed to load";
			} finally {
				loading = false;
			}
		}
		$$renderer.push(`<div class="mx-auto w-full max-w-5xl p-4 sm:p-6"><div class="mb-4 flex items-center justify-between gap-3"><div><h1 class="text-lg font-semibold">Activity</h1> <p class="text-muted-foreground text-sm">Scheduled jobs and the domain-event log.</p></div> `);
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
		$$renderer.push(`<!----></div> <div class="border-rule mb-3 flex gap-1 border-b"><button${attr_class(`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors ${stringify("border-primary text-foreground")}`)}>`);
		Calendar_clock($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> Jobs</button> <button${attr_class(`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors ${stringify("text-muted-foreground hover:text-foreground border-transparent")}`)}>`);
		Radio($$renderer, { class: "h-3.5 w-3.5" });
		$$renderer.push(`<!----> Events</button></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mb-3 flex flex-wrap items-center gap-1.5"><!--[-->`);
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
		} else if (loading && jobs.length === 0 && events.length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="text-muted-foreground p-8 text-center text-sm">Loading…</div>`);
		} else {
			$$renderer.push("<!--[2-->");
			if (jobs.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-muted-foreground p-8 text-center text-sm">No jobs.</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="border-rule overflow-x-auto rounded-md border"><table class="w-full text-sm"><thead class="bg-muted/50 text-muted-foreground text-xs"><tr><th class="px-3 py-2 text-left font-medium">Type</th><th class="px-3 py-2 text-left font-medium">Status</th><th class="px-3 py-2 text-left font-medium">Run at</th><th class="px-3 py-2 text-left font-medium">Attempts</th><th class="px-3 py-2 text-left font-medium">Last error</th><th class="px-3 py-2 text-left font-medium">Created</th></tr></thead><tbody><!--[-->`);
				const each_array_1 = ensure_array_like(jobs);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let job = each_array_1[$$index_1];
					$$renderer.push(`<tr class="border-rule border-t"><td class="px-3 py-2 font-mono text-xs">${escape_html(job.type)}</td><td class="px-3 py-2">`);
					Badge($$renderer, {
						variant: statusVariant[job.status],
						class: "capitalize",
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(job.status)}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></td><td class="px-3 py-2 whitespace-nowrap">${escape_html(fmt(job.runAt))}</td><td class="px-3 py-2">${escape_html(job.attempts)}/${escape_html(job.maxAttempts)}</td><td class="text-muted-foreground max-w-[220px] truncate px-3 py-2"${attr("title", job.lastError ?? "")}>${escape_html(job.lastError ?? "—")}</td><td class="text-muted-foreground px-3 py-2 whitespace-nowrap">${escape_html(fmt(job.createdAt))}</td></tr>`);
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
