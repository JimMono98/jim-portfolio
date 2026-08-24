"use client";

import { useId, useMemo, useReducer, useRef, useState } from "react";
import {
  AlertTriangle,
  Braces,
  CheckCircle2,
  Database,
  Fingerprint,
  GitCompareArrows,
  Network,
  RefreshCcw,
  Route,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import {
  MAX_PATH_LENGTH,
  MAX_QUERY_INPUT_LENGTH,
  QUERY_PRESETS,
  RECONSTRUCTION_LIMIT,
  ROUTE_PRESETS,
  SOURCE_OPTIONS,
  createInitialSecurityLabState,
  deriveSecurityPipeline,
  deriveWhatChanged,
  securityLabReducer,
  validateLocalPath,
  validateQueryInput,
} from "./securityLabModel.mjs";

const TONE_STYLES = {
  warning: {
    border: "border-amber-300/25",
    background: "bg-amber-300/[0.055]",
    text: "text-amber-200",
    dot: "bg-amber-300",
    icon: AlertTriangle,
  },
  blocked: {
    border: "border-rose-300/25",
    background: "bg-rose-300/[0.055]",
    text: "text-rose-200",
    dot: "bg-rose-300",
    icon: XCircle,
  },
  secure: {
    border: "border-accent/25",
    background: "bg-accent/[0.055]",
    text: "text-accent",
    dot: "bg-accent",
    icon: ShieldCheck,
  },
  neutral: {
    border: "border-white/10",
    background: "bg-white/[0.025]",
    text: "text-white/55",
    dot: "bg-white/30",
    icon: CheckCircle2,
  },
};

function toneStyles(tone) {
  return TONE_STYLES[tone] ?? TONE_STYLES.neutral;
}

function StatusBadge({ status, tone = "neutral" }) {
  const styles = toneStyles(tone);
  const Icon = styles.icon;

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.13em]",
        styles.border,
        styles.background,
        styles.text,
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}

function ChoiceGroup({ legend, name, value, options, onChange }) {
  const groupId = useId();

  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const optionValue = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;
          const optionId = `${groupId}-${optionValue.replaceAll(/[^a-z0-9]/gi, "-")}`;
          const selected = value === optionValue;

          return (
            <div key={optionValue}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={optionValue}
                checked={selected}
                onChange={() => onChange(optionValue)}
                className="peer sr-only"
              />
              <label
                htmlFor={optionId}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none",
                  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#19191f]",
                  selected
                    ? "border-accent bg-accent text-primary"
                    : "border-white/15 bg-white/[0.035] text-white/65 hover:border-accent/45 hover:text-white",
                )}
              >
                {optionLabel}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function CodeValue({ label, children, accent = false }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <code
        className={cn(
          "mt-2 block whitespace-pre-wrap break-all text-xs leading-6 sm:text-sm",
          accent ? "text-accent" : "text-white/70",
        )}
      >
        {children}
      </code>
    </div>
  );
}

