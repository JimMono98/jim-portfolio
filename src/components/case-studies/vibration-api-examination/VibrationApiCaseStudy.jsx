"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Accessibility,
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Braces,
  CircleDot,
  ExternalLink,
  Eye,
  FileCode2,
  Gauge,
  Hand,
  Layers3,
  MousePointerClick,
  Play,
  Radio,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TriangleAlert,
  Vibrate,
  VolumeX,
  Waves,
} from "lucide-react";

import CaseStudyNavigation from "@/components/case-studies/CaseStudyNavigation";
import {
  Reveal,
  SectionHeading,
  TechPill,
} from "@/components/case-studies/CaseStudyPrimitives";
import HapticPatternStudio from "@/components/case-studies/vibration-api-examination/HapticPatternStudio";
import { ARTIFACT_DRIFT } from "@/components/case-studies/vibration-api-examination/hapticPatternModel.mjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESENTATION_URL =
  "https://ihuedu-my.sharepoint.com/:p:/g/personal/it185400_ihu365_gr/EaSEa3Tf1pVKqTN3Y1tqlaMBWH_wKmwdgcqfuYPG8Te0gg?e=HpVtK5";
const ASSET_PATH = "/assets/projects/vibration-api-examination";

const projectFacts = [
  ["Coursework", "Ninth-semester Haptic Interfaces"],
  ["Preserved evidence", "27-slide view-only presentation"],
  ["Prototype", "Mobile-web HTML, CSS & inline JavaScript"],
  ["Source evidence", "Surviving hosted page snapshots · no repository"],
];

const courseworkFeatures = [
  {
    number: "01",
    icon: Vibrate,
    title: "Trigger a double pulse",
    copy: "The presentation and surviving page source expose [200, 100, 200]: pulse, pause, then pulse again.",
  },
  {
    number: "02",
    icon: Gauge,
    title: "Compare short and long duration",
    copy: "Separate controls request 200 milliseconds and 10,000 milliseconds. The long example remains documentary evidence and is not replayed here.",
  },
  {
    number: "03",
    icon: Activity,
    title: "Shake the screen visually",
    copy: "A five-second requestAnimationFrame loop applies sine/cosine translation to the document body. This movement is visual, not haptic.",
  },
  {
    number: "04",
    icon: Smartphone,
    title: "Combine movement and vibration",
    copy: "Another control pairs the five-second screen animation with navigator.vibrate(5000), joining two distinct feedback channels.",
  },
  {
    number: "05",
    icon: Waves,
    title: "Generate color-indexed patterns",
    copy: "Five scenarios vary pulse duration, pause duration, or repetition from a selected color index. The archived snapshots are not fully identical.",
  },
];

const apiFlow = [
  {
    icon: MousePointerClick,
    label: "01 · Activation",
    title: "A visitor chooses Play",
    copy: "The request comes directly from an explicit control—not autoplay, hover, or a background loop.",
  },
  {
    icon: Braces,
    label: "02 · Pattern",
    title: "Durations alternate on and off",
    copy: "[200, 100, 200] means vibrate for 200ms, pause for 100ms, then vibrate for 200ms.",
  },
  {
    icon: Radio,
    label: "03 · User agent",
    title: "The browser handles the request",
    copy: "It may accept, clamp, truncate, reject, or suppress the pattern according to visibility and platform policy.",
  },
  {
    icon: Smartphone,
    label: "04 · Device",
    title: "Physical output is not observable",
    copy: "Web code cannot confirm an actuator, system setting, or whether the visitor actually felt the vibration.",
  },
];

const interfaceScenarios = [
  {
    icon: Hand,
    title: "Tap",
    pattern: "[40]",
    copy: "A compact pulse may reinforce a direct control press without delaying the interface.",
  },
  {
    icon: BadgeCheck,
    title: "Confirmation",
    pattern: "[60, 50, 100]",
    copy: "A short–pause–long rhythm may distinguish completion from a generic tap.",
  },
  {
    icon: TriangleAlert,
    title: "Warning",
    pattern: "[120, 80, 120]",
    copy: "Two measured pulses may accompany a visible caution state that still carries the meaning alone.",
  },
  {
    icon: VolumeX,
    title: "Error",
    pattern: "[160, 70, 160, 70, 220]",
    copy: "A denser sequence may support an error message, but should never replace its text or recovery action.",
  },
];

