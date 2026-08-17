import { createClient } from "@sanity/client";

let client;

export function getSanityClient() {
  if (client) {
    return client;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    throw new Error("Sanity project configuration is unavailable.");
  }

  client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
  });

  return client;
}
