"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Code2,
  LoaderCircle,
  Send,
  Server,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const REQUESTING_DELAY = 250;
const RESULT_DELAY = 700;

const RESULT_MESSAGES = {
  0: "Try again in September.",
  5: "Halfway there — keep going.",
  10: "You are Top.",
};

const quickValues = [0, 5, 10];

export function getNumberCheckerResult(number) {
  if (!Number.isSafeInteger(number)) {
    throw new TypeError("Number checker input must be a safe integer.");
  }

  const matched = Object.prototype.hasOwnProperty.call(RESULT_MESSAGES, number);
  const isRememberedResponse = number === 0 || number === 10;

  return {
    number,
    matched,
    branch: matched ? `number == ${number}` : "else",
    provenance: isRememberedResponse
      ? "Author-provided recollection"
      : "Portfolio recreation",
    message: matched
      ? RESULT_MESSAGES[number]
      : `Number ${number} reached the fallback path. Try 0, 5, or 10.`,
  };
}

function parseNumberInput(rawInput) {
  const normalizedInput = rawInput.trim();

  if (!normalizedInput) {
    return {
      error: "Enter a whole number to continue.",
    };
  }

  if (!/^[+-]?\d+$/.test(normalizedInput)) {
    return {
      error: "Use a whole number, such as 0, 5, 10, or 13.",
    };
  }

  const number = Number(normalizedInput);

  if (!Number.isSafeInteger(number)) {
    return {
      error: "Enter a whole number within the safe integer range.",
    };
  }

  return { number };
}

function FlowConnector({ active, label, value }) {
  return (
    <div className="flex min-h-20 flex-col items-center justify-center gap-2 lg:min-h-0">
      <p
        className={cn(
          "text-center text-[0.62rem] uppercase tracking-[0.16em] transition-colors duration-300",
          active ? "text-accent" : "text-white/30"
        )}
      >
        {label}
      </p>
      {value !== undefined ? (
        <code className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[0.68rem] text-white/55">
          number = {value ?? "—"}
        </code>
      ) : null}
      <ArrowDown
        className={cn(
          "h-5 w-5 transition-colors duration-300 lg:hidden",
          active ? "text-accent" : "text-white/25"
        )}
        aria-hidden="true"
      />
      <ArrowRight
        className={cn(
          "hidden h-5 w-5 transition-colors duration-300 lg:block",
          active ? "text-accent" : "text-white/25"
        )}
        aria-hidden="true"
      />
    </div>
  );
}

function LogicBranch({ active, children }) {
  return (
    <span
      className={cn(
        "-mx-2 block rounded-lg border border-transparent px-2 py-1 transition-colors duration-300",
        active && "border-accent/25 bg-accent/[0.07] text-white"
      )}
    >
      {children}
    </span>
  );
}

function PhaseBadge({ phase }) {
  const labels = {
    idle: "Awaiting input",
    requesting: "Preparing request",
    processing: "Evaluating logic",
    matched: "Branch matched",
    fallback: "Fallback branch",
  };
  const isBusy = phase === "requesting" || phase === "processing";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em]",
        phase === "idle"
          ? "border-white/10 bg-white/[0.035] text-white/40"
          : "border-accent/25 bg-accent/[0.07] text-accent"
      )}
    >
      {isBusy ? (
        <LoaderCircle
          className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : phase === "matched" ? (
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            phase === "idle" ? "bg-white/30" : "bg-accent"
          )}
          aria-hidden="true"
        />
      )}
      {labels[phase]}
    </span>
  );
}

