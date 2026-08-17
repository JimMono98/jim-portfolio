"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Binary,
  BookOpenCheck,
  BrainCircuit,
  Braces,
  ChartNoAxesCombined,
  CheckCircle2,
  CircleDot,
  ExternalLink,
  FlaskConical,
  Gauge,
  GitCompareArrows,
  Grid3X3,
  Layers3,
  LineChart,
  SlidersHorizontal,
  Split,
  TriangleAlert,
  Workflow,
} from "lucide-react";

import CaseStudyNavigation from "@/components/case-studies/CaseStudyNavigation";
import {
  ExternalButton,
  Reveal,
  SectionHeading,
  TechPill,
} from "@/components/case-studies/CaseStudyPrimitives";
import MLPlayground from "@/components/case-studies/decision-tree-svm-models/MLPlayground";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REPORTS_URL =
  "https://ihuedu-my.sharepoint.com/:f:/g/personal/it185400_ihu365_gr/ElZdZPGmrOdEtCW02ExZT3MBbIYGTWmhiUQsWud8mpDIKg?e=DvJAer";
const ASSET_PATH = "/assets/projects/decision-tree-svm-models";

const technologies = ["Python", "NumPy", "Matplotlib", "scikit-learn"];

const projectFacts = [
  ["Course", "Artificial Intelligence"],
  ["Academic context", "2023–2024 · Semester 6"],
  ["Preserved evidence", "Two reports · April 2024"],
  ["Experiment scope", "Classification and regression"],
];

const workflowSteps = [
  {
    icon: CircleDot,
    number: "01",
    title: "Generate",
    copy: "Create a synthetic dataset for the selected learning task.",
  },
  {
    icon: ChartNoAxesCombined,
    number: "02",
    title: "Visualize",
    copy: "Inspect its shape before choosing or evaluating a model.",
  },
  {
    icon: Split,
    number: "03",
    title: "Split",
    copy: "Reserve 20% of the samples for held-out evaluation.",
  },
  {
    icon: BrainCircuit,
    number: "04",
    title: "Train",
    copy: "Fit Decision Tree and RBF-kernel SVM candidates.",
  },
  {
    icon: SlidersHorizontal,
    number: "05",
    title: "Compare",
    copy: "Explore the documented hyperparameter combinations.",
  },
  {
    icon: Gauge,
    number: "06",
    title: "Evaluate",
    copy: "Use task-appropriate held-out metrics to inspect behavior.",
  },
];

const implementationCards = [
  {
    icon: Binary,
    eyebrow: "Data generation",
    title: "NumPy defines both learning problems.",
    copy: "The classification appendix builds four two-dimensional Gaussian clusters. The regression appendix samples x in [0, 10] and adds Gaussian noise to x · cos(x).",
  },
  {
    icon: SlidersHorizontal,
    eyebrow: "Model search",
    title: "Explicit loops expose every setting.",
    copy: "Decision Tree depth and SVM C/gamma combinations are fitted and evaluated directly. The preserved implementation does not use cross-validation or GridSearchCV.",
  },
  {
    icon: BarChart3,
    eyebrow: "Evaluation",
    title: "Each task uses a metric that fits its output.",
    copy: "Classification uses held-out Accuracy and a confusion matrix. Regression compares candidates through held-out Mean Squared Error.",
  },
  {
    icon: Braces,
    eyebrow: "Preserved source",
    title: "The reports retain appendix code, not a repository.",
    copy: "The technical reading is grounded in code printed inside the two reports. No standalone source files or reproducible environment were recovered.",
  },
];

const reviewPoints = [
  {
    icon: CheckCircle2,
    title: "Model capacity becomes visible",
    copy: "Tree depth and RBF influence make the relationship between flexibility, bias, variance, and noisy observations tangible.",
  },
  {
    icon: GitCompareArrows,
    title: "Comparisons remain contextual",
    copy: "Metrics can rank the active candidates for one dataset and split; they cannot establish that one algorithm is universally superior.",
  },
  {
    icon: TriangleAlert,
    title: "Reproducibility has a boundary",
    copy: "The original synthetic generation was not seeded. Regression fixed only the later train/test split, while classification fixed neither stage.",
  },
  {
    icon: FlaskConical,
    title: "Educational scope stays explicit",
    copy: "No scaling, cross-validation, persisted model, API, database, deployment, or production inference path appears in the recovered work.",
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

function ReportFigure({
  file,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className = "",
  imageClassName = "",
}) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#101014]">
        <Image
          src={`${ASSET_PATH}/${file}.webp`}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          quality={90}
          className={cn("h-auto w-full", imageClassName)}
        />
      </div>
      <figcaption className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-white/30">
        Original report figure · April 2024
      </figcaption>
    </figure>
  );
}

