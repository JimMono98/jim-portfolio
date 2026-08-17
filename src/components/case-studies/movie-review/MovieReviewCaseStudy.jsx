"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Database,
  Film,
  Github,
  KeyRound,
  Layers3,
  MessageSquareText,
  Search,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import CaseStudyNavigation from "@/components/case-studies/CaseStudyNavigation";
import {
  ExternalButton,
  Reveal,
  SectionHeading,
  TechPill,
} from "@/components/case-studies/CaseStudyPrimitives";

const ASSET_PATH = "/assets/projects/movie-review";
const SOURCE_URL = "https://github.com/JimMono98/What-A-Movie";
const PRESENTATION_URL =
  "https://ihuedu-my.sharepoint.com/:p:/g/personal/it185400_ihu365_gr/EfS_8bkLmplKj0hL2arFmqkBmbdJyeywYjTtE8ONxCqbNQ?e=wsUbQj";

const technologies = [
  "Kotlin",
  "Jetpack Compose",
  "MVVM",
  "StateFlow",
  "Hilt",
  "Retrofit",
  "Room",
  "Firebase",
];

const technicalCards = [
  {
    icon: Layers3,
    number: "01",
    title: "Compose & navigation",
    copy: "A declarative UI layer turns observable screen state into discovery, search, detail, authentication, and review experiences with route-based navigation between them.",
  },
  {
    icon: Workflow,
    number: "02",
    title: "MVVM & StateFlow",
    copy: "ViewModels coordinate catalogue operations and expose StateFlow-backed UI state, keeping TMDb network and Room persistence work outside the composables that render that path.",
  },
  {
    icon: Database,
    number: "03",
    title: "Retrofit & Room",
    copy: "Retrofit retrieves movie and TV data from TMDb. Room retains catalogue and detail records so previously cached content can be rendered when it is available.",
  },
  {
    icon: KeyRound,
    number: "04",
    title: "Firebase services",
    copy: "Firebase Authentication provides identity, while Firestore stores user reviews. Review writes are followed by an explicit refresh rather than a live subscription.",
  },
];

const features = [
  {
    icon: Film,
    title: "Discovery built around collections",
    copy: "A featured carousel and focused movie and TV collections give the home experience a clear browsing rhythm across popular catalogue data.",
    meta: "Home · Popular · TV Series",
  },
  {
    icon: Search,
    title: "Search that leads to context",
    copy: "Debounced TMDb search moves from a query to rich media details, including the TMDb score, related titles, and available video content.",
    meta: "Search · Details · Similar titles",
  },
  {
    icon: MessageSquareText,
    title: "An owned review lifecycle",
    copy: "Authenticated users can create, edit, and delete ratings with comments. Identity establishes ownership, and each write is reflected through an explicit data refresh.",
    meta: "Create · Edit · Delete",
  },
];

const takeaways = [
  {
    title: "Keep data boundaries visible",
    copy: "Catalogue data and user-generated reviews have different sources and lifecycles. Separating their responsibilities makes each path easier to reason about and evolve.",
  },
  {
    title: "Caching is a product decision",
    copy: "Room can preserve useful browsing continuity for catalogue and detail data already seen, without making a broader promise of complete offline operation.",
  },
  {
    title: "Ownership belongs in the flow",
    copy: "Authentication does more than unlock a screen: it identifies who owns a review and therefore who may update or remove it.",
  },
];

function PhoneShot({ file, alt, priority = false, sizes, className = "" }) {
  return (
    <figure className={`relative mx-auto w-full ${className}`}>
      <Image
        src={`${ASSET_PATH}/${file}.webp`}
        alt={alt}
        width={1000}
        height={2113}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        quality={90}
        sizes={sizes}
        className="h-auto w-full object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.38)]"
      />
    </figure>
  );
}

