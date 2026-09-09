import projects from "@/data/projects";

export function getCaseStudySlug(project) {
  return project?.caseStudySlug || null;
}

export function getCaseStudyPath(project) {
  const slug = getCaseStudySlug(project);

  return slug ? `/projects/${slug}` : null;
}

export function getCaseStudyNeighbors(currentSlug) {
  const orderedCaseStudies = projects
    .filter((project) => Boolean(getCaseStudySlug(project)))
    .sort((a, b) => {
      return a.order - b.order;
    });

  const currentIndex = orderedCaseStudies.findIndex(
    (project) => project.caseStudySlug === currentSlug
  );

  if (currentIndex === -1) {
    return { previousProject: null, nextProject: null };
  }

  const toNavigationProject = (project) => ({
    number: project.number,
    title: project.navigationTitle || project.name,
    href: getCaseStudyPath(project),
  });
  const previousEntry = orderedCaseStudies[currentIndex - 1];
  const nextEntry = orderedCaseStudies[currentIndex + 1];

  return {
    previousProject: previousEntry
      ? toNavigationProject(previousEntry)
      : null,
    nextProject: nextEntry ? toNavigationProject(nextEntry) : null,
  };
}
