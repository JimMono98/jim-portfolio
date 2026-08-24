import WebSecurityCaseStudy from "@/components/case-studies/hack-the-box-no-threshold/WebSecurityCaseStudy";
import { getCaseStudyNeighbors } from "@/lib/caseStudies";

export const metadata = {
  title: "No-Threshold Web Security Challenge | Jim Mono",
  description:
    "An evidence-led Web Security case study examining a documented authentication path through an interactive, browser-local trust-boundary reconstruction.",
  openGraph: {
    title: "No-Threshold Web Security Challenge | Jim Mono",
    description:
      "Explore the documented No-Threshold challenge path, its trust failures, and a safe interactive comparison of observed and hardened controls.",
    type: "article",
  },
};

export default function HackTheBoxNoThresholdPage() {
  const { previousProject, nextProject } = getCaseStudyNeighbors(
    "hack-the-box-no-threshold"
  );

  return (
    <WebSecurityCaseStudy
      previousProject={previousProject}
      nextProject={nextProject}
    />
  );
}
