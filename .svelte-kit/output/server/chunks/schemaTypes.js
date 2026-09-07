import { n as File_text, t as Settings } from "./settings2.js";
//#endregion
//#region src/lib/schemaTypes/index.ts
var schemaTypes = [{
	type: "document",
	name: "page",
	title: "Page",
	description: "A standalone page served at its own URL",
	icon: File_text,
	groups: [
		{
			name: "content",
			title: "Content",
			default: true
		},
		{
			name: "media",
			title: "Media"
		},
		{
			name: "seo",
			title: "SEO"
		}
	],
	preview: { select: {
		title: "title",
		subtitle: "excerpt"
	} },
	previewUrl: (doc) => {
		const slug = doc.slug;
		return slug ? `/${slug}?aphex-preview=1` : null;
	},
	fields: [
		{
			name: "title",
			type: "string",
			title: "Title",
			group: "content",
			validation: (Rule) => Rule.required()
		},
		{
			name: "slug",
			type: "slug",
			title: "Slug",
			source: "title",
			description: "The URL path this page is served at.",
			group: "content",
			validation: (Rule) => Rule.required()
		},
		{
			name: "excerpt",
			type: "text",
			title: "Excerpt",
			rows: 2,
			description: "One or two lines. Shown in listings and used as the SEO fallback.",
			group: "content"
		},
		{
			name: "content",
			type: "array",
			title: "Content",
			group: "content",
			of: [{
				type: "block",
				marks: { annotations: [{
					name: "link",
					title: "Link",
					fields: [{
						name: "href",
						type: "url",
						title: "URL"
					}, {
						name: "blank",
						type: "boolean",
						title: "Open in new tab"
					}]
				}] }
			}, {
				type: "image",
				title: "Image"
			}]
		},
		{
			name: "coverImage",
			type: "image",
			title: "Cover image",
			description: "Opens the asset browser. Alt text can be set per placement.",
			group: "media"
		},
		{
			name: "seoTitle",
			type: "string",
			title: "SEO title",
			description: "Falls back to the page title when empty.",
			group: "seo"
		},
		{
			name: "seoDescription",
			type: "text",
			title: "SEO description",
			rows: 3,
			description: "Falls back to the excerpt when empty.",
			group: "seo"
		}
	]
}, {
	type: "document",
	name: "siteSettings",
	title: "Site Settings",
	description: "Site name, description and logo",
	icon: Settings,
	group: "Settings",
	singleton: true,
	groups: [{
		name: "general",
		title: "General",
		default: true
	}, {
		name: "branding",
		title: "Branding"
	}],
	fields: [
		{
			name: "title",
			type: "string",
			title: "Site name",
			description: "Shown in the browser tab, and as a fallback when no logo is set.",
			group: "general"
		},
		{
			name: "description",
			type: "text",
			title: "Description",
			rows: 3,
			description: "The default meta description, used on pages that don't set their own.",
			group: "general"
		},
		{
			name: "logo",
			type: "image",
			title: "Logo",
			description: "Replaces the site name in the header. A transparent PNG or SVG works best.",
			group: "branding"
		},
		{
			name: "favicon",
			type: "image",
			title: "Favicon",
			description: "The browser tab icon, for the public site and the admin. A square PNG or SVG, 32px or larger.",
			group: "branding"
		},
		{
			name: "logoHeight",
			type: "number",
			title: "Logo height",
			description: "Height of the header logo in pixels. Width follows the aspect ratio.",
			group: "branding",
			min: 16,
			max: 80,
			step: 2,
			initialValue: 40,
			options: { layout: "slider" }
		}
	]
}];
//#endregion
export { schemaTypes as t };