const platformLimits = [
  {
    icon: Play,
    title: "Explicit activation",
    copy: "A sticky user activation is required. The Studio calls the API only from its Play control.",
  },
  {
    icon: Eye,
    title: "Visible document",
    copy: "A hidden document cannot start a request. Hiding or leaving this page stops the current pattern and it never auto-resumes.",
  },
  {
    icon: Smartphone,
    title: "Uneven support",
    copy: "Chromium-family mobile browsers are the primary functional target. Safari/WebKit does not implement the API, and Firefox is not a dependable haptic target.",
  },
  {
    icon: ShieldCheck,
    title: "No output proof",
    copy: "A true result means the request was accepted—not that hardware exists, settings allow it, or physical feedback occurred.",
  },
];

const evidenceLimits = [
  "No versioned source repository or canonical final implementation survives",
  "No verified participant count, protocol, device matrix, or reproducible evaluation dataset",
  "No amplitude, frequency, force, intensity, or actuator-readback capability",
  "No claim that the new semantic presets are universal haptic conventions",
];

function HoverSurface({ children, className = "", reduceMotion }) {
  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -5, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("motion-reduce:!transform-none", className)}
    >
      {children}
    </motion.div>
  );
}

function EvidenceFigure({
  file,
  alt,
  width,
  height,
  sizes,
  priority = false,
  caption,
}) {
  return (
    <figure>
      <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#f4f4f4]">
        <Image
          src={ASSET_PATH + "/" + file + ".webp"}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          quality={90}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-white/30">
        {caption} · Original coursework presentation crop
      </figcaption>
    </figure>
  );
}

