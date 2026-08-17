import JimMonoPortfolioCaseStudy from "@/components/case-studies/jimmono-portfolio/JimMonoPortfolioCaseStudy";
import { getCaseStudyNeighbors } from "@/lib/caseStudies";

export const metadata = {
  title: "JimMono Personal Portfolio | Jim Mono",
  description:
    "An engineering case study of the JimMono portfolio, combining Next.js route groups, a local project registry, Sanity-managed Contact display content, and Vercel delivery.",
  openGraph: {
    title: "JimMono Personal Portfolio | Jim Mono",
    description:
      "How the JimMono portfolio brings together App Router architecture, a local project registry, Sanity-managed Contact display content, responsive navigation, and reusable case-study routes.",
    type: "article",
  },
};

export default function JimMonoPortfolioPage() {
  const { previousProject, nextProject } =
    getCaseStudyNeighbors("jimmono-portfolio");

  return (
    <JimMonoPortfolioCaseStudy
      previousProject={previousProject}
      nextProject={nextProject}
    />
  );
}
