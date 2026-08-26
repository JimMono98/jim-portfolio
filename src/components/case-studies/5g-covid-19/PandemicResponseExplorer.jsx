"use client";

import { useEffect, useId, useMemo, useReducer, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  CircleAlert,
  CircleDotDashed,
  Cloud,
  Cpu,
  GraduationCap,
  HeartPulse,
  Network,
  RadioTower,
  RefreshCcw,
  Route,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  Unplug,
  Users,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import {
  CAPABILITY_GROUPS,
  DEPENDENCY_OPTIONS,
  PANDEMIC_SCENARIOS,
  createInitialPandemicResponseState,
  derivePandemicResponse,
  pandemicResponseReducer,
} from "./pandemicResponseModel.mjs";

const CLASSIFICATION_STYLES = {
  direct: {
    label: "Direct",
    border: "border-cyan-300/30",
    background: "bg-cyan-300/[0.075]",
    text: "text-cyan-100",
    dot: "bg-cyan-300",
  },
  conditional: {
    label: "Conditional",
    border: "border-amber-300/30",
    background: "bg-amber-300/[0.065]",
    text: "text-amber-100",
    dot: "bg-amber-300",
  },
  "paper-wide": {
    label: "Paper-wide",
    border: "border-accent/25",
    background: "bg-accent/[0.055]",
    text: "text-accent",
    dot: "bg-accent",
  },
  "not-central": {
    label: "Not central",
    border: "border-white/10",
    background: "bg-white/[0.02]",
    text: "text-white/40",
    dot: "bg-white/25",
  },
};

const DEPENDENCY_META = [
  {
    key: "endpoint",
    label: "Endpoint / sensing",
    hint: "Can the scenario create or receive the required data?",
  },
  {
    key: "transport",
    label: "Transport",
    hint: "Which connectivity path is available?",
  },
  {
    key: "processing",
    label: "Processing",
    hint: "Where can application processing take place?",
  },
  {
    key: "serviceReady",
    label: "Downstream workflow",
    hint: "Can the receiving service act on the information?",
  },
  {
    key: "governanceReady",
    label: "Governance / consent",
    hint: "Are responsible-use conditions represented as ready?",
  },
];

const ROUTE_ICONS = [
  Smartphone,
  Activity,
  RadioTower,
  Cpu,
  Building2,
  Users,
];

function readable(value, fallback = "Not specified") {
  if (Array.isArray(value)) {
    return value.join(" · ");
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return fallback;
}

function scenarioLabel(scenario) {
  return (
    scenario.shortTitle ??
    scenario.shortLabel ??
    scenario.label ??
    scenario.title ??
    scenario.name
  );
}

function scenarioDescription(scenario) {
  return scenario.summary ?? scenario.description ?? scenario.context ?? "";
}

function stageLabel(stage) {
  return stage.label ?? stage.actor ?? stage.title ?? stage.id;
}

function stageRole(stage) {
  return stage.technologyRole ?? stage.role ?? stage.detail ?? stage.description;
}

function evidenceLabel(value) {
  const raw =
    typeof value === "string"
      ? value
      : value?.label ?? value?.type ?? "Portfolio reconstruction";
  const normalized = raw.toLowerCase();

  if (normalized.includes("standard") || normalized.includes("current")) {
    return "Current standards fact";
  }

  if (
    normalized.includes("paper") ||
    normalized.includes("coursework") ||
    normalized.includes("original")
  ) {
    return "Original paper evidence";
  }

  return "Portfolio reconstruction";
}

function EvidenceBadge({ evidence }) {
  const label = evidenceLabel(evidence);
  const styles =
    label === "Original paper evidence"
      ? "border-accent/25 bg-accent/[0.05] text-accent"
      : label === "Current standards fact"
        ? "border-cyan-300/25 bg-cyan-300/[0.055] text-cyan-100"
        : "border-amber-300/25 bg-amber-300/[0.055] text-amber-100";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.13em]",
        styles,
      )}
    >
      {label}
    </span>
  );
}

function normalizeClassification(value) {
  return String(value ?? "not-central")
    .toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-");
}

