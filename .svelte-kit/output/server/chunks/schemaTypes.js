//#endregion
//#region src/lib/schemaTypes/index.ts
var schemaTypes = [{
	type: "document",
	name: "page",
	title: "Page",
	fields: [
		{
			name: "title",
			type: "string",
			title: "Title",
			validation: (Rule) => Rule.required()
		},
		{
			name: "slug",
			type: "slug",
			title: "Slug",
			source: "title",
			validation: (Rule) => Rule.required()
		},
		{
			name: "body",
			type: "text",
			title: "Body",
			rows: 8
		}
	]
}];
//#endregion
export { schemaTypes as t };
