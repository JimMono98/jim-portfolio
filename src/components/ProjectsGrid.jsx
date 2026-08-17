"use client";

import { BsArrowDownRight } from "react-icons/bs";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCaseStudyPath } from "@/lib/caseStudies";

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
                className="group flex flex-1 flex-col justify-center gap-6 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-8 focus-visible:ring-offset-primary"
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
                    <BsArrowDownRight className="text-3xl text-primary transition-transform duration-500 group-hover:-rotate-45 group-focus-visible:-rotate-45 motion-reduce:!transform-none motion-reduce:!transition-none" />
                  </span>
                </div>
                {/* title */}
                <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500">
                  {project.category}
                </h2>
                {/* description */}
                <p className="text-white/60">{project.name}</p>
                {/*border*/}
                <div className="w-full border-b border-white/20"></div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
