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
  Building2,
  Car,
  CheckCircle2,
  CircleDot,
  ExternalLink,
  HeartPulse,
  Layers3,
  LockKeyhole,
  MapPin,
  Network,
  Plane,
  Radio,
  Server,
  ShieldCheck,
  Signal,
  TriangleAlert,
  Users,
  Video,
  Workflow,
} from "lucide-react";

import CaseStudyNavigation from "@/components/case-studies/CaseStudyNavigation";
import {
  ExternalButton,
  Reveal,
  SectionHeading,
  TechPill,
} from "@/components/case-studies/CaseStudyPrimitives";
import IncidentSignalBoard from "@/components/case-studies/5g-public-safety/IncidentSignalBoard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAPER_URL =
  "https://ihuedu-my.sharepoint.com/:w:/g/personal/it185400_ihu365_gr/EWhKw3qPUFNFlk21apOCFFMBZP2F3jWpIRBJX3jWaAYecQ?e=xdYfpn";
const ASSET_PATH = "/assets/projects/5g-public-safety";

const projectFacts = [
  ["Coursework type", "University literature synthesis"],
  ["Preserved artifact", "Five rendered pages · view-only Greek Word paper"],
  ["Research basis", "15 references recorded in the paper"],
  ["Recovered implementation", "None · no source, prototype, or measurements"],
];

const evidenceLegend = [
  {
    label: "Original paper evidence",
    copy: "A domain, example, challenge, or conclusion present in the preserved coursework.",
    classes: "border-accent/25 bg-accent/[0.045] text-accent",
  },
  {
    label: "Current standards fact",
    copy: "A 2026 reading grounded in an authoritative standards or public-safety source.",
    classes: "border-sky-200/20 bg-sky-200/[0.04] text-sky-100/80",
  },
  {
    label: "Portfolio reconstruction",
    copy: "A browser-local explanatory model—not a recovered or deployed emergency system.",
    classes: "border-amber-200/20 bg-amber-200/[0.04] text-amber-100/80",
  },
];

const domains = [
  {
    number: "01",
    icon: HeartPulse,
    title: "Connected healthcare",
    copy: "The paper examines telemedicine, remote monitoring, and connected healthcare as public-safety support contexts.",
    boundary:
      "Connectivity can carry media and telemetry; it does not diagnose a patient or make a clinical decision.",
  },
  {
    number: "02",
    icon: Building2,
    title: "Smart-building safety",
    copy: "Sensors, controls, security systems, and structural monitoring appear as sources of building-state information.",
    boundary:
      "A sensor creates an observation. The network transports it; it does not determine whether the building is safe.",
  },
  {
    number: "03",
    icon: Plane,
    title: "Emergency response & UAV support",
    copy: "Police, coast guard, fire, and EMS communications sit alongside UAV search, responder guidance, supplies, cameras, sensors, and thermal imagery.",
    boundary:
      "These are literature-reported possibilities. 5G does not pilot the aircraft, interpret its imagery, or direct the response.",
  },
  {
    number: "04",
    icon: Car,
    title: "Connected transport",
    copy: "Connected vehicles, vehicle-to-vehicle and infrastructure communication, remote monitoring, and traffic-authority information form the fourth domain.",
    boundary:
      "Transporting vehicle or road information does not make an autonomous decision or guarantee a safe operational outcome.",
  },
];

const informationPath = [
  {
    icon: Activity,
    title: "Field observation",
    copy: "A responder, sensor, camera, UAV, building system, or vehicle produces an observation.",
  },
  {
    icon: Radio,
    title: "Connectivity",
    copy: "A configured access and transport path carries data; it does not create or validate the observation.",
  },
  {
    icon: Server,
    title: "Application / service",
    copy: "A service receives, routes, or processes information according to its own implementation and policy.",
  },
  {
    icon: LockKeyhole,
    title: "Authorized recipient",
    copy: "Identity, group membership, interworking, and policy determine who may receive a feed.",
  },
  {
    icon: Users,
    title: "Human action",
    copy: "Responders, coordinators, clinicians, building operators, or authorities interpret and act.",
  },
];

