"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Braces,
  CheckCircle2,
  CircleDot,
  Code2,
  Container,
  ExternalLink,
  Eye,
  FileSearch,
  Fingerprint,
  KeyRound,
  Layers3,
  LockKeyhole,
  Network,
  Route,
  Search,
  ShieldAlert,
  ShieldCheck,
  SquareTerminal,
  TriangleAlert,
  Workflow,
} from "lucide-react";

import CaseStudyNavigation from "@/components/case-studies/CaseStudyNavigation";
import {
  Reveal,
  SectionHeading,
  TechPill,
} from "@/components/case-studies/CaseStudyPrimitives";
import SecurityLab from "@/components/case-studies/hack-the-box-no-threshold/SecurityLab";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESENTATION_URL =
  "https://ihuedu-my.sharepoint.com/:p:/g/personal/it185400_ihu365_gr/EZPv6bLIMVpKqGZjg7Jt17EB7IODLspAWo_hoJS8GrVPFA?e=PyY1Gi";
const ASSET_PATH = "/assets/projects/hack-the-box-no-threshold";

const verifiedTools = [
  "Browser DevTools",
  "Gobuster",
  "FoxyProxy",
  "Burp Suite",
  "Python requests",
  "ThreadPoolExecutor",
];

const projectFacts = [
  ["Challenge", "No-Threshold · Hack The Box"],
  ["Classification", "Medium · Web"],
  ["Capture context", "26 May 2024"],
  ["Preserved evidence", "21-slide presentation"],
];

const attackPath = [
  {
    icon: Search,
    number: "01",
    title: "Discover an authentication route",
    copy: "The presentation records endpoint discovery through Gobuster. A dashboard response redirected toward the login route, establishing where the authentication flow began.",
  },
  {
    icon: Route,
    number: "02",
    title: "Compare two path representations",
    copy: "A direct request to /auth/login returned 403. A Burp request using /./auth/login rendered the login page, documenting inconsistent treatment of equivalent-looking paths.",
  },
  {
    icon: Braces,
    number: "03",
    title: "Cross the query boundary",
    copy: "The preserved login request uses syntax-bearing input and the following screen is the 2FA form. The evidence supports a SQL-injection login bypass, but does not preserve the backend query implementation.",
  },
  {
    icon: KeyRound,
    number: "04",
    title: "Reach a four-digit verification step",
    copy: "The application presented a four-digit 2FA form. No confirmed code, successful verification response, or flag output survives in the presentation.",
  },
  {
    icon: Fingerprint,
    number: "05",
    title: "Change the claimed request identity",
    copy: "The documented Python helper changes X-Forwarded-For after every five requests. That demonstrates reliance on visitor-controlled identity data; it does not prove the server’s exact rate threshold.",
  },
];

const controlFailures = [
  {
    icon: Route,
    label: "Representation",
    title: "Authorization and routing did not agree on one path.",
    copy: "The recorded 403-to-login difference shows why a security decision must use the same canonical representation as the downstream route decision.",
    invariant: "Normalize once, then apply policy and routing to that same value.",
  },
  {
    icon: Code2,
    label: "Query boundary",
    title: "User-controlled data influenced statement structure.",
    copy: "The login step demonstrates the risk of mixing input with SQL syntax. The recovered slides do not expose the original query or database implementation.",
    invariant: "Keep the statement fixed and pass untrusted values separately.",
  },
  {
    icon: Fingerprint,
    label: "Identity boundary",
    title: "A client assertion influenced request accounting.",
    copy: "Forwarding metadata is meaningful only inside a configured trust chain. Treating a visitor-provided header as identity lets one actor appear as several buckets.",
    invariant: "Derive limits from trusted proxy data and stable server-side identity.",
  },
];

const toolRoles = [
  {
    icon: Eye,
    title: "Browser DevTools",
    copy: "Used to inspect the application interface and its browser-visible structure before moving into request-level analysis.",
  },
  {
    icon: FileSearch,
    title: "Gobuster",
    copy: "Recorded in the discovery stage, where a dashboard response exposed the redirect toward the authentication route.",
  },
  {
    icon: Network,
    title: "FoxyProxy + Burp Suite",
    copy: "FoxyProxy routed browser traffic into Burp. Proxy and Repeater then supported request inspection and controlled path/input changes.",
  },
  {
    icon: SquareTerminal,
    title: "Python request helper",
    copy: "The slides preserve a helper built with requests and ThreadPoolExecutor for the verification stage. This OnePage does not recreate that automation.",
  },
];

