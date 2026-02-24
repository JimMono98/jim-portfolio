import { getProjects } from "@/sanity/lib/queries";
import ProjectsGrid from "@/components/ProjectsGrid";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const projects = await getProjects();
  return <ProjectsGrid projects={projects} />;
}
