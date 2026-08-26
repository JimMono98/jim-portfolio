"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  CircleDot,
  ExternalLink,
  Factory,
  GraduationCap,
  HeartPulse,
  Layers3,
  Network,
  Radio,
  Server,
  ShieldCheck,
  Signal,
  Smartphone,
  Stethoscope,
  TriangleAlert,
  Users,
  Workflow,
} from "lucide-react";

import CaseStudyNavigation from "@/components/case-studies/CaseStudyNavigation";
import {
  Reveal,
  SectionHeading,
  TechPill,
} from "@/components/case-studies/CaseStudyPrimitives";
import PandemicResponseExplorer from "@/components/case-studies/5g-covid-19/PandemicResponseExplorer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAPER_URL =
  "https://ihuedu-my.sharepoint.com/:w:/g/personal/it185400_ihu365_gr/EWXmtvrXHeNJgajw5vloW-sBNT8KJ9b16lE3z8UgHZ2AMQ?e=I1XPGc";
const ASSET_PATH = "/assets/projects/5g-covid-19";

const projectFacts = [
  ["Coursework type", "Literature-based Internet of Things examination"],
  ["Preserved artifact", "Four-page, view-only Greek Word paper"],
  ["Research basis", "Eight references recorded in the paper"],
  ["Recovered implementation", "None · no source, prototype, or measurements"],
];

const evidenceLegend = [
  {
    label: "Original paper evidence",
    copy: "A topic, example, or conclusion present in the preserved coursework.",
    classes: "border-accent/25 bg-accent/[0.045] text-accent",
  },
  {
    label: "Current standards fact",
    copy: "A present-day reading checked against an authoritative external source.",
    classes:
      "border-cyan-200/20 bg-cyan-200/[0.04] text-cyan-100/80",
  },
  {
    label: "Portfolio reconstruction",
    copy: "A new explanatory model that does not reproduce a deployed system.",
    classes:
      "border-amber-200/20 bg-amber-200/[0.04] text-amber-100/80",
  },
];

const domains = [
  {
    number: "01",
    icon: Stethoscope,
    title: "Telemedicine & connected care",
    copy: "The paper discusses remote consultation, patient monitoring, medical imaging, and connected robots inside healthcare settings.",
    boundary:
      "Connectivity transports media, telemetry, and commands; it does not perform diagnosis or make clinical decisions.",
  },
  {
    number: "02",
    icon: GraduationCap,
    title: "Remote education",
    copy: "Video learning, VR/AR experiences, and remotely proctored examinations appear as ways to continue education at a distance.",
    boundary:
      "Ordinary video is not automatically a URLLC workload, and a learning service does not require 5G by definition.",
  },
  {
    number: "03",
    icon: Factory,
    title: "Contactless operations",
    copy: "Retail and supply-chain examples include automation, AGVs, UAVs, and robots used to reduce direct human contact.",
    boundary:
      "The paper discusses movement of products and operational automation—not a verified medical-supply delivery deployment.",
  },
  {
    number: "04",
    icon: Users,
    title: "Public-health monitoring",
    copy: "BLE/GPS contact detection, location monitoring, and mass-surveillance examples are examined as pandemic-era practices.",
    boundary:
      "BLE or GPS produces the proximity/location signal; cellular connectivity may carry data onward but does not perform that sensing.",
  },
];

const trafficProfiles = [
  {
    key: "eMBB",
    title: "Enhanced mobile broadband",
    copy: "A traffic profile associated with high-data-rate experiences such as rich video or immersive media. It is relevant where the media path genuinely needs that capacity.",
  },
  {
    key: "URLLC",
    title: "Ultra-reliable, low-latency communication",
    copy: "A profile for stringent reliability and latency needs. Its relevance is conditional—not every call, robot, or remote interaction qualifies.",
  },
  {
    key: "mMTC",
    title: "Massive machine-type communication",
    copy: "A profile for very large populations of connected devices. A single wearable or sensor does not become mMTC merely because it is IoT.",
  },
];

