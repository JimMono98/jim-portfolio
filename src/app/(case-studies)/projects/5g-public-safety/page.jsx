import FiveGPublicSafetyCaseStudy from "@/components/case-studies/5g-public-safety/FiveGPublicSafetyCaseStudy";
import { getCaseStudyNeighbors } from "@/lib/caseStudies";

export const metadata = {
  title: "5G for Public Safety | Jim Mono",
  description:
    "An evidence-led Internet of Things case study that turns a preserved public-safety literature paper into an interactive, browser-local incident information board.",
  openGraph: {
    title: "5G for Public Safety | Jim Mono",
    description:
      "Explore how field observations, connectivity, services, authorization, and human decisions shape a shared operational picture.",
    type: "article",
  },
};

export default function FiveGPublicSafetyPage() {
  const { previousProject, nextProject } =
    getCaseStudyNeighbors("5g-public-safety");

  return (
    <FiveGPublicSafetyCaseStudy
      previousProject={previousProject}
      nextProject={nextProject}
    />
  );
}