function ComparisonLane({ label, eyebrow, status, tone, detail, icon: Icon, children }) {
  const styles = toneStyles(tone);

  return (
    <article
      className={cn(
        "min-w-0 rounded-[1.7rem] border p-5 sm:p-6",
        styles.border,
        styles.background,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="rounded-xl border border-white/10 bg-black/15 p-2.5">
            <Icon className={cn("h-5 w-5", styles.text)} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/35">
              {eyebrow}
            </p>
            <h4 className="mt-2 font-semibold text-white">{label}</h4>
          </div>
        </div>
        <StatusBadge status={status} tone={tone} />
      </div>
      <p className="mt-5 text-sm leading-7 text-white/55">{detail}</p>
      <div className="mt-5 space-y-3">{children}</div>
    </article>
  );
}

function RouteScenario({ state, route, draft, setDraft, commitRoute, announce }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const draftValidation = validateLocalPath(draft);
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const handlePreset = (value) => {
    setDraft(value);
    setSubmitted(false);
    commitRoute(value);
    const nextRoute = deriveSecurityPipeline({ ...state, routeInput: value }).route;
    announce(
      `Route comparison updated. Observed lane: ${nextRoute.observed.status}. Hardened lane: ${nextRoute.hardened.status}.`,
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!draftValidation.valid) {
      announce(`Path rejected. ${draftValidation.error}`);
      inputRef.current?.focus();
      return;
    }

    commitRoute(draft);
    const nextRoute = deriveSecurityPipeline({ ...state, routeInput: draft }).route;
    announce(
      `Path applied. Observed lane: ${nextRoute.observed.status}. Hardened lane: ${nextRoute.hardened.status}.`,
    );
  };

  return (
    <div className="space-y-7">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
          Route policy
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Compare raw-path policy with canonical routing.
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/55">
          The narrow model recognizes literal dot segments only. It is an
          educational consistency check, not a recovered server algorithm or a
          complete URL normalizer.
        </p>
      </div>

      <ChoiceGroup
        legend="Path presets"
        name="security-route-preset"
        value={
          ROUTE_PRESETS.some((preset) => preset.value === state.routeInput)
            ? state.routeInput
            : ""
        }
        options={ROUTE_PRESETS}
        onChange={handlePreset}
      />

      <form onSubmit={handleSubmit} noValidate className="max-w-3xl">
        <label htmlFor={inputId} className="text-sm font-medium text-white/70">
          Bounded local path
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input
            ref={inputRef}
            id={inputId}
            type="text"
            autoComplete="off"
            spellCheck="false"
            maxLength={MAX_PATH_LENGTH + 1}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setSubmitted(false);
            }}
            aria-invalid={submitted && !draftValidation.valid ? "true" : undefined}
            aria-describedby={submitted && !draftValidation.valid ? `${hintId} ${errorId}` : hintId}
            className="h-12 min-w-0 flex-1 rounded-xl border-white/15 bg-black/15 text-sm text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f]"
          />
          <Button
            type="submit"
            variant="outline"
            className="h-12 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f]"
          >
            Apply path
          </Button>
        </div>
        <p id={hintId} className="mt-3 text-xs leading-5 text-white/40">
          Root-relative paths only. Hosts, encoding, traversal, query data,
          fragments, duplicate slashes, and control characters are rejected.
        </p>
        {submitted && !draftValidation.valid ? (
          <p id={errorId} role="alert" className="mt-3 text-sm text-rose-200">
            {draftValidation.error}
          </p>
        ) : null}
      </form>

      <div className="grid gap-5 md:grid-cols-2">
        <ComparisonLane
          label="Raw policy first"
          eyebrow="Observed assumption"
          status={route.observed.status}
          tone={route.observed.tone}
          detail={route.observed.detail}
          icon={Route}
        >
          <CodeValue label="Policy sees">{route.observed.policyInput || "—"}</CodeValue>
          <CodeValue label="Downstream route" accent>
            {route.observed.downstreamPath || "Not resolved"}
          </CodeValue>
        </ComparisonLane>
        <ComparisonLane
          label="Canonical value first"
          eyebrow="Hardened reconstruction"
          status={route.hardened.status}
          tone={route.hardened.tone}
          detail={route.hardened.detail}
          icon={ShieldCheck}
        >
          <CodeValue label="Policy sees">{route.hardened.policyInput || "—"}</CodeValue>
          <CodeValue label="Router sees" accent>
            {route.hardened.downstreamPath || "Not resolved"}
          </CodeValue>
        </ComparisonLane>
      </div>
    </div>
  );
}

