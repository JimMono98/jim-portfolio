import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CaseStudyBackLink() {
  return (
    <Button
      asChild
      variant="outline"
      className="group fixed left-4 top-4 z-30 h-10 border-white/15 bg-primary/80 px-4 font-primary text-xs font-medium text-white/70 shadow-lg shadow-black/10 backdrop-blur-md hover:border-accent hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:left-6 sm:top-6 sm:h-11 sm:px-5 sm:text-sm"
    >
      <Link href="/projects">
        <ArrowLeft
          className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:!transform-none motion-reduce:!transition-none"
          aria-hidden="true"
        />
        Back to Projects
      </Link>
    </Button>
  );
}
