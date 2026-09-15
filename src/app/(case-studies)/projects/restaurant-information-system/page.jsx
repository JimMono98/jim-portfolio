import RestaurantCaseStudy from "@/components/case-studies/restaurant-information-system/RestaurantCaseStudy";
import { getCaseStudyNeighbors } from "@/lib/caseStudies";

export const metadata = {
  title: "Restaurant Information System | Jim Mono",
  description:
    "A Java Swing HCI coursework case study: authentic desktop screens, documented event handlers, and an interactive browser-local order workbench.",
  openGraph: {
    title: "Restaurant Information System | Jim Mono",
    description:
      "Trace a restaurant order from menu selection to table-model rows, totals, and local message previews.",
    type: "article",
  },
};

export default function RestaurantPage() {
  return (
    <RestaurantCaseStudy
      {...getCaseStudyNeighbors("restaurant-information-system")}
    />
  );
}