const architectureConcepts = [
  {
    key: "MEC",
    title: "Nearby processing placement",
    copy: "Multi-access edge computing can place application processing closer to access networks. It is access-agnostic and does not guarantee end-to-end latency by itself.",
  },
  {
    key: "Slicing",
    title: "Logical network resources",
    copy: "The paper proposes network slicing as a scalability and service-isolation concept. A slice does not automatically provide privacy, security, or clinical safety.",
  },
  {
    key: "NFV",
    title: "Software-managed network functions",
    copy: "NFV appears as a flexible infrastructure concept in the paper, not as an implemented or evaluated project architecture.",
  },
];

const opportunities = [
  {
    icon: Signal,
    title: "Capacity for media-rich paths",
    copy: "eMBB can be relevant to high-resolution video, imaging, or immersive learning when the application actually needs that data rate.",
  },
  {
    icon: Activity,
    title: "Responsive control paths",
    copy: "URLLC and nearby processing may support stringent interactions, but only after the complete service path is engineered and validated.",
  },
  {
    icon: Network,
    title: "Large connected estates",
    copy: "mMTC frames dense device populations; it is most meaningful at fleet or infrastructure scale rather than for one endpoint.",
  },
  {
    icon: Layers3,
    title: "Flexible service resources",
    copy: "Slicing and NFV can structure network resources, while MEC can alter processing placement. They remain components, not complete applications.",
  },
];

const constraints = [
  {
    icon: HeartPulse,
    title: "Clinical and service validity",
    copy: "Connectivity cannot establish diagnostic quality, safe operating procedures, or a useful downstream professional workflow.",
  },
  {
    icon: ShieldCheck,
    title: "Consent and governance",
    copy: "Contact and location systems require purpose limitation, transparency, data governance, and meaningful user safeguards beyond transport security.",
  },
  {
    icon: Smartphone,
    title: "Access and inclusion",
    copy: "Device availability, coverage, cost, digital literacy, and accessible service design can determine who benefits from a connected system.",
  },
  {
    icon: TriangleAlert,
    title: "End-to-end uncertainty",
    copy: "A radio profile or edge node cannot guarantee application latency, reliability, privacy, or security across every component and operator.",
  },
];

const evidenceLimits = [
  "No author-built 5G, IoT, healthcare, education, or logistics implementation",
  "No dataset, controlled experiment, network measurement, or reproducible environment",
  "No evidence that cited deployments or numerical examples were independently reproduced",
  "No causal evidence that 5G changed infections, mortality, or hospital burden",
];

const standardsSources = [
  {
    label: "ITU-R M.2083",
    href: "https://www.itu.int/dms_pubrec/itu-r/rec/m/R-REC-M.2083-0-201509-I!!PDF-E.pdf",
  },
  {
    label: "ITU-R M.2410",
    href: "https://www.itu.int/dms_pub/itu-r/opb/rep/R-REP-M.2410-2017-PDF-E.pdf",
  },
  {
    label: "ETSI MEC",
    href: "https://www.etsi.org/technical-groups/mec/",
  },
  {
    label: "3GPP TS 23.501",
    href: "https://www.etsi.org/deliver/etsi_TS/123500_123599/123501/18.12.00_60/ts_123501v181200p.pdf",
  },
  {
    label: "WHO telemedicine guidance",
    href: "https://www.who.int/publications/i/item/9789240059184",
  },
  {
    label: "WHO contact-tracing ethics",
    href: "https://www.who.int/publications/i/item/WHO-2019-nCoV-Ethics_Contact_tracing_apps-2020.1",
  },
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
      <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#f4f4f2]">
        <Image
          src={`${ASSET_PATH}/${file}.webp`}
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
        {caption} · Original paper crop · Archived filename context: 24-Apr2021
      </figcaption>
    </figure>
  );
}

