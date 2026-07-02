
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/(protected)" | "/" | "/(protected)/admin" | "/(protected)/admin/organizations" | "/(protected)/admin/organizations/_components" | "/(protected)/admin/settings" | "/(protected)/admin/settings/_components" | "/(protected)/admin/settings/account" | "/(protected)/admin/settings/api-keys" | "/(protected)/admin/settings/members" | "/(protected)/admin/settings/roles" | "/api" | "/api/instance-settings" | "/api/invitations" | "/api/invitations/[id]" | "/api/invitations/[id]/accept" | "/api/invitations/[id]/reject" | "/api/settings" | "/api/settings/api-keys" | "/api/settings/api-keys/[id]" | "/api/[...slug]" | "/god-mode" | "/god-mode/_components" | "/god-mode/organizations" | "/invitations" | "/invite" | "/invite/[token]" | "/login" | "/mcp" | "/media" | "/media/[id]" | "/media/[id]/[filename]" | "/reset-password" | "/reset-password/[token]" | "/verify-email";
		RouteParams(): {
			"/api/invitations/[id]": { id: string };
			"/api/invitations/[id]/accept": { id: string };
			"/api/invitations/[id]/reject": { id: string };
			"/api/settings/api-keys/[id]": { id: string };
			"/api/[...slug]": { slug: string };
			"/invite/[token]": { token: string };
			"/media/[id]": { id: string };
			"/media/[id]/[filename]": { id: string; filename: string };
			"/reset-password/[token]": { token: string }
		};
		LayoutParams(): {
			"/(protected)": Record<string, never>;
			"/": { id?: string; slug?: string; token?: string; filename?: string };
			"/(protected)/admin": Record<string, never>;
			"/(protected)/admin/organizations": Record<string, never>;
			"/(protected)/admin/organizations/_components": Record<string, never>;
			"/(protected)/admin/settings": Record<string, never>;
			"/(protected)/admin/settings/_components": Record<string, never>;
			"/(protected)/admin/settings/account": Record<string, never>;
			"/(protected)/admin/settings/api-keys": Record<string, never>;
			"/(protected)/admin/settings/members": Record<string, never>;
			"/(protected)/admin/settings/roles": Record<string, never>;
			"/api": { id?: string; slug?: string };
			"/api/instance-settings": Record<string, never>;
			"/api/invitations": { id?: string };
			"/api/invitations/[id]": { id: string };
			"/api/invitations/[id]/accept": { id: string };
			"/api/invitations/[id]/reject": { id: string };
			"/api/settings": { id?: string };
			"/api/settings/api-keys": { id?: string };
			"/api/settings/api-keys/[id]": { id: string };
			"/api/[...slug]": { slug: string };
			"/god-mode": Record<string, never>;
			"/god-mode/_components": Record<string, never>;
			"/god-mode/organizations": Record<string, never>;
			"/invitations": Record<string, never>;
			"/invite": { token?: string };
			"/invite/[token]": { token: string };
			"/login": Record<string, never>;
			"/mcp": Record<string, never>;
			"/media": { id?: string; filename?: string };
			"/media/[id]": { id: string; filename?: string };
			"/media/[id]/[filename]": { id: string; filename: string };
			"/reset-password": { token?: string };
			"/reset-password/[token]": { token: string };
			"/verify-email": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/organizations" | "/admin/settings" | "/admin/settings/account" | "/admin/settings/api-keys" | "/admin/settings/members" | "/admin/settings/roles" | "/api/instance-settings" | "/api/invitations" | `/api/invitations/${string}/accept` & {} | `/api/invitations/${string}/reject` & {} | "/api/settings/api-keys" | `/api/settings/api-keys/${string}` & {} | `/api/${string}` & {} | "/god-mode" | "/god-mode/organizations" | "/invitations" | `/invite/${string}` & {} | "/login" | "/mcp" | `/media/${string}/${string}` & {} | `/reset-password/${string}` & {} | "/verify-email";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/images/aphex-darkmode.png" | "/images/aphex-lightmode.png" | "/robots.txt" | string & {};
	}
}