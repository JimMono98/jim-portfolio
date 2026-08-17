"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "jim-portfolio",
  title: "Jim Portfolio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Contact Page")
              .schemaType("contactPage")
              .child(
                S.document()
                  .title("Contact Page")
                  .schemaType("contactPage")
                  .documentId("contactPage")
              ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (previousActions, context) =>
      context.schemaType === "contactPage"
        ? previousActions.filter(
            ({ action }) => action !== "duplicate" && action !== "delete"
          )
        : previousActions,
    newDocumentOptions: (previousOptions) =>
      previousOptions.filter(
        ({ templateId }) => templateId !== "contactPage"
      ),
  },
});