function HeroComposition({ reduceMotion }) {
  const flowNodes = [
    [Smartphone, "Endpoint"],
    [Radio, "Transport"],
    [Server, "Edge / cloud"],
    [HeartPulse, "Service"],
  ];

  return (
    <div className="relative mx-auto w-full max-w-[43rem] pb-10 sm:pb-14">
      <div
        className="pointer-events-none absolute inset-x-[8%] top-[-12%] h-[32rem] rounded-full bg-cyan-300/[0.08] blur-[120px]"
        aria-hidden="true"
      />
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.008 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative ml-auto w-full max-w-[560px] rounded-[2rem] border border-white/10 bg-[#141419] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.44)] motion-reduce:!transform-none sm:p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-4 px-2 pt-1">
          <div className="flex gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-accent/70" />
            <span className="h-2 w-2 rounded-full bg-cyan-200/65" />
            <span className="h-2 w-2 rounded-full bg-amber-200/65" />
          </div>
          <p className="text-[0.58rem] uppercase tracking-[0.18em] text-white/35">
            Original paper evidence
          </p>
        </div>
        <EvidenceFigure
          file="paper-title"
          alt="Cropped original Greek paper title about the use of 5G technology in addressing COVID-19"
          width={710}
          height={105}
          sizes="(max-width: 639px) calc(100vw - 54px), 560px"
          priority
          caption="Greek coursework title"
        />
      </motion.div>

      <motion.div
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mr-auto mt-5 w-[94%] max-w-[31rem] rounded-[1.65rem] border border-cyan-200/20 bg-[#111116]/95 p-5 shadow-[0_22px_65px_rgba(0,0,0,0.4)] motion-reduce:!transform-none sm:-mt-10 sm:ml-4 sm:w-[82%]"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.18em] text-cyan-100/70">
              Explanatory data path
            </p>
            <p className="mt-2 text-xs text-white/45">
              Connectivity is one layer of the service.
            </p>
          </div>
          <Network className="h-5 w-5 text-accent" aria-hidden="true" />
        </div>
        <div
          className="mt-5 grid grid-cols-4 gap-2"
          role="img"
          aria-label="Endpoint to transport to edge or cloud to service data path"
        >
          {flowNodes.map(([Icon, label], index) => (
            <div key={label} className="relative text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-cyan-100/20 bg-cyan-100/[0.05]">
                <Icon className="h-4 w-4 text-cyan-100/70" aria-hidden="true" />
              </div>
              {index < flowNodes.length - 1 ? (
                <span
                  className="absolute left-[calc(50%+1.5rem)] top-5 h-px w-[calc(100%-2rem)] bg-gradient-to-r from-cyan-200/35 to-accent/30"
                  aria-hidden="true"
                />
              ) : null}
              <p className="mt-2 text-[0.52rem] uppercase tracking-[0.1em] text-white/35">
                {label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function DomainCard({ domain, reduceMotion }) {
  const Icon = domain.icon;

  return (
    <HoverSurface reduceMotion={reduceMotion} className="h-full">
      <article className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-6 sm:p-7">
        <div className="flex items-center justify-between gap-5">
          <span className="text-xs font-semibold text-accent">
            {domain.number}
          </span>
          <Icon className="h-6 w-6 text-cyan-100/70" aria-hidden="true" />
        </div>
        <h3 className="mt-7 text-xl font-semibold leading-7 text-white">
          {domain.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-white/55">{domain.copy}</p>
        <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-6 text-amber-100/65">
          Boundary · {domain.boundary}
        </p>
      </article>
    </HoverSurface>
  );
}

function ConceptCard({ item, tone = "cyan" }) {
  return (
    <article
      className={cn(
        "rounded-[1.45rem] border p-5 sm:p-6",
        tone === "cyan"
          ? "border-cyan-200/20 bg-cyan-200/[0.035]"
          : "border-accent/20 bg-accent/[0.035]",
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.2em]",
          tone === "cyan" ? "text-cyan-100/75" : "text-accent",
        )}
      >
        {item.key}
      </p>
      <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/50">{item.copy}</p>
    </article>
  );
}

function InsightCard({ item, tone, reduceMotion }) {
  const Icon = item.icon;

  return (
    <HoverSurface reduceMotion={reduceMotion} className="h-full">
      <article
        className={cn(
          "h-full rounded-[1.55rem] border p-6",
          tone === "opportunity"
            ? "border-cyan-200/20 bg-cyan-200/[0.035]"
            : "border-amber-200/20 bg-amber-200/[0.035]",
        )}
      >
        <Icon
          className={cn(
            "h-6 w-6",
            tone === "opportunity"
              ? "text-cyan-100/75"
              : "text-amber-100/75",
          )}
          aria-hidden="true"
        />
        <h3 className="mt-6 text-lg font-semibold text-white">{item.title}</h3>
        <p className="mt-4 text-sm leading-7 text-white/50">{item.copy}</p>
      </article>
    </HoverSurface>
  );
}

function SourceLink({ href, children }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-cyan-100/80 underline decoration-cyan-200/30 underline-offset-4 transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </Link>
  );
}

export default function FiveGPandemicResponseCaseStudy({
  previousProject,
  nextProject,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-x-clip bg-primary text-white">
      <section className="relative isolate pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-32">
        <div
          className="pointer-events-none absolute left-[58%] top-[-15rem] -z-10 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-cyan-300/[0.07] blur-[140px] sm:h-[64rem] sm:w-[64rem]"
          aria-hidden="true"
        />
        <div className="container mx-auto">
          <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 xl:gap-20">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm">
                Case study · Internet of Things
              </p>
              <h1 className="mt-6 text-[2.55rem] font-semibold leading-[1.1] text-white sm:text-6xl sm:leading-[1.03] lg:text-[3.7rem] xl:text-[4.35rem]">
                5G Pandemic
                <span className="block text-white/45">Response</span>
              </h1>
              <p className="mt-6 text-base font-medium leading-7 text-accent sm:text-lg">
                Connectivity / Healthcare, Education & Automation
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                An evidence-led reinterpretation of a literature paper about
                5G during COVID-19—turned into an explorable network that keeps
                connectivity separate from sensing, processing, services, and
                human decisions.
              </p>
              <p className="mt-4 max-w-xl text-xs leading-6 text-white/35">
                Academic catalogue title: “The Role of 5G Technology in
                Mitigating the Effects of COVID-19.”
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-auto min-h-14 w-full whitespace-normal px-5 py-3 text-center leading-5 tracking-[1.5px] focus-visible:ring-accent focus-visible:ring-offset-primary lg:h-14 lg:w-auto lg:whitespace-nowrap lg:px-8 lg:py-0 lg:tracking-[2px]"
                >
                  <Link href="#pandemic-response-explorer">
                    Explore the Response Network
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
                    href={PAPER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                    View Original Paper
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
              aria-label="Research topics covered by the paper"
            >
              {["5G", "IoT", "MEC", "Network Slicing"].map((topic) => (
                <TechPill key={topic} reduceMotion={reduceMotion}>
                  {topic}
                </TechPill>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-20">
            <SectionHeading
              eyebrow="Project evidence & context"
              title="A literature synthesis—not a deployed 5G or IoT system."
              description="The preserved four-page Greek paper examines pandemic-era uses of 5G through eight references. No source code, hardware prototype, dataset, experiment, network measurement, or reproducible architecture survives because the coursework did not document an implementation."
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
            {evidenceLegend.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.05}>
                <div
                  className={cn(
                    "h-full rounded-[1.45rem] border p-5",
                    item.classes,
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.17em]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/50">
                    {item.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-[#111116] p-5 sm:p-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:p-10">
              <EvidenceFigure
                file="paper-use-cases"
                alt="Privacy-safe crop from the original Greek paper showing authored use-case prose without third-party figures"
                width={724}
                height={1040}
                sizes="(max-width: 1023px) calc(100vw - 70px), 520px"
                caption="Authored use-case discussion"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  Archival identity
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  The original Greek title remains the primary artifact label.
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                  “Η χρήση της τεχνολογίας του 5G στην καταπολέμηση του
                  COVID-19” is the title preserved in the paper. The longer
                  English wording is a later portfolio-catalogue description,
                  not evidence of a separate English edition.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Four pandemic-response domains"
            title="The paper connects one network discussion to four distinct service contexts."
            description="These domains come from the preserved coursework. Historical examples involving China, hospitals, robots, or monitoring are presented as cases reported by its sources—not systems created, deployed, or independently verified by the author."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 sm:mt-16">
            {domains.map((domain, index) => (
              <Reveal key={domain.number} delay={index * 0.05}>
                <DomainCard domain={domain} reduceMotion={reduceMotion} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="The 5G capability grammar"
            title="Traffic profiles and architecture concepts answer different questions."
            description="eMBB, URLLC, and mMTC are IMT-2020 usage profiles. MEC, network slicing, and NFV describe processing placement or network architecture. Keeping those groups separate prevents one label from standing in for an entire service."
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-2 sm:mt-16">
            <Reveal>
              <div className="h-full rounded-[2rem] border border-cyan-200/20 bg-cyan-200/[0.02] p-5 sm:p-8">
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">
                      Traffic profiles
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      What the communication may need
                    </h3>
                  </div>
                  <Signal className="h-7 w-7 text-cyan-100/65" aria-hidden="true" />
                </div>
                <div className="mt-7 grid gap-4">
                  {trafficProfiles.map((item) => (
                    <ConceptCard key={item.key} item={item} />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.07}>
              <div className="h-full rounded-[2rem] border border-accent/20 bg-accent/[0.02] p-5 sm:p-8">
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent">
                      Architecture concepts
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      Where and how resources are arranged
                    </h3>
                  </div>
                  <Layers3 className="h-7 w-7 text-accent/75" aria-hidden="true" />
                </div>
                <div className="mt-7 grid gap-4">
                  {architectureConcepts.map((item) => (
                    <ConceptCard key={item.key} item={item} tone="accent" />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-8">
            <div className="flex flex-col gap-5 rounded-[1.7rem] border border-amber-200/20 bg-amber-200/[0.035] p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-100/75">
                  Classification guardrail
                </p>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  Ordinary video does not automatically require URLLC. One IoT
                  endpoint is not automatically mMTC. A logical network slice
                  does not automatically make a service private, secure, or
                  clinically safe.
                </p>
              </div>
              <TriangleAlert
                className="h-7 w-7 shrink-0 text-amber-100/70"
                aria-hidden="true"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="response-network"
        className="scroll-mt-8 py-20 sm:scroll-mt-12 sm:py-24 lg:py-32"
      >
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Interactive 5G Pandemic Response Explorer"
            title="Follow the data—and test what happens when one dependency changes."
            description="This browser-local portfolio reconstruction maps evidence-backed scenarios onto one inspectable service path. It calculates reachability and capability context from your choices; it does not simulate a live network, patient, device fleet, or pandemic outcome."
          />
          <div className="mt-14 sm:mt-16">
            <PandemicResponseExplorer />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Opportunity ↔ constraint"
            title="Connectivity can improve a path without completing the service."
            description="The same scenario can contain a meaningful network opportunity and an unresolved human, operational, or governance constraint. Neither side cancels the other."
          />
          <div className="mt-14 grid gap-8 lg:grid-cols-2 sm:mt-16">
            <Reveal>
              <div className="h-full rounded-[2rem] border border-cyan-200/20 bg-[#111116] p-5 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">
                  Where 5G may contribute
                </p>
                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {opportunities.map((item) => (
                    <InsightCard
                      key={item.title}
                      item={item}
                      tone="opportunity"
                      reduceMotion={reduceMotion}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.07}>
              <div className="h-full rounded-[2rem] border border-amber-200/20 bg-[#111116] p-5 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100/75">
                  What connectivity does not solve
                </p>
                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {constraints.map((item) => (
                    <InsightCard
                      key={item.title}
                      item={item}
                      tone="constraint"
                      reduceMotion={reduceMotion}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Re-reading the paper in 2026"
            title="The enabling network must stay distinct from the application around it."
            description="The historical paper provides the topics. Current standards and guidance refine how those topics should be described today without retroactively changing the original coursework."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 sm:mt-16">
            <Reveal>
              <article className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <Radio className="h-6 w-6 text-cyan-100/70" aria-hidden="true" />
                <h3 className="mt-6 text-xl font-semibold text-white">
                  BLE/GPS senses; cellular transport may carry
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/55">
                  Proximity or location originates in a separate sensing layer.
                  5G can be one transport option after that event exists; it
                  does not replace BLE proximity or GPS location acquisition.
                  The governance questions remain separate, as emphasized by the{" "}
                  <SourceLink href="https://www.who.int/publications/i/item/WHO-2019-nCoV-Ethics_Contact_tracing_apps-2020.1">
                    WHO contact-tracing ethics guidance
                  </SourceLink>
                  .
                </p>
              </article>
            </Reveal>

            <Reveal delay={0.05}>
              <article className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <Server className="h-6 w-6 text-cyan-100/70" aria-hidden="true" />
                <h3 className="mt-6 text-xl font-semibold text-white">
                  MEC changes placement, not the whole service
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/55">
                  The{" "}
                  <SourceLink href="https://www.etsi.org/technical-groups/mec/">
                    ETSI MEC model
                  </SourceLink>{" "}
                  places computing capabilities at the network edge in a
                  multi-access environment. That may shorten part of a path,
                  but does not guarantee end-to-end application behavior.
                </p>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <article className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <HeartPulse className="h-6 w-6 text-cyan-100/70" aria-hidden="true" />
                <h3 className="mt-6 text-xl font-semibold text-white">
                  Telemedicine is a service—not a radio profile
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/55">
                  The{" "}
                  <SourceLink href="https://www.who.int/publications/i/item/9789240059184">
                    WHO telemedicine guidance
                  </SourceLink>{" "}
                  treats remote care as an end-to-end health service. 5G may
                  support particular media or device paths, but telemedicine
                  can operate over other suitable access networks too.
                </p>
              </article>
            </Reveal>

            <Reveal delay={0.15}>
              <article className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <Layers3 className="h-6 w-6 text-cyan-100/70" aria-hidden="true" />
                <h3 className="mt-6 text-xl font-semibold text-white">
                  Slicing separates logical network contexts
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/55">
                  <SourceLink href="https://www.etsi.org/deliver/etsi_TS/123500_123599/123501/18.12.00_60/ts_123501v181200p.pdf">
                    3GPP TS 23.501
                  </SourceLink>{" "}
                  defines network-slice concepts within the 5G system. Their
                  presence is not proof that privacy, application security, or
                  clinical safety requirements have been met.
                </p>
              </article>
            </Reveal>
          </div>

          <Reveal className="mt-8">
            <div className="rounded-[2rem] border border-amber-200/25 bg-amber-200/[0.04] p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-100/75">
                    Standards reference · not an application guarantee
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    IMT-2020 targets are evaluation requirements—not measured
                    results for these use cases.
                  </h3>
                  <p className="mt-5 max-w-4xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                    <SourceLink href="https://www.itu.int/dms_pubrec/itu-r/rec/m/R-REC-M.2083-0-201509-I!!PDF-E.pdf">
                      ITU-R M.2083
                    </SourceLink>{" "}
                    frames the usage profiles, while{" "}
                    <SourceLink href="https://www.itu.int/dms_pub/itu-r/opb/rep/R-REP-M.2410-2017-PDF-E.pdf">
                      ITU-R M.2410
                    </SourceLink>{" "}
                    sets minimum technical performance requirements used for
                    IMT-2020 evaluation. Those values are neither application
                    SLAs nor evidence that the paper&apos;s scenarios achieved
                    them end to end.
                  </p>
                </div>
                <TriangleAlert
                  className="h-8 w-8 shrink-0 text-amber-100/70"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {standardsSources.map((source) => (
                  <Link
                    key={source.label}
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/10 px-4 py-2 text-xs font-semibold text-white/65 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a271e]"
                  >
                    {source.label}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Recorded conclusion & engineering review"
            title="The paper frames 5G as an enabler—not a complete pandemic response."
            description="Its recorded conclusion emphasizes connectivity, responsiveness, device scale, and flexible network resources across the cited scenarios. This case study preserves that conclusion while keeping causal outcomes, implementation claims, and reproducibility outside the evidence."
          />

          <div className="mt-14 grid gap-7 lg:grid-cols-[0.92fr_1.08fr] sm:mt-16">
            <Reveal>
              <div className="h-full rounded-[2rem] border border-accent/25 bg-accent/[0.045] p-5 sm:p-8 lg:p-10">
                <div className="mx-auto max-w-[354px]">
                  <EvidenceFigure
                    file="paper-conclusion"
                    alt="Privacy-safe crop of the conclusion from the original Greek 5G and COVID-19 paper"
                    width={354}
                    height={425}
                    sizes="(max-width: 423px) calc(100vw - 70px), 354px"
                    caption="Authored conclusion excerpt"
                  />
                </div>
                <div className="mt-7 flex items-start gap-4">
                  <CheckCircle2
                    className="mt-1 h-6 w-6 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent">
                      Recorded coursework conclusion
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/60">
                      The preserved paper presents 5G as a potential enabling
                      layer for remote services, connected devices, and
                      automation during the pandemic. That is its literature
                      conclusion—not a measured project result.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.07}>
              <div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:p-10">
                <TriangleAlert
                  className="h-7 w-7 text-amber-100/75"
                  aria-hidden="true"
                />
                <p className="mt-7 text-xs uppercase tracking-[0.2em] text-amber-100/75">
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
                <div className="mt-8 rounded-[1.35rem] border border-white/10 bg-black/15 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Quantitative boundary
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    The cited 8–16 Mb/s example for 4K/25fps and other numbers
                    in the paper remain literature references. They are not
                    treated as measurements, scenario thresholds, or service
                    guarantees in the Explorer.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-8">
            <div className="grid gap-5 rounded-[1.7rem] border border-white/10 bg-[#111116] p-6 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
              <Workflow className="h-7 w-7 text-cyan-100/65" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                  Durable engineering takeaway
                </p>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  A useful connected service requires an endpoint, a suitable
                  transport, processing, an application workflow, and
                  responsible governance. Improving one layer cannot stand in
                  for validating all of them.
                </p>
              </div>
              <ArrowRight
                className="hidden h-6 w-6 text-accent/60 md:block"
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
              Original paper
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Review the preserved Internet of Things coursework.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-primary/70 sm:text-base sm:leading-8">
              The view-only Word document remains the canonical historical
              artifact. The Response Explorer above is a separate, clearly
              labelled portfolio reconstruction.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-white hover:bg-[#2a2a31] focus-visible:ring-primary sm:w-auto"
              >
                <Link
                  href={PAPER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Original Paper
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-primary/35 bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-white focus-visible:ring-primary sm:w-auto"
              >
                <Link href="#pandemic-response-explorer">
                  <Network className="mr-2 h-4 w-4" aria-hidden="true" />
                  Return to the Response Network
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
