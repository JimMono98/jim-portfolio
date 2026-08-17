"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  CheckCircle2,
  CircleHelp,
  Code2,
  ExternalLink,
  GitBranch,
  History,
  MessageSquareText,
  MonitorSmartphone,
  Send,
  Server,
  Smartphone,
  UserRound,
  Workflow,
} from "lucide-react";

import CaseStudyNavigation from "@/components/case-studies/CaseStudyNavigation";
import {
  ExternalButton,
  Reveal,
  SectionHeading,
  TechPill,
} from "@/components/case-studies/CaseStudyPrimitives";
import NumberCheckerRecreation from "@/components/case-studies/number-checker/NumberCheckerRecreation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ORIGINAL_PROJECT_URL =
  "https://ihuedu-my.sharepoint.com/:i:/g/personal/it185400_ihu365_gr/EaiGUVKBLEJIu0_-fjmNsQgBa_y_4PHjalZIrKm6eDNvvQ?e=qpiaCu";
const SNAPSHOT_PATH =
  "/assets/projects/custom-python-api-number-checker/original-project-snapshot.png";

const projectFacts = [
  ["Approximate period", "Around 2018 · author-provided timeline"],
  ["Portfolio position", "Project 03"],
  ["Learning sequence", "Early project 02"],
  ["Primary purpose", "Client–server fundamentals"],
];

const flowSteps = [
  {
    icon: UserRound,
    number: "01",
    label: "User input",
    detail: "A number is entered.",
  },
  {
    icon: Smartphone,
    number: "02",
    label: "Mobile client",
    detail: "The interface submits the value.",
  },
  {
    icon: Send,
    number: "03",
    label: "Data sent",
    detail: "The number crosses the client boundary.",
  },
  {
    icon: Server,
    number: "04",
    label: "Python backend",
    detail: "The backend receives the value.",
  },
  {
    icon: GitBranch,
    number: "05",
    label: "Conditional logic",
    detail: "A matching branch is evaluated.",
  },
  {
    icon: MessageSquareText,
    number: "06",
    label: "Returned response",
    detail: "The mobile UI displays the text.",
  },
];

const evidenceGroups = [
  {
    icon: CheckCircle2,
    eyebrow: "Preserved evidence",
    title: "What the artifact still shows",
    copy: "A screen titled MainActivity accepts a number, exposes a Send action, and renders a result. Its fallback message explicitly names 0, 5, and 10.",
  },
  {
    icon: History,
    eyebrow: "Author recollection",
    title: "What survives through project history",
    copy: "The exercise dates to around 2018, used a Python backend, and was assigned to make the client-to-backend response cycle tangible.",
  },
  {
    icon: CircleHelp,
    eyebrow: "Not recoverable",
    title: "What the case study will not invent",
    copy: "The original source, transport details, framework choices, and most response strings are no longer available.",
  },
];

const requestLayers = [
  {
    icon: Smartphone,
    label: "Client",
    title: "Capture one piece of user input.",
    copy: "The mobile surface owns the number field and the action that begins the exchange.",
  },
  {
    icon: Server,
    label: "Backend",
    title: "Receive the submitted value.",
    copy: "The remembered system boundary places processing outside the mobile interface.",
  },
  {
    icon: GitBranch,
    label: "Logic",
    title: "Choose a response branch.",
    copy: "Conditional evaluation turns a small input into different returned text.",
  },
  {
    icon: MessageSquareText,
    label: "Response",
    title: "Render the returned result.",
    copy: "The interaction closes only when the client presents the processed output.",
  },
];

