import CaseStudyBackLink from "@/components/case-studies/CaseStudyBackLink";
import PageTransition from "@/components/PageTransition";
import StairTransition from "@/components/StairTransition";

export default function CaseStudiesLayout({ children }) {
  return (
    <>
      <CaseStudyBackLink />
      <StairTransition />
      <PageTransition>
        <div className="pt-16 sm:pt-20">{children}</div>
      </PageTransition>
    </>
  );
}