function QueryScenario({ state, query, draft, setDraft, dispatch, announce }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const draftValidation = validateQueryInput(draft);
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const selectPreset = (value) => {
    dispatch({ type: "select-query-preset", value });
    setSubmitted(false);
    const nextQuery = deriveSecurityPipeline({ ...state, queryPreset: value }).query;
    announce(
      `${QUERY_PRESETS[value].label} selected. Observed lane: ${nextQuery.observed.status}. Hardened lane: ${nextQuery.hardened.status}.`,
    );
  };

  const handleCustomSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!draftValidation.valid) {
      announce(`Custom input rejected. ${draftValidation.error}`);
      inputRef.current?.focus();
      return;
    }

    dispatch({ type: "set-custom-query", value: draft });
    announce(
      "Custom input inspected locally. The interpolated text changed; the parameterized statement remained stable. No original-project outcome is assigned.",
    );
  };

  return (
    <div className="space-y-7">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
          Query construction
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Separate data from statement structure.
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/55">
          This comparison constructs text only. It has no database, parser,
          authentication result, or live query execution.
        </p>
      </div>

      <ChoiceGroup
        legend="Identifier input"
        name="security-query-preset"
        value={state.queryPreset}
        options={Object.entries(QUERY_PRESETS).map(([value, preset]) => ({
          value,
          label: preset.label,
        }))}
        onChange={selectPreset}
      />

      {state.queryPreset === "custom" ? (
        <form onSubmit={handleCustomSubmit} noValidate className="max-w-3xl">
          <label htmlFor={inputId} className="text-sm font-medium text-white/70">
            Custom identifier
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Input
              ref={inputRef}
              id={inputId}
              type="text"
              autoComplete="off"
              spellCheck="false"
              maxLength={MAX_QUERY_INPUT_LENGTH + 1}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setSubmitted(false);
              }}
              aria-invalid={submitted && !draftValidation.valid ? "true" : undefined}
              aria-describedby={submitted && !draftValidation.valid ? `${hintId} ${errorId}` : hintId}
              className="h-12 min-w-0 flex-1 rounded-xl border-white/15 bg-black/15 text-sm text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f]"
            />
            <Button
              type="submit"
              variant="outline"
              className="h-12 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f]"
            >
              Inspect construction
            </Button>
          </div>
          <p id={hintId} className="mt-3 text-xs leading-5 text-white/40">
            Printable local text only. Custom inputs never inherit an outcome
            from the preserved presentation.
          </p>
          {submitted && !draftValidation.valid ? (
            <p id={errorId} role="alert" className="mt-3 text-sm text-rose-200">
              {draftValidation.error}
            </p>
          ) : null}
        </form>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <ComparisonLane
          label="Interpolated illustration"
          eyebrow="Observed assumption"
          status={query.observed.status}
          tone={query.observed.tone}
          detail={query.observed.detail}
          icon={Database}
        >
          <CodeValue label="Statement text">{query.observed.statement || "—"}</CodeValue>
        </ComparisonLane>
        <ComparisonLane
          label="Parameterized illustration"
          eyebrow="Hardened reconstruction"
          status={query.hardened.status}
          tone={query.hardened.tone}
          detail={query.hardened.detail}
          icon={Braces}
        >
          <CodeValue label="Byte-identical statement" accent>
            {query.hardened.statement}
          </CodeValue>
          <CodeValue label="Separately bound values">
            {JSON.stringify(query.hardened.boundValues)}
          </CodeValue>
        </ComparisonLane>
      </div>

      <div
        role="note"
        className={cn(
          "rounded-2xl border p-4 text-sm leading-7",
          query.isRecordedPreset
            ? "border-amber-300/20 bg-amber-300/[0.04] text-amber-100/70"
            : "border-white/10 bg-white/[0.025] text-white/50",
        )}
      >
        <span className="font-semibold text-white/75">Evidence boundary: </span>
        {query.evidenceNote}
      </div>
    </div>
  );
}

