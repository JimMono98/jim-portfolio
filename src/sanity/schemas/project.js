import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "num",
      title: "Number",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Category",
      type: "string",
      description: "Category label (e.g. Web Development)",
    }),
    defineField({
      name: "description",
      title: "Project Name",
      type: "string",
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
