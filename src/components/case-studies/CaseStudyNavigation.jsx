"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

function ProjectNavigationCard({ project, direction, className = "" }) {
  const reduceMotion = useReducedMotion();
  const isPrevious = direction === "previous";
  const Icon = isPrevious ? ArrowLeft : ArrowRight;
  const eyebrow = isPrevious ? "Previous project" : "Next project";
  const iconMotion = isPrevious
    ? "group-hover:-translate-x-1"
    : "group-hover:translate-x-1";

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`motion-reduce:!transform-none ${className}`}
    >
      <Link
        href={project.href}
        className="group flex min-h-40 h-full items-center justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 transition-colors hover:border-accent/50 hover:bg-accent/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:p-9"
      >
        {isPrevious ? (
          <Icon
            className={`h-6 w-6 shrink-0 text-accent transition-transform duration-300 motion-reduce:!transform-none motion-reduce:!transition-none ${iconMotion}`}
            aria-hidden="true"
          />
        ) : null}

        <div className={isPrevious ? "text-left" : "text-right"}>
          <p className="text-xs uppercase tracking-[0.2em] text-white/35">
            {eyebrow}
          </p>
          <p className="mt-5 text-xl font-semibold text-white transition-colors group-hover:text-accent sm:text-2xl">
            {project.title}
          </p>
        </div>

        {!isPrevious ? (
          <Icon
            className={`h-6 w-6 shrink-0 text-accent transition-transform duration-300 motion-reduce:!transform-none motion-reduce:!transition-none ${iconMotion}`}
            aria-hidden="true"
          />
        ) : null}
      </Link>
    </motion.div>
  );
}

function NextProjectPlaceholder({ className = "" }) {
  return (
    <div
      aria-disabled="true"
      className={`flex min-h-40 items-center rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 sm:p-9 md:justify-end md:text-right ${className}`}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
          Next case study
        </p>
        <p className="mt-5 text-xl font-semibold text-white/45 sm:text-2xl">
          Coming soon
        </p>
      </div>
    </div>
  );
}

export default function CaseStudyNavigation({
  previousProject,
  nextProject,
  showNextPlaceholder = false,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="pb-10 pt-16 sm:pb-12 sm:pt-20 lg:pb-14 lg:pt-24">
      <div className="container mx-auto">
        <motion.nav
          aria-label="Case study navigation"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.5,
            ease: "easeOut",
          }}
          className="motion-reduce:!transform-none"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {previousProject ? (
              <ProjectNavigationCard
                project={previousProject}
                direction="previous"
              />
            ) : null}

            {nextProject ? (
              <ProjectNavigationCard
                project={nextProject}
                direction="next"
                className="md:col-start-2"
              />
            ) : showNextPlaceholder ? (
              <NextProjectPlaceholder className="md:col-start-2" />
            ) : null}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-sm text-xl font-semibold text-white/45 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-primary sm:text-2xl"
            >
              <ArrowDown
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1 motion-reduce:!transform-none motion-reduce:!transition-none"
                aria-hidden="true"
              />
              Back to Projects
            </Link>
          </div>
        </motion.nav>
      </div>
    </section>
  );
}
