import VibrationApiCaseStudy from "@/components/case-studies/vibration-api-examination/VibrationApiCaseStudy";
import { getCaseStudyNeighbors } from "@/lib/caseStudies";

export const metadata = {
  title: "Vibration API & Haptic Feedback | Jim Mono",
  description:
    "An evidence-led Haptic Interfaces case study with a browser-local studio for exploring genuine Vibration API patterns and honest visual fallbacks.",
  openGraph: {
    title: "Vibration API & Haptic Feedback | Jim Mono",
    description:
      "Explore the original mobile-web coursework, compose tactile patterns, and compare real Vibration API requests with accessible visual simulation.",
    type: "article",
  },
};

export default function VibrationApiExaminationPage() {
  const { previousProject, nextProject } = getCaseStudyNeighbors(
    "vibration-api-examination",
  );

  return (
    <VibrationApiCaseStudy
      previousProject={previousProject}
      nextProject={nextProject}
    />
  );
}