const concepts = [
  {
    icon: MonitorSmartphone,
    title: "Client / server separation",
    copy: "Interface concerns and processing responsibilities live on opposite sides of a clear boundary.",
  },
  {
    icon: UserRound,
    title: "User input",
    copy: "A small value becomes the starting point for the complete interaction.",
  },
  {
    icon: Send,
    title: "Request / response lifecycle",
    copy: "The exercise makes the round trip visible from submission to returned text.",
  },
  {
    icon: GitBranch,
    title: "Conditional processing",
    copy: "A backend decision selects the response associated with the received number.",
  },
  {
    icon: MessageSquareText,
    title: "Rendering returned data",
    copy: "The client turns processed output back into something the user can see.",
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

function HeroSystem({ reduceMotion }) {
  return (
    <div className="relative mx-auto w-full max-w-[43rem]">
      <div
        className="pointer-events-none absolute inset-x-[12%] top-[18%] h-72 rounded-full bg-accent/[0.08] blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative grid gap-4 sm:grid-cols-[0.8fr_auto_1.2fr] sm:items-center">
        <motion.div
          whileHover={reduceMotion ? undefined : { y: -5, scale: 1.01 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mx-auto w-full max-w-[15rem] rounded-[2rem] border-[6px] border-[#2b2b31] bg-[#111116] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.42)] motion-reduce:!transform-none"
        >
          <div className="rounded-[1.4rem] border border-white/10 bg-[#18181d] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/35">
                Mobile input
              </p>
              <Smartphone className="h-4 w-4 text-accent" aria-hidden="true" />
            </div>
            <p className="mt-8 text-xs text-white/40">number</p>
            <p className="mt-2 border-b border-accent/70 pb-3 text-4xl font-semibold text-white">
              10
            </p>
            <div className="mt-8 flex h-10 items-center justify-center rounded-full bg-accent text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Send
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-center py-1 sm:flex-col sm:gap-2">
          <motion.span
            animate={
              reduceMotion
                ? undefined
                : { x: [0, 10, 0], opacity: [0.45, 1, 0.45] }
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_18px_rgba(0,255,153,0.8)] motion-reduce:!transform-none"
            aria-hidden="true"
          />
          <ArrowRight
            className="mx-3 h-5 w-5 rotate-90 text-accent/65 sm:mx-0 sm:rotate-0"
            aria-hidden="true"
          />
        </div>

        <motion.div
          whileHover={reduceMotion ? undefined : { y: -5, scale: 1.008 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#141419] shadow-[0_26px_75px_rgba(0,0,0,0.38)] motion-reduce:!transform-none"
        >
          <div className="flex h-10 items-center gap-2 border-b border-white/10 bg-[#232329] px-4">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-accent/65" />
            <span className="ml-2 text-[0.6rem] uppercase tracking-[0.18em] text-white/35">
              Conceptual backend
            </span>
          </div>
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">
                Python logic
              </p>
              <Braces className="h-5 w-5 text-accent/65" aria-hidden="true" />
            </div>
            <div className="mt-6 space-y-3 text-xs leading-6 sm:text-sm">
              <p>
                <span className="text-accent">if</span>{" "}
                <span className="text-white/70">number == 10:</span>
              </p>
              <p className="pl-5 text-white/45">select matching response</p>
            </div>
            <div className="mt-7 rounded-2xl border border-accent/25 bg-accent/[0.06] p-4">
              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-white/35">
                Returned text
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                You are Top.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="mt-5 text-center text-[0.65rem] uppercase tracking-[0.18em] text-white/30">
        Conceptual flow · not recovered source code
      </p>
    </div>
  );
}

function FlowArrow() {
  return (
    <ArrowRight
      className="mx-auto h-5 w-5 shrink-0 rotate-90 text-accent/65 lg:rotate-0"
      aria-hidden="true"
    />
  );
}

function FlowNode({ icon: Icon, number, label, detail }) {
  return (
    <div className="min-w-0 flex-1 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-accent">{number}</span>
        <Icon className="h-5 w-5 text-accent/70" aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-base font-semibold text-white">{label}</h3>
      <p className="mt-2 text-xs leading-5 text-white/45">{detail}</p>
    </div>
  );
}

function OriginalFlow() {
  return (
    <Reveal className="rounded-[2rem] border border-white/10 bg-[#18181d] p-5 sm:p-8 lg:p-10">
      <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        {flowSteps.map((step, index) => (
          <div
            key={step.number}
            className="contents"
          >
            <FlowNode {...step} />
            {index < flowSteps.length - 1 ? <FlowArrow /> : null}
          </div>
        ))}
      </div>
      <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-white/35">
        This diagram describes the confirmed learning concept. It does not
        assign an undocumented protocol, framework, payload format, or
        deployment model to the original project.
      </p>
    </Reveal>
  );
}

function IllustrativeLogic() {
  const codeRows = [
    ["if", "number == 0:", '"Try again in September."'],
    ["elif", "number == 10:", '"You are Top."'],
    ["elif", "number == 5:", '"Halfway there — keep going."'],
    ["else", ":", '"Number {n} reached the fallback path."'],
  ];

  return (
    <Reveal delay={0.08}>
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#141419] shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#232329] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-accent/65" />
          </div>
          <p className="text-[0.62rem] uppercase tracking-[0.18em] text-white/35">
            recreation_logic.py
          </p>
        </div>
        <div className="overflow-x-auto p-5 sm:p-7">
          <p className="mb-6 text-xs leading-6 text-white/35">
            Illustrative Python-style logic for the portfolio recreation. This
            is not the original source.
          </p>
          <pre
            aria-label="Illustrative Python-style conditional logic used by the local recreation"
            className="min-w-[29rem] text-xs leading-8 sm:text-sm"
          >
            <code>
              {codeRows.map(([keyword, condition, result], index) => (
                <span key={keyword + condition} className="block">
                  <span className="select-none pr-5 text-white/20">
                    {String(index * 2 + 1).padStart(2, "0")}
                  </span>
                  <span className="text-accent">{keyword}</span>
                  {keyword === "else" ? "" : " "}
                  <span className="text-white/70">{condition}</span>
                  <span className="block pl-[4.25rem] text-white/45">
                    response = {result}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </Reveal>
  );
}

function OriginalSnapshot({ reduceMotion }) {
  return (
    <Reveal delay={0.08}>
      <motion.figure
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.008 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto max-w-[22rem] motion-reduce:!transform-none"
      >
        <div className="rounded-[2.5rem] border-[7px] border-[#2b2b31] bg-[#101014] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
          <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-black">
            <Image
              src={SNAPSHOT_PATH}
              alt="Original mobile prototype showing the number 13, a Send button, and a response prompting the user to choose 0, 5, or 10"
              width={544}
              height={876}
              sizes="(max-width: 639px) 82vw, 340px"
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
        </div>
        <figcaption className="mt-5 text-center text-xs leading-6 text-white/35">
          Original 544 × 876 project artifact, presented at a constrained size
          without upscaling or UI reconstruction.
        </figcaption>
      </motion.figure>
    </Reveal>
  );
}

export default function NumberCheckerCaseStudy({
  previousProject,
  nextProject,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-x-clip bg-primary text-white">
      <section className="relative isolate pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-32">
        <div
          className="pointer-events-none absolute left-[67%] top-0 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px] sm:h-[46rem] sm:w-[46rem]"
          aria-hidden="true"
        />

        <div className="container mx-auto">
          <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm">
                Case study · Early client–server exercise
              </p>
              <h1 className="mt-6 text-[2.45rem] font-semibold leading-[1.04] text-white sm:text-6xl lg:text-[4.05rem] xl:text-[4.65rem]">
                Custom Python API{" "}
                <span className="block text-white/45">Number Checker</span>
              </h1>
              <p className="mt-6 text-base font-medium leading-7 text-accent sm:text-lg">
                Mobile Development / Client–Server Fundamentals
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                An early mobile development exercise built to understand how a
                frontend sends a value to a backend, waits for processing, and
                renders the returned response.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="w-full focus-visible:ring-accent focus-visible:ring-offset-primary sm:w-auto"
                >
                  <Link href="#interactive-recreation">
                    Try the Recreation
                    <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <ExternalButton
                  href={ORIGINAL_PROJECT_URL}
                  variant="outline"
                  icon={ExternalLink}
                >
                  View Original Project
                </ExternalButton>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <HeroSystem reduceMotion={reduceMotion} />
            </Reveal>
          </div>

          <Reveal delay={0.14} className="mt-12">
            <ul
              className="flex flex-wrap justify-center gap-2 lg:justify-start"
              aria-label="Verified technology"
            >
              <TechPill reduceMotion={reduceMotion}>Python</TechPill>
            </ul>
          </Reveal>
        </div>
      </section>

      <section
        id="project-context"
        className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32"
      >
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
            <SectionHeading
              eyebrow="Project context"
              title="A small exercise built around one important boundary."
              description="Around 2018, this professor-guided project used a simple number exchange to make frontend and backend responsibilities visible. Its value came from tracing the complete cycle, not from feature count or production complexity."
            />

            <Reveal delay={0.08}>
              <dl className="divide-y divide-white/10 rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 sm:px-8">
                {projectFacts.map(([term, description]) => (
                  <motion.div
                    key={term}
                    whileHover={
                      reduceMotion ? undefined : { scale: 1.01 }
                    }
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

          <div className="mt-14 grid gap-5 md:grid-cols-3 sm:mt-16">
            {evidenceGroups.map(
              ({ icon: Icon, eyebrow, title, copy }, index) => (
                <Reveal key={title} delay={index * 0.06}>
                  <HoverSurface
                    reduceMotion={reduceMotion}
                    className="h-full rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-6"
                  >
                    <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    <p className="mt-6 text-[0.65rem] uppercase tracking-[0.2em] text-white/35">
                      {eyebrow}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold leading-7 text-white">
                      {title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/50">
                      {copy}
                    </p>
                  </HoverSurface>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="The original idea"
            title="Follow one number across the full request–response cycle."
            description="The project reduced client–server communication to its clearest form: capture a value, move it across a system boundary, evaluate it, and return something the interface can render."
          />
          <div className="mt-14 sm:mt-16">
            <OriginalFlow />
          </div>
        </div>
      </section>

      <section
        id="interactive-recreation"
        className="scroll-mt-8 border-y border-white/10 bg-[#19191f] py-20 sm:scroll-mt-12 sm:py-24 lg:py-32"
      >
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Interactive recreation"
            title="Run the conditional locally and watch each stage respond."
            description="This modern portfolio interaction recreates the documented idea in the browser. It is deliberately transparent: no live Python service, remote endpoint, or recovered production system sits behind the button."
          />
          <div className="mt-14 sm:mt-16">
            <NumberCheckerRecreation />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Behind the request"
            title="Four responsibilities turn input into visible output."
            description="The recreated logic stays intentionally compact so the system boundary remains the focus. The Python-style panel documents today’s simulation, not source recovered from the original project."
          />

          <div className="mt-14 grid items-start gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 sm:mt-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {requestLayers.map(({ icon: Icon, label, title, copy }, index) => (
                <Reveal key={label} delay={index * 0.05}>
                  <HoverSurface
                    reduceMotion={reduceMotion}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5 sm:p-6"
                  >
                    <div className="flex gap-4">
                      <Icon
                        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/35">
                          {label}
                        </p>
                        <h3 className="mt-3 text-base font-semibold leading-6 text-white">
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

            <IllustrativeLogic />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto grid items-center gap-14 lg:grid-cols-[1fr_0.72fr] lg:gap-24">
          <div>
            <SectionHeading
              eyebrow="Original project snapshot"
              title="One preserved screen anchors the reconstruction in evidence."
              description="The low-resolution image is not restored, enlarged into a hero, or treated as proof of an undocumented stack. It remains useful because it captures the original number-entry interaction and fallback result."
            />

            <Reveal delay={0.06} className="mt-9">
              <div className="rounded-[1.6rem] border border-accent/25 bg-accent/[0.045] p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-accent">
                  Preserved response
                </p>
                <p className="mt-4 text-base leading-7 text-white/80">
                  “Lathos Dialekse Ksana apo to 0-5-10.”
                </p>
                <p className="mt-3 text-sm leading-7 text-white/45">
                  A transliterated Greek prompt meaning: wrong choice; choose
                  again from 0, 5, or 10. The brace-like presentation alone is
                  not enough to identify a payload format.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-8">
              <ExternalButton href={ORIGINAL_PROJECT_URL} icon={ExternalLink}>
                View Original Project
              </ExternalButton>
            </Reveal>
          </div>

          <OriginalSnapshot reduceMotion={reduceMotion} />
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Why this project matters"
            title="Its engineering value is the round trip, not the feature list."
            description="This was an early practical encounter with separating a mobile interface from backend processing. The project made a simple but durable idea concrete: input is captured in one place, processed in another, and only becomes useful when the result returns to the user."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 sm:mt-16">
            {concepts.map(({ icon: Icon, title, copy }, index) => (
              <Reveal key={title} delay={index * 0.05}>
                <HoverSurface
                  reduceMotion={reduceMotion}
                  className={cn(
                    "h-full rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-6",
                    index === concepts.length - 1 &&
                      "md:col-span-2 lg:col-span-1"
                  )}
                >
                  <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/50">
                    {copy}
                  </p>
                </HoverSurface>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <div className="flex flex-col gap-5 rounded-[2rem] border border-accent/25 bg-accent/[0.045] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  Engineering takeaway
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
                  A clear system boundary can teach more than a long feature
                  list when the goal is to understand where data goes and why
                  it comes back.
                </p>
              </div>
              <Workflow
                className="h-8 w-8 shrink-0 text-accent/65"
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
              Original project
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Compare the recreation with the preserved prototype artifact.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-primary/70 sm:text-base sm:leading-8">
              The original link remains the historical reference; the
              interactive section above is a transparent portfolio
              reconstruction.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-white hover:bg-[#2a2a31] focus-visible:ring-primary sm:w-auto"
              >
                <Link
                  href={ORIGINAL_PROJECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Original Project
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
                <Link href="#interactive-recreation">
                  <Code2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Try the Recreation Again
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
        showNextPlaceholder
      />
    </main>
  );
}