const currentStandards = [
  {
    icon: Radio,
    title: "MCX services are distinct",
    copy: "MCPTT, MCVideo, and MCData are separate standardized mission-critical service families. They are not labels for every voice, video, or data flow—and the original paper did not document them.",
    source: "3GPP SA6",
    href: "https://www.3gpp.org/technologies/sa6-app-enable?form=MG0AV3",
  },
  {
    icon: Workflow,
    title: "Interworking is explicit",
    copy: "Communication between 3GPP mission-critical services and legacy TETRA or P25 systems requires an interworking function plus compatible configuration, identity, group, and operational policy.",
    source: "3GPP TS 23.283",
    href: "https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3242",
  },
  {
    icon: Plane,
    title: "UAS connectivity is not autonomy",
    copy: "The 5G system can support UAS connectivity, identification, and tracking. That does not provide flight autonomy, payload interpretation, mission authorization, or an emergency decision.",
    source: "3GPP TS 23.256",
    href: "https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3853",
  },
  {
    icon: MapPin,
    title: "Positioning is not an accuracy promise",
    copy: "5GS Location Services define location architecture and procedures. Availability and accuracy still depend on the method, device, radio environment, configuration, and authorization.",
    source: "3GPP TS 23.273",
    href: "https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3577",
  },
  {
    icon: Server,
    title: "MEC changes processing placement",
    copy: "Multi-access edge computing can place application processing nearer an access network. It does not guarantee end-to-end latency, analytic correctness, continuity, or responder safety.",
    source: "ETSI MEC",
    href: "https://www.etsi.org/technical-groups/mec/",
  },
  {
    icon: Layers3,
    title: "Slicing creates logical contexts",
    copy: "Network slicing can structure logical network resources and policy. It does not automatically guarantee isolation, coverage, priority, resilience, security, or application performance.",
    source: "3GPP TS 23.501",
    href: "https://www.etsi.org/deliver/etsi_TS/123500_123599/123501/18.12.00_60/ts_123501v181200p.pdf",
  },
];

const opportunities = [
  {
    icon: Video,
    title: "Richer shared information",
    copy: "Broadband paths may carry field video, thermal imagery, sensor state, or vehicle data into an operational picture when every required component is available.",
  },
  {
    icon: Signal,
    title: "Responsive information exchange",
    copy: "Suitable radio, transport, application, and processing design may shorten parts of an information path; the end-to-end result still requires validation.",
  },
  {
    icon: Network,
    title: "More connected assets",
    copy: "Buildings, vehicles, field devices, and UAV payloads can contribute separate observations without turning the network into their sensing layer.",
  },
];

const constraints = [
  {
    icon: Radio,
    title: "Coverage and fallback readiness",
    copy: "Backhaul loss does not create automatic failover. Local, deployable, off-network, or legacy-radio paths must be deliberately supported and configured.",
  },
  {
    icon: LockKeyhole,
    title: "Authorization and interoperability",
    copy: "A technically reachable feed can remain unavailable when recipient identity, group policy, or cross-system interworking is not ready.",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity and privacy",
    copy: "Sensitive video, telemetry, health, vehicle, and location information needs controls beyond connectivity or a logical network slice.",
  },
  {
    icon: Users,
    title: "Operational procedures",
    copy: "Governance, training, common procedures, device readiness, and human judgment remain part of an effective multi-agency response.",
  },
];

const evidenceLimits = [
  "No author-built or deployed 5G, public-safety, UAV, building, vehicle, healthcare, MEC, slicing, or NFV system",
  "No source code, prototype, hardware, dataset, experiment, network measurement, or reproducible architecture",
  "No guaranteed priority, coverage, latency, positioning, resilience, interoperability, security, or automatic fallback",
  "No independent validation of the cited international, aviation, or operational examples",
  "No recoverable submission date, software environment, or methodology beyond the visible literature review",
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

function SourceLink({ href, children }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-sky-100/80 underline decoration-sky-200/30 underline-offset-4 transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </Link>
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
        {caption} · Original paper excerpt · date not preserved
      </figcaption>
    </figure>
  );
}