function MiniTimeline({ pattern, label, active = false }) {
  const total = pattern.reduce((sum, duration) => sum + duration, 0);
  const description = pattern
    .map((duration, index) =>
      index % 2 === 0
        ? duration + " millisecond pulse"
        : duration + " millisecond pause",
    )
    .join(", ");

  return (
    <div
      role="img"
      aria-label={label + ": " + description}
      className="relative flex h-12 items-center gap-1 overflow-hidden rounded-xl border border-white/10 bg-black/20 p-2"
    >
      {pattern.map((duration, index) => {
        const isPulse = index % 2 === 0;
        return (
          <span
            key={duration + "-" + index}
            style={{ flexGrow: Math.max(duration / total, 0.08) }}
            className={cn(
              "h-full min-w-2 rounded-md border",
              isPulse
                ? active
                  ? "border-accent/80 bg-accent/65"
                  : "border-accent/45 bg-accent/30"
                : "border-dashed border-cyan-200/25 bg-cyan-200/[0.035]",
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

function HeroComposition({ reduceMotion }) {
  return (
    <div className="relative mx-auto w-full max-w-[43rem] pb-10 sm:pb-14">
      <div
        className="pointer-events-none absolute inset-x-[10%] top-[-10%] h-[32rem] rounded-full bg-accent/[0.08] blur-[115px]"
        aria-hidden="true"
      />
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.008 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative ml-auto w-full max-w-[560px] rounded-[2rem] border border-white/10 bg-[#141419] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.44)] motion-reduce:!transform-none sm:p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-4 px-2 pt-1">
          <div className="flex gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-rose-300/65" />
            <span className="h-2 w-2 rounded-full bg-amber-200/65" />
            <span className="h-2 w-2 rounded-full bg-accent/70" />
          </div>
          <p className="text-[0.58rem] uppercase tracking-[0.18em] text-white/35">
            Original interface evidence
          </p>
        </div>
        <EvidenceFigure
          file="coursework-trigger-pattern"
          alt="Cropped original coursework interface showing the trigger vibration control and documented 200, 100, 200 millisecond pattern"
          width={750}
          height={445}
          sizes="(max-width: 639px) calc(100vw - 54px), 560px"
          priority
          caption="Trigger vibration pattern"
        />
      </motion.div>
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mr-auto mt-5 w-[92%] max-w-[25rem] rounded-[1.65rem] border border-cyan-200/20 bg-[#111116]/95 p-5 shadow-[0_22px_65px_rgba(0,0,0,0.4)] motion-reduce:!transform-none sm:-mt-12 sm:ml-4 sm:w-[68%]"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.18em] text-cyan-200/75">
              Pattern anatomy
            </p>
            <code className="mt-2 block text-sm text-white/75">
              [200, 100, 200]
            </code>
          </div>
          <Vibrate className="h-5 w-5 text-accent" aria-hidden="true" />
        </div>
        <div className="mt-4">
          <MiniTimeline
            pattern={[200, 100, 200]}
            label="Coursework double pulse"
            active
          />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ number, icon: Icon, title, copy }) {
  return (
    <article className="h-full rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-accent">{number}</span>
        <Icon className="h-5 w-5 text-accent/70" aria-hidden="true" />
      </div>
      <h3 className="mt-7 text-lg font-semibold leading-7 text-white">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-white/50">{copy}</p>
      <p className="mt-6 border-t border-white/10 pt-4 text-[0.62rem] uppercase tracking-[0.15em] text-white/30">
        Original coursework evidence
      </p>
    </article>
  );
}

function FlowCard({ icon: Icon, label, title, copy, isLast }) {
  return (
    <article className="relative h-full rounded-[1.7rem] border border-white/10 bg-[#15151a] p-6">
      {!isLast ? (
        <ArrowRight
          className="absolute -right-5 top-10 z-10 hidden h-4 w-4 text-accent/40 xl:block"
          aria-hidden="true"
        />
      ) : null}
      <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
      <p className="mt-6 text-[0.62rem] uppercase tracking-[0.17em] text-white/35">
        {label}
      </p>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-white">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-white/50">{copy}</p>
    </article>
  );
}

export default function VibrationApiCaseStudy({
  previousProject,
  nextProject,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-x-clip bg-primary text-white">
      <section className="relative isolate pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-32">
        <div
          className="pointer-events-none absolute left-[58%] top-[-14rem] -z-10 h-[54rem] w-[54rem] -translate-x-1/2 rounded-full bg-accent/[0.075] blur-[135px] sm:h-[62rem] sm:w-[62rem]"
          aria-hidden="true"
        />
        <div className="container mx-auto">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-20">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm">
                Case study · Haptic Interfaces
              </p>
              <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.14] text-white sm:text-6xl sm:leading-[1.03] lg:text-[3.45rem] xl:text-[4.15rem]">
                Vibration API
                <span className="block text-white/45">& Haptic Feedback</span>
              </h1>
              <p className="mt-6 text-base font-medium leading-7 text-accent sm:text-lg">
                Tactile Interaction / Mobile Web
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                An evidence-led examination of an HTML and JavaScript haptic
                prototype—revisited through a genuine browser-local pattern
                studio and the platform reality of the Web Vibration API in
                2026.
              </p>
              <p className="mt-4 max-w-xl text-xs leading-6 text-white/35">
                Original catalogue title: “An Examination of the Vibration API:
                Integrating Tactile Feedback into Modern Mobile Web
                Applications.”
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-auto min-h-14 w-full whitespace-normal px-5 py-3 text-center leading-5 tracking-[1.5px] focus-visible:ring-accent focus-visible:ring-offset-primary lg:h-14 lg:w-auto lg:whitespace-nowrap lg:px-8 lg:py-0 lg:tracking-[2px]"
                >
                  <Link href="#pattern-studio">
                    Explore the Pattern Studio
                    <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-auto min-h-14 w-full whitespace-normal px-5 py-3 text-center leading-5 tracking-[1.5px] focus-visible:ring-accent focus-visible:ring-offset-primary lg:h-14 lg:w-auto lg:whitespace-nowrap lg:px-8 lg:py-0 lg:tracking-[2px]"
                >
                  <Link
                    href={PRESENTATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                    View Original Presentation
                    <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <HeroComposition reduceMotion={reduceMotion} />
            </Reveal>
          </div>
          <Reveal delay={0.14} className="mt-10">
            <ul
              className="flex flex-wrap justify-center gap-2 lg:justify-start"
              aria-label="Verified coursework technologies"
            >
              {["HTML5", "CSS", "JavaScript", "Vibration API"].map(
                (technology) => (
                  <TechPill key={technology} reduceMotion={reduceMotion}>
                    {technology}
                  </TechPill>
                ),
              )}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-20">
            <SectionHeading
              eyebrow="Project evidence & context"
              title="A tactile mobile-web exercise survives through two imperfect snapshots."
              description="The 27-slide coursework deck and a currently reachable set of university-hosted HTML pages document the prototype. No versioned repository survives, and differences between those artifacts prevent either snapshot from being treated as a uniquely canonical final build."
            />
            <Reveal delay={0.08}>
              <dl className="divide-y divide-white/10 rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 sm:px-8">
                {projectFacts.map(([term, description]) => (
                  <motion.div
                    key={term}
                    whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="grid gap-1 py-5 motion-reduce:!transform-none sm:grid-cols-[10.5rem_1fr] sm:gap-5"
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
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [
                "Original coursework",
                "Visible in the preserved deck or surviving hosted source.",
                "border-accent/25 bg-accent/[0.045] text-accent",
              ],
              [
                "Current platform fact",
                "Checked against current standards and compatibility sources.",
                "border-cyan-200/20 bg-cyan-200/[0.04] text-cyan-100/80",
              ],
              [
                "Portfolio reconstruction",
                "New local interaction, permanently labelled and bounded.",
                "border-amber-200/20 bg-amber-200/[0.04] text-amber-100/80",
              ],
            ].map(([label, copy, classes], index) => (
              <Reveal key={label} delay={index * 0.05}>
                <div className={cn("rounded-[1.45rem] border p-5", classes)}>
                  <p className="text-xs font-semibold uppercase tracking-[0.17em]">
                    {label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/50">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="What the coursework built"
            title="One small API was explored through duration, rhythm, and combined feedback."
            description="Each capability below is supported by the presentation or surviving inline source. Screen movement and vibration are kept separate so visual animation is never mistaken for physical haptic output."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-6 sm:mt-16">
            {courseworkFeatures.map((feature, index) => (
              <Reveal
                key={feature.number}
                delay={index * 0.05}
                className={cn("lg:col-span-2", index === 3 && "lg:col-start-2")}
              >
                <HoverSurface reduceMotion={reduceMotion} className="h-full">
                  <FeatureCard {...feature} />
                </HoverSurface>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12">
            <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-[#111116] p-5 sm:p-8 md:grid-cols-2 lg:p-10">
              <EvidenceFigure
                file="coursework-vibration-controls"
                alt="Cropped original coursework interface showing short vibration, long vibration, and cancellation controls"
                width={750}
                height={363}
                sizes="(max-width: 767px) calc(100vw - 70px), 540px"
                caption="Short, long & cancel controls"
              />
              <EvidenceFigure
                file="coursework-pattern-scenarios"
                alt="Cropped original coursework interface showing color choices and vibration pattern scenarios without evaluation data"
                width={864}
                height={362}
                sizes="(max-width: 767px) calc(100vw - 70px), 540px"
                caption="Color-indexed pattern scenarios"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="How the API works"
            title="The pattern describes time—not tactile intensity."
            description="The API accepts a duration or a sequence that alternates vibration and silence. It does not expose amplitude, frequency, force, actuator selection, or physical-output confirmation."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4 sm:mt-16">
            {apiFlow.map((step, index) => (
              <Reveal key={step.label} delay={index * 0.05}>
                <HoverSurface reduceMotion={reduceMotion} className="h-full">
                  <FlowCard {...step} isLast={index === apiFlow.length - 1} />
                </HoverSurface>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <div className="grid gap-7 rounded-[2rem] border border-accent/25 bg-accent/[0.045] p-6 sm:p-8 md:grid-cols-[0.78fr_1.22fr] md:items-center lg:p-10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  Documented sequence
                </p>
                <code className="mt-4 block text-2xl font-semibold text-white sm:text-3xl">
                  [200, 100, 200]
                </code>
              </div>
              <MiniTimeline
                pattern={[200, 100, 200]}
                label="Two 200 millisecond pulses separated by a 100 millisecond pause"
                active
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="pattern-studio"
        className="scroll-mt-8 py-20 sm:scroll-mt-12 sm:py-24 lg:py-32"
      >
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Interactive Haptic Pattern Studio"
            title="Compose a rhythm, request real vibration, or inspect the same timing visually."
            description="This is a new, browser-local portfolio experience—not the original coursework interface. Every duration, timeline, validation result, and comparison is calculated from the selected pattern without networking, storage, or hidden playback."
          />
          <div className="mt-14 sm:mt-16">
            <HapticPatternStudio />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Re-reading the prototype in 2026"
            title="Preserved intent and surviving code do not always describe the same version."
            description="The differences are useful engineering evidence: a historical interface needs provenance, explicit semantics, and current platform constraints before it can be reconstructed responsibly."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 sm:mt-16">
            {ARTIFACT_DRIFT.map((record, index) => (
              <Reveal key={record.id} delay={index * 0.06}>
                <details
                  open={index === 0}
                  className="group h-full rounded-[2rem] border border-white/10 bg-[#111116] p-6 sm:p-8"
                >
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-[#111116] [&::-webkit-details-marker]:hidden">
                    <span>
                      <span className="text-xs uppercase tracking-[0.2em] text-white/35">
                        Artifact drift inspector ·{" "}
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-3 block text-xl font-semibold text-white">
                        {record.title}
                      </span>
                    </span>
                    <FileCode2
                      className="h-6 w-6 shrink-0 text-accent transition-transform duration-300 group-open:rotate-90 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="mt-7 grid gap-4 border-t border-white/10 pt-6">
                    {[
                      [
                        record.presentation,
                        "border-cyan-200/20 bg-cyan-200/[0.035] text-cyan-100/75",
                      ],
                      [
                        record.hostedSource,
                        "border-amber-200/20 bg-amber-200/[0.035] text-amber-100/75",
                      ],
                    ].map(([snapshot, classes]) => (
                      <div
                        key={snapshot.label}
                        className={cn("rounded-[1.25rem] border p-5", classes)}
                      >
                        <p className="text-[0.62rem] uppercase tracking-[0.17em]">
                          {snapshot.label}
                        </p>
                        <code className="mt-3 block break-words text-sm text-white/75">
                          {snapshot.value}
                        </code>
                        <p className="mt-3 text-xs leading-6 text-white/45">
                          {snapshot.detail}
                        </p>
                      </div>
                    ))}
                    <p className="text-sm leading-7 text-white/55">
                      {record.currentReading} {record.interpretation}
                    </p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <div className="grid gap-5 rounded-[1.7rem] border border-white/10 bg-[#111116] p-6 sm:p-8 md:grid-cols-3">
              {[
                ["10 entries", "Current specification maximum pattern length"],
                ["10,000ms", "Maximum duration retained for one entry"],
                [
                  "Final pause",
                  "Has no physical effect once the sequence ends",
                ],
              ].map(([value, label]) => (
                <div
                  key={value}
                  className="rounded-[1.3rem] border border-white/10 bg-white/[0.025] p-5"
                >
                  <p className="text-xl font-semibold text-accent">{value}</p>
                  <p className="mt-3 text-sm leading-6 text-white/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Haptics in interface design"
            title="Rhythm can reinforce meaning, but it cannot own the meaning."
            description="These bounded patterns are portfolio design proposals—not universal haptic conventions. Each should accompany a visible state, readable message, and appropriate recovery path."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4 sm:mt-16">
            {interfaceScenarios.map((scenario, index) => {
              const Icon = scenario.icon;
              return (
                <Reveal key={scenario.title} delay={index * 0.05}>
                  <HoverSurface reduceMotion={reduceMotion} className="h-full">
                    <article className="h-full rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-6">
                      <div className="flex items-center justify-between gap-4">
                        <Icon
                          className="h-6 w-6 text-accent"
                          aria-hidden="true"
                        />
                        <code className="text-xs text-white/35">
                          {scenario.pattern}
                        </code>
                      </div>
                      <h3 className="mt-7 text-lg font-semibold text-white">
                        {scenario.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-white/50">
                        {scenario.copy}
                      </p>
                    </article>
                  </HoverSurface>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="mt-10">
            <div className="flex flex-col gap-5 rounded-[1.7rem] border border-accent/25 bg-accent/[0.045] p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  Accessible by construction
                </p>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:text-base">
                  Haptic output is optional and defaults off. Timelines, labels,
                  status text, and interface messages carry the complete state
                  whether the API is unsupported, suppressed, disabled, or
                  physically imperceptible.
                </p>
              </div>
              <Accessibility
                className="h-7 w-7 shrink-0 text-accent/75"
                aria-hidden="true"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Browser reality & user control"
            title="API availability is only the first condition for tactile output."
            description="The Studio uses runtime feature detection, but support still depends on user activation, document visibility, hardware, browser policy, and system settings. Its status language never upgrades a request into proof that vibration was felt."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4 sm:mt-16">
            {platformLimits.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.05}>
                  <HoverSurface reduceMotion={reduceMotion} className="h-full">
                    <article className="h-full rounded-[1.7rem] border border-white/10 bg-[#15151a] p-6">
                      <Icon
                        className="h-6 w-6 text-cyan-100/70"
                        aria-hidden="true"
                      />
                      <h3 className="mt-6 text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-white/50">
                        {item.copy}
                      </p>
                    </article>
                  </HoverSurface>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="mt-10">
            <div className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-[#111116] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/65">
                  Current authoritative sources
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">
                  Compatibility is treated as a current platform fact, not as an
                  outcome of the original coursework.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  ["W3C specification", "https://www.w3.org/TR/vibration/"],
                  [
                    "MDN API reference",
                    "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate",
                  ],
                  [
                    "MDN compatibility data",
                    "https://github.com/mdn/browser-compat-data/blob/main/api/Navigator.json",
                  ],
                  [
                    "WebKit position",
                    "https://github.com/WebKit/standards-positions/issues/267",
                  ],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.025] px-4 py-2 text-xs font-semibold text-white/65 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]"
                  >
                    {label}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Engineering review & evidence limits"
            title="A trustworthy reconstruction keeps its unknowns visible."
            description="The portfolio can preserve the interaction idea, improve its controls, and test present-day behavior. It cannot recover missing source history, turn sparse evaluation slides into validated research, or make the Web API richer than it is."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-[1.05fr_0.95fr] sm:mt-16">
            <Reveal>
              <div className="h-full rounded-[2rem] border border-accent/25 bg-accent/[0.05] p-6 sm:p-8 lg:p-10">
                <Sparkles className="h-7 w-7 text-accent" aria-hidden="true" />
                <p className="mt-7 text-xs uppercase tracking-[0.2em] text-accent">
                  What this reconstruction improves
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  Consent, safe bounds, truthful state, and an equivalent visual
                  channel.
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  Device output is opt-in, every playable pattern is bounded,
                  visibility cancels active work, and the browser result is
                  reported as a request—not proof of sensation.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.07}>
              <div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:p-10">
                <TriangleAlert
                  className="h-7 w-7 text-amber-100/75"
                  aria-hidden="true"
                />
                <p className="mt-7 text-xs uppercase tracking-[0.2em] text-amber-100/70">
                  Evidence cannot establish
                </p>
                <ul className="mt-5 space-y-4">
                  {evidenceLimits.map((limit) => (
                    <li
                      key={limit}
                      className="flex items-start gap-3 text-sm leading-7 text-white/55"
                    >
                      <CircleDot
                        className="mt-2 h-3 w-3 shrink-0 text-white/30"
                        aria-hidden="true"
                      />
                      {limit}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-8">
            <div className="flex flex-col gap-5 rounded-[1.7rem] border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                  Privacy boundary
                </p>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-white/55">
                  The Studio performs no networking, persistence, telemetry,
                  permission probing, sensor reading, or hardware inference. It
                  uses only the selected local pattern and, after explicit
                  opt-in, the Vibration API request itself.
                </p>
              </div>
              <Layers3
                className="h-7 w-7 shrink-0 text-white/30"
                aria-hidden="true"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-accent py-20 text-primary sm:py-24 lg:py-28">
        <div className="container mx-auto">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60 sm:text-sm">
              Original presentation
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Review the preserved Haptic Interfaces coursework.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-primary/70 sm:text-base sm:leading-8">
              The view-only deck remains the canonical presentation artifact.
              The Pattern Studio above is a separate, current, and clearly
              labelled portfolio reconstruction.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 lg:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-white hover:bg-[#2a2a31] focus-visible:ring-primary lg:w-auto"
              >
                <Link
                  href={PRESENTATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Original Presentation
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-primary/35 bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-white focus-visible:ring-primary lg:w-auto"
              >
                <Link href="#pattern-studio">
                  <Vibrate className="mr-2 h-4 w-4" aria-hidden="true" />
                  Return to the Pattern Studio
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
        showNextPlaceholder={!nextProject}
      />
    </main>
  );
}