function HeroPhone({ children, className = "", reduceMotion }) {
  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -8, scale: 1.015 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
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
  images,
  reverse = false,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
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

      <Reveal
        delay={0.08}
        className={`relative rounded-[2rem] border border-white/10 bg-white/[0.035] px-4 pb-0 pt-8 sm:px-8 sm:pt-12 ${
          reverse ? "lg:order-1" : ""
        }`}
      >
        <div
          className={`mx-auto grid max-w-[680px] items-end justify-center gap-2 sm:gap-5 ${
            images.length === 3 ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          {images.map((image, index) => (
            <motion.div
              key={image.file}
              whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={
                images.length === 3 && index === 1
                  ? "relative z-10"
                  : "relative z-0"
              }
            >
              <PhoneShot
                {...image}
                sizes={
                  images.length === 3
                    ? "(max-width: 767px) 28vw, (max-width: 1199px) 26vw, 180px"
                    : "(max-width: 767px) 42vw, (max-width: 1199px) 38vw, 250px"
                }
              />
            </motion.div>
          ))}
        </div>
      </Reveal>
    </article>
  );
}

function ArchitecturePath({ label, note, nodes }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#18181d] p-5 sm:p-8">
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-white">{label}</h3>
        <p className="text-xs uppercase tracking-[0.18em] text-white/35">
          {note}
        </p>
      </div>
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        {nodes.map((node, index) => (
          <div
            key={node.title}
            className="contents"
          >
            <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-5">
              <p className="text-sm font-semibold leading-5 text-white">
                {node.title}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/45">
                {node.detail}
              </p>
            </div>
            {index < nodes.length - 1 ? (
              <ArrowRight
                className="mx-auto h-4 w-4 shrink-0 rotate-90 text-accent/70 md:rotate-0"
                aria-hidden="true"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MovieReviewCaseStudy({ previousProject, nextProject }) {
  const reduceMotion = useReducedMotion();

  const cataloguePath = [
    { title: "Compose UI", detail: "Screens & navigation" },
    { title: "ViewModels", detail: "StateFlow-backed UI state" },
    { title: "Repositories", detail: "Hilt-provided dependencies" },
    { title: "Retrofit + Room", detail: "TMDb network + local cache" },
  ];

  const reviewPath = [
    { title: "Compose screens", detail: "Authentication & review UI" },
    { title: "Firebase Auth", detail: "Current-user identity" },
    { title: "Screen-local operations", detail: "Create, edit, delete & re-fetch" },
    { title: "Cloud Firestore", detail: "User & review records" },
  ];

  return (
    <main className="overflow-x-clip bg-primary text-white">
      <section className="relative isolate pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-32">
        <div
          className="pointer-events-none absolute left-1/2 top-16 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[120px] sm:h-[38rem] sm:w-[38rem]"
          aria-hidden="true"
        />
        <div className="container mx-auto">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm">
              Case study · Android application
            </p>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              Movie Review{" "}
              <span className="block text-white/45">Mobile App</span>
            </h1>
            <p className="mt-6 text-lg font-medium text-accent sm:text-xl">
              What a Movie
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
              An Android experience that connects TMDb-powered discovery,
              cached catalogue data, Firebase authentication, and an owned
              rating and review lifecycle.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ExternalButton href={SOURCE_URL} icon={Github}>
                View Source Code
              </ExternalButton>
              <ExternalButton href={PRESENTATION_URL} variant="outline">
                View Original Presentation
              </ExternalButton>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-10 max-w-4xl sm:mt-12">
            <ul
              className="flex flex-wrap justify-center gap-2"
              aria-label="Technologies used"
            >
              {technologies.map((technology) => (
                <TechPill key={technology} reduceMotion={reduceMotion}>
                  {technology}
                </TechPill>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.16} className="relative mx-auto mt-12 max-w-5xl sm:mt-16">
            <div
              className="absolute inset-x-[12%] bottom-[6%] top-[18%] -z-10 rounded-[3rem] border border-accent/10 bg-gradient-to-b from-accent/[0.08] to-transparent"
              aria-hidden="true"
            />
            <div
              className="grid grid-cols-[0.84fr_1fr_0.84fr] items-end justify-center gap-2 sm:gap-5 lg:gap-8"
              aria-label="What a Movie home, details, and review screens"
            >
              <HeroPhone
                reduceMotion={reduceMotion}
                className="pb-[5%] pt-[16%]"
              >
                <PhoneShot
                  file="movie-details"
                  alt="Movie details screen showing title information, score, and related content"
                  sizes="(max-width: 767px) 26vw, (max-width: 1199px) 25vw, 260px"
                />
              </HeroPhone>
              <HeroPhone reduceMotion={reduceMotion} className="relative z-10">
                <PhoneShot
                  file="home"
                  alt="What a Movie home screen with featured and popular catalogue content"
                  priority
                  sizes="(max-width: 767px) 31vw, (max-width: 1199px) 30vw, 310px"
                />
              </HeroPhone>
              <HeroPhone
                reduceMotion={reduceMotion}
                className="pb-[5%] pt-[16%]"
              >
                <PhoneShot
                  file="create-review"
                  alt="Create review screen with rating and comment controls"
                  sizes="(max-width: 767px) 26vw, (max-width: 1199px) 25vw, 260px"
                />
              </HeroPhone>
            </div>
          </Reveal>

          <Reveal className="mt-10 flex justify-center">
            <a
              href="#overview"
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
        <div className="container mx-auto grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-20">
          <SectionHeading
            eyebrow="Project overview"
            title="A complete mobile journey, from discovery to contribution."
            description="What a Movie is an Android movie and TV discovery app created as a university project with guidance from a Deloitte representative. It combines public catalogue data with authenticated, user-owned reviews in one focused experience."
          />

          <Reveal delay={0.08}>
            <dl className="divide-y divide-white/10 rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 sm:px-8">
              {[
                ["Platform", "Android"],
                ["Experience", "Discovery, details & reviews"],
                ["Catalogue data", "TMDb API + Room cache"],
                ["User data", "Firebase Auth + Firestore"],
              ].map(([term, description]) => (
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
            eyebrow="The app experience"
            title="One journey, four focused moments."
            description="The interface moves from access and discovery to context and contribution, keeping each step clear while preserving a consistent visual system."
            headingId="experience-heading"
          />

          <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-28 lg:space-y-36">
            <ExperienceStage
              number="01"
              eyebrow="Onboarding & access"
              title="A clear path into the experience."
              copy="The welcome screen establishes the product before sign-in and registration create a direct route to an authenticated account."
              detail="Authentication is required for review actions, while the entry flow remains visually connected to the catalogue experience that follows."
              images={[
                { file: "welcome", alt: "What a Movie welcome screen" },
                { file: "sign-in", alt: "What a Movie sign-in screen" },
                { file: "register", alt: "What a Movie registration screen" },
              ]}
            />

            <ExperienceStage
              number="02"
              eyebrow="Catalogue discovery"
              title="Collections make browsing feel immediate."
              copy="The home experience combines featured content with dedicated popular movie and TV views, giving each catalogue slice room to be explored."
              detail="TMDb is the catalogue source; Room supports the experience with records that have already been cached locally."
              reverse
              images={[
                { file: "home", alt: "What a Movie discovery home screen" },
                { file: "popular", alt: "Popular movies catalogue screen" },
                { file: "tv-series", alt: "TV series catalogue screen" },
              ]}
            />

            <ExperienceStage
              number="03"
              eyebrow="Search & details"
              title="From intent to useful context."
              copy="Debounced search avoids issuing a request for every keystroke, then connects results to a detail view with the TMDb score, media information, similar titles, and videos when available."
              detail="The detail route remains part of the same repository-backed catalogue path as discovery, rather than introducing a parallel data model."
              images={[
                { file: "search", alt: "Movie and TV search results screen" },
                {
                  file: "movie-details",
                  alt: "Movie details screen with score and related content",
                },
              ]}
            />

            <ExperienceStage
              number="04"
              eyebrow="Rating & review"
              title="Contribution with visible ownership."
              copy="An authenticated user can submit a rating and comment, revisit the review, edit its content, or delete it through the same ownership-aware workflow."
              detail="Firestore operations are followed by an explicit refresh. The implementation does not depend on a live Firestore subscription."
              reverse
              images={[
                {
                  file: "create-review",
                  alt: "Create review screen with rating and comment fields",
                },
                {
                  file: "edit-review",
                  alt: "Edit review dialog with existing rating and comment",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="How it works"
            title="Two data paths, each with a distinct responsibility."
            description="Catalogue browsing follows the application architecture through ViewModels and repositories. Authentication and reviews use Firebase directly from their screen and helper flow."
          />

          <div className="mt-12 space-y-5 sm:mt-16">
            <Reveal>
              <ArchitecturePath
                label="Catalogue path"
                note="Discovery · search · details"
                nodes={cataloguePath}
              />
            </Reveal>
            <Reveal delay={0.08}>
              <ArchitecturePath
                label="Review path"
                note="Identity · ratings · comments"
                nodes={reviewPath}
              />
            </Reveal>
          </div>

          <Reveal className="mt-6">
            <p className="flex items-start gap-3 text-xs leading-6 text-white/40 sm:text-sm">
              <ShieldCheck
                className="mt-1 h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              Room supports cached catalogue browsing; it is not a claim of full
              offline coverage. Firestore review updates use explicit refreshes,
              not real-time listeners.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Technical implementation"
            title="A pragmatic Android stack with clear roles."
            description="Each technology solves a specific part of the experience, from declarative rendering and state ownership to network, cache, identity, and review storage."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 sm:mt-16">
            {technicalCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <Reveal key={card.title} delay={(index % 2) * 0.08}>
                  <motion.article
                    whileHover={
                      reduceMotion ? undefined : { y: -5, scale: 1.008 }
                    }
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/25 bg-accent/[0.07] text-accent">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold text-white/20">
                        {card.number}
                      </span>
                    </div>
                    <h3 className="mt-8 text-xl font-semibold text-white">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/55">
                      {card.copy}
                    </p>
                  </motion.article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Feature highlights"
            title="The product value is in the connected flow."
            centered
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3 sm:mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Reveal key={feature.title} delay={index * 0.06}>
                  <motion.article
                    whileHover={
                      reduceMotion ? undefined : { y: -6, scale: 1.01 }
                    }
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-[#1c1c22] p-6 sm:p-8"
                  >
                    <Icon className="h-7 w-7 text-accent" aria-hidden="true" />
                    <h3 className="mt-8 text-xl font-semibold leading-7 text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-4 flex-1 text-sm leading-7 text-white/55">
                      {feature.copy}
                    </p>
                    <p className="mt-7 border-t border-white/10 pt-5 text-xs uppercase tracking-[0.14em] text-white/35">
                      {feature.meta}
                    </p>
                  </motion.article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            eyebrow="Engineering takeaways"
            title="Decisions that remain useful beyond one app."
            description="The implementation surfaces a few durable lessons about boundaries, continuity, and ownership without overstating what the system provides."
          />

          <div className="divide-y divide-white/10 border-y border-white/10">
            {takeaways.map((takeaway, index) => (
              <Reveal key={takeaway.title} delay={index * 0.05}>
                <article className="grid gap-4 py-7 sm:grid-cols-[2.5rem_1fr] sm:gap-5 sm:py-8">
                  <span className="text-sm font-semibold text-accent">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {takeaway.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/55">
                      {takeaway.copy}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-accent py-16 text-primary sm:py-20">
        <div className="container mx-auto">
          <Reveal className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">
                Original project
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl xl:text-5xl">
                Explore the source and the original presentation.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-primary/70 sm:text-base">
                Review the Android implementation on GitHub or open the
                view-only university project presentation for the original
                project context.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button
                asChild
                size="lg"
                variant="primary"
                className="w-full border border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-accent sm:w-auto"
              >
                <Link
                  href={PRESENTATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Original Presentation
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="w-full border border-primary bg-transparent text-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-accent sm:w-auto"
              >
                <Link
                  href={SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Source Code
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CaseStudyNavigation
        previousProject={previousProject}
        nextProject={nextProject}
        showNextPlaceholder
      />
    </main>
  );
}
