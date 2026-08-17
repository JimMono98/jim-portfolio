import NumberCheckerCaseStudy from "@/components/case-studies/number-checker/NumberCheckerCaseStudy";
import { getCaseStudyNeighbors } from "@/lib/caseStudies";

export const metadata = {
  title: "Custom Python API Number Checker | Jim Mono",
  description:
    "An engineering case study of an early mobile client-server exercise connecting user input to Python backend logic and a returned text response.",
  openGraph: {
    title: "Custom Python API Number Checker | Jim Mono",
    description:
      "How an early learning project demonstrated the request-response path between a mobile client and conditional Python backend logic.",
    type: "article",
  },
};

export default function CustomPythonApiNumberCheckerPage() {
  const { previousProject, nextProject } = getCaseStudyNeighbors(
    "custom-python-api-number-checker"
  );

  return (
    <NumberCheckerCaseStudy
      previousProject={previousProject}
      nextProject={nextProject}
    />
  );
}