function HeroComposition({ reduceMotion }) {
  const path = [
    [Activity, "Field"],
    [Radio, "Connect"],
    [Server, "Service"],
    [LockKeyhole, "Authorize"],
    [Users, "Act"],
  ];

  return (
    <div className="relative mx-auto w-full max-w-[43rem] pb-10 sm:pb-14">
      <div
        className="pointer-events-none absolute inset-x-[8%] top-[-12%] h-[32rem] rounded-full bg-sky-300/[0.08] blur-[120px]"
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
            <span className="h-2 w-2 rounded-full bg-sky-200/65" />
            <span className="h-2 w-2 rounded-full bg-amber-200/65" />
          </div>
          <p className="text-[0.58rem] uppercase tracking-[0.18em] text-white/35">
            Original paper evidence
          </p>
        </div>
        <EvidenceFigure
          file="paper-title"
          alt="Privacy-safe crop of the original Greek paper title about the application of 5G technology in public safety"
          width={710}
          height={120}
          sizes="(max-width: 639px) calc(100vw - 54px), 560px"
          priority
          caption="Greek coursework title"
        />
      </motion.div>

      <motion.div
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mr-auto mt-5 w-[96%] max-w-[34rem] rounded-[1.65rem] border border-sky-200/20 bg-[#111116]/95 p-5 shadow-[0_22px_65px_rgba(0,0,0,0.4)] motion-reduce:!transform-none sm:-mt-8 sm:ml-4 sm:w-[88%]"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.18em] text-sky-100/70">
              Portfolio reconstruction
            </p>
            <p className="mt-2 text-xs text-white/45">
              An information path—not an emergency system.
            </p>
          </div>
          <Network className="h-5 w-5 text-accent" aria-hidden="true" />
        </div>
        <div
          className="mt-5 grid grid-cols-5 gap-1.5"
          role="img"
          aria-label="Field observation through connectivity and service to an authorized recipient and human action"
        >
          {path.map(([Icon, label], index) => (
            <div key={label} className="relative text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-sky-100/20 bg-sky-100/[0.05] sm:h-10 sm:w-10">
                <Icon className="h-4 w-4 text-sky-100/70" aria-hidden="true" />
              </div>
              {index < path.length - 1 ? (
                <span
                  className="absolute left-[calc(50%+1.35rem)] top-[1.1rem] h-px w-[calc(100%-1.7rem)] bg-gradient-to-r from-sky-200/35 to-accent/30 sm:left-[calc(50%+1.5rem)] sm:top-5 sm:w-[calc(100%-2rem)]"
                  aria-hidden="true"
                />
              ) : null}
              <p className="mt-2 text-[0.46rem] uppercase tracking-[0.08em] text-white/35 sm:text-[0.52rem]">
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
          <Icon className="h-6 w-6 text-sky-100/70" aria-hidden="true" />
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

function PathStage({ stage, index }) {
  const Icon = stage.icon;

  return (
    <li className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-100/20 bg-sky-100/[0.05]">
          <Icon className="h-5 w-5 text-sky-100/75" aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold text-white/25">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-white">{stage.title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/50">{stage.copy}</p>
      {index < informationPath.length - 1 ? (
        <ArrowRight
          className="absolute -bottom-6 left-1/2 h-4 w-4 -translate-x-1/2 rotate-90 text-accent/50 sm:hidden"
          aria-hidden="true"
        />
      ) : null}
    </li>
  );
}

function StandardCard({ item, reduceMotion }) {
  const Icon = item.icon;

  return (
    <HoverSurface reduceMotion={reduceMotion} className="h-full">
      <article className="flex h-full flex-col rounded-[1.65rem] border border-sky-200/20 bg-sky-200/[0.03] p-6">
        <div className="flex items-center justify-between gap-4">
          <Icon className="h-6 w-6 text-sky-100/70" aria-hidden="true" />
          <span className="text-[0.62rem] uppercase tracking-[0.16em] text-sky-100/55">
            Current standards fact
          </span>
        </div>
        <h3 className="mt-6 text-lg font-semibold text-white">{item.title}</h3>
        <p className="mt-4 flex-1 text-sm leading-7 text-white/50">
          {item.copy}
        </p>
        <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-6 text-white/45">
          Source · <SourceLink href={item.href}>{item.source}</SourceLink>
        </p>
      </article>
    </HoverSurface>
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
            ? "border-sky-200/20 bg-sky-200/[0.035]"
            : "border-amber-200/20 bg-amber-200/[0.035]",
        )}
      >
        <Icon
          className={cn(
            "h-6 w-6",
            tone === "opportunity"
              ? "text-sky-100/75"
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

export default function FiveGPublicSafetyCaseStudy({
  previousProject,
  nextProject,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-x-clip bg-primary text-white">
      <section className="relative isolate pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-32">
        <div
          className="pointer-events-none absolute left-[58%] top-[-15rem] -z-10 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-sky-300/[0.07] blur-[140px] sm:h-[64rem] sm:w-[64rem]"
          aria-hidden="true"
        />
        <div className="container mx-auto">
          <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 xl:gap-20">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm">
                Case study · Internet of Things
              </p>
              <h1 className="mt-6 text-[2.55rem] font-semibold leading-[1.1] text-white sm:text-6xl sm:leading-[1.03] lg:text-[3.7rem] xl:text-[4.35rem]">
                5G for
                <span className="block text-white/45">Public Safety</span>
              </h1>
              <p className="mt-6 text-base font-medium leading-7 text-accent sm:text-lg">
                Operational Communications / Situational Awareness
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                An evidence-led reinterpretation of a public-safety literature
                paper—turned into an interactive information board that keeps
                field observations, connectivity, services, authorization,
                and human decisions distinct.
              </p>
              <p className="mt-4 max-w-xl text-xs leading-6 text-white/35">
                Academic catalogue title: “The Implementation of 5G Technology
                in Enhancing Public Safety.” This case study presents the work
                as research, not as an implemented system.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-auto min-h-14 w-full whitespace-normal px-5 py-3 text-center leading-5 tracking-[1.5px] focus-visible:ring-accent focus-visible:ring-offset-primary sm:w-auto sm:px-8 sm:tracking-[2px]"
                >
                  <Link href="#incident-signal-board">
                    Explore the Signal Board
                    <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <ExternalButton
                  href={PAPER_URL}
                  variant="outline"
                  icon={BookOpen}
                >
                  View Original Paper
                </ExternalButton>
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
              {["5G", "IoT", "URLLC", "Network Slicing"].map((topic) => (
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
              title="A public-safety literature study—not a deployed 5G platform."
              description="The preserved Greek paper spans five rendered pages and records 15 references. It discusses where 5G may contribute to public safety, but documents no source code, prototype, hardware, experiment, dataset, measurement, deployment, or reproducible architecture."
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
            <div className="rounded-[2rem] border border-white/10 bg-[#111116] p-6 sm:p-8 lg:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">
                Archival identity
              </p>
              <h3 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                The exact Greek title describes an application of technology,
                not a recovered software implementation.
              </h3>
              <p className="mt-5 max-w-4xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                “Η εφαρμογή της τεχνολογίας του 5G στην Δημόσια Ασφάλεια” is
                the title preserved in the paper. The English registry wording
                is a later catalogue description. The artifact itself is an
                undated narrative review; its course and semester are not
                recoverable.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Four public-safety domains"
            title="One connectivity discussion spans four different operational contexts."
            description="The domains below come from the preserved paper. Its healthcare, international, aviation, UAV, building, and transport cases remain examples reported through cited literature—not systems created, deployed, or independently verified by the author."
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start sm:mt-16">
            <Reveal>
              <div className="rounded-[2rem] border border-white/10 bg-[#111116] p-5 sm:p-7 lg:sticky lg:top-24">
                <div className="mx-auto max-w-[370px]">
                  <EvidenceFigure
                    file="paper-emergency-response"
                    alt="Privacy-safe crop of authored Greek prose about emergency-response and UAV-related public-safety examples"
                    width={370}
                    height={480}
                    sizes="(max-width: 439px) calc(100vw - 70px), 370px"
                    caption="Authored emergency-response discussion"
                  />
                </div>
                <p className="mt-5 text-sm leading-7 text-white/50">
                  The crop preserves authored prose only. All third-party
                  figures from the paper are excluded from this case study.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2">
              {domains.map((domain, index) => (
                <Reveal key={domain.number} delay={index * 0.05}>
                  <DomainCard domain={domain} reduceMotion={reduceMotion} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="From field observation to operational picture"
            title="Connectivity carries information; it does not create the incident decision."
            description="This code-native path makes each responsibility visible. A source produces an observation, a configured network transports it, a service handles it, policy governs recipients, and people decide what to do next."
          />

          <Reveal className="mt-14 sm:mt-16">
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {informationPath.map((stage, index) => (
                <PathStage key={stage.title} stage={stage} index={index} />
              ))}
            </ol>
          </Reveal>

          <Reveal className="mt-8">
            <div className="flex flex-col gap-5 rounded-[1.7rem] border border-amber-200/20 bg-amber-200/[0.035] p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-100/75">
                  Responsibility boundary
                </p>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  5G does not sense a structural fault, interpret thermal
                  imagery, pilot a UAV, diagnose a patient, control an
                  emergency response, or guarantee a successful outcome.
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

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Interactive Incident Signal Board"
            title="Test what remains visible to each operational role."
            description="This deterministic browser-local reconstruction calculates a many-to-many feed and recipient matrix across three evidence-backed drills. It does not simulate network packets, incident outcomes, emergency recommendations, response times, or probabilities."
          />
          <div className="mt-14 sm:mt-16">
            <IncidentSignalBoard />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Mission-critical communications in 2026"
            title="Standardized capabilities still depend on real deployment and operational readiness."
            description="These current standards facts help interpret the historical paper without retroactively placing MCX, a recovered architecture, or a specific implementation inside the coursework."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 sm:mt-16">
            {currentStandards.map((item, index) => (
              <Reveal key={item.title} delay={(index % 3) * 0.05}>
                <StandardCard item={item} reduceMotion={reduceMotion} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="rounded-[2rem] border border-amber-200/25 bg-amber-200/[0.04] p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-100/75">
                    Standards target · not an application guarantee
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    A specification, slice, priority policy, or edge node is
                    not proof of field performance.
                  </h3>
                  <p className="mt-5 max-w-4xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                    <SourceLink href="https://www.itu.int/dms_pub/itu-r/opb/rep/R-REP-M.2410-2017-PDF-E.pdf">
                      ITU-R M.2410
                    </SourceLink>{" "}
                    contains minimum technical performance requirements for
                    IMT-2020 evaluation—not measured incident-response SLAs.
                    Likewise, interoperability requires compatible
                    implementation, configuration, identity, policy, and
                    operational preparation.
                  </p>
                </div>
                <TriangleAlert
                  className="h-8 w-8 shrink-0 text-amber-100/70"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.35rem] border border-white/10 bg-black/10 p-5">
                  <p className="text-xs uppercase tracking-[0.17em] text-white/35">
                    Dated interoperability evidence
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    ETSI reported a 92% success rate across the tests executed
                    at its July 2026 MCX Plugtests. That result belongs to the
                    event and tested configurations; it is not universal
                    product certification. See the{" "}
                    <SourceLink href="https://www.etsi.org/newsroom/news/etsi-mission-critical-10th-plugtests-report-unveiled/">
                      ETSI event report
                    </SourceLink>
                    .
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-white/10 bg-black/10 p-5">
                  <p className="text-xs uppercase tracking-[0.17em] text-white/35">
                    Operational interoperability
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    Governance, common procedures, training, exercises, and
                    technology all contribute to multi-agency readiness,
                    according to{" "}
                    <SourceLink href="https://www.publicsafety.gc.ca/cnt/mrgnc-mngmnt/mrgnc-prprdnss/cmmnctns-ntrprblt-en.aspx">
                      Public Safety Canada
                    </SourceLink>
                    .
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Operational opportunity ↔ constraint"
            title="More information can help—but only when the complete operating system is ready."
            description="The paper records opportunities and challenges around the same public-safety landscape. This comparison keeps connectivity benefits alongside coverage, authorization, interoperability, privacy, and human readiness."
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-2 sm:mt-16">
            <Reveal>
              <div className="h-full rounded-[2rem] border border-sky-200/20 bg-[#111116] p-5 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/75">
                  Where connectivity may contribute
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
                  What connectivity does not resolve
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

          <Reveal className="mt-8">
            <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-[#111116] p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-10">
              <div className="mx-auto w-full max-w-[370px]">
                <EvidenceFigure
                  file="paper-challenges"
                  alt="Privacy-safe crop of authored Greek prose discussing challenges around 5G and public safety"
                  width={370}
                  height={857}
                  sizes="(max-width: 439px) calc(100vw - 70px), 370px"
                  caption="Authored challenges discussion"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  Original paper evidence
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  The paper records aviation, privacy, access, and scale as
                  unresolved concerns.
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                  Aviation and radio-altimeter interference, privacy and
                  security, limited connectivity or device availability, and
                  scalability appear in the preserved discussion. Slicing,
                  NFV, encryption, and blockchain are proposals in that
                  narrative—not implemented or evaluated solutions.
                </p>
                <p className="mt-4 text-xs leading-6 text-white/35">
                  Frequency, power, and video figures cited by the paper remain
                  literature-reported examples. They do not drive a calculator
                  or simulation here.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Recorded conclusion & engineering limits"
            title="The paper presents 5G as a possible enabler—not a complete public-safety system."
            description="Its conclusion is preserved as a historical literature position across healthcare, buildings, emergency support, and transport. Current analysis remains separate from what the coursework originally stated."
          />

          <div className="mt-14 grid gap-7 lg:grid-cols-[0.92fr_1.08fr] sm:mt-16">
            <Reveal>
              <div className="h-full rounded-[2rem] border border-accent/25 bg-accent/[0.045] p-6 sm:p-8 lg:p-10">
                <CheckCircle2 className="h-7 w-7 text-accent" aria-hidden="true" />
                <p className="mt-7 text-xs uppercase tracking-[0.2em] text-accent">
                  Recorded coursework conclusion
                </p>
                <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  The preserved paper frames 5G as a technology that may assist
                  connected care, smart-building monitoring, emergency-response
                  support, and connected transport. This is the paper&apos;s
                  literature conclusion—not a measured result or independently
                  reproduced deployment.
                </p>
                <div className="mt-8 rounded-[1.35rem] border border-white/10 bg-black/15 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Durable engineering takeaway
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    Situational awareness depends on observable sources,
                    suitable connectivity, working applications, authorized
                    recipients, interoperable procedures, and human judgment.
                    Improving one layer cannot validate the others.
                  </p>
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
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-accent py-20 text-primary sm:py-24 lg:py-28">
        <div className="container mx-auto">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60 sm:text-sm">
              Original paper
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Review the preserved public-safety coursework.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-primary/70 sm:text-base sm:leading-8">
              The protected, view-only Word paper remains the canonical
              historical artifact. The Incident Signal Board above is a
              separate, clearly labelled portfolio reconstruction.
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
                <Link href="#incident-signal-board">
                  <Network className="mr-2 h-4 w-4" aria-hidden="true" />
                  Return to the Signal Board
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
