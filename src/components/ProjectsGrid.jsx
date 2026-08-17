"use client";

import { BsArrowDownRight } from "react-icons/bs";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCaseStudyPath } from "@/lib/caseStudies";

const ARROW_BASE_ANGLE = 45;
const ARROW_WRAP_POINT = 90;

function wrapCursorAngle(cursorAngle) {
  const positiveAngle =
    ((cursorAngle - ARROW_WRAP_POINT) % 360 + 360) % 360;

  return positiveAngle + ARROW_WRAP_POINT - 360;
}

function handleProjectPointerMove(event) {
  if (
    event.pointerType !== "mouse" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const arrow = event.currentTarget.querySelector("[data-project-arrow]");

  if (!arrow) {
    return;
  }

  const circleBounds = arrow.parentElement.getBoundingClientRect();
  const cursorIsOverArrow =
    event.clientX >= circleBounds.left &&
    event.clientX <= circleBounds.right &&
    event.clientY >= circleBounds.top &&
    event.clientY <= circleBounds.bottom;

  if (cursorIsOverArrow) {
    arrow.style.transitionDuration = "300ms";
    arrow.style.setProperty("--project-arrow-rotation", "-45deg");
    return;
  }

  const circleCenterX = circleBounds.left + circleBounds.width / 2;
  const circleCenterY = circleBounds.top + circleBounds.height / 2;
  const cursorAngle =
    (Math.atan2(
      circleCenterY - event.clientY,
      event.clientX - circleCenterX
    ) *
      180) /
    Math.PI;
  const wrappedCursorAngle = wrapCursorAngle(cursorAngle);

  arrow.style.transitionDuration = "140ms";
  arrow.style.setProperty(
    "--project-arrow-rotation",
    `${-wrappedCursorAngle - ARROW_BASE_ANGLE}deg`
  );
}

function resetProjectArrow(event) {
  const arrow = event.currentTarget.querySelector("[data-project-arrow]");

  if (!arrow) {
    return;
  }

  arrow.style.transitionDuration = "550ms";
  arrow.style.setProperty("--project-arrow-rotation", "0deg");
}

const ProjectsGrid = ({ projects }) => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-[60px]"
        >
          {projects.map((project) => {
            const href =
              getCaseStudyPath(project) || project.originalUrl || "/projects";
            const isInternal = href.startsWith("/");

            return (
              <Link
                key={project.id}
                href={href}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noopener noreferrer"}
                aria-label={`View ${project.name}`}
                onPointerMove={handleProjectPointerMove}
                onPointerLeave={resetProjectArrow}
                className="group flex h-full flex-col gap-6 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-8 focus-visible:ring-offset-primary"
              >
                {/* top */}
                <div className="w-full flex justify-between items-center">
                  <div className="text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover transition-all duration-500">
                    {project.number}
                  </div>
                  <span
                    aria-hidden="true"
                    className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-white transition-colors duration-500 group-hover:bg-accent group-focus-visible:bg-accent"
                  >
                    <span
                      data-project-arrow
                      className="flex items-center justify-center transition-transform will-change-transform motion-reduce:!transform-none motion-reduce:!transition-none"
                      style={{
                        transform:
                          "rotate(var(--project-arrow-rotation, 0deg))",
                        transitionTimingFunction:
                          "cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      <BsArrowDownRight className="text-3xl text-primary transition-transform duration-500 group-focus-visible:-rotate-45 motion-reduce:!transform-none motion-reduce:!transition-none" />
                    </span>
                  </span>
                </div>
                {/* title */}
                <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500">
                  {project.category}
                </h2>
                {/* description */}
                <p className="text-white/60">{project.name}</p>
                {/*border*/}
                <div className="mt-auto w-full border-b border-white/20"></div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