function ClassificationBadge({ classification }) {
  const normalized = normalizeClassification(classification);
  const styles =
    CLASSIFICATION_STYLES[normalized] ?? CLASSIFICATION_STYLES["not-central"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.13em]",
        styles.border,
        styles.background,
        styles.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} aria-hidden="true" />
      {styles.label}
    </span>
  );
}

function scenarioIcon(id) {
  if (id.includes("patient") || id.includes("hospital")) return HeartPulse;
  if (id.includes("education")) return GraduationCap;
  if (id.includes("automation") || id.includes("logistics")) return Bot;
  if (id.includes("contact") || id.includes("public")) return Network;
  return Activity;
}

function ScenarioSelector({ activeId, onSelect }) {
  return (
    <div>
      <p
        id="pandemic-scenario-label"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40"
      >
        Choose a documented domain
      </p>
      <div
        role="group"
        aria-labelledby="pandemic-scenario-label"
        className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5"
      >
        {PANDEMIC_SCENARIOS.map((scenario, index) => {
          const selected = activeId === scenario.id;
          const Icon = scenarioIcon(scenario.id);

          return (
            <button
              key={scenario.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(scenario)}
              className={cn(
                "group flex min-h-14 min-w-0 items-center gap-3 rounded-[1.05rem] border px-4 py-3 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f] motion-reduce:transition-none",
                selected
                  ? "border-cyan-300/40 bg-cyan-300/[0.1] text-white"
                  : "border-white/10 bg-white/[0.025] text-white/55 hover:border-cyan-300/30 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                  selected
                    ? "border-cyan-300/30 bg-cyan-300/[0.12] text-cyan-100"
                    : "border-white/10 bg-black/15 text-white/35 group-hover:text-cyan-100",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.58rem] uppercase tracking-[0.13em] text-white/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block text-xs font-semibold leading-5">
                  {scenarioLabel(scenario)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DesktopRouteGraph({ route, state, dependencyPath, onSelectStep, reduceMotion }) {
  const reachableIds = new Set(dependencyPath.reachableStepIds ?? []);
  const count = route.length;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 12 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-7 left-6 top-7 w-3"
        aria-hidden="true"
      >
        {route.slice(0, -1).map((stage, index) => {
          const y1 = (index * 100) / (count - 1);
          const y2 = ((index + 1) * 100) / (count - 1);
          const connected =
            reachableIds.has(stage.id) && reachableIds.has(route[index + 1].id);

          return (
            <motion.path
              key={`${stage.id}-${route[index + 1].id}`}
              d={`M 6 ${y1} L 6 ${y2}`}
              fill="none"
              stroke={connected ? "rgba(103,232,249,0.58)" : "rgba(255,255,255,0.1)"}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              strokeDasharray={connected ? "0" : "8 8"}
              initial={false}
              animate={reduceMotion ? undefined : { opacity: connected ? 1 : 0.55 }}
              transition={{ duration: 0.35 }}
            />
          );
        })}
      </svg>

      <ol className="relative space-y-2">
        {route.map((stage, index) => {
          const active = state.activeStepIndex === index;
          const reachable = reachableIds.has(stage.id);
          const Icon = ROUTE_ICONS[index] ?? CircleDotDashed;

          return (
            <li key={stage.id} className="min-w-0">
              <button
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => onSelectStep(index, stage)}
                className={cn(
                  "group grid min-h-16 w-full min-w-0 grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 rounded-[1.05rem] border bg-[#111116] px-3 py-2.5 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f] motion-reduce:transition-none",
                  active
                    ? "border-cyan-300/45 bg-cyan-300/[0.08]"
                    : reachable
                      ? "border-white/15 hover:border-cyan-300/30"
                      : "border-dashed border-amber-300/20 opacity-70 hover:opacity-100",
                )}
              >
                <motion.span
                  key={`${stage.id}-${active}`}
                  initial={reduceMotion || !active ? false : { scale: 0.88, opacity: 0.65 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border",
                    active
                      ? "border-cyan-200/60 bg-cyan-300 text-primary shadow-[0_0_28px_rgba(103,232,249,0.28)]"
                      : reachable
                        ? "border-cyan-300/30 bg-[#19191f] text-cyan-100"
                        : "border-amber-300/25 bg-[#19191f] text-amber-100/70",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </motion.span>
                <span className="min-w-0">
                  <span className="block text-[0.52rem] uppercase tracking-[0.13em] text-white/30">
                    Stage {index + 1}
                  </span>
                  <span className="mt-1 block text-[0.7rem] font-semibold leading-5 text-white/70">
                    {stageLabel(stage)}
                  </span>
                </span>
                <span
                  className={cn(
                    "text-[0.52rem] uppercase tracking-[0.1em]",
                    reachable ? "text-cyan-100/60" : "text-amber-100/60",
                  )}
                >
                  {reachable ? "Open" : "Stopped"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function MobileRouteGraph({ route, state, dependencyPath, onSelectStep, reduceMotion }) {
  const reachableIds = new Set(dependencyPath.reachableStepIds ?? []);

  return (
    <ol className="space-y-2 lg:hidden">
      {route.map((stage, index) => {
        const active = state.activeStepIndex === index;
        const reachable = reachableIds.has(stage.id);
        const Icon = ROUTE_ICONS[index] ?? CircleDotDashed;

        return (
          <li key={stage.id} className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3">
            <div className="flex flex-col items-center" aria-hidden="true">
              <motion.span
                key={`${stage.id}-${active}`}
                initial={reduceMotion || !active ? false : { scale: 0.88 }}
                animate={{ scale: 1 }}
                className={cn(
                  "z-10 flex h-11 w-11 items-center justify-center rounded-full border bg-[#19191f]",
                  active
                    ? "border-cyan-200/60 bg-cyan-300 text-primary"
                    : reachable
                      ? "border-cyan-300/30 text-cyan-100"
                      : "border-amber-300/25 text-amber-100/70",
                )}
              >
                <Icon className="h-4 w-4" />
              </motion.span>
              {index < route.length - 1 ? (
                <span
                  className={cn(
                    "my-1 h-full min-h-5 w-px",
                    reachableIds.has(route[index + 1].id)
                      ? "bg-cyan-300/35"
                      : "border-l border-dashed border-white/15",
                  )}
                />
              ) : null}
            </div>
            <button
              type="button"
              aria-current={active ? "step" : undefined}
              onClick={() => onSelectStep(index, stage)}
              className={cn(
                "mb-2 flex min-h-16 min-w-0 items-center justify-between gap-3 rounded-[1rem] border px-4 py-3 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f] motion-reduce:transition-none",
                active
                  ? "border-cyan-300/40 bg-cyan-300/[0.08]"
                  : reachable
                    ? "border-white/10 bg-white/[0.02]"
                    : "border-dashed border-amber-300/20 bg-amber-300/[0.025]",
              )}
            >
              <span className="min-w-0">
                <span className="text-[0.55rem] uppercase tracking-[0.13em] text-white/30">
                  Stage {index + 1}
                </span>
                <span className="mt-1 block text-xs font-semibold leading-5 text-white/70">
                  {stageLabel(stage)}
                </span>
              </span>
              <span
                className={cn(
                  "shrink-0 text-[0.55rem] uppercase tracking-[0.1em]",
                  reachable ? "text-cyan-100/60" : "text-amber-100/60",
                )}
              >
                {reachable ? "Reachable" : "Stopped"}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function CurrentStagePanel({ stage, index, count, onPrevious, onNext }) {
  const details = [
    ["Data", stage.data ?? stage.dataType],
    ["Role in the route", stageRole(stage)],
    ["Technology layer", stage.technology],
    ["Limitation", stage.limitation],
  ].filter(([, value]) => value);

  return (
    <article className="mt-6 rounded-[1.55rem] border border-cyan-300/20 bg-cyan-300/[0.035] p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/75">
              Follow the data · {index + 1}/{count}
            </p>
            <EvidenceBadge
              evidence={stage.evidenceLabel ?? stage.evidence ?? stage.source}
            />
          </div>
          <h4 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
            {stageLabel(stage)}
          </h4>
          {stage.summary ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
              {stage.summary}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={onPrevious}
            disabled={index === 0}
            aria-label="Previous data stage"
            className="h-11 w-11 focus-visible:ring-accent focus-visible:ring-offset-[#19191f]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={onNext}
            disabled={index === count - 1}
            aria-label="Next data stage"
            className="h-11 w-11 focus-visible:ring-accent focus-visible:ring-offset-[#19191f]"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-black/15 p-4">
            <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-white/30">
              {label}
            </dt>
            <dd className="mt-2 text-xs leading-6 text-white/60">
              {readable(value)}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function FollowControls({ index, count, onPrevious, onNext }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-4 rounded-[1.05rem] border border-white/10 bg-black/15 p-3">
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/40">
        Follow the data · {index + 1}/{count}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onPrevious}
          disabled={index === 0}
          aria-label="Previous data stage"
          className="h-11 w-11 focus-visible:ring-accent focus-visible:ring-offset-[#19191f]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onNext}
          disabled={index === count - 1}
          aria-label="Next data stage"
          className="h-11 w-11 focus-visible:ring-accent focus-visible:ring-offset-[#19191f]"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

function StageChapter({ stage, index, active, onInspect, setRef }) {
  const reachable = stage.status === "reachable";
  const unavailable = stage.status === "unavailable";
  const statusLabel = reachable
    ? "Reachable in current model"
    : unavailable
      ? "First unavailable stage"
      : "Not reached after an earlier stop";

  return (
    <li
      ref={setRef}
      data-step-index={index}
      className="flex min-h-[58vh] scroll-mt-32 items-center py-8"
    >
      <article
        aria-current={active ? "step" : undefined}
        className={cn(
          "w-full rounded-[1.6rem] border p-6 transition-colors motion-reduce:transition-none xl:p-7",
          active
            ? "border-cyan-300/40 bg-cyan-300/[0.065] shadow-[0_22px_70px_rgba(0,0,0,0.22)]"
            : "border-white/10 bg-white/[0.02]",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
            Data chapter {String(index + 1).padStart(2, "0")}
          </p>
          <EvidenceBadge evidence={stage.evidenceLabel} />
        </div>

        <h4 className="mt-4 text-2xl font-semibold text-white xl:text-3xl">
          {stageLabel(stage)}
        </h4>
        <p className="mt-4 text-sm leading-7 text-white/55">{stage.role}</p>

        <dl className="mt-6 space-y-3">
          {[
            ["Data", stage.data],
            ["Technology layer", stage.technology],
            ["Current boundary", statusLabel],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid gap-1 rounded-xl border border-white/10 bg-black/15 p-4 xl:grid-cols-[9rem_minmax(0,1fr)] xl:gap-4"
            >
              <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/30">
                {label}
              </dt>
              <dd
                className={cn(
                  "text-xs leading-6",
                  label === "Current boundary"
                    ? reachable
                      ? "text-cyan-100/70"
                      : "text-amber-100/70"
                    : "text-white/55",
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <Button
          type="button"
          variant="outline"
          onClick={() => onInspect(index, stage)}
          className="mt-6 min-h-11 focus-visible:ring-accent focus-visible:ring-offset-[#19191f]"
        >
          <CircleDotDashed className="mr-2 h-4 w-4" aria-hidden="true" />
          Inspect this stage
        </Button>
      </article>
    </li>
  );
}

function DesktopScrollytelling({
  route,
  state,
  dependencyPath,
  onSelectStep,
  onPrevious,
  onNext,
  reduceMotion,
  setChapterRef,
}) {
  return (
    <div className="mt-7 hidden items-start gap-8 lg:grid lg:grid-cols-[minmax(18rem,0.82fr)_minmax(22rem,1.18fr)] xl:gap-12">
      <aside className="sticky top-24 self-start rounded-[1.6rem] border border-white/10 bg-[#111116] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/30">
          Live network route
        </p>
        <p className="mt-2 text-xs leading-5 text-white/40">
          Scroll the chapters or use any stage control. The topology remains
          available without taking over page scrolling.
        </p>
        <div className="mt-5">
          <DesktopRouteGraph
            route={route}
            state={state}
            dependencyPath={dependencyPath}
            onSelectStep={onSelectStep}
            reduceMotion={reduceMotion}
          />
        </div>
        <FollowControls
          index={state.activeStepIndex}
          count={route.length}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </aside>

      <ol aria-label="Data-route chapters" className="min-w-0">
        {route.map((stage, index) => (
          <StageChapter
            key={stage.id}
            stage={stage}
            index={index}
            active={state.activeStepIndex === index}
            onInspect={onSelectStep}
            setRef={(node) => setChapterRef(index, node)}
          />
        ))}
      </ol>
    </div>
  );
}

function CapabilityMatcher({ matches }) {
  const groups = Array.isArray(CAPABILITY_GROUPS)
    ? CAPABILITY_GROUPS
    : Object.entries(CAPABILITY_GROUPS).map(([id, value]) => ({
        id,
        ...(typeof value === "string" ? { label: value } : value),
      }));

  return (
    <section aria-labelledby="capability-matcher-heading" className="mt-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/65">
          Capability matcher
        </p>
        <h3 id="capability-matcher-heading" className="mt-3 text-2xl font-semibold text-white">
          Separate traffic profiles from architectural enablers.
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/50">
          These classifications describe the selected literature scenario. They
          are not performance measurements, application requirements, or a
          guarantee that a named capability is active.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {groups.map((group) => {
          const groupMatches = matches.filter((item) => item.groupId === group.id);
          return (
            <article
              key={group.id}
              className="rounded-[1.55rem] border border-white/10 bg-black/15 p-5 sm:p-6"
            >
              <div className="flex items-start gap-3">
                {group.id.includes("traffic") ? (
                  <RadioTower className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100/75" aria-hidden="true" />
                ) : (
                  <Workflow className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                )}
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.15em] text-white/30">
                    {group.eyebrow ?? (group.id.includes("traffic") ? "Usage profiles" : "System concepts")}
                  </p>
                  <h4 className="mt-2 font-semibold text-white">
                    {group.label ?? group.title}
                  </h4>
                  {group.description ? (
                    <p className="mt-2 text-xs leading-6 text-white/40">
                      {group.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {groupMatches.map((match) => (
                  <li
                    key={match.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white/75">{match.label}</p>
                        {match.name ? (
                          <p className="mt-1 text-[0.6rem] text-white/30">{match.name}</p>
                        ) : null}
                      </div>
                      <ClassificationBadge classification={match.classification} />
                    </div>
                    <p className="mt-3 text-xs leading-6 text-white/45">{match.note}</p>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function normalizeOption(option) {
  return typeof option === "object"
    ? option
    : { value: option, label: String(option) };
}

function DependencyChoice({ meta, value, options, onChange }) {
  const id = useId();

  return (
    <fieldset className="min-w-0 rounded-[1.3rem] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <legend className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
        {meta.label}
      </legend>
      <p className="mt-1 text-xs leading-5 text-white/35">{meta.hint}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map(normalizeOption).map((option) => {
          const optionId = `${id}-${String(option.value).replaceAll(/[^a-z0-9]/gi, "-")}`;
          const selected = Object.is(value, option.value);

          return (
            <div key={String(option.value)}>
              <input
                id={optionId}
                type="radio"
                name={id}
                value={String(option.value)}
                checked={selected}
                onChange={() => onChange(option.value, option.label)}
                className="peer sr-only"
              />
              <label
                htmlFor={optionId}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors motion-reduce:transition-none",
                  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#19191f]",
                  selected
                    ? "border-cyan-300/45 bg-cyan-300/[0.12] text-cyan-50"
                    : "border-white/10 bg-black/15 text-white/45 hover:border-cyan-300/30 hover:text-white",
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function resultTone(status) {
  if (status === "complete" || status === "ready") {
    return {
      border: "border-accent/25",
      background: "bg-accent/[0.05]",
      text: "text-accent",
      icon: CheckCircle2,
    };
  }

  if (status === "blocked") {
    return {
      border: "border-rose-300/25",
      background: "bg-rose-300/[0.045]",
      text: "text-rose-100",
      icon: Unplug,
    };
  }

  return {
    border: "border-amber-300/25",
    background: "bg-amber-300/[0.05]",
    text: "text-amber-100",
    icon: CircleAlert,
  };
}

function PathResult({ eyebrow, result }) {
  const styles = resultTone(result.status);
  const Icon = styles.icon;

  return (
    <article className={cn("rounded-[1.35rem] border p-5", styles.border, styles.background)}>
      <div className="flex items-start gap-3">
        <span className="rounded-xl border border-current/15 bg-black/10 p-2.5">
          <Icon className={cn("h-4 w-4", styles.text)} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-white/30">
            {eyebrow}
          </p>
          <h4 className={cn("mt-2 font-semibold", styles.text)}>{result.label}</h4>
        </div>
      </div>
      <p className="mt-4 text-xs leading-6 text-white/50">{result.detail}</p>
    </article>
  );
}

function DependencyLens({ state, dependencyPath, onChange }) {
  const firstMissing = dependencyPath.firstMissingDependency;

  return (
    <section aria-labelledby="dependency-lens-heading" className="mt-8 border-t border-white/10 pt-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100/75">
          Connectivity is only one layer
        </p>
        <h3 id="dependency-lens-heading" className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Remove a dependency and inspect where the path stops.
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/50">
          This deterministic model checks structural reachability. “Other suitable
          network” keeps transport conceptually available; it does not certify
          bandwidth, latency, reliability, or suitability for a real deployment.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DEPENDENCY_META.map((meta) => (
          <DependencyChoice
            key={meta.key}
            meta={meta}
            value={state.dependencies[meta.key]}
            options={DEPENDENCY_OPTIONS[meta.key].options}
            onChange={(value, label) => onChange(meta, value, label)}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <PathResult eyebrow="Technical path" result={dependencyPath.technicalPath} />
        <PathResult eyebrow="Responsible-use path" result={dependencyPath.responsibleUse} />
      </div>

      <div className="mt-4 rounded-[1.3rem] border border-white/10 bg-black/15 p-5">
        <div className="flex items-start gap-3">
          {firstMissing ? (
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-100/75" aria-hidden="true" />
          ) : (
            <Route className="mt-0.5 h-5 w-5 shrink-0 text-cyan-100/75" aria-hidden="true" />
          )}
          <div>
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/30">
              First stopping boundary
            </p>
            <p className="mt-2 text-sm font-semibold text-white/70">
              {firstMissing
                ? `${firstMissing.routeStepLabel ?? firstMissing.stageLabel ?? "Route stage"} — ${firstMissing.label ?? "dependency"} unavailable`
                : "No technical dependency is currently unavailable."}
            </p>
            {firstMissing?.detail ? (
              <p className="mt-2 text-xs leading-6 text-white/45">{firstMissing.detail}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function lensContent(scenario, lens) {
  const value = scenario.lenses?.[lens] ?? scenario[lens];

  if (typeof value === "string") {
    return { title: lens === "opportunity" ? "What connectivity can enable" : "What connectivity does not solve", body: value, items: [] };
  }

  if (Array.isArray(value)) {
    return { title: lens === "opportunity" ? "What connectivity can enable" : "What connectivity does not solve", body: "", items: value };
  }

  return {
    title:
      value?.title ??
      (lens === "opportunity"
        ? "What connectivity can enable"
        : "What connectivity does not solve"),
    body: value?.body ?? value?.detail ?? "",
    items: value?.items ?? value?.points ?? [],
  };
}

function OpportunityConstraint({ scenario, lens, onChange }) {
  const content = lensContent(scenario, lens);

  return (
    <section aria-labelledby="opportunity-constraint-heading" className="mt-8 border-t border-white/10 pt-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
          Opportunity ↔ constraint
        </p>
        <h3 id="opportunity-constraint-heading" className="mt-3 text-2xl font-semibold text-white">
          Read both sides of the selected scenario.
        </h3>
      </div>

      <Tabs value={lens} onValueChange={onChange} className="mt-5">
        <TabsList className="grid w-full max-w-xl grid-cols-2 rounded-xl border border-white/10 bg-black/15 p-1.5">
          <TabsTrigger
            value="opportunity"
            className="min-h-11 rounded-lg bg-transparent text-xs focus-visible:ring-2 focus-visible:ring-accent data-[state=active]:bg-cyan-300 data-[state=active]:text-primary sm:text-sm"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
            Opportunity
          </TabsTrigger>
          <TabsTrigger
            value="constraint"
            className="min-h-11 rounded-lg bg-transparent text-xs focus-visible:ring-2 focus-visible:ring-accent data-[state=active]:bg-amber-300 data-[state=active]:text-primary sm:text-sm"
          >
            <CircleAlert className="mr-2 h-4 w-4" aria-hidden="true" />
            Constraint
          </TabsTrigger>
        </TabsList>

        {["opportunity", "constraint"].map((value) => (
          <TabsContent key={value} value={value} className="mt-4 min-h-0">
            {value === lens ? (
              <article
                className={cn(
                  "rounded-[1.55rem] border p-5 sm:p-7",
                  lens === "opportunity"
                    ? "border-cyan-300/25 bg-cyan-300/[0.045]"
                    : "border-amber-300/25 bg-amber-300/[0.045]",
                )}
              >
                <h4 className="text-lg font-semibold text-white sm:text-xl">{content.title}</h4>
                {content.body ? (
                  <p className="mt-3 max-w-4xl text-sm leading-7 text-white/55">{content.body}</p>
                ) : null}
                {content.items.length ? (
                  <ul className="mt-5 grid gap-3 md:grid-cols-2">
                    {content.items.map((item) => (
                      <li
                        key={typeof item === "string" ? item : item.label}
                        className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/10 p-4 text-xs leading-6 text-white/55"
                      >
                        <span
                          className={cn(
                            "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                            lens === "opportunity" ? "bg-cyan-300" : "bg-amber-300",
                          )}
                          aria-hidden="true"
                        />
                        {typeof item === "string" ? item : item.label ?? item.detail}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function WhatChanged({ explanation }) {
  return (
    <aside className="mt-6 rounded-[1.6rem] border border-accent/20 bg-accent/[0.035] p-5 sm:p-7">
      <div className="flex items-start gap-3">
        <Network className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            What changed?
          </p>
          <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">
            {explanation.title}
          </h3>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-white/55">
            {explanation.body ?? explanation.detail}
          </p>
          {explanation.caveat ? (
            <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-6 text-white/35">
              {explanation.caveat}
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export default function PandemicResponseExplorer() {
  const reduceMotion = useReducedMotion();
  const [state, dispatch] = useReducer(
    pandemicResponseReducer,
    undefined,
    createInitialPandemicResponseState,
  );
  const [announcement, setAnnouncement] = useState("");
  const chapterRefs = useRef([]);
  const derived = useMemo(() => derivePandemicResponse(state), [state]);
  const {
    scenario,
    route,
    selectedStage,
    capabilities,
    dependencyPath,
    explanation,
    whatChanged,
  } = derived;
  const capabilityMatches = [
    ...capabilities.trafficProfiles,
    ...capabilities.architecturalConcepts,
  ];

  useEffect(() => {
    const chapters = chapterRefs.current.filter(Boolean);

    if (!chapters.length || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const centeredEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => {
            const viewportCenter = window.innerHeight / 2;
            const firstCenter =
              first.boundingClientRect.top + first.boundingClientRect.height / 2;
            const secondCenter =
              second.boundingClientRect.top + second.boundingClientRect.height / 2;
            return (
              Math.abs(firstCenter - viewportCenter) -
              Math.abs(secondCenter - viewportCenter)
            );
          })[0];

        if (centeredEntry) {
          dispatch({
            type: "set-step",
            index: Number(centeredEntry.target.dataset.stepIndex),
          });
        }
      },
      {
        rootMargin: "-42% 0px -42% 0px",
        threshold: 0,
      },
    );

    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, [state.scenarioId]);

  const setChapterRef = (index, node) => {
    chapterRefs.current[index] = node;
  };

  const scrollToChapter = (index) => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(min-width: 960px)").matches
    ) {
      return;
    }

    chapterRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  };

  const selectScenario = (nextScenario) => {
    dispatch({ type: "select-scenario", scenarioId: nextScenario.id });
    setAnnouncement(
      `${scenarioLabel(nextScenario)} selected. The data path returned to stage one.`,
    );
  };

  const selectStep = (index, stage) => {
    dispatch({ type: "set-step", index });
    scrollToChapter(index);
    setAnnouncement(`Data stage ${index + 1} selected: ${stageLabel(stage)}.`);
  };

  const moveStep = (direction) => {
    const nextIndex =
      direction === "next"
        ? Math.min(state.activeStepIndex + 1, route.length - 1)
        : Math.max(state.activeStepIndex - 1, 0);
    const nextStage = route[nextIndex];
    dispatch({ type: direction === "next" ? "next-step" : "previous-step" });
    scrollToChapter(nextIndex);
    setAnnouncement(`Data stage ${nextIndex + 1}: ${stageLabel(nextStage)}.`);
  };

  const changeDependency = (meta, value, label) => {
    const nextState = {
      ...state,
      dependencies: { ...state.dependencies, [meta.key]: value },
    };
    const nextDerived = derivePandemicResponse(nextState);
    dispatch({ type: "set-dependency", dependency: meta.key, value });
    setAnnouncement(
      `${meta.label} set to ${label}. ${nextDerived.dependencyPath.technicalPath.label} ${nextDerived.dependencyPath.responsibleUse.label}`,
    );
  };

  const changeLens = (lens) => {
    dispatch({ type: "set-lens", lens });
    setAnnouncement(`${lens === "opportunity" ? "Opportunity" : "Constraint"} lens selected.`);
  };

  const resetExplorer = () => {
    dispatch({ type: "reset" });
    setAnnouncement("Pandemic Response Explorer reset to its initial scenario and dependencies.");
  };

  return (
    <div
      id="pandemic-response-explorer"
      className="scroll-mt-24 rounded-[2rem] border border-white/10 bg-[#19191f] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.3)] sm:p-6 lg:p-8"
    >
      <div
        role="note"
        className="flex flex-col gap-5 rounded-[1.55rem] border border-amber-300/20 bg-amber-300/[0.04] p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6"
      >
        <div className="flex max-w-4xl items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-100/75" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100/75">
              Interactive portfolio reconstruction
            </p>
            <p className="mt-3 text-sm leading-7 text-white/55">
              This explorer reorganizes literature examples into one inspectable
              data path. Every result is calculated locally from the selected
              dependencies; no real network, health data, sensor, benchmark, or
              external request is used.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={resetExplorer}
          className="min-h-11 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f]"
        >
          <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Reset explorer
        </Button>
      </div>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      <div className="mt-8">
        <ScenarioSelector activeId={state.scenarioId} onSelect={selectScenario} />
      </div>

      <section aria-labelledby="active-scenario-heading" className="mt-8 border-t border-white/10 pt-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/70">
                Active data route
              </p>
              <EvidenceBadge evidence="Portfolio reconstruction" />
            </div>
            <h3 id="active-scenario-heading" className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              {scenarioLabel(scenario)}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/55">
              {scenarioDescription(scenario)}
            </p>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-2 text-center">
            <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3">
              <p className="text-[0.55rem] uppercase tracking-[0.13em] text-white/30">Route stages</p>
              <p className="mt-1 text-sm font-semibold text-cyan-100">{route.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3">
              <p className="text-[0.55rem] uppercase tracking-[0.13em] text-white/30">Selected</p>
              <p className="mt-1 text-sm font-semibold text-cyan-100">{state.activeStepIndex + 1}</p>
            </div>
          </div>
        </div>

        <DesktopScrollytelling
          route={route}
          state={state}
          dependencyPath={dependencyPath}
          onSelectStep={selectStep}
          onPrevious={() => moveStep("previous")}
          onNext={() => moveStep("next")}
          reduceMotion={reduceMotion}
          setChapterRef={setChapterRef}
        />

        <div className="mt-7 lg:hidden">
          <div className="rounded-[1.6rem] border border-white/10 bg-[#111116] p-4 sm:p-5">
            <MobileRouteGraph
              route={route}
              state={state}
              dependencyPath={dependencyPath}
              onSelectStep={selectStep}
              reduceMotion={reduceMotion}
            />
          </div>
          <CurrentStagePanel
            stage={selectedStage}
            index={state.activeStepIndex}
            count={route.length}
            onPrevious={() => moveStep("previous")}
            onNext={() => moveStep("next")}
          />
        </div>
      </section>

      <CapabilityMatcher matches={capabilityMatches} />

      <DependencyLens
        state={state}
        dependencyPath={dependencyPath}
        onChange={changeDependency}
      />

      <OpportunityConstraint
        scenario={scenario}
        lens={state.lens}
        onChange={changeLens}
      />

      <WhatChanged
        explanation={{ ...whatChanged, caveat: explanation.caveat }}
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Original paper evidence", "Use cases and technologies reported in the coursework."],
          ["Current standards fact", "Definitions kept separate from application guarantees."],
          ["Portfolio reconstruction", "The unified topology, controls, and dependency model."],
        ].map(([label, detail]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <EvidenceBadge evidence={label} />
            <p className="mt-3 text-xs leading-6 text-white/40">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
