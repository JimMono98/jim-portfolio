"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  GitCompareArrows,
  Minus,
  Play,
  Plus,
  RotateCcw,
  Square,
  Vibrate,
  Waves,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import {
  HAPTIC_PRESETS,
  MAX_ACTIVE_MS,
  MAX_PATTERN_SEGMENTS,
  MAX_PAUSE_MS,
  MAX_PULSE_MS,
  MAX_TOTAL_MS,
  MIN_PAUSE_MS,
  MIN_PULSE_MS,
  analyzePattern,
  comparePatterns,
  describePattern,
  validatePattern,
} from "./hapticPatternModel.mjs";

const DEFAULT_CUSTOM_DRAFT = ["120", "80", "120"];

function presetById(id) {
  return HAPTIC_PRESETS.find((preset) => preset.id === id);
}

function numericPattern(draft) {
  return draft.map((value) =>
    value === "" || value === "-" ? Number.NaN : Number(value),
  );
}

function patternDescription(pattern) {
  return pattern
    .map((duration, index) =>
      index % 2 === 0
        ? duration + " millisecond pulse"
        : duration + " millisecond pause",
    )
    .join(", ");
}

function PatternTimeline({
  analysis,
  label,
  activeSegment = -1,
  progress = 0,
  reduceMotion,
}) {
  return (
    <div>
      <div
        role="img"
        aria-label={label + ": " + patternDescription(analysis.pattern)}
        className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/20 p-3 sm:p-4"
      >
        <div
          className="grid h-20 min-w-0 overflow-hidden rounded-lg"
          style={{
            gridTemplateColumns: analysis.pattern
              .map((duration) => "minmax(0, " + duration + "fr)")
              .join(" "),
          }}
        >
          {analysis.timeline.map((segment) => {
            const isPulse = segment.type === "pulse";
            const isActive = activeSegment === segment.index;

            return (
              <div
                key={segment.index}
                title={segment.label + ": " + segment.durationMs + "ms"}
                className={cn(
                  "relative min-w-0 overflow-hidden border-y border-r transition-colors first:border-l motion-reduce:transition-none",
                  isPulse
                    ? "border-accent/45 bg-accent/20"
                    : "border-dashed border-cyan-100/25 bg-cyan-100/[0.025]",
                  isActive &&
                    (isPulse
                      ? "border-accent bg-accent/70"
                      : "border-cyan-100/70 bg-cyan-100/15"),
                )}
                aria-hidden="true"
              >
                {segment.widthPercent >= 8 ? (
                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-2 truncate px-0.5 text-center text-[0.55rem] font-semibold",
                      isPulse ? "text-white/65" : "text-cyan-50/45",
                    )}
                  >
                    {segment.durationMs}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        {!reduceMotion && progress > 0 ? (
          <span
            className="pointer-events-none absolute bottom-2 top-2 w-px bg-white/75 shadow-[0_0_12px_rgba(255,255,255,0.65)]"
            style={{ left: Math.min(progress * 100, 100) + "%" }}
            aria-hidden="true"
          />
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.62rem] uppercase tracking-[0.14em] text-white/35">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-sm bg-accent/60"
            aria-hidden="true"
          />
          Pulse
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-sm border border-dashed border-cyan-100/45"
            aria-hidden="true"
          />
          Pause
        </span>
        <span className="ml-auto normal-case tracking-normal text-white/30">
          Width represents duration, not intensity.
        </span>
      </div>
    </div>
  );
}

function PatternStats({ analysis }) {
  const stats = [
    ["Pulses", analysis.pulseCount],
    ["Active", analysis.activeMs + "ms"],
    ["Paused", analysis.pauseMs + "ms"],
    ["Total", analysis.totalMs + "ms"],
    ["Active ratio", Math.round(analysis.activeRatio * 100) + "%"],
    ["Pulse density", analysis.rhythmDensity.toFixed(1) + "/s"],
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stats.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
        >
          <dt className="text-[0.6rem] uppercase tracking-[0.14em] text-white/35">
            {label}
          </dt>
          <dd className="mt-2 text-sm font-semibold text-white/75">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StatusPanel({
  support,
  deviceEnabled,
  visible,
  requestState,
  onToggleDevice,
}) {
  let icon = Waves;
  let tone = "border-white/10 bg-white/[0.025] text-white/65";
  let title = "Checking Vibration API";
  let detail = "Visual simulation remains available.";

  if (support === "unsupported") {
    icon = XCircle;
    tone = "border-amber-200/20 bg-amber-200/[0.04] text-amber-100/80";
    title = "Unsupported · Visual simulation available";
    detail = "This browser does not expose navigator.vibrate().";
  } else if (support === "checking") {
    // Preserve the initial checking state until client-side feature detection runs.
  } else if (!visible) {
    icon = AlertTriangle;
    tone = "border-amber-200/20 bg-amber-200/[0.04] text-amber-100/80";
    title = "Visual simulation · Page is not visible";
    detail =
      "The active request was stopped and will not resume automatically.";
  } else if (!deviceEnabled) {
    icon = Waves;
    title = "Visual simulation · Device vibration is off";
    detail =
      "Enable device output, then press Play to request physical vibration.";
  } else if (requestState === "requested") {
    icon = Vibrate;
    tone = "border-accent/25 bg-accent/[0.055] text-accent";
    title = "Real device vibration requested";
    detail = "The browser accepted the request; visual timing is synchronized.";
  } else if (requestState === "blocked") {
    icon = AlertTriangle;
    tone = "border-amber-200/20 bg-amber-200/[0.04] text-amber-100/80";
    title = "Visual simulation · Request blocked or unavailable";
    detail = "The browser did not accept device output for this request.";
  } else if (support === "supported") {
    icon = CheckCircle2;
    tone = "border-cyan-200/20 bg-cyan-200/[0.04] text-cyan-100/80";
    title = "Vibration API available · Play to request device vibration";
    detail = "Acceptance cannot confirm hardware output or physical sensation.";
  }

  const Icon = icon;

  return (
    <div className={cn("rounded-[1.6rem] border p-5 sm:p-6", tone)}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="rounded-xl border border-current/20 bg-black/10 p-2.5">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">
              {title}
            </p>
            <p className="mt-2 text-xs leading-5 text-white/45">{detail}</p>
          </div>
        </div>
        <label
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center gap-3 rounded-full border border-white/15 bg-black/10 px-4 py-2 text-xs font-semibold text-white/65",
            support === "unsupported"
              ? "cursor-not-allowed opacity-55"
              : "cursor-pointer",
          )}
        >
          <span>Use device vibration</span>
          <input
            type="checkbox"
            checked={deviceEnabled}
            onChange={(event) => onToggleDevice(event.target.checked)}
            disabled={support !== "supported"}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="relative h-6 w-11 rounded-full bg-white/15 transition-colors peer-checked:bg-accent peer-checked:[&>span]:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#19191f] motion-reduce:transition-none"
          >
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform motion-reduce:transition-none" />
          </span>
        </label>
      </div>
    </div>
  );
}

function PresetChoices({ selectedId, onSelect }) {
  const groupId = useId();

  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        Playable presets
      </legend>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {HAPTIC_PRESETS.map((preset) => {
          const id = groupId + "-" + preset.id;
          const selected = selectedId === preset.id;
          return (
            <div key={preset.id}>
              <input
                id={id}
                type="radio"
                name={groupId}
                value={preset.id}
                checked={selected}
                onChange={() => onSelect(preset.id)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "flex min-h-24 cursor-pointer flex-col justify-between rounded-[1.2rem] border p-4 transition-colors motion-reduce:transition-none",
                  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#19191f]",
                  selected
                    ? "border-accent bg-accent/[0.08]"
                    : "border-white/10 bg-white/[0.025] hover:border-accent/40",
                )}
              >
                <span className="text-sm font-semibold text-white">
                  {preset.label}
                </span>
                <span className="mt-3 flex items-center justify-between gap-3">
                  <code className="text-[0.65rem] text-white/40">
                    [{preset.pattern.join(", ")}]
                  </code>
                  <span
                    className={cn(
                      "text-[0.55rem] uppercase tracking-[0.11em]",
                      preset.source === "Original coursework"
                        ? "text-accent"
                        : "text-amber-100/65",
                    )}
                  >
                    {preset.source === "Original coursework"
                      ? "Coursework"
                      : "Portfolio"}
                  </span>
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function PatternComposer({
  draft,
  validation,
  selected,
  onChange,
  onAddPair,
  onRemovePair,
  onUse,
  onReset,
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/75">
            Custom composer
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-white/40">
            Add pulse–pause pairs while keeping an odd-length sequence. All
            values are local, bounded, and one-shot.
          </p>
        </div>
        {selected ? (
          <span className="rounded-full border border-accent/30 bg-accent/[0.07] px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-accent">
            Active pattern
          </span>
        ) : null}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {draft.map((value, index) => {
          const isPulse = index % 2 === 0;
          const minimum = isPulse ? MIN_PULSE_MS : MIN_PAUSE_MS;
          const maximum = isPulse ? MAX_PULSE_MS : MAX_PAUSE_MS;
          return (
            <div key={index}>
              <label
                htmlFor={"haptic-segment-" + index}
                className="text-xs font-medium text-white/60"
              >
                {isPulse
                  ? "Pulse " + (index / 2 + 1)
                  : "Pause " + (index + 1) / 2}
              </label>
              <div className="relative mt-2">
                <Input
                  id={"haptic-segment-" + index}
                  type="number"
                  inputMode="numeric"
                  min={minimum}
                  max={maximum}
                  step="1"
                  value={value}
                  onChange={(event) => onChange(index, event.target.value)}
                  aria-invalid={!validation.valid ? "true" : undefined}
                  className="h-12 rounded-xl border-white/15 bg-black/15 pr-12 text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f]"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">
                  ms
                </span>
              </div>
              <p className="mt-2 text-[0.6rem] text-white/30">
                {minimum}–{maximum}ms
              </p>
            </div>
          );
        })}
      </div>
      {!validation.valid ? (
        <p role="alert" className="mt-4 text-sm leading-6 text-rose-200">
          {validation.error}
        </p>
      ) : (
        <p className="mt-4 text-xs leading-5 text-white/35">
          Maximum {MAX_PATTERN_SEGMENTS} segments, {MAX_TOTAL_MS}ms total, and{" "}
          {MAX_ACTIVE_MS}ms active vibration.
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onAddPair}
          disabled={draft.length >= MAX_PATTERN_SEGMENTS}
          className="min-h-11 focus-visible:ring-accent focus-visible:ring-offset-[#19191f]"
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add pause + pulse
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onRemovePair}
          disabled={draft.length <= 1}
          className="min-h-11 focus-visible:ring-accent focus-visible:ring-offset-[#19191f]"
        >
          <Minus className="mr-2 h-4 w-4" aria-hidden="true" />
          Remove pair
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="min-h-11 focus-visible:ring-accent focus-visible:ring-offset-[#19191f]"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Reset
        </Button>
        <Button
          type="button"
          onClick={onUse}
          disabled={!validation.valid}
          className="min-h-11 focus-visible:ring-accent focus-visible:ring-offset-[#19191f]"
        >
          Use custom pattern
        </Button>
      </div>
    </div>
  );
}

function PlaybackButtons({ playing, onPlay, onStop, label = "Play pattern" }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        type="button"
        size="lg"
        onClick={onPlay}
        className="min-h-12 w-full focus-visible:ring-accent focus-visible:ring-offset-[#19191f] sm:w-auto"
      >
        <Play className="mr-2 h-4 w-4" aria-hidden="true" />
        {label}
      </Button>
      <Button
        type="button"
        size="lg"
        variant="outline"
        onClick={onStop}
        disabled={!playing}
        className="min-h-12 w-full focus-visible:ring-accent focus-visible:ring-offset-[#19191f] sm:w-auto"
      >
        <Square className="mr-2 h-4 w-4" aria-hidden="true" />
        Stop
      </Button>
    </div>
  );
}

export default function HapticPatternStudio() {
  const reduceMotion = useReducedMotion();
  const animationFrameRef = useRef(null);
  const playbackTokenRef = useRef(0);
  const [support, setSupport] = useState("checking");
  const [visible, setVisible] = useState(true);
  const [deviceEnabled, setDeviceEnabled] = useState(false);
  const [requestState, setRequestState] = useState("idle");
  const [selectedId, setSelectedId] = useState("coursework-double-pulse");
  const [customDraft, setCustomDraft] = useState(DEFAULT_CUSTOM_DRAFT);
  const [tab, setTab] = useState("studio");
  const [playing, setPlaying] = useState(false);
  const [playingKey, setPlayingKey] = useState("");
  const [activeSegment, setActiveSegment] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [compareAId, setCompareAId] = useState("coursework-double-pulse");
  const [compareBId, setCompareBId] = useState("confirmation");

  const customPattern = useMemo(
    () => numericPattern(customDraft),
    [customDraft],
  );
  const customValidation = useMemo(
    () => validatePattern(customPattern),
    [customPattern],
  );
  const selectedPreset = presetById(selectedId);
  const selectedPattern =
    selectedId === "custom" ? customPattern : selectedPreset.pattern;
  const selectedLabel =
    selectedId === "custom" ? "Custom pattern" : selectedPreset.label;
  const selectedValidation = validatePattern(selectedPattern);
  const selectedAnalysis = selectedValidation.valid
    ? analyzePattern(selectedPattern)
    : null;
  const selectedDescription = selectedValidation.valid
    ? describePattern(selectedPattern)
    : null;

  const compareA = presetById(compareAId);
  const compareB = presetById(compareBId);
  const comparison = comparePatterns(compareA.pattern, compareB.pattern);

  const stopPlayback = useCallback((message = "", nextState = "idle") => {
    playbackTokenRef.current += 1;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      try {
        navigator.vibrate(0);
      } catch {
        // The synchronized visual state still stops when device cancellation fails.
      }
    }
    setPlaying(false);
    setPlayingKey("");
    setActiveSegment(-1);
    setProgress(0);
    setRequestState(nextState);
    if (message) {
      setAnnouncement(message);
    }
  }, []);

  const playPattern = useCallback(
    (pattern, label, key) => {
      const validation = validatePattern(pattern);
      if (!validation.valid) {
        stopPlayback("Pattern rejected. " + validation.error, "blocked");
        return;
      }

      stopPlayback();
      const analysis = analyzePattern(pattern);
      let state = "visual";

      if (deviceEnabled) {
        if (
          support === "supported" &&
          typeof document !== "undefined" &&
          document.visibilityState === "visible"
        ) {
          try {
            state =
              navigator.vibrate(pattern) === true ? "requested" : "blocked";
          } catch {
            state = "blocked";
          }
        } else {
          state = "blocked";
        }
      }

      setRequestState(state);
      setPlaying(true);
      setPlayingKey(key);
      setActiveSegment(0);
      setProgress(0);

      const token = playbackTokenRef.current;
      const startedAt = performance.now();

      const tick = (now) => {
        if (token !== playbackTokenRef.current) {
          return;
        }
        const elapsed = Math.min(now - startedAt, analysis.totalMs);
        const segment =
          analysis.timeline.find(
            (item) => elapsed >= item.startMs && elapsed < item.endMs,
          ) ?? analysis.timeline[analysis.timeline.length - 1];

        setActiveSegment(segment.index);
        setProgress(reduceMotion ? 0 : elapsed / analysis.totalMs);

        if (elapsed < analysis.totalMs) {
          animationFrameRef.current = requestAnimationFrame(tick);
        } else {
          animationFrameRef.current = null;
          setPlaying(false);
          setPlayingKey("");
          setActiveSegment(-1);
          setProgress(0);
        }
      };

      animationFrameRef.current = requestAnimationFrame(tick);
      setAnnouncement(
        label +
          " started. " +
          (state === "requested"
            ? "Device vibration requested and visual timeline active."
            : "Visual simulation active; physical vibration was not requested or accepted."),
      );
    },
    [deviceEnabled, reduceMotion, stopPlayback, support],
  );

  useEffect(() => {
    const available =
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function";
    setSupport(available ? "supported" : "unsupported");
    setVisible(
      typeof document === "undefined" || document.visibilityState === "visible",
    );
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      const isVisible = document.visibilityState === "visible";
      setVisible(isVisible);
      if (!isVisible) {
        stopPlayback(
          "Playback stopped because the page is no longer visible.",
          "hidden",
        );
      }
    };
    const handlePageHide = () => {
      stopPlayback("", "hidden");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
      stopPlayback();
    };
  }, [stopPlayback]);

  const choosePreset = (id) => {
    stopPlayback();
    setSelectedId(id);
    setAnnouncement(presetById(id).label + " selected.");
  };

  const updateCustom = (index, value) => {
    stopPlayback();
    setCustomDraft((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  };

  const addPair = () => {
    stopPlayback();
    setCustomDraft((current) =>
      current.length <= MAX_PATTERN_SEGMENTS - 2
        ? [...current, "80", "120"]
        : current,
    );
  };

  const removePair = () => {
    stopPlayback();
    setCustomDraft((current) =>
      current.length > 1 ? current.slice(0, -2) : current,
    );
  };

  const resetCustom = () => {
    stopPlayback();
    setCustomDraft(DEFAULT_CUSTOM_DRAFT);
    setAnnouncement("Custom pattern reset.");
  };

  const useCustom = () => {
    if (!customValidation.valid) {
      setAnnouncement("Custom pattern rejected. " + customValidation.error);
      return;
    }
    stopPlayback();
    setSelectedId("custom");
    setAnnouncement("Valid custom pattern selected.");
  };

  const toggleDevice = (enabled) => {
    if (!enabled) {
      stopPlayback(
        "Device vibration disabled. Visual simulation remains available.",
      );
    }
    setDeviceEnabled(enabled);
    if (enabled) {
      setRequestState("idle");
      setAnnouncement(
        "Device vibration enabled. Press Play to request physical output.",
      );
    }
  };

  const changeTab = (value) => {
    stopPlayback();
    setTab(value);
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#19191f] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:p-6 lg:p-8">
      <div className="rounded-[1.6rem] border border-amber-200/20 bg-amber-200/[0.04] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-100/75"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/75">
              Interactive portfolio reconstruction
            </p>
            <p className="mt-3 text-sm leading-7 text-white/55">
              All processing stays in this browser. No network, storage,
              telemetry, sensor readout, or hardware confirmation is used.
              Device vibration is optional and defaults off.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <StatusPanel
          support={support}
          deviceEnabled={deviceEnabled}
          visible={visible}
          requestState={requestState}
          onToggleDevice={toggleDevice}
        />
      </div>

      <Tabs value={tab} onValueChange={changeTab} className="mt-6">
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-[1.2rem] border border-white/10 bg-black/15 p-1.5">
          <TabsTrigger
            value="studio"
            className="min-h-11 rounded-xl px-3 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-accent data-[state=active]:bg-accent data-[state=active]:text-primary sm:text-sm"
          >
            <Vibrate className="mr-2 h-4 w-4" aria-hidden="true" />
            Pattern Studio
          </TabsTrigger>
          <TabsTrigger
            value="compare"
            className="min-h-11 rounded-xl px-3 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-accent data-[state=active]:bg-accent data-[state=active]:text-primary sm:text-sm"
          >
            <GitCompareArrows className="mr-2 h-4 w-4" aria-hidden="true" />
            A/B Compare
          </TabsTrigger>
        </TabsList>

        <TabsContent value="studio" className="mt-7 min-h-0 space-y-7">
          <PresetChoices selectedId={selectedId} onSelect={choosePreset} />

          <PatternComposer
            draft={customDraft}
            validation={customValidation}
            selected={selectedId === "custom"}
            onChange={updateCustom}
            onAddPair={addPair}
            onRemovePair={removePair}
            onUse={useCustom}
            onReset={resetCustom}
          />

          {selectedAnalysis ? (
            <div className="rounded-[1.7rem] border border-white/10 bg-[#111116] p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">
                    Active pattern
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                    {selectedLabel}
                  </h3>
                  <code className="mt-2 block text-xs text-white/35">
                    [{selectedPattern.join(", ")}]
                  </code>
                </div>
                <PlaybackButtons
                  playing={playing && playingKey === "active"}
                  onPlay={() =>
                    playPattern(selectedPattern, selectedLabel, "active")
                  }
                  onStop={() => stopPlayback("Playback stopped.")}
                />
              </div>
              <div className="mt-7">
                <PatternTimeline
                  analysis={selectedAnalysis}
                  label={selectedLabel}
                  activeSegment={playingKey === "active" ? activeSegment : -1}
                  progress={playingKey === "active" ? progress : 0}
                  reduceMotion={reduceMotion}
                />
              </div>
              <div className="mt-5">
                <PatternStats analysis={selectedAnalysis} />
              </div>
            </div>
          ) : null}

          {selectedDescription ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-cyan-200/20 bg-cyan-200/[0.035] p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">
                  Why this may feel different
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {selectedDescription.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/55">
                  {selectedDescription.why}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-accent/20 bg-accent/[0.04] p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-accent">
                  Where it may make sense
                </p>
                <p className="mt-4 text-sm leading-7 text-white/55">
                  {selectedDescription.where}
                </p>
                <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-6 text-white/35">
                  {selectedDescription.caveat}
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                Documented · not replayed
              </p>
              <p className="mt-3 font-semibold text-white">
                Long vibration · 10,000ms
              </p>
              <p className="mt-2 text-xs leading-5 text-white/40">
                Preserved as coursework evidence; outside this Studio’s safe
                duration.
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                Documented · not replayed
              </p>
              <p className="mt-3 font-semibold text-white">
                Shake + vibration · 5,000ms
              </p>
              <p className="mt-2 text-xs leading-5 text-white/40">
                The original combined visual and tactile example remains
                separate evidence.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="mt-7 min-h-0 space-y-7">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["Pattern A", compareAId, setCompareAId, compareA, "compare-a"],
              ["Pattern B", compareBId, setCompareBId, compareB, "compare-b"],
            ].map(([label, value, setter, preset, key]) => {
              const analysis = analyzePattern(preset.pattern);
              return (
                <article
                  key={label}
                  className="min-w-0 rounded-[1.7rem] border border-white/10 bg-[#111116] p-5 sm:p-6"
                >
                  <label
                    htmlFor={"compare-" + key}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45"
                  >
                    {label}
                  </label>
                  <select
                    id={"compare-" + key}
                    value={value}
                    onChange={(event) => {
                      stopPlayback();
                      setter(event.target.value);
                    }}
                    className="mt-3 min-h-12 w-full rounded-xl border border-white/15 bg-[#19191f] px-4 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]"
                  >
                    {HAPTIC_PRESETS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-5">
                    <PatternTimeline
                      analysis={analysis}
                      label={label + ", " + preset.label}
                      activeSegment={playingKey === key ? activeSegment : -1}
                      progress={playingKey === key ? progress : 0}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                  <div className="mt-5">
                    <PatternStats analysis={analysis} />
                  </div>
                  <div className="mt-5">
                    <PlaybackButtons
                      playing={playing && playingKey === key}
                      label={"Play " + label}
                      onPlay={() =>
                        playPattern(preset.pattern, preset.label, key)
                      }
                      onStop={() => stopPlayback("Playback stopped.")}
                    />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="rounded-[1.7rem] border border-accent/20 bg-accent/[0.04] p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Calculated Pattern Anatomy
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              {comparison.samePattern
                ? "The selected patterns are identical."
                : "The same timing model reveals their structural difference."}
            </h3>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {comparison.observations.map((observation) => (
                <li
                  key={observation}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-white/55"
                >
                  <CheckCircle2
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {observation}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-6 text-white/35">
              A/B playback is sequential because a new navigator.vibrate()
              request replaces the previous pattern. Timing differences may feel
              different, but this browser model cannot measure sensation.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
