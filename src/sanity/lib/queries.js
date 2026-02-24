import { client } from "./client";

export async function getProjects() {
  return client.fetch(
    `*[_type == "project"] | order(order asc) {
      num,
      title,
      description,
      href,
      order
    }`
  );
}