const remediationCards = [
  {
    icon: Route,
    title: "Use one route representation",
    copy: "Parse and canonicalize a request path before access-control evaluation, then route using exactly that canonical value. The lab demonstrates only a narrow literal-dot model, not universal URL normalization.",
  },
  {
    icon: Braces,
    title: "Bind values outside query structure",
    copy: "Parameterized statements keep SQL syntax stable while the database driver handles each input as data. Validation remains useful, but it is not a substitute for binding.",
  },
  {
    icon: Network,
    title: "Define a trusted proxy boundary",
    copy: "Strip or ignore visitor-supplied forwarding headers unless they arrive through a configured trusted proxy chain that owns those values.",
  },
  {
    icon: Fingerprint,
    title: "Limit a stable verification identity",
    copy: "Tie failed attempts to a server-derived verification transaction, account, or session and enforce bounded attempts independently of mutable client labels.",
  },
  {
    icon: Container,
    title: "Reduce impact after prevention",
    copy: "Least privilege and container isolation can constrain damage if an earlier control fails. The slides recommend these measures; they do not show that either was implemented.",
  },
];

const evidenceLimits = [
  "No recovered challenge backend or author-owned source repository",
  "No independently reproducible route, database, or rate-limit implementation",
  "No confirmed 2FA code, successful verification response, or preserved flag",
  "No evidence that Docker or least-privilege remediation was implemented",
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
      <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#101014]">
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
        {caption} · Original presentation crop · May 2024
      </figcaption>
    </figure>
  );
}

