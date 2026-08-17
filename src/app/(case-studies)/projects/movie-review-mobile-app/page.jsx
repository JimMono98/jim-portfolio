import MovieReviewCaseStudy from "@/components/case-studies/movie-review/MovieReviewCaseStudy";
import { getCaseStudyNeighbors } from "@/lib/caseStudies";

export const metadata = {
  title: "Movie Review Mobile App | Jim Mono",
  description:
    "An engineering case study of What a Movie, an Android discovery and review app built with Kotlin, Jetpack Compose, TMDb, Room, and Firebase.",
  openGraph: {
    title: "Movie Review Mobile App | Jim Mono",
    description:
      "How What a Movie brings together catalogue discovery, cached data, authentication, and an owned review lifecycle on Android.",
    type: "article",
  },
};

export default function MovieReviewMobileAppPage() {
  const { previousProject, nextProject } = getCaseStudyNeighbors(
    "movie-review-mobile-app"
  );

  return (
    <MovieReviewCaseStudy
      previousProject={previousProject}
      nextProject={nextProject}
    />
  );
}