function HeroEvidence({ reduceMotion }) {
  return (
    <div className="relative mx-auto w-full max-w-[43rem] pb-8 sm:pb-14">
      <div
        className="pointer-events-none absolute inset-x-[8%] top-[8%] h-[27rem] rounded-full bg-accent/[0.08] blur-[110px]"
        aria-hidden="true"
      />

      <motion.div
        whileHover={reduceMotion ? undefined : { y: -6, scale: 1.008 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative rounded-[2rem] border border-white/10 bg-[#141419] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.42)] motion-reduce:!transform-none sm:p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-4 px-2 pt-1">
          <div className="flex gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-accent/70" />
          </div>
          <p className="text-[0.58rem] uppercase tracking-[0.18em] text-white/35">
            Classification · original report
          </p>
        </div>
        <ReportFigure
          file="classification-dataset"
          alt="Original report scatter plot showing four two-dimensional clusters arranged as a two-class classification dataset"
          width={800}
          height={600}
          sizes="(max-width: 1023px) 92vw, 620px"
          priority
        />
      </motion.div>

      <motion.div
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative ml-auto mt-5 w-[82%] rounded-[1.7rem] border border-white/10 bg-[#19191f] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.38)] motion-reduce:!transform-none sm:-mt-12 sm:mr-5 sm:w-[54%]"
      >
        <p className="mb-3 px-1 text-[0.58rem] uppercase tracking-[0.18em] text-accent">
          Regression · original report
        </p>
        <ReportFigure
          file="regression-dataset"
          alt="Original report scatter plot of noisy samples generated around the x times cosine x regression function"
          width={1002}
          height={600}
          sizes="(max-width: 639px) 72vw, 330px"
        />
      </motion.div>
    </div>
  );
}

function DataLandscape({
  number,
  label,
  title,
  copy,
  facts,
  icon: Icon,
  reduceMotion,
}) {
  return (
    <HoverSurface
      reduceMotion={reduceMotion}
      className="h-full rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-5">
        <span className="text-sm font-semibold text-accent">{number}</span>
        <Icon className="h-6 w-6 text-accent/70" aria-hidden="true" />
      </div>
      <p className="mt-8 text-xs uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>
      <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
        {title}
      </h3>
      <p className="mt-5 text-sm leading-7 text-white/55">{copy}</p>
      <dl className="mt-7 divide-y divide-white/10 border-y border-white/10">
        {facts.map(([term, description]) => (
          <div key={term} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="text-xs uppercase tracking-[0.14em] text-white/30">
              {term}
            </dt>
            <dd className="text-sm leading-6 text-white/75">{description}</dd>
          </div>
        ))}
      </dl>
    </HoverSurface>
  );
}

function WorkflowStep({ icon: Icon, number, title, copy }) {
  return (
    <div className="min-w-0 flex-1 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-accent">{number}</span>
        <Icon className="h-5 w-5 text-accent/70" aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-white/45">{copy}</p>
    </div>
  );
}

function ExperimentalWorkflow() {
  return (
    <Reveal className="rounded-[2rem] border border-white/10 bg-[#18181d] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {workflowSteps.map((step) => (
          <div key={step.number} className="contents">
            <WorkflowStep {...step} />
          </div>
        ))}
      </div>
      <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-white/35">
        Both reports follow this experiment loop. It is a modelling workflow,
        not evidence of an application service, deployed API, or production ML
        system.
      </p>
    </Reveal>
  );
}

function ParameterRow({ label, values }) {
  return (
    <div className="grid gap-3 border-t border-white/10 py-4 sm:grid-cols-[8rem_1fr] sm:items-center">
      <dt className="text-xs uppercase tracking-[0.15em] text-white/35">
        {label}
      </dt>
      <dd className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-white/70"
          >
            {value}
          </span>
        ))}
      </dd>
    </div>
  );
}

