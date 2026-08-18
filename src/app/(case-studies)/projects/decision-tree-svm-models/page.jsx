import DecisionTreeSvmCaseStudy from "@/components/case-studies/decision-tree-svm-models/DecisionTreeSvmCaseStudy";
import { getCaseStudyNeighbors } from "@/lib/caseStudies";

export const metadata = {
  title: "Decision Tree & SVM Models | Jim Mono",
  description:
    "An engineering case study comparing Decision Tree and SVM models across classification and regression, with a deterministic interactive reconstruction of the documented experiments.",
  openGraph: {
    title: "Decision Tree & SVM Models | Jim Mono",
    description:
      "Explore a university artificial-intelligence project through its preserved reports and a genuine interactive reconstruction of its classification and regression experiments.",
    type: "article",
  },
};

export default function DecisionTreeSvmModelsPage() {
  const { previousProject, nextProject } = getCaseStudyNeighbors(
    "decision-tree-svm-models"
  );

  return (
    <DecisionTreeSvmCaseStudy
      previousProject={previousProject}
      nextProject={nextProject}
    />
  );
}