function HeroEvidence({ reduceMotion }) {
  return (
    <div className="relative mx-auto w-full max-w-[43rem] pb-10 sm:pb-16">
      <div
        className="pointer-events-none absolute inset-x-[7%] top-[2%] h-[30rem] rounded-full bg-accent/[0.08] blur-[115px]"
        aria-hidden="true"
      />

      <motion.div
        whileHover={reduceMotion ? undefined : { y: -6, scale: 1.008 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative ml-auto w-full max-w-[537px] rounded-[2rem] border border-white/10 bg-[#141419] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.44)] motion-reduce:!transform-none sm:max-w-[545px] sm:p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-4 px-2 pt-1">
          <div className="flex gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-rose-400/70" />
            <span className="h-2 w-2 rounded-full bg-amber-300/60" />
            <span className="h-2 w-2 rounded-full bg-accent/70" />
          </div>
          <p className="text-[0.58rem] uppercase tracking-[0.18em] text-white/35">
            Application evidence
          </p>
        </div>
        <EvidenceFigure
          file="wizard-shop"
          alt="Cropped original presentation screenshot showing the Wizard Shop application interface"
          width={513}
          height={185}
          sizes="(max-width: 639px) calc(100vw - 54px), 513px"
          priority
          caption="Wizard Shop interface"
        />
      </motion.div>

      <motion.div
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative ml-auto mt-5 w-[88%] max-w-[510px] rounded-[1.7rem] border border-white/10 bg-[#19191f] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.4)] motion-reduce:!transform-none sm:-mt-6 sm:mr-5 sm:w-[64%]"
      >
        <p className="mb-3 px-1 text-[0.58rem] uppercase tracking-[0.18em] text-rose-300/80">
          Direct request · blocked
        </p>
        <EvidenceFigure
          file="forbidden-response"
          alt="Cropped original presentation screenshot showing the plain 403 Forbidden response returned by the login route"
          width={486}
          height={227}
          sizes="(max-width: 639px) 78vw, 486px"
          caption="403 response"
        />
      </motion.div>

      <motion.div
        whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mr-auto mt-5 w-[92%] max-w-[21rem] rounded-[1.5rem] border border-amber-300/20 bg-[#111116]/95 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.35)] motion-reduce:!transform-none sm:-mt-24 sm:ml-4 sm:w-[50%]"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.6rem] uppercase tracking-[0.18em] text-amber-200/75">
            Request envelope
          </p>
          <Route className="h-4 w-4 text-amber-200/75" aria-hidden="true" />
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
          <span className="text-xs font-semibold text-accent">GET</span>
          <code className="min-w-0 truncate text-xs text-white/75">
            /./auth/login
          </code>
        </div>
        <p className="mt-3 text-[0.65rem] leading-5 text-white/35">
          Documented path variant · no live request
        </p>
      </motion.div>
    </div>
  );
}

function AttackStep({ icon: Icon, number, title, copy, isLast }) {
  return (
    <article className="relative h-full rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-6">
      {!isLast ? (
        <ArrowRight
          className="absolute -right-5 top-9 z-10 hidden h-4 w-4 text-accent/45 xl:block"
          aria-hidden="true"
        />
      ) : null}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-accent">{number}</span>
        <Icon className="h-5 w-5 text-accent/70" aria-hidden="true" />
      </div>
      <h3 className="mt-7 text-lg font-semibold leading-7 text-white">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-white/50">{copy}</p>
      <p className="mt-6 border-t border-white/10 pt-4 text-[0.62rem] uppercase tracking-[0.15em] text-white/30">
        Original presentation evidence
      </p>
    </article>
  );
}

function ControlFailure({ icon: Icon, label, title, copy, invariant }) {
  return (
    <div className="h-full rounded-[2rem] border border-white/10 bg-[#18181d] p-6 sm:p-8">
      <div className="flex items-center justify-between gap-5">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-300/75">
          {label}
        </p>
        <Icon className="h-6 w-6 text-rose-300/70" aria-hidden="true" />
      </div>
      <h3 className="mt-7 text-xl font-semibold leading-8 text-white">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-white/50">{copy}</p>
      <div className="mt-7 rounded-[1.25rem] border border-accent/20 bg-accent/[0.045] p-5">
        <p className="text-[0.62rem] uppercase tracking-[0.17em] text-accent">
          Defensive invariant
        </p>
        <p className="mt-3 text-sm leading-6 text-white/65">{invariant}</p>
      </div>
    </div>
  );
}

function ToolCard({ icon: Icon, title, copy }) {
  return (
    <div className="h-full rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-6">
      <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
      <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-white/50">{copy}</p>
    </div>
  );
}

function RemediationCard({ icon: Icon, title, copy }) {
  return (
    <div className="h-full rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-6 sm:p-7">
      <div className="flex items-center justify-between gap-5">
        <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
        <Icon className="h-5 w-5 text-white/30" aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-lg font-semibold leading-7 text-white">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-white/50">{copy}</p>
    </div>
  );
}

export default function WebSecurityCaseStudy({
  previousProject,
  nextProject,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-x-clip bg-primary text-white">
      <section className="relative isolate pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-32">
        <div
          className="pointer-events-none absolute left-[62%] top-[-13rem] -z-10 h-[52rem] w-[52rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[130px] sm:h-[60rem] sm:w-[60rem]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-[-10rem] top-[18rem] -z-10 h-[28rem] w-[28rem] rounded-full bg-amber-300/[0.035] blur-[120px]"
          aria-hidden="true"
        />

        <div className="container mx-auto">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-20">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm">
                Case study · Web Security
              </p>
              <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.03] text-white sm:text-6xl lg:text-[3.4rem] xl:text-[4rem]">
                No-Threshold{" "}
                <span className="block text-white/45">
                  Web Security Challenge
                </span>
              </h1>
              <p className="mt-6 text-base font-medium leading-7 text-accent sm:text-lg">
                Authentication Controls / Trust-Boundary Analysis
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                An evidence-led reading of a documented Hack The Box challenge
                path: inconsistent route handling, a query boundary failure,
                and request identity trusted at a four-digit verification
                stage.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-auto min-h-14 w-full whitespace-normal px-5 py-3 text-center leading-5 tracking-[1.5px] focus-visible:ring-accent focus-visible:ring-offset-primary sm:h-14 sm:w-auto sm:whitespace-nowrap sm:px-8 sm:py-0 sm:tracking-[2px]"
                >
                  <Link href="#security-lab">
                    Explore the Security Lab
                    <ArrowDown
                      className="ml-2 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-auto min-h-14 w-full whitespace-normal px-5 py-3 text-center leading-5 tracking-[1.5px] focus-visible:ring-accent focus-visible:ring-offset-primary sm:h-14 sm:w-auto sm:whitespace-nowrap sm:px-8 sm:py-0 sm:tracking-[2px]"
                >
                  <Link
                    href={PRESENTATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink
                      className="mr-2 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    View Original Presentation
                    <ArrowUpRight
                      className="ml-2 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <HeroEvidence reduceMotion={reduceMotion} />
            </Reveal>
          </div>

          <Reveal delay={0.14} className="mt-10">
            <ul
              className="flex flex-wrap justify-center gap-2 lg:justify-start"
              aria-label="Verified tools and technologies"
            >
              {verifiedTools.map((tool) => (
                <TechPill key={tool} reduceMotion={reduceMotion}>
                  {tool}
                </TechPill>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-start lg:gap-20">
            <SectionHeading
              eyebrow="Project evidence & context"
              title="A preserved walkthrough supports the chain—not a recovered application."
              description="The 21-slide presentation records a Medium Web challenge, the tools used to inspect it, and a sequence that reaches the verification boundary. It does not preserve the target, backend source, exact server architecture, successful 2FA value, or flag output."
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

          <Reveal className="mt-12">
            <div className="rounded-[1.7rem] border border-amber-300/25 bg-amber-300/[0.045] p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">
                    Archival naming note
                  </p>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:text-base">
                    The original cover and historical catalogue use “SSTI.” The
                    preserved slides do not document a template engine,
                    template-rendering sink, SSTI probe, or SSTI result. This
                    case study therefore uses the evidence-supported challenge
                    title and retains the earlier label only as archival
                    context.
                  </p>
                </div>
                <BookOpenCheck
                  className="h-7 w-7 shrink-0 text-amber-200/70"
                  aria-hidden="true"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="The observed attack path"
            title="Small trust decisions compose into one authentication path."
            description="Each stage below is grounded in the original presentation. The sequence explains what was observed without turning missing implementation details into invented architecture."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5 sm:mt-16">
            {attackPath.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.05}>
                <HoverSurface reduceMotion={reduceMotion} className="h-full">
                  <AttackStep
                    {...step}
                    isLast={index === attackPath.length - 1}
                  />
                </HoverSurface>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-4">
                <ShieldAlert
                  className="mt-0.5 h-5 w-5 shrink-0 text-rose-300/75"
                  aria-hidden="true"
                />
                <p className="text-sm leading-7 text-white/55">
                  The screenshots show challenge completion, but no preserved
                  flag or confirmed verification response. “Reached 2FA” is the
                  strongest retained outcome for this technical sequence.
                </p>
              </div>
              <span className="shrink-0 text-[0.62rem] uppercase tracking-[0.17em] text-white/30">
                Evidence boundary
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="security-lab"
        className="scroll-mt-8 border-y border-white/10 bg-[#19191f] py-20 sm:scroll-mt-12 sm:py-24 lg:py-32"
      >
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Interactive trust boundary lab"
            title="Test how representation, data, and identity change a control decision."
            description="The same browser-local inputs drive an observed-assumptions lane and a hardened-reconstruction lane. Every path result, query preview, counter, and pipeline status is calculated from the current lab state—without contacting a target or executing an exploit."
          />
          <div className="mt-14 sm:mt-16">
            <SecurityLab />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Why each control failed"
            title="The common fault is misplaced trust at a boundary."
            description="The route, query, and request-identity stages fail in different ways, but each lets an untrusted representation influence a security decision it should not own."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3 sm:mt-16">
            {controlFailures.map((failure, index) => (
              <Reveal key={failure.label} delay={index * 0.06}>
                <HoverSurface reduceMotion={reduceMotion} className="h-full">
                  <ControlFailure {...failure} />
                </HoverSurface>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Methodology & tools"
            title="Each tool answers a specific question in the documented workflow."
            description="The evidence moves from browser inspection to endpoint discovery, controlled request comparison, and finally documented request automation. The tools are presented by role—not as decorative security branding."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4 sm:mt-16">
            {toolRoles.map((tool, index) => (
              <Reveal key={tool.title} delay={index * 0.05}>
                <HoverSurface reduceMotion={reduceMotion} className="h-full">
                  <ToolCard {...tool} />
                </HoverSurface>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="grid gap-5 rounded-[2rem] border border-white/10 bg-[#111116] p-6 sm:p-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:p-10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  Recorded automation
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                  A preserved helper changed the claimed source over time.
                </h3>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                <p className="text-sm leading-7 text-white/55">
                  The screenshot documents Python{" "}
                  <code className="text-white/75">requests</code>, a{" "}
                  <code className="text-white/75">ThreadPoolExecutor</code>,
                  and changes to{" "}
                  <code className="text-white/75">X-Forwarded-For</code> after
                  every five requests. It is evidence of the approach—not a
                  recovered, runnable source file or proof of the exact server
                  threshold.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Defensive remediation"
            title="Repair the trust decisions, then constrain what remains."
            description="The primary controls align representations, separate data from structure, and derive identity from trusted server context. Least privilege and isolation provide an additional containment layer rather than replacing prevention."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-6 sm:mt-16">
            {remediationCards.map((card, index) => (
              <Reveal
                key={card.title}
                delay={index * 0.05}
                className={cn(
                  "lg:col-span-2",
                  index === 3 && "lg:col-start-2"
                )}
              >
                <HoverSurface reduceMotion={reduceMotion} className="h-full">
                  <RemediationCard {...card} />
                </HoverSurface>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="flex flex-col gap-5 rounded-[1.7rem] border border-accent/25 bg-accent/[0.045] p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  Recommendation boundary
                </p>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:text-base">
                  Parameter binding, trusted-proxy handling, stable
                  verification identity, least privilege, and container
                  isolation are engineering recommendations. The presentation
                  does not demonstrate that the challenge was remediated or
                  rebuilt with these controls.
                </p>
              </div>
              <LockKeyhole
                className="h-7 w-7 shrink-0 text-accent/70"
                aria-hidden="true"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Recorded outcome & engineering limits"
            title="The preserved work explains the path while leaving its unknowns visible."
            description="A trustworthy case study separates what the presentation demonstrates, what can be reconstructed safely, and what the surviving artifacts cannot answer."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-[0.92fr_1.08fr] sm:mt-16">
            <Reveal>
              <div className="h-full rounded-[2rem] border border-accent/30 bg-accent/[0.05] p-6 sm:p-8 lg:p-10">
                <CheckCircle2 className="h-7 w-7 text-accent" aria-hidden="true" />
                <p className="mt-7 text-xs uppercase tracking-[0.2em] text-accent">
                  Recorded challenge outcome
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  The presentation shows the challenge as completed.
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  Its technical sequence documents route discovery, a path
                  policy mismatch, a SQL-injection login bypass, a four-digit
                  verification boundary, and forwarding-header changes in the
                  request helper. It does not retain the final verification
                  response or flag.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.07}>
              <div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:p-10">
                <TriangleAlert
                  className="h-7 w-7 text-amber-200/75"
                  aria-hidden="true"
                />
                <p className="mt-7 text-xs uppercase tracking-[0.2em] text-amber-200/75">
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
                  Impact language
                </p>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-white/55">
                  The presentation discusses confidentiality, integrity, and
                  availability as potential consequences of weak controls. No
                  measured real-world impact is preserved, so those outcomes
                  are not presented here as demonstrated results.
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

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Engineering takeaway"
            title="A secure flow is only as consistent as its trust boundaries."
            description="A route policy can be bypassed when representations diverge. A query becomes unsafe when data can become structure. A rate limit loses meaning when the visitor controls the identity it counts. The durable lesson is to make each boundary explicit, stable, and server-owned."
          />

          <Reveal className="mt-14 sm:mt-16">
            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-[#111116] p-5 sm:p-8 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center lg:p-10">
              {[
                ["01", "Canonical representation", Route],
                ["02", "Bound data", Braces],
                ["03", "Server-derived identity", Fingerprint],
              ].map(([number, title, Icon], index) => (
                <div key={number} className="contents">
                  <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.025] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold text-accent">
                        {number}
                      </span>
                      <Icon className="h-5 w-5 text-accent/70" aria-hidden="true" />
                    </div>
                    <p className="mt-5 text-sm font-semibold text-white">
                      {title}
                    </p>
                  </div>
                  {index < 2 ? (
                    <ArrowRight
                      className="mx-auto hidden h-5 w-5 text-accent/40 lg:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
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
              Review the preserved No-Threshold project walkthrough.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-primary/70 sm:text-base sm:leading-8">
              The view-only PowerPoint remains the canonical historical
              artifact. The interactive lab above is a separate, clearly
              labelled portfolio reconstruction.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-white hover:bg-[#2a2a31] focus-visible:ring-primary sm:w-auto"
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
                className="w-full border-primary/35 bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-white focus-visible:ring-primary sm:w-auto"
              >
                <Link href="#security-lab">
                  <Workflow className="mr-2 h-4 w-4" aria-hidden="true" />
                  Return to the Security Lab
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
