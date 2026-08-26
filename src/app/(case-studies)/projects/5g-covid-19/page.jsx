import FiveGPandemicResponseCaseStudy from "@/components/case-studies/5g-covid-19/FiveGPandemicResponseCaseStudy";
import { getCaseStudyNeighbors } from "@/lib/caseStudies";

export const metadata = {
  title: "5G Pandemic Response | Jim Mono",
  description:
    "An evidence-led Internet of Things case study that turns a preserved 5G and COVID-19 literature review into an interactive, browser-local response-network explorer.",
  openGraph: {
    title: "5G Pandemic Response | Jim Mono",
    description:
      "Follow data through healthcare, education, automation, and public-health scenarios while separating 5G capabilities from the systems around them.",
    type: "article",
  },
};

export default function FiveGCovid19Page() {
  const { previousProject, nextProject } =
    getCaseStudyNeighbors("5g-covid-19");

  return (
    <FiveGPandemicResponseCaseStudy
      previousProject={previousProject}
      nextProject={nextProject}
    />
  );
}
