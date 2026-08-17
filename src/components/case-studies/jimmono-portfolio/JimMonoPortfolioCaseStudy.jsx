"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Accessibility,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Code2,
  Database,
  ExternalLink,
  Github,
  GitBranch,
  Layers3,
  LayoutGrid,
  Mail,
  Menu,
  Monitor,
  PanelsTopLeft,
  Route,
  Server,
  Sparkles,
} from "lucide-react";

import CaseStudyNavigation from "@/components/case-studies/CaseStudyNavigation";
import {
  ExternalButton,
  Reveal,
  SectionHeading,
  TechPill,
} from "@/components/case-studies/CaseStudyPrimitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ASSET_PATH = "/assets/projects/jimmono-portfolio";
const LIVE_URL = "https://jim-mono.vercel.app/";
const SOURCE_URL = "https://github.com/JimMono98/jim-portfolio";

const technologies = [
  "Next.js 14",
  "React 18",
  "Tailwind CSS",
  "Framer Motion",
  "Sanity",
  "Radix UI",
  "Vercel",
];

const overviewFacts = [
  ["Application", "Multi-route developer portfolio"],
  ["Framework", "Next.js App Router"],
  ["Project catalogue", "Local structured registry"],
  ["Delivery", "Vercel-hosted application"],
];

const featureHighlights = [
  {
    icon: Blocks,
    number: "01",
    title: "A local project registry",
    copy: "The Projects route reads one ordered local dataset with a stable contract for card labels, original destinations, and optional case-study routes.",
    meta: "Frozen data · stable order · explicit fields",
  },
  {
    icon: GitBranch,
    number: "02",
    title: "Two destinations from one card",
    copy: "An optional case-study slug takes visitors to an internal narrative, while the original URL remains available for external project material.",
    meta: "Internal route · external fallback",
  },
  {
    icon: PanelsTopLeft,
    number: "03",
    title: "A dedicated reading context",
    copy: "Case studies use their own route-group layout with a quiet Back control and no global header, while retaining the shared transition language.",
    meta: "Route groups · shared shell",
  },
  {
    icon: Menu,
    number: "04",
    title: "Navigation shaped by the viewport",
    copy: "The desktop navigation becomes a Radix-based drawer below the 1200px breakpoint, while project content changes independently at smaller breakpoints.",
    meta: "Desktop nav · mobile sheet",
  },
];

const decisions = [
  {
    title: "Keep project routing in one local registry",
    copy: "A small structured dataset owns project-card metadata, stable order, original URLs, and optional case-study slugs. Detailed narratives remain explicit routes with project-specific structure and visuals.",
  },
  {
    title: "Separate shells at the routing layer",
    copy: "Route groups keep the standard portfolio header out of immersive OnePages without pathname conditionals or a second hidden navigation system.",
  },
  {
    title: "Keep the original destination",
    copy: "Adding an internal case study does not discard the existing href. Live sites, source repositories, reports, and presentations remain available inside each narrative.",
  },
  {
    title: "Use client boundaries where interaction starts",
    copy: "Layouts and route pages can remain server components, while pathname state, forms, drawers, motion, and sliders are isolated in client components.",
  },
];

const evolution = [
  {
    year: "2024",
    title: "Portfolio foundation",
    copy: "The initial Next.js application established the primary routes, responsive presentation, animated page transitions, and a project list stored directly in the UI.",
  },
  {
    year: "2025",
    title: "Direct contact workflow",
    copy: "The contact experience evolved around a client form and an App Router endpoint that sends submissions through Nodemailer.",
  },
  {
    year: "FEB 2026",
    title: "Content editing foundation",
    copy: "Sanity introduced an embedded Studio. In the current architecture, that content layer is limited to Contact display content and remains separate from Nodemailer delivery.",
  },
  {
    year: "CURRENT",
    title: "Local registry and structured case studies",
    copy: "A local ordered project registry, optional slugs, a dedicated route-group shell, and reusable navigation now connect catalogue cards to explicit engineering narratives.",
  },
];