function ParameterCard({ eyebrow, title, description, rows, children }) {
  return (
    <div className="h-full rounded-[2rem] border border-white/10 bg-[#18181d] p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-white/50">{description}</p>
      <dl className="mt-7">
        {rows.map((row) => (
          <ParameterRow key={row.label} {...row} />
        ))}
      </dl>
      {children}
    </div>
  );
}

function CodeEvidence({ label, lines }) {
  return (
    <Reveal>
      <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#111116]">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#232329] px-5 py-4">
          <div className="flex gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-accent/65" />
          </div>
          <p className="text-[0.62rem] uppercase tracking-[0.18em] text-white/35">
            {label}
          </p>
        </div>
        <pre className="overflow-x-auto p-5 text-xs leading-7 text-white/65 sm:p-6 sm:text-sm">
          <code>{lines.join("\n")}</code>
        </pre>
        <p className="border-t border-white/10 px-5 py-4 text-[0.65rem] uppercase tracking-[0.15em] text-white/30 sm:px-6">
          Verified appendix excerpt · original report
        </p>
      </div>
    </Reveal>
  );
}

export default function DecisionTreeSvmCaseStudy({
  previousProject,
  nextProject,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-x-clip bg-primary text-white">
      <section className="relative isolate pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-32">
        <div
          className="pointer-events-none absolute left-[62%] top-[-12rem] -z-10 h-[48rem] w-[48rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[125px] sm:h-[58rem] sm:w-[58rem]"
          aria-hidden="true"
        />

        <div className="container mx-auto">
          <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 xl:gap-20">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm">
                Case study · Artificial Intelligence coursework
              </p>
              <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.03] text-white sm:text-6xl lg:text-[4rem] xl:text-[4.7rem]">
                Decision Tree &amp; SVM{" "}
                <span className="block text-white/45">Models</span>
              </h1>
              <p className="mt-6 text-base font-medium leading-7 text-accent sm:text-lg">
                Classification / Regression · Comparison &amp; Hyperparameter
                Exploration
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                Two supervised-learning experiments examine how Decision Trees
                and RBF-kernel SVM models respond to different capacity and
                regularization settings across classification and regression.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="w-full focus-visible:ring-accent focus-visible:ring-offset-primary sm:w-auto"
                >
                  <Link href="#ml-playground">
                    Explore the Experiments
                    <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <ExternalButton
                  href={REPORTS_URL}
                  variant="outline"
                  icon={ExternalLink}
                >
                  View Original Reports
                </ExternalButton>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <HeroEvidence reduceMotion={reduceMotion} />
            </Reveal>
          </div>

          <Reveal delay={0.14} className="mt-10">
            <ul
              className="flex flex-wrap justify-center gap-2 lg:justify-start"
              aria-label="Verified technologies"
            >
              {technologies.map((technology) => (
                <TechPill key={technology} reduceMotion={reduceMotion}>
                  {technology}
                </TechPill>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
            <SectionHeading
              eyebrow="Project context"
              title="Two reports preserve one comparative learning exercise."
              description="Created for a sixth-semester Artificial Intelligence course, the April 2024 work applies the same experimental idea to two tasks: classify a synthetic two-dimensional pattern, then approximate a noisy nonlinear function."
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
            <div className="rounded-[1.7rem] border border-accent/25 bg-accent/[0.045] p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">
                    Evidence boundary
                  </p>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:text-base">
                    The preserved reports provide figures, explanations, and
                    Python appendices. They do not provide standalone source
                    files, dependency versions, saved models, or a reproducible
                    copy of the unseeded 2024 datasets.
                  </p>
                </div>
                <BookOpenCheck
                  className="h-7 w-7 shrink-0 text-accent/70"
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
            eyebrow="Two data landscapes"
            title="One discrete boundary problem and one noisy continuous curve."
            description="Both datasets are synthetic, but they expose different model behavior. Classification asks which class occupies a point in two-dimensional space; regression asks what continuous value follows from x."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-2 sm:mt-16">
            <Reveal>
              <DataLandscape
                number="01"
                label="Classification"
                title="Four Gaussian clusters form an XOR-like pattern."
                copy="The appendix generates four clusters of 200 samples around [2,2], [-2,-2], [2,-2], and [-2,2], producing 800 two-dimensional observations across two classes."
                facts={[
                  ["Samples", "800 · 200 per cluster"],
                  ["Features", "Two continuous dimensions"],
                  ["Split", "80% train · 20% held out"],
                  ["Metric", "Accuracy + confusion matrix"],
                ]}
                icon={Grid3X3}
                reduceMotion={reduceMotion}
              />
            </Reveal>

            <Reveal delay={0.07}>
              <DataLandscape
                number="02"
                label="Regression"
                title="A nonlinear function is observed through Gaussian noise."
                copy="The appendix samples 100 x values uniformly from [0,10], evaluates y = x · cos(x), and adds Gaussian noise with a scale of 1 before fitting each regressor."
                facts={[
                  ["Samples", "100 noisy observations"],
                  ["Function", "y = x · cos(x)"],
                  ["Split", "80% train · 20% held out"],
                  ["Metric", "Mean Squared Error"],
                ]}
                icon={LineChart}
                reduceMotion={reduceMotion}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Experimental workflow"
            title="The same six-stage loop connects both reports."
            description="Keeping the workflow consistent makes the meaningful differences easier to inspect: model capacity, hyperparameter sensitivity, output shape, and evaluation metric."
          />
          <div className="mt-14 sm:mt-16">
            <ExperimentalWorkflow />
          </div>
        </div>
      </section>

      <section
        id="ml-playground"
        className="scroll-mt-8 py-20 sm:scroll-mt-12 sm:py-24 lg:py-32"
      >
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Interactive ML playground"
            title="Change the settings, probe the models, and evaluate the result."
            description="This deterministic portfolio reconstruction turns the documented experiment into a genuine interactive comparison. Predictions and metrics come from reconstructed fitted models, while the original report evidence remains separate below."
          />
          <div className="mt-14 sm:mt-16">
            <MLPlayground />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Model comparison"
            title="Hyperparameters reshape capacity in different ways."
            description="Tree depth controls how many recursive partitions a tree can create. In the RBF models, C changes the regularization trade-off while gamma changes how localized each training sample’s influence becomes."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-2 sm:mt-16">
            <Reveal>
              <ParameterCard
                eyebrow="Classification search"
                title="Decision Tree Classifier vs RBF SVC"
                description="The report evaluates all listed settings, then directly compares Tree depth 5 with SVC C=1 and gamma=1 through Accuracy and confusion matrices."
                rows={[
                  { label: "Tree depth", values: ["3", "5", "10"] },
                  { label: "SVC C", values: ["0.1", "1", "10"] },
                  { label: "SVC gamma", values: ["10", "1", "0.1"] },
                ]}
              >
                <div className="mt-6">
                  <ReportFigure
                    file="classification-hyperparameters"
                    alt="Original classification report figure comparing representative Decision Tree depth and SVM C and gamma settings"
                    width={602}
                    height={350}
                    sizes="(max-width: 1023px) 88vw, 520px"
                  />
                </div>
              </ParameterCard>
            </Reveal>

            <Reveal delay={0.07}>
              <ParameterCard
                eyebrow="Regression search"
                title="Decision Tree Regressor vs RBF SVR"
                description="The appendix searches the full depth and C/gamma grids below. It separately visualizes representative Tree depths 3, 5, and 9 and three SVR configurations."
                rows={[
                  {
                    label: "Tree depth",
                    values: ["None", "3", "5", "7", "9"],
                  },
                  { label: "SVR C", values: ["0.1", "1", "10"] },
                  { label: "SVR gamma", values: ["scale", "auto"] },
                ]}
              >
                <div className="mt-6">
                  <ReportFigure
                    file="regression-fit-comparison"
                    alt="Original regression report figure showing representative fitted outputs for Decision Tree and SVM regression settings"
                    width={1502}
                    height={1000}
                    sizes="(max-width: 1023px) 88vw, 520px"
                  />
                </div>
              </ParameterCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Evaluation & recorded outcome"
            title="The metric changes with the question the model answers."
            description="Accuracy and a confusion matrix describe discrete class assignments. Mean Squared Error summarizes continuous prediction error. Neither metric turns one experiment into a universal algorithm ranking."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] sm:mt-16">
            <Reveal>
              <div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  Evaluation tools
                </p>
                <div className="mt-7 space-y-6">
                  <div className="border-l border-accent/50 pl-5">
                    <h3 className="text-lg font-semibold text-white">
                      Classification
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/50">
                      Accuracy reports the share of correct held-out labels. A
                      2 × 2 confusion matrix separates correct and incorrect
                      outcomes by class.
                    </p>
                  </div>
                  <div className="border-l border-accent/50 pl-5">
                    <h3 className="text-lg font-semibold text-white">
                      Regression
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/50">
                      Mean Squared Error averages squared residuals, increasing
                      the influence of predictions that land farther from the
                      held-out target.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.07}>
              <div className="h-full rounded-[2rem] border border-accent/30 bg-accent/[0.055] p-6 sm:p-8 lg:p-10">
                <BookOpenCheck
                  className="h-7 w-7 text-accent"
                  aria-hidden="true"
                />
                <p className="mt-7 text-xs uppercase tracking-[0.2em] text-accent">
                  Recorded coursework conclusion
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  The reports favored SVM for their documented runs.
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  That is the conclusion recorded in the classification and
                  regression reports for those datasets and outcomes. It is not
                  a universal claim, an independently reproduced original
                  score, or a promise that the reconstruction above will rank
                  every active SVM setting first.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#19191f] py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Technical implementation"
            title="The appendices make the experiment readable from data to metric."
            description="The source evidence is compact and direct: NumPy generates the observations, scikit-learn provides the model and evaluation primitives, and Matplotlib renders the documented figures."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 sm:mt-16">
            {implementationCards.map(
              ({ icon: Icon, eyebrow, title, copy }, index) => (
                <Reveal key={title} delay={index * 0.05}>
                  <HoverSurface
                    reduceMotion={reduceMotion}
                    className="h-full rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-6"
                  >
                    <div className="flex items-center justify-between gap-5">
                      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/35">
                        {eyebrow}
                      </p>
                      <Icon
                        className="h-5 w-5 text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold leading-7 text-white">
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

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <CodeEvidence
              label="classification appendix"
              lines={[
                "num_samples = 200",
                "blue_data = np.random.normal(",
                "    loc=[2, 2], scale=[1, 1], size=(num_samples, 2)",
                ")",
                "svm_model = SVC(C=1, gamma=1, kernel='rbf')",
              ]}
            />
            <CodeEvidence
              label="regression appendix"
              lines={[
                "a = 0",
                "f = lambda x: x * np.cos(x + a)",
                "x = np.random.uniform(0, 10, 100)",
                "y = f(x) + np.random.normal(scale=1, size=100)",
                "model = SVR(C=C, gamma=gamma)",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Engineering review"
            title="Useful model intuition, with the experiment’s limits left visible."
            description="The strongest lesson is not a fixed winner. It is learning how data shape, capacity, hyperparameters, and evaluation choices interact—and what evidence is still needed before a result can be reproduced or generalized."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 sm:mt-16">
            {reviewPoints.map(({ icon: Icon, title, copy }, index) => (
              <Reveal key={title} delay={index * 0.05}>
                <HoverSurface
                  reduceMotion={reduceMotion}
                  className="h-full rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-6 sm:p-7"
                >
                  <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/50">
                    {copy}
                  </p>
                </HoverSurface>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="flex flex-col gap-5 rounded-[2rem] border border-accent/25 bg-accent/[0.045] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  Reconstruction boundary
                </p>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-white/65 sm:text-base">
                  The interactive playground fixes the random generation so
                  its behavior can be tested and revisited. It reconstructs the
                  documented method; it does not reproduce the exact unseeded
                  samples or scores from April 2024.
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
              Original reports
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Read the preserved classification and regression coursework.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-primary/70 sm:text-base sm:leading-8">
              The SharePoint folder remains the canonical historical artifact.
              The interactive models above are a clearly labelled,
              deterministic portfolio reconstruction.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-white hover:bg-[#2a2a31] focus-visible:ring-primary sm:w-auto"
              >
                <Link
                  href={REPORTS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Original Reports
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
                <Link href="#ml-playground">
                  <BrainCircuit className="mr-2 h-4 w-4" aria-hidden="true" />
                  Return to the Playground
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