export default function NumberCheckerRecreation() {
  const reduceMotion = useReducedMotion();
  const inputId = useId();
  const resultId = useId();
  const inputRef = useRef(null);
  const timersRef = useRef(new Set());

  const [rawInput, setRawInput] = useState("13");
  const [phase, setPhase] = useState("idle");
  const [fieldError, setFieldError] = useState("");
  const [submittedNumber, setSubmittedNumber] = useState(null);
  const [result, setResult] = useState(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const schedule = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);

    timersRef.current.add(timer);
  }, []);

  const completeSimulation = useCallback((number) => {
    const nextResult = getNumberCheckerResult(number);

    setResult(nextResult);
    setPhase(nextResult.matched ? "matched" : "fallback");
  }, []);

  const runSimulation = useCallback(
    (number) => {
      clearTimers();
      setFieldError("");
      setSubmittedNumber(number);
      setResult(null);

      if (reduceMotion) {
        completeSimulation(number);
        return;
      }

      setPhase("requesting");
      schedule(() => setPhase("processing"), REQUESTING_DELAY);
      schedule(() => completeSimulation(number), RESULT_DELAY);
    },
    [clearTimers, completeSimulation, reduceMotion, schedule]
  );

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    const isBusy = phase === "requesting" || phase === "processing";

    if (reduceMotion && isBusy && submittedNumber !== null) {
      clearTimers();
      completeSimulation(submittedNumber);
    }
  }, [
    clearTimers,
    completeSimulation,
    phase,
    reduceMotion,
    submittedNumber,
  ]);

  const resetPendingResult = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setFieldError("");
    setSubmittedNumber(null);
    setResult(null);
  }, [clearTimers]);

  const handleInputChange = (event) => {
    setRawInput(event.target.value);
    resetPendingResult();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearTimers();

    const parsedInput = parseNumberInput(rawInput);

    if (parsedInput.error) {
      setPhase("idle");
      setFieldError(parsedInput.error);
      setSubmittedNumber(null);
      setResult(null);
      inputRef.current?.focus();
      return;
    }

    runSimulation(parsedInput.number);
  };

  const handleQuickRequest = (number) => {
    setRawInput(String(number));
    runSimulation(number);
  };

  const isRequesting = phase === "requesting";
  const isProcessing = phase === "processing";
  const isBusy = isRequesting || isProcessing;
  const hasCompleted = phase === "matched" || phase === "fallback";
  const activeBranch = hasCompleted ? result?.branch : null;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = fieldError ? `${hintId} ${errorId}` : hintId;
  const payloadValue = submittedNumber ?? null;

  const liveMessage = fieldError
    ? ""
    : isBusy
      ? `Running the local simulation for ${submittedNumber}.`
      : hasCompleted
        ? result.message
        : "Awaiting a local simulation.";

  const visibleResult = (() => {
    if (isRequesting) {
      return {
        title: "Preparing the conceptual payload",
        copy: `The recreated mobile client is packaging number ${submittedNumber}.`,
      };
    }

    if (isProcessing) {
      return {
        title: "Evaluating the reconstructed branches",
        copy: "The local simulation is checking 0, 5, and 10 before the fallback path.",
      };
    }

    if (hasCompleted) {
      return {
        title: result.branch,
        copy: result.message,
      };
    }

    return {
      title: "Awaiting a local simulation",
      copy: "Enter a whole number or run one of the documented quick requests.",
    };
  })();

  return (
    <section
      aria-labelledby={`${inputId}-heading`}
      className="rounded-[2rem] border border-white/10 bg-[#18181d] p-5 sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Interactive reconstruction
          </p>
          <h3
            id={`${inputId}-heading`}
            className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl"
          >
            Trace a number through the documented conditional.
          </h3>
          <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            The surviving artifact establishes a mobile input, three accepted
            values, and a fallback response. This code-native version makes
            that decision path explorable without overstating the original
            implementation.
          </p>
        </div>

        <div
          role="note"
          className="flex max-w-md items-start gap-3 rounded-2xl border border-accent/25 bg-accent/[0.06] p-4"
        >
          <ShieldCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-accent"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Local simulation
            </p>
            <p className="mt-2 text-xs leading-5 text-white/55">
              Runs entirely in this browser. No live Python service or network
              request is used.
            </p>
          </div>
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveMessage}
      </p>

      <div className="mt-8 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,0.9fr)_4rem_minmax(0,1.15fr)_4rem_minmax(0,0.9fr)] lg:items-stretch sm:mt-10">
        <article className="min-w-0 rounded-[1.8rem] border-[5px] border-[#2a2a30] bg-[#111116] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.32)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-accent">
                01 · Mobile client
              </p>
              <h4 className="mt-3 text-lg font-semibold text-white">
                MainActivity
              </h4>
            </div>
            <Smartphone className="h-5 w-5 text-white/25" aria-hidden="true" />
          </div>

          <p className="mt-5 text-[0.65rem] uppercase tracking-[0.16em] text-white/30">
            Recreated interaction
          </p>

          <form onSubmit={handleSubmit} className="mt-4" noValidate>
            <label
              htmlFor={inputId}
              className="text-xs font-medium text-white/70"
            >
              Number
            </label>
            <Input
              ref={inputRef}
              id={inputId}
              name="number"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={rawInput}
              onChange={handleInputChange}
              aria-invalid={fieldError ? "true" : undefined}
              aria-describedby={describedBy}
              className="mt-2 h-14 w-full rounded-xl border-white/15 bg-[#18181d] py-3 text-lg font-medium text-white placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]"
            />
            <p id={hintId} className="mt-3 text-xs leading-5 text-white/40">
              Choose 0, 5, or 10. Other whole numbers demonstrate the fallback.
            </p>
            {fieldError ? (
              <p
                id={errorId}
                role="alert"
                className="mt-3 text-xs leading-5 text-[#ff8f8f]"
              >
                {fieldError}
              </p>
            ) : null}

            <Button
              type="submit"
              size="md"
              aria-controls={resultId}
              className="mt-5 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]"
            >
              <Send className="mr-2 h-4 w-4" aria-hidden="true" />
              {isBusy ? "Restart simulation" : "Simulate request"}
            </Button>

            <fieldset className="mt-5">
              <legend className="sr-only">Run a documented quick request</legend>
              <p
                className="mb-2 text-[0.62rem] uppercase tracking-[0.16em] text-white/30"
                aria-hidden="true"
              >
                Quick requests
              </p>
              <div className="grid grid-cols-3 gap-2">
                {quickValues.map((number) => (
                  <Button
                    key={number}
                    type="button"
                    variant="outline"
                    onClick={() => handleQuickRequest(number)}
                    aria-label={`Run local simulation with ${number}`}
                    aria-controls={resultId}
                    className="min-w-0 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]"
                  >
                    {number}
                  </Button>
                ))}
              </div>
            </fieldset>
          </form>
        </article>

        <FlowConnector
          active={isRequesting || isProcessing || hasCompleted}
          label="Conceptual payload"
          value={payloadValue}
        />

        <article
          aria-busy={isProcessing}
          className={cn(
            "min-w-0 rounded-[1.8rem] border bg-[#141419] p-5 transition-colors duration-300 sm:p-6",
            isProcessing
              ? "border-accent/35"
              : "border-white/10"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-accent">
                02 · Python backend concept
              </p>
              <h4 className="mt-3 text-lg font-semibold text-white">
                Conditional branches
              </h4>
            </div>
            <Server className="h-5 w-5 text-white/25" aria-hidden="true" />
          </div>

          <div className="mt-5 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.16em] text-white/30">
            <Code2 className="h-4 w-4 text-accent/70" aria-hidden="true" />
            Illustrative reconstruction
          </div>

          <pre
            className="mt-4 overflow-hidden whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-[#0f0f13] p-4 text-[0.68rem] leading-6 text-white/55 sm:text-xs"
            aria-label="Illustrative reconstructed Python conditional"
          >
            <code>
              <span className="block text-white/75">def check(number):</span>
              <LogicBranch active={activeBranch === "number == 0"}>
                {`    if number == 0:\n        return "Try again in September."`}
              </LogicBranch>
              <LogicBranch active={activeBranch === "number == 5"}>
                {`    elif number == 5:\n        return "Halfway there — keep going."`}
              </LogicBranch>
              <LogicBranch active={activeBranch === "number == 10"}>
                {`    elif number == 10:\n        return "You are Top."`}
              </LogicBranch>
              <LogicBranch active={activeBranch === "else"}>
                {`    else:\n        return fallback(number)`}
              </LogicBranch>
            </code>
          </pre>
        </article>

        <FlowConnector
          active={isProcessing || hasCompleted}
          label="Local result"
        />

        <motion.article
          id={resultId}
          key={phase}
          aria-busy={isBusy}
          initial={reduceMotion ? false : { opacity: 0.65, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
          className="min-w-0 rounded-[1.8rem] border border-white/10 bg-white/[0.025] p-5 motion-reduce:!transform-none sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-accent">
                03 · Response
              </p>
              <h4 className="mt-3 text-lg font-semibold text-white">
                Recreated result
              </h4>
            </div>
            <CheckCircle2
              className={cn(
                "h-5 w-5",
                hasCompleted ? "text-accent" : "text-white/20"
              )}
              aria-hidden="true"
            />
          </div>

          <p className="mt-5 text-[0.65rem] uppercase tracking-[0.16em] text-white/30">
            Generated locally
          </p>
          <div className="mt-4">
            <PhaseBadge phase={phase} />
          </div>
          <p className="mt-6 break-words text-base font-semibold leading-7 text-white">
            {visibleResult.title}
          </p>
          <p className="mt-3 break-words text-sm leading-7 text-white/55">
            {visibleResult.copy}
          </p>
          {hasCompleted ? (
            <p className="mt-6 border-t border-white/10 pt-4 text-[0.62rem] uppercase tracking-[0.16em] text-accent/75">
              {result.provenance}
            </p>
          ) : null}
        </motion.article>
      </div>
    </section>
  );
}