function PortfolioImage({
  file,
  alt,
  sizes,
  priority = false,
  className = "",
  objectPosition = "object-top",
}) {
  return (
    <Image
      src={ASSET_PATH + "/" + file + ".webp"}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? undefined : "lazy"}
      quality={90}
      sizes={sizes}
      className={cn("object-cover", objectPosition, className)}
    />
  );
}

function BrowserFrame({
  file,
  alt,
  label,
  sizes,
  priority = false,
  aspect = "aspect-[16/10]",
  className = "",
  imageClassName = "",
  objectPosition = "object-top",
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-[#141419] shadow-[0_28px_80px_rgba(0,0,0,0.38)]",
        className
      )}
    >
      <figcaption className="flex h-9 items-center gap-2 border-b border-white/10 bg-[#232329] px-3 sm:h-11 sm:px-4">
        <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-white/15" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-accent/55" aria-hidden="true" />
        <span className="ml-2 truncate text-[0.58rem] uppercase tracking-[0.15em] text-white/35 sm:text-[0.65rem]">
          {label}
        </span>
      </figcaption>
      <div className={cn("relative bg-primary", aspect)}>
        <PortfolioImage
          file={file}
          alt={alt}
          sizes={sizes}
          priority={priority}
          className={imageClassName}
          objectPosition={objectPosition}
        />
      </div>
    </figure>
  );
}

function DeviceFrame({
  file,
  alt,
  sizes,
  className = "",
  label = "Mobile viewport",
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[1.7rem] border-[5px] border-[#29292f] bg-[#111116] shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:rounded-[2.2rem] sm:border-[7px]",
        className
      )}
    >
      <figcaption className="sr-only">{label}</figcaption>
      <div className="relative aspect-[390/844]">
        <PortfolioImage file={file} alt={alt} sizes={sizes} />
      </div>
    </figure>
  );
}

function HoverSurface({ children, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("motion-reduce:!transform-none", className)}
    >
      {children}
    </motion.div>
  );
}

function ExperienceStage({
  number,
  eyebrow,
  title,
  copy,
  detail,
  visual,
  reverse = false,
}) {
  return (
    <article className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 xl:gap-24">
      <Reveal className={reverse ? "lg:order-2" : ""}>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-accent">{number}</span>
          <span className="h-px w-12 bg-accent/50" aria-hidden="true" />
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">
            {eyebrow}
          </p>
        </div>
        <h3 className="mt-6 text-2xl font-semibold leading-tight text-white sm:text-3xl">
          {title}
        </h3>
        <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
          {copy}
        </p>
        <p className="mt-5 border-l border-accent/60 pl-5 text-sm leading-7 text-white/45">
          {detail}
        </p>
      </Reveal>
      <Reveal delay={0.08} className={reverse ? "lg:order-1" : ""}>
        {visual}
      </Reveal>
    </article>
  );
}

function FlowArrow() {
  return (
    <ArrowRight
      className="mx-auto h-4 w-4 shrink-0 rotate-90 text-accent/70 md:rotate-0"
      aria-hidden="true"
    />
  );
}

function FlowNode({ icon: Icon, title, detail, accent = false }) {
  return (
    <div
      className={cn(
        "min-w-0 flex-1 rounded-2xl border px-4 py-5 sm:px-5",
        accent
          ? "border-accent/35 bg-accent/[0.08]"
          : "border-white/10 bg-white/[0.035]"
      )}
    >
      <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
      <p className="mt-4 text-sm font-semibold leading-5 text-white">{title}</p>
      <p className="mt-2 text-xs leading-5 text-white/45">{detail}</p>
    </div>
  );
}

function TokenSwatch({ color, label, value, border = false }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div
        className={cn("h-16 rounded-xl", border && "border border-white/15")}
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <p className="mt-4 text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/35">
        {value}
      </p>
    </div>
  );
}

