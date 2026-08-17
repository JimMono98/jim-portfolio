import projects from "@/data/projects";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function Projects() {
  return <ProjectsGrid projects={projects} />;
}