function Meter({ count, limit, tone }) {
  const styles = toneStyles(tone);

  return (
    <div aria-label={`${count} of ${limit} admitted attempts`} className="flex gap-2">
      {Array.from({ length: limit }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-2 flex-1 rounded-full border",
            index < count
              ? cn(styles.border, styles.dot)
              : "border-white/10 bg-white/[0.035]",
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function IdentityScenario({ state, identity, dispatch, announce }) {
  const recordAttempt = () => {
    const observedResult = identity.observedNextAdmitted ? "admitted" : "blocked";
    const hardenedResult = identity.hardenedNextAdmitted ? "admitted" : "blocked";
    dispatch({ type: "record-attempt" });
    announce(
      `Failed verification attempt recorded. Observed ${state.identitySource} bucket: ${observedResult}. Hardened verification principal: ${hardenedResult}.`,
    );
  };

  const selectSource = (value) => {
    dispatch({ type: "set-source", value });
    const nextIdentity = deriveSecurityPipeline({ ...state, identitySource: value }).identity;
    announce(
      `${value} selected. Its observed bucket contains ${nextIdentity.observedCount} admitted attempts; the stable hardened principal contains ${nextIdentity.hardenedCount}.`,
    );
  };

  return (
    <div className="space-y-7">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
          Rate-limit identity
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Change who defines the counting key.
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/55">
          Record failed verification attempts manually. There is no OTP input,
          delay, source rotation, target request, or brute-force automation.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <ChoiceGroup
          legend="Visitor-claimed symbolic source"
          name="security-symbolic-source"
          value={state.identitySource}
          options={SOURCE_OPTIONS}
          onChange={selectSource}
        />
        <Button
          type="button"
          onClick={recordAttempt}
          className="min-h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f] lg:w-auto"
        >
          Record failed verification attempt
        </Button>
      </div>

      <p className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-6 text-white/45">
        Demonstration policy: the first {RECONSTRUCTION_LIMIT} attempts are
        admitted and the next is blocked. This compressed threshold belongs to
        the portfolio reconstruction; the original threshold is not known.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <ComparisonLane
          label={state.identitySource}
          eyebrow="Visitor-controlled bucket"
          status={identity.observed.status}
          tone={identity.observed.tone}
          detail={identity.observed.detail}
          icon={Network}
        >
          <CodeValue label="Current counting key">{state.identitySource}</CodeValue>
          <Meter
            count={identity.observedCount}
            limit={identity.limit}
            tone={identity.observed.tone}
          />
        </ComparisonLane>
        <ComparisonLane
          label="Verification transaction"
          eyebrow="Server-derived principal"
          status={identity.hardened.status}
          tone={identity.hardened.tone}
          detail={identity.hardened.detail}
          icon={Fingerprint}
        >
          <CodeValue label="Stable counting key" accent>
            {identity.stablePrincipal}
          </CodeValue>
          <Meter
            count={identity.hardenedCount}
            limit={identity.limit}
            tone={identity.hardened.tone}
          />
        </ComparisonLane>
      </div>

      {state.events.length > 0 ? (
        <details className="rounded-2xl border border-white/10 bg-black/10 p-4 sm:p-5">
          <summary className="cursor-pointer text-sm font-semibold text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            View local attempt history ({state.events.length})
          </summary>
          <ol className="mt-4 space-y-3">
            {state.events.map((event) => (
              <li
                key={event.id}
                className="grid gap-2 rounded-xl border border-white/10 bg-white/[0.025] p-3 text-xs leading-5 text-white/50 sm:grid-cols-[auto_1fr_1fr]"
              >
                <span className="font-semibold text-white/70">#{event.id}</span>
                <span>
                  Observed {event.source}: {event.observed} ({event.observedCount}/
                  {RECONSTRUCTION_LIMIT})
                </span>
                <span>
                  Hardened principal: {event.hardened} ({event.hardenedCount}/
                  {RECONSTRUCTION_LIMIT})
                </span>
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </div>
  );
}

function PipelineRail({ rail, hardened = false }) {
  return (
    <article
      className={cn(
        "min-w-0 rounded-[1.75rem] border p-5 sm:p-6",
        hardened
          ? "border-accent/20 bg-accent/[0.035]"
          : "border-amber-300/20 bg-amber-300/[0.035]",
      )}
    >
      <div className="flex items-center gap-3">
        {hardened ? (
          <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
        ) : (
          <GitCompareArrows className="h-5 w-5 text-amber-200" aria-hidden="true" />
        )}
        <h4 className="font-semibold text-white">{rail.label}</h4>
      </div>

      <ol className="mt-6 space-y-3">
        {rail.steps.map((step, index) => {
          const styles = toneStyles(step.tone);
          return (
            <li
              key={step.label}
              className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3"
            >
              <div className="flex flex-col items-center" aria-hidden="true">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-[0.65rem] font-semibold",
                    styles.border,
                    styles.background,
                    styles.text,
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < rail.steps.length - 1 ? (
                  <span className="my-1 h-5 w-px bg-white/10 motion-reduce:transition-none" />
                ) : null}
              </div>
              <div className="min-w-0 pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                  {step.label}
                </p>
                <p className={cn("mt-1 text-sm leading-6", styles.text)}>
                  {step.status}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-3 border-t border-white/10 pt-5 text-sm leading-7 text-white/60">
        {rail.overall}
      </p>
    </article>
  );
}

export default function SecurityLab() {
  const [state, dispatch] = useReducer(
    securityLabReducer,
    undefined,
    createInitialSecurityLabState,
  );
  const [activeScenario, setActiveScenario] = useState("route");
  const [routeDraft, setRouteDraft] = useState(state.routeInput);
  const [customQueryDraft, setCustomQueryDraft] = useState(
    state.customQueryInput,
  );
  const [liveMessage, setLiveMessage] = useState("");
  const pipeline = useMemo(() => deriveSecurityPipeline(state), [state]);
  const whatChanged = useMemo(
    () => deriveWhatChanged(state, activeScenario),
    [activeScenario, state],
  );

  const announce = (message) => setLiveMessage(message);

  const resetLab = () => {
    const initialState = createInitialSecurityLabState();
    dispatch({ type: "reset" });
    setRouteDraft(initialState.routeInput);
    setCustomQueryDraft(initialState.customQueryInput);
    setActiveScenario("route");
    announce("Trust Boundary Lab reset to its documented reconstruction defaults.");
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#19191f] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-6 lg:p-8">
      <div
        role="note"
        className="flex flex-col gap-4 rounded-[1.5rem] border border-accent/20 bg-accent/[0.035] p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6"
      >
        <div className="flex max-w-3xl items-start gap-3">
          <ShieldCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-accent"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Local security reconstruction
            </p>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Interactive portfolio reconstruction based on the documented
              trust failures. All processing stays in this browser; no target,
              database, exploit endpoint or network request is used.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={resetLab}
          className="min-h-11 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f]"
        >
          <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Reset lab
        </Button>
      </div>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>

      <Tabs
        value={activeScenario}
        onValueChange={setActiveScenario}
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-1 gap-2 rounded-2xl border border-white/10 bg-black/10 p-2 sm:grid-cols-3">
          <TabsTrigger
            value="route"
            className="min-h-11 rounded-xl bg-transparent text-sm focus-visible:ring-2 focus-visible:ring-accent data-[state=active]:bg-accent data-[state=active]:text-primary"
          >
            Route policy
          </TabsTrigger>
          <TabsTrigger
            value="query"
            className="min-h-11 rounded-xl bg-transparent text-sm focus-visible:ring-2 focus-visible:ring-accent data-[state=active]:bg-accent data-[state=active]:text-primary"
          >
            Query boundary
          </TabsTrigger>
          <TabsTrigger
            value="identity"
            className="min-h-11 rounded-xl bg-transparent text-sm focus-visible:ring-2 focus-visible:ring-accent data-[state=active]:bg-accent data-[state=active]:text-primary"
          >
            Rate identity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="route" className="mt-8 min-h-0 focus-visible:ring-accent">
          <RouteScenario
            state={state}
            route={pipeline.route}
            draft={routeDraft}
            setDraft={setRouteDraft}
            commitRoute={(value) => dispatch({ type: "set-route", value })}
            announce={announce}
          />
        </TabsContent>

        <TabsContent value="query" className="mt-8 min-h-0 focus-visible:ring-accent">
          <QueryScenario
            state={state}
            query={pipeline.query}
            draft={customQueryDraft}
            setDraft={setCustomQueryDraft}
            dispatch={dispatch}
            announce={announce}
          />
        </TabsContent>

        <TabsContent value="identity" className="mt-8 min-h-0 focus-visible:ring-accent">
          <IdentityScenario
            state={state}
            identity={pipeline.identity}
            dispatch={dispatch}
            announce={announce}
          />
        </TabsContent>
      </Tabs>

      <section
        aria-labelledby="security-pipeline-heading"
        className="mt-10 border-t border-white/10 pt-10"
      >
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            Unified request pipeline
          </p>
          <h3
            id="security-pipeline-heading"
            className="mt-3 text-2xl font-semibold text-white sm:text-3xl"
          >
            One request, two trust models.
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/55">
            Later scenarios stay independently explorable, while each pipeline
            stops at its first effective boundary.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <PipelineRail rail={pipeline.observed} />
          <PipelineRail rail={pipeline.hardened} hardened />
        </div>
      </section>

      <aside className="mt-6 rounded-[1.7rem] border border-accent/20 bg-accent/[0.035] p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <GitCompareArrows
            className="mt-0.5 h-5 w-5 shrink-0 text-accent"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              What changed?
            </p>
            <h4 className="mt-3 text-lg font-semibold text-white sm:text-xl">
              {whatChanged.title}
            </h4>
            <p className="mt-3 text-sm leading-7 text-white/60">
              {whatChanged.body}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