function ArchitectureDiagram() {
  const siteRoutes = ["/", "/projects", "/resume", "/work", "/contact"];
  const caseRoutes = [
    "/projects/jimmono-portfolio",
    "/projects/movie-review-mobile-app",
    "/projects/custom-python-api-number-checker",
  ];

  return (
    <Reveal className="rounded-[2rem] border border-white/10 bg-[#18181d] p-5 sm:p-8 lg:p-10">
      <div className="mx-auto flex max-w-3xl flex-col items-stretch gap-3 md:flex-row md:items-center">
        <FlowNode
          icon={Monitor}
          title="Visitor"
          detail="Desktop, tablet, or mobile"
        />
        <FlowArrow />
        <FlowNode
          icon={Route}
          title="Next.js App Router"
          detail="Routes, layouts, and handlers"
          accent
        />
        <FlowArrow />
        <FlowNode
          icon={Layers3}
          title="Root layout"
          detail="JetBrains Mono and global metadata"
        />
      </div>

      <div className="mx-auto my-5 h-10 w-px bg-gradient-to-b from-accent/70 to-white/10" />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent">
                Standard portfolio
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                (site) layout
              </h3>
            </div>
            <LayoutGrid className="h-6 w-6 text-white/25" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm leading-7 text-white/50">
            Global Header, StairTransition, and PageTransition wrap Home,
            Projects, Resume, Work, and Contact.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {siteRoutes.map((route) => (
              <span
                key={route}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50"
              >
                {route}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-accent/25 bg-accent/[0.045] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent">
                Immersive narratives
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                (case-studies) layout
              </h3>
            </div>
            <PanelsTopLeft
              className="h-6 w-6 text-accent/60"
              aria-hidden="true"
            />
          </div>
          <p className="mt-4 text-sm leading-7 text-white/50">
            The shared Back control replaces the global header while the same
            stair and page transitions preserve continuity.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {caseRoutes.map((route) => (
              <span
                key={route}
                className="rounded-full border border-accent/20 bg-accent/[0.05] px-3 py-1 text-xs text-white/55"
              >
                {route}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <FlowNode
          icon={Database}
          title="/studio"
          detail="Sanity · Contact display content only"
        />
        <FlowNode
          icon={Mail}
          title="/api/sendEmail"
          detail="Route Handler backed by Nodemailer"
        />
        <FlowNode
          icon={Server}
          title="Vercel"
          detail="Verified production hosting"
        />
      </div>
    </Reveal>
  );
}

function ProjectRegistryFlow() {
  const fields = [
    "id",
    "number",
    "category",
    "name",
    "originalUrl",
    "caseStudySlug",
    "order",
  ];

  return (
    <div className="space-y-5">
      <Reveal>
        <div className="rounded-[2rem] border border-white/10 bg-[#18181d] p-5 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent">
                Local project record
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                A stable contract for catalogue presentation and routing.
              </h3>
            </div>
            <Code2 className="h-7 w-7 text-accent/70" aria-hidden="true" />
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {fields.map((field) => (
              <span
                key={field}
                className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/55"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          <FlowNode
            icon={Code2}
            title="projects registry"
            detail="Frozen local records with explicit order"
          />
          <FlowArrow />
          <FlowNode
            icon={Server}
            title="/projects page"
            detail="Passes local records to the grid"
          />
          <FlowArrow />
          <FlowNode
            icon={LayoutGrid}
            title="ProjectsGrid"
            detail="Client-side presentation and card motion"
          />
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2">
        <Reveal>
          <HoverSurface className="h-full rounded-[2rem] border border-accent/25 bg-accent/[0.05] p-6 sm:p-8">
            <Route className="h-6 w-6 text-accent" aria-hidden="true" />
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-accent">
              caseStudySlug exists
            </p>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Internal case-study route
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/55">
              The card resolves to /projects/slug and stays in the same tab.
              Each slug still maps to a concrete route implementation.
            </p>
          </HoverSurface>
        </Reveal>

        <Reveal delay={0.06}>
          <HoverSurface className="h-full rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <ExternalLink className="h-6 w-6 text-accent" aria-hidden="true" />
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40">
              caseStudySlug is absent
            </p>
            <h3 className="mt-4 text-xl font-semibold text-white">
              Original href fallback
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/55">
              Relative original URLs remain same-tab links. External reports,
              presentations, and project URLs open in a new tab.
            </p>
          </HoverSurface>
        </Reveal>
      </div>
    </div>
  );
}

export default function JimMonoPortfolioCaseStudy({
  previousProject,
  nextProject,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-x-clip bg-primary text-white">
      <section className="relative isolate pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-32">
        <div
          className="pointer-events-none absolute left-[58%] top-4 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[120px] sm:h-[42rem] sm:w-[42rem] lg:left-[68%]"
          aria-hidden="true"
        />

        <div className="container mx-auto">
          <div className="grid items-center gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 xl:gap-16">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm">
                Case study · Web application
              </p>
              <h1 className="mt-6 text-[2.55rem] font-semibold leading-[1.03] text-white sm:text-6xl lg:text-[4.25rem] xl:text-[4.8rem]">
                JimMono{" "}
                <span className="block text-white/45">Personal Portfolio</span>
              </h1>
              <p className="mt-6 text-base font-medium leading-7 text-accent sm:text-lg">
                Web Development / Portfolio Engineering
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                A Next.js portfolio that brings professional identity,
                locally structured project data, responsive navigation,
                direct contact, and immersive engineering case studies into
                one evolving application.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <ExternalButton href={LIVE_URL} icon={ExternalLink}>
                  View Live Portfolio
                </ExternalButton>
                <ExternalButton
                  href={SOURCE_URL}
                  variant="outline"
                  icon={Github}
                >
                  View Source Code
                </ExternalButton>
              </div>
            </Reveal>

            <Reveal
              delay={0.1}
              className="relative mx-auto h-[28rem] w-full max-w-[46rem] sm:h-[40rem] lg:h-[38rem]"
            >
              <motion.div
                whileHover={
                  reduceMotion ? undefined : { y: -5, scale: 1.008 }
                }
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute left-0 top-0 z-10 w-[92%] motion-reduce:!transform-none sm:w-[88%]"
              >
                <BrowserFrame
                  file="home-desktop"
                  alt="JimMono portfolio homepage on desktop with navigation, introduction, and portrait"
                  label="Home · desktop"
                  sizes="(max-width: 639px) 84vw, (max-width: 959px) 72vw, 650px"
                  priority
                  aspect="aspect-[240/129]"
                />
              </motion.div>

              <motion.div
                whileHover={
                  reduceMotion ? undefined : { y: -5, scale: 1.008 }
                }
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute bottom-[4%] right-0 z-20 w-[76%] motion-reduce:!transform-none sm:w-[70%]"
              >
                <BrowserFrame
                  file="projects-desktop"
                  alt="JimMono Projects catalogue showing locally defined project cards"
                  label="Projects · desktop"
                  sizes="(max-width: 639px) 70vw, (max-width: 959px) 58vw, 520px"
                  aspect="aspect-[36/25]"
                />
              </motion.div>

              <motion.div
                whileHover={
                  reduceMotion ? undefined : { y: -7, scale: 1.01 }
                }
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute bottom-0 left-[3%] z-30 w-[22%] min-w-[5.4rem] motion-reduce:!transform-none sm:w-[20%]"
              >
                <DeviceFrame
                  file="home-mobile"
                  alt="JimMono homepage arranged for a mobile viewport"
                  sizes="(max-width: 639px) 22vw, 145px"
                />
              </motion.div>
            </Reveal>
          </div>

          <Reveal delay={0.14} className="mt-10 sm:mt-12">
            <ul
              className="flex flex-wrap justify-center gap-2 lg:justify-start"
              aria-label="Technologies used"
            >
              {technologies.map((technology) => (
                <TechPill key={technology} reduceMotion={reduceMotion}>
                  {technology}
                </TechPill>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-10 flex justify-center">
            <a
              href="#overview"
              className="inline-flex items-center gap-3 rounded-sm text-xs uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Explore the case study
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>

      <section
        id="overview"
        className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32"
      >
        <div className="container mx-auto grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
          <SectionHeading
            eyebrow="Project overview"
            title="A portfolio with application structure behind the presentation."
            description="JimMono is a multi-route portfolio for professional identity, selected software work, deeper project narratives, and direct contact. Its current architecture combines a local structured project registry with explicit, project-specific case-study routes."
          />

          <Reveal delay={0.08}>
            <dl className="divide-y divide-white/10 rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 sm:px-8">
              {overviewFacts.map(([term, description]) => (
                <motion.div
                  key={term}
                  whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="grid gap-1 py-5 motion-reduce:!transform-none sm:grid-cols-[9rem_1fr] sm:gap-5"
                >
                  <dt className="text-xs uppercase tracking-[0.16em] text-white/35">
                    {term}
                  </dt>
                  <dd className="text-sm leading-6 text-white/80">
                    {description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section
        className="py-20 sm:py-24 lg:py-32"
        aria-labelledby="experience-heading"
      >
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="The portfolio experience"
            title="One application, several ways into the work."
            description="The experience starts with a direct introduction, moves through an ordered local project catalogue, and expands selected records into focused engineering narratives without disconnecting the supporting resume, work, and contact routes."
            headingId="experience-heading"
          />

          <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-28 lg:space-y-36">
            <ExperienceStage
              number="01"
              eyebrow="Home"
              title="Identity appears before inventory."
              copy="The homepage pairs an animated role introduction with a concise profile, CV access, social links, and a portrait treatment built from a real image and an animated SVG ring."
              detail="On narrower screens the portrait moves before the text, preserving the visual entry point while the desktop navigation becomes a mobile drawer."
              visual={
                <HoverSurface>
                  <BrowserFrame
                    file="home-desktop"
                    alt="Desktop homepage with JimMono introduction, portfolio navigation, and portrait"
                    label="Home · 1440px"
                    sizes="(max-width: 959px) 94vw, 650px"
                    aspect="aspect-[240/129]"
                  />
                </HoverSurface>
              }
            />

            <ExperienceStage
              number="02"
              eyebrow="Projects"
              title="The catalogue is locally structured and consistently rendered."
              copy="The Projects page passes an ordered local project registry to a client grid for the animated, fully clickable card experience."
              detail="At 768px the catalogue already uses two columns while the global header still uses its compact drawer, showing that content and navigation respond independently."
              reverse
              visual={
                <div className="relative pb-16 sm:pb-20">
                  <HoverSurface className="relative z-10 w-[92%]">
                    <BrowserFrame
                      file="projects-desktop"
                      alt="Desktop Projects page with an ordered two-column catalogue"
                      label="Projects · desktop"
                      sizes="(max-width: 959px) 85vw, 600px"
                      aspect="aspect-[36/25]"
                    />
                  </HoverSurface>
                  <HoverSurface className="absolute bottom-0 right-0 z-20 w-[38%] sm:w-[31%]">
                    <DeviceFrame
                      file="projects-mobile"
                      alt="Projects catalogue stacked into one column on mobile"
                      sizes="(max-width: 639px) 35vw, 190px"
                    />
                  </HoverSurface>
                </div>
              }
            />

            <ExperienceStage
              number="03"
              eyebrow="Project case studies"
              title="A project card can now open a complete engineering story."
              copy="Selected local records resolve to dedicated internal OnePages. The case-study shell removes the global header, retains a fixed path back to Projects, and uses registry order for project-to-project navigation."
              detail="Original source, presentation, report, or live-project links remain available inside the narrative rather than being replaced by the internal route."
              visual={
                <HoverSurface>
                  <BrowserFrame
                    file="movie-case-study-desktop"
                    alt="Movie Review engineering case study with immersive navigation and real Android screens"
                    label="Movie Review · case study"
                    sizes="(max-width: 959px) 94vw, 650px"
                    aspect="aspect-[36/25]"
                  />
                </HoverSurface>
              }
            />

            <ExperienceStage
              number="04"
              eyebrow="Supporting routes"
              title="Resume, work, and contact complete the information architecture."
              copy="Radix tabs and scroll areas organize the Resume, a Swiper carousel provides a separate Work presentation, and the Contact form posts to a server Route Handler backed by Nodemailer. Sanity supplies Contact display content independently of that submission flow."
              detail="The Projects registry and Work slider remain locally defined. Each route keeps its own data and interaction model inside the shared portfolio shell."
              reverse
              visual={
                <div className="grid gap-4 sm:grid-cols-2">
                  <HoverSurface className="sm:col-span-2">
                    <BrowserFrame
                      file="resume-skills"
                      alt="Resume Skills view with Radix tabs, scrollable skill cards, and portfolio navigation"
                      label="Resume · skills"
                      sizes="(max-width: 959px) 94vw, 650px"
                      aspect="aspect-[36/25]"
                    />
                  </HoverSurface>
                  <HoverSurface>
                    <BrowserFrame
                      file="work-slider"
                      alt="Cropped visual from the portfolio Work carousel"
                      label="Work · Swiper"
                      sizes="(max-width: 639px) 90vw, 310px"
                      aspect="aspect-[117/104]"
                    />
                  </HoverSurface>
                  <HoverSurface>
                    <BrowserFrame
                      file="contact-form"
                      alt="Cropped JimMono contact form without personal contact details"
                      label="Contact · form"
                      sizes="(max-width: 639px) 90vw, 310px"
                      aspect="aspect-[79/85]"
                    />
                  </HoverSurface>
                </div>
              }
            />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Application architecture"
            title="Two presentation shells, one shared application."
            description="The App Router separates the standard portfolio experience from immersive case studies at the layout level, while server pages and interaction-focused client components divide data work from interface behavior."
          />
          <div className="mt-14 sm:mt-16">
            <ArchitectureDiagram />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Project registry & routing"
            title="One local record can lead to two kinds of destination."
            description="The registry keeps project fields explicit and versioned with the application. A shared resolver preserves each original URL while enabling richer internal case studies where they exist."
          />
          <div className="mt-14 sm:mt-16">
            <ProjectRegistryFlow />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Structured case studies"
              title="From a project link to an engineering narrative."
              description="The case-study layer adds depth without turning the whole catalogue into a generic page template. Every narrative stays explicit, inspectable, and free to use project-specific visuals."
            />

            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {[
                [
                  "01",
                  "The local catalogue record exposes an optional internal slug.",
                ],
                [
                  "02",
                  "A concrete server route owns metadata while the registry supplies ordered neighbours.",
                ],
                [
                  "03",
                  "The case-study layout provides Back navigation without the global header.",
                ],
                [
                  "04",
                  "Source, presentation, and live-project links stay inside the story.",
                ],
              ].map(([number, copy], index) => (
                <Reveal key={number} delay={index * 0.05}>
                  <div className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
                    <span className="text-xs font-semibold text-accent">
                      {number}
                    </span>
                    <p className="text-sm leading-7 text-white/60">{copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.08}>
            <HoverSurface>
              <BrowserFrame
                file="movie-case-study-desktop"
                alt="Movie Review case study demonstrating the shared immersive case-study shell"
                label="Shared case-study system"
                sizes="(max-width: 1023px) 94vw, 650px"
                aspect="aspect-[36/25]"
              />
            </HoverSurface>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Design language & motion"
            title="A compact visual system keeps very different routes related."
            description="The identity comes from one typeface, a dark surface hierarchy, a precise green accent, soft borders, and rounded geometry. Motion adds orientation and feedback without becoming a second visual language."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] sm:mt-16">
            <Reveal>
              <div className="h-full rounded-[2rem] border border-white/10 bg-[#18181d] p-5 sm:p-8">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <TokenSwatch
                    color="#1c1c22"
                    label="Primary"
                    value="#1c1c22"
                    border
                  />
                  <TokenSwatch
                    color="#00ff99"
                    label="Accent"
                    value="#00ff99"
                  />
                  <TokenSwatch
                    color="#00e187"
                    label="Hover"
                    value="#00e187"
                  />
                  <TokenSwatch
                    color="#232329"
                    label="Surface"
                    value="#232329"
                    border
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    JetBrains Mono
                  </p>
                  <p className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    Engineering stories,
                    <span className="block text-white/45">
                      presented with restraint.
                    </span>
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.14em] text-white/60">
                      Rounded pills
                    </span>
                    <span className="rounded-full border border-accent/40 px-4 py-2 text-xs uppercase tracking-[0.14em] text-accent">
                      Accent outline
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="h-full rounded-[2rem] border border-white/10 bg-[#18181d] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent">
                      Interaction grammar
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-white">
                      Restrained by design.
                    </h3>
                  </div>
                  <Sparkles
                    className="h-6 w-6 text-accent/65"
                    aria-hidden="true"
                  />
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    ["Reveal", "0.5s · opacity + 24px · once"],
                    ["Hover", "0.3s · easeOut · scale ≤ 1.01"],
                    ["Stairs", "6 panels · 0.4s · reverse stagger"],
                  ].map(([label, value]) => (
                    <motion.div
                      key={label}
                      whileHover={
                        reduceMotion ? undefined : { x: 5, scale: 1.005 }
                      }
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 motion-reduce:!transform-none"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                        {label}
                      </p>
                      <p className="mt-2 text-sm text-white/70">{value}</p>
                    </motion.div>
                  ))}
                </div>

                <p className="mt-6 text-xs leading-6 text-white/40">
                  Case-study reveals and hover transforms respond to reduced
                  motion preferences. That scoped behavior is not presented as
                  coverage for every legacy transition in the wider site.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Responsive behavior"
            title="The interface changes mode instead of simply shrinking."
            description="Navigation and content use separate breakpoints. Mobile is a single-column reading experience, tablet combines a compact header with a two-column catalogue, and desktop returns to the full navigation inside a centered content frame."
          />

          <div className="mt-14 grid items-end gap-7 md:grid-cols-2 lg:grid-cols-[0.72fr_1.45fr_0.72fr] sm:mt-16">
            <Reveal className="mx-auto w-full max-w-[17rem]">
              <DeviceFrame
                file="home-mobile"
                alt="JimMono homepage at a 390 pixel mobile viewport"
                sizes="(max-width: 767px) 68vw, 260px"
                label="390 pixel mobile homepage"
              />
              <p className="mt-5 text-center text-xs uppercase tracking-[0.16em] text-white/40">
                390px · single column
              </p>
            </Reveal>

            <Reveal
              delay={0.06}
              className="md:col-span-2 lg:col-span-1 lg:row-auto"
            >
              <BrowserFrame
                file="projects-tablet"
                alt="Projects page at 768 pixels with hamburger navigation and a two-column project grid"
                label="Projects · tablet"
                sizes="(max-width: 1023px) 94vw, 580px"
                aspect="aspect-[3/4]"
              />
              <p className="mt-5 text-center text-xs uppercase tracking-[0.16em] text-white/40">
                768px · drawer header + two columns
              </p>
            </Reveal>

            <Reveal
              delay={0.12}
              className="mx-auto w-full max-w-[17rem] md:row-start-1 lg:row-auto"
            >
              <DeviceFrame
                file="mobile-navigation"
                alt="JimMono mobile navigation drawer with portfolio routes and contact call to action"
                sizes="(max-width: 767px) 68vw, 260px"
                label="Mobile navigation drawer"
              />
              <p className="mt-5 text-center text-xs uppercase tracking-[0.16em] text-white/40">
                Compact navigation · direct CTA
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Code2,
                title: "Image delivery",
                copy: "next/image, explicit sizes, one priority hero asset, and lazy loading elsewhere.",
              },
              {
                icon: Accessibility,
                title: "Semantic interaction",
                copy: "Heading structure, labelled navigation, focus states, and safe external-link attributes.",
              },
              {
                icon: Server,
                title: "Server boundaries",
                copy: "Route metadata and Contact display-content loading stay server-side; motion and interactive controls stay client-side.",
              },
              {
                icon: Blocks,
                title: "Shared primitives",
                copy: "Case-study headings, reveals, pills, CTAs, Back control, and ordered navigation are reusable.",
              },
            ].map(({ icon: Icon, title, copy }, index) => (
              <Reveal key={title} delay={index * 0.05}>
                <HoverSurface className="h-full rounded-[1.6rem] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 text-base font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/50">
                    {copy}
                  </p>
                </HoverSurface>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Feature highlights"
            title="A small set of systems carries most of the experience."
            description="The strongest implementation choices connect explicit data ownership, predictable routing, focused reading contexts, and responsive access rather than adding isolated surface features."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 sm:mt-16">
            {featureHighlights.map(
              ({ icon: Icon, number, title, copy, meta }, index) => (
                <Reveal key={title} delay={index * 0.05}>
                  <HoverSurface className="h-full rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-5">
                      <span className="text-xs font-semibold text-accent">
                        {number}
                      </span>
                      <Icon
                        className="h-6 w-6 text-accent/70"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-8 text-xl font-semibold leading-snug text-white sm:text-2xl">
                      {title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">
                      {copy}
                    </p>
                    <p className="mt-7 text-xs uppercase tracking-[0.17em] text-white/35">
                      {meta}
                    </p>
                  </HoverSurface>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Engineering decisions"
              title="Trade-offs that keep the system understandable."
              description="The architecture favours explicit ownership and incremental evolution over a single abstraction for every route."
            />

            <div className="mt-10 space-y-4">
              {decisions.map(({ title, copy }, index) => (
                <Reveal key={title} delay={index * 0.05}>
                  <HoverSurface className="rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                    <div className="flex gap-4">
                      <span className="pt-1 text-xs font-semibold text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold leading-6 text-white">
                          {title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-white/50">
                          {copy}
                        </p>
                      </div>
                    </div>
                  </HoverSurface>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Verified evolution"
              title="Built as a sequence of practical iterations."
              description="The current case-study system extends an application that already changed across navigation, contact, source organization, and project-data ownership."
            />

            <div className="relative mt-10 space-y-1 before:absolute before:bottom-5 before:left-[0.42rem] before:top-5 before:w-px before:bg-white/10">
              {evolution.map(({ year, title, copy }, index) => (
                <Reveal key={year} delay={index * 0.05}>
                  <article className="relative grid grid-cols-[1rem_1fr] gap-5 py-5">
                    <span
                      className="relative z-10 mt-1 h-3.5 w-3.5 rounded-full border-2 border-accent bg-[#19191f]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        {year}
                      </p>
                      <h3 className="mt-3 text-lg font-semibold text-white">
                        {title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-white/50">
                        {copy}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent py-20 text-primary sm:py-24 lg:py-28">
        <div className="container mx-auto">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60 sm:text-sm">
              Explore the portfolio
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              See the live experience or inspect the implementation.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-primary/70 sm:text-base sm:leading-8">
              The deployed portfolio and its public source show the application
              from two complementary perspectives.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-white hover:bg-[#2a2a31] focus-visible:ring-primary sm:w-auto"
              >
                <Link
                  href={LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Live Portfolio
                  <ArrowUpRight
                    className="ml-2 h-4 w-4"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-primary/35 bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-white focus-visible:ring-primary sm:w-auto"
              >
                <Link
                  href={SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Source Code
                  <ArrowUpRight
                    className="ml-2 h-4 w-4"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CaseStudyNavigation
        previousProject={previousProject}
        nextProject={nextProject}
      />

    </main>
  );
}
