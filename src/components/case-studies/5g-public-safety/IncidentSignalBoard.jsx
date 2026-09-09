"use client";

import { useId, useMemo, useReducer, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Bell,
  Building2,
  Car,
  CheckCircle2,
  CircleAlert,
  CircleDot,
  Filter,
  Layers3,
  Map as MapIcon,
  Network,
  RefreshCcw,
  Route,
  Search,
  Settings2,
  ShieldCheck,
  Signal,
  TriangleAlert,
  Unplug,
  Video,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  DEGRADED_MODES,
  EVIDENCE_BADGES,
  INCIDENT_DRILLS,
  OPERATING_CONDITIONS,
  SIGNAL_LAYERS,
  createInitialIncidentSignalState,
  deriveIncidentSignalBoard,
  incidentSignalReducer,
} from "./incidentSignalModel.mjs";

const STATUS_TONES = {
  available: {
    label: "Available",
    border: "border-accent/25",
    background: "bg-accent/[0.055]",
    text: "text-accent",
    dot: "bg-accent",
    icon: CheckCircle2,
  },
  conditional: {
    label: "Conditional",
    border: "border-amber-300/25",
    background: "bg-amber-300/[0.055]",
    text: "text-amber-100",
    dot: "bg-amber-300",
    icon: CircleAlert,
  },
  unavailable: {
    label: "Unavailable",
    border: "border-rose-300/25",
    background: "bg-rose-300/[0.05]",
    text: "text-rose-100",
    dot: "bg-rose-300",
    icon: Unplug,
  },
  "not-applicable": {
    label: "Not applicable",
    border: "border-white/10",
    background: "bg-white/[0.02]",
    text: "text-white/40",
    dot: "bg-white/25",
    icon: CircleDot,
  },
};

const DRILL_ICONS = {
  search: Search,
  building: Building2,
  road: Car,
};

const LAYER_ICONS = {
  instructions: Bell,
  video: Video,
  telemetry: Activity,
  asset: MapIcon,
};

const CONTROL_ORDER = [
  "sourceAvailability",
  "broadbandBackhaul",
  "applicationService",
  "authorizationPolicy",
  "partnerInterworking",
  "degradedMode",
];

function text(value, fallback = "Not specified") {
  if (Array.isArray(value)) {
    return value.map((item) => text(item, "")).filter(Boolean).join(" · ");
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (value && typeof value === "object") {
    return value.label ?? value.title ?? value.detail ?? fallback;
  }

  return fallback;
}

function drillTitle(drill) {
  return drill.shortTitle ?? drill.label ?? drill.title ?? drill.name;
}

function perspectiveTitle(perspective) {
  return perspective.label ?? perspective.title ?? perspective.name;
}

function feedTitle(feed) {
  return feed.label ?? feed.title ?? feed.name;
}

function recipientTitle(recipient) {
  return recipient.shortLabel ?? recipient.label ?? recipient.title ?? recipient.name;
}

function normalizeStatus(status) {
  return String(status?.id ?? status ?? "not-applicable")
    .toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-");
}

function statusTone(status) {
  return STATUS_TONES[normalizeStatus(status)] ?? STATUS_TONES["not-applicable"];
}

function StatusBadge({ status, compact = false }) {
  const styles = statusTone(status);
  const Icon = styles.icon;
  const suppliedLabel = typeof status === "object" ? status.label : null;

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-full border font-semibold uppercase",
        compact
          ? "px-2.5 py-1 text-[0.52rem] tracking-[0.1em]"
          : "px-3 py-1.5 text-[0.58rem] tracking-[0.13em]",
        styles.border,
        styles.background,
        styles.text,
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {suppliedLabel ?? styles.label}
    </span>
  );
}

function evidenceTone(badge) {
  const normalized = String(badge?.id ?? badge?.label ?? badge ?? "reconstruction").toLowerCase();

  if (normalized.includes("standard") || normalized.includes("current")) {
    return "border-cyan-300/25 bg-cyan-300/[0.055] text-cyan-100";
  }

  if (
    normalized.includes("paper") ||
    normalized.includes("original") ||
    normalized.includes("coursework")
  ) {
    return "border-accent/25 bg-accent/[0.05] text-accent";
  }

  return "border-amber-300/25 bg-amber-300/[0.05] text-amber-100";
}

function EvidenceBadge({ badge }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.12em]",
        evidenceTone(badge),
      )}
    >
      {text(badge, "Portfolio reconstruction")}
    </span>
  );
}

function iconForDrill(drill) {
  const id = drill.id.toLowerCase();
  const key = Object.keys(DRILL_ICONS).find((candidate) => id.includes(candidate));
  return key ? DRILL_ICONS[key] : Network;
}

function iconForLayer(layer) {
  const id = layer.id.toLowerCase();
  const key = Object.keys(LAYER_ICONS).find((candidate) => id.includes(candidate));
  return key ? LAYER_ICONS[key] : Layers3;
}

function DrillSelector({ activeId, onSelect }) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        Scenario drill
      </legend>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {INCIDENT_DRILLS.map((drill, index) => {
          const selected = activeId === drill.id;
          const Icon = iconForDrill(drill);

          return (
            <button
              key={drill.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(drill)}
              className={cn(
                "group flex min-h-20 min-w-0 items-center gap-4 rounded-[1.2rem] border px-4 py-4 text-left transition-colors motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f]",
                selected
                  ? "border-cyan-300/45 bg-cyan-300/[0.09]"
                  : "border-white/10 bg-white/[0.02] hover:border-cyan-300/30",
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                  selected
                    ? "border-cyan-200/45 bg-cyan-300 text-primary"
                    : "border-white/10 bg-black/15 text-white/35 group-hover:text-cyan-100",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.55rem] uppercase tracking-[0.13em] text-white/30">
                  Drill {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block text-sm font-semibold leading-5 text-white/75">
                  {drillTitle(drill)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function PerspectiveSelector({ perspectives, activeId, onSelect }) {
  const groupId = useId();

  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        View from
      </legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {perspectives.map((perspective) => {
          const id = `${groupId}-${perspective.id}`;
          const selected = activeId === perspective.id;

          return (
            <div key={perspective.id}>
              <input
                id={id}
                type="radio"
                name={groupId}
                value={perspective.id}
                checked={selected}
                onChange={() => onSelect(perspective)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors motion-reduce:transition-none sm:text-sm",
                  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#19191f]",
                  selected
                    ? "border-cyan-300 bg-cyan-300 text-primary"
                    : "border-white/15 bg-black/15 text-white/55 hover:border-cyan-300/35 hover:text-white",
                )}
              >
                {perspectiveTitle(perspective)}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function LayerFilters({ layers, enabledIds, onToggle }) {
  const groupId = useId();

  return (
    <fieldset>
      <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        <Filter className="h-4 w-4" aria-hidden="true" />
        Information layers
      </legend>
      <p className="mt-2 text-xs leading-5 text-white/30">
        Display filter only. Delivery logic and evidence remain unchanged.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {layers.map((layer) => {
          const id = `${groupId}-${layer.id}`;
          const enabled = enabledIds.includes(layer.id);
          const Icon = iconForLayer(layer);

          return (
            <div key={layer.id}>
              <input
                id={id}
                type="checkbox"
                checked={enabled}
                onChange={() => onToggle(layer)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2 text-xs font-semibold transition-colors motion-reduce:transition-none",
                  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#19191f]",
                  enabled
                    ? "border-cyan-300/35 bg-cyan-300/[0.08] text-cyan-50"
                    : "border-white/10 bg-black/10 text-white/35 hover:border-white/20 hover:text-white/60",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{layer.label ?? layer.title}</span>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function choiceDefinitions() {
  const raw = Array.isArray(OPERATING_CONDITIONS)
    ? OPERATING_CONDITIONS
    : Object.values(OPERATING_CONDITIONS);
  const byId = new Map(raw.map((definition) => [definition.id ?? definition.key, definition]));

  if (!byId.has("degradedMode")) {
    byId.set("degradedMode", {
      id: "degradedMode",
      label: "Degraded mode",
      description: "Inspect a documented or standards-context alternate path.",
      options: DEGRADED_MODES,
    });
  }

  return CONTROL_ORDER.map((id) => byId.get(id)).filter(Boolean);
}

function ControlGroup({ definition, value, onChange }) {
  const id = useId();
  const options = definition.options ?? definition.values ?? [];

  return (
    <fieldset className="min-w-0 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <legend className="px-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
        {definition.label ?? definition.title}
      </legend>
      {definition.description ? (
        <p className="mt-1 text-xs leading-5 text-white/30">{definition.description}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((rawOption) => {
          const sourceOption =
            typeof rawOption === "object"
              ? rawOption
              : { value: rawOption, label: String(rawOption) };
          const option = {
            ...sourceOption,
            value: sourceOption.value ?? sourceOption.id,
            label:
              sourceOption.shortLabel ??
              sourceOption.label ??
              String(sourceOption.value ?? sourceOption.id),
          };
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
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              <label
                htmlFor={optionId}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-[0.68rem] font-semibold transition-colors motion-reduce:transition-none",
                  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#19191f]",
                  selected
                    ? "border-amber-300/50 bg-amber-300/[0.12] text-amber-50"
                    : "border-white/10 bg-black/15 text-white/40 hover:border-amber-300/25 hover:text-white/70",
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

function OperatingControls({ operating, onChange }) {
  const definitions = choiceDefinitions();

  return (
    <section aria-labelledby="operating-controls-heading" className="mt-8 border-t border-white/10 pt-8">
      <div className="max-w-3xl">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100/75">
          <Settings2 className="h-4 w-4" aria-hidden="true" />
          Conditions & policy
        </p>
        <h3 id="operating-controls-heading" className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Change one coordination condition at a time.
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/50">
          Results describe information availability inside this deterministic
          reconstruction. An alternate path is never automatic and never proves
          operational readiness.
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {definitions.map((definition) => {
          const key = definition.id ?? definition.key;
          return (
            <ControlGroup
              key={key}
              definition={definition}
              value={operating[key]}
              onChange={(option) => onChange(definition, option)}
            />
          );
        })}
      </div>
    </section>
  );
}

function FeedButton({ feed, selected, onSelect }) {
  const layer = SIGNAL_LAYERS.find((item) => item.id === feed.layerId);
  const Icon = layer ? iconForLayer(layer) : Signal;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(feed)}
      className={cn(
        "group flex min-h-14 w-full min-w-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]",
        selected
          ? "border-cyan-300/45 bg-cyan-300/[0.1]"
          : "border-white/10 bg-black/15 hover:border-cyan-300/25",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
          selected
            ? "border-cyan-200/40 bg-cyan-300 text-primary"
            : "border-white/10 bg-white/[0.025] text-white/35 group-hover:text-cyan-100",
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold text-white/70">{feedTitle(feed)}</span>
        <span className="mt-1 block truncate text-[0.54rem] uppercase tracking-[0.11em] text-white/30">
          {layer?.label ?? feed.layerLabel ?? "Information feed"}
        </span>
      </span>
    </button>
  );
}

function RecipientButton({ recipient, delivery, selected, onSelect }) {
  const tone = statusTone(delivery?.statusId ?? delivery?.status);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(recipient)}
      className={cn(
        "group flex min-h-14 w-full min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition-colors motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]",
        selected
          ? cn(tone.border, tone.background)
          : "border-white/10 bg-black/15 hover:border-white/20",
      )}
    >
      <span className="min-w-0 truncate text-xs font-semibold text-white/65">
        {recipientTitle(recipient)}
      </span>
      <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", tone.dot)} aria-hidden="true" />
    </button>
  );
}

function AbstractSectorMap({
  drill,
  visibleFeeds,
  recipients,
  selectedFeed,
  selectedRecipient,
  selectedDelivery,
  matrix,
  onSelectFeed,
  onSelectRecipient,
  reduceMotion,
}) {
  const DrillIcon = iconForDrill(drill);
  const deliveryFor = (recipient) =>
    matrix.find(
      (cell) =>
        cell.feed.id === selectedFeed.id && cell.recipient.id === recipient.id,
    );
  const activeTone = statusTone(selectedDelivery.statusId ?? selectedDelivery.status);
  const selectedFeedVisible = visibleFeeds.some(
    (feed) => feed.id === selectedFeed.id,
  );

  return (
    <section aria-labelledby="incident-sector-map-heading" className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/70">
            Abstract incident-sector map
          </p>
          <h3 id="incident-sector-map-heading" className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Inspect a feed and its intended recipients.
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/50">
            Sectors and connectors are explanatory layout—not geography,
            coverage, accurate location, or a live emergency network.
          </p>
        </div>
        <StatusBadge status={selectedDelivery.statusId ?? selectedDelivery.status} />
      </div>

      {!selectedFeedVisible ? (
        <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/[0.035] p-4 text-xs leading-6 text-amber-100/70">
          The selected feed remains inspectable but is hidden from the map and
          matrix by the current information-layer filter.
        </p>
      ) : null}

      <div className="mt-6 grid min-w-0 gap-5 rounded-[1.7rem] border border-white/10 bg-[#111116] p-4 sm:p-6 lg:grid-cols-[minmax(12rem,0.85fr)_minmax(16rem,1.15fr)_minmax(12rem,0.85fr)] lg:items-center">
        <div className="min-w-0">
          <p className="mb-3 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-white/30">
            Information feeds
          </p>
          <div className="space-y-2">
            {visibleFeeds.map((feed) => (
              <FeedButton
                key={feed.id}
                feed={feed}
                selected={selectedFeed.id === feed.id}
                onSelect={onSelectFeed}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[25rem] overflow-hidden rounded-[1.6rem] border border-cyan-300/20 bg-cyan-950/[0.1] p-5">
          <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-55" aria-hidden="true">
            {["A", "B", "C", "D"].map((sector) => (
              <div key={sector} className="relative border border-cyan-100/[0.08]">
                <span className="absolute left-3 top-2 text-[0.52rem] uppercase tracking-[0.14em] text-cyan-100/25">
                  Sector {sector}
                </span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.12),transparent_56%)]" aria-hidden="true" />

          <motion.div
            key={`${drill.id}-${selectedFeed.id}-${selectedRecipient.id}`}
            initial={reduceMotion ? false : { opacity: 0.55, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 flex h-full flex-col items-center justify-center text-center motion-reduce:!transform-none"
          >
            <span
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-full border shadow-[0_0_55px_rgba(103,232,249,0.16)]",
                activeTone.border,
                activeTone.background,
                activeTone.text,
              )}
            >
              <DrillIcon className="h-8 w-8" aria-hidden="true" />
            </span>
            <p className="mt-5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/30">
              Selected signal path
            </p>
            <p className="mt-2 max-w-[15rem] text-sm font-semibold leading-6 text-white/75">
              {feedTitle(selectedFeed)} → {recipientTitle(selectedRecipient)}
            </p>
            <div className="mt-4">
              <StatusBadge status={selectedDelivery.statusId ?? selectedDelivery.status} compact />
            </div>
          </motion.div>
        </div>

        <div className="min-w-0">
          <p className="mb-3 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-white/30">
            Intended recipients
          </p>
          <div className="space-y-2">
            {recipients.map((recipient) => (
              <RecipientButton
                key={recipient.id}
                recipient={recipient}
                delivery={deliveryFor(recipient)}
                selected={selectedRecipient.id === recipient.id}
                onSelect={onSelectRecipient}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MatrixCell({ cell, selected, onSelect }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(cell)}
      className={cn(
        "flex min-h-11 w-full items-center justify-center rounded-lg border p-2 text-center transition-colors motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]",
        selected
          ? "border-cyan-300/45 bg-cyan-300/[0.08]"
          : "border-white/10 bg-black/10 hover:border-white/20",
      )}
    >
      <StatusBadge status={cell.statusId ?? cell.status} compact />
    </button>
  );
}

function DeliveryMatrix({
  feeds,
  recipients,
  matrix,
  selectedFeed,
  selectedRecipient,
  onSelectCell,
}) {
  const cellFor = (feed, recipient) =>
    matrix.find(
      (cell) => cell.feed.id === feed.id && cell.recipient.id === recipient.id,
    );

  return (
    <section aria-labelledby="delivery-matrix-heading" className="mt-8 border-t border-white/10 pt-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
          Feed-to-recipient matrix
        </p>
        <h3 id="delivery-matrix-heading" className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Availability depends on the complete information path.
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/50">
          Select any cell to inspect its first blocker, information loss, and
          explicitly configured alternate path.
        </p>
      </div>

      <div className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-white/10 md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">
            Information-feed availability for each intended recipient
          </caption>
          <thead className="bg-white/[0.035]">
            <tr>
              <th scope="col" className="w-[28%] border-b border-white/10 p-4 text-[0.58rem] uppercase tracking-[0.14em] text-white/35">
                Information feed
              </th>
              {recipients.map((recipient) => (
                <th
                  key={recipient.id}
                  scope="col"
                  className="border-b border-l border-white/10 p-3 text-center text-[0.58rem] uppercase leading-5 tracking-[0.1em] text-white/35"
                >
                  {recipientTitle(recipient)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feeds.map((feed) => (
              <tr key={feed.id} className="border-b border-white/10 last:border-b-0">
                <th scope="row" className="p-4 text-xs font-semibold leading-5 text-white/60">
                  {feedTitle(feed)}
                </th>
                {recipients.map((recipient) => {
                  const cell = cellFor(feed, recipient);
                  const selected =
                    selectedFeed.id === feed.id &&
                    selectedRecipient.id === recipient.id;
                  return (
                    <td key={recipient.id} className="border-l border-white/10 p-2">
                      <MatrixCell cell={cell} selected={selected} onSelect={onSelectCell} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-4 md:hidden">
        {feeds.map((feed) => (
          <article key={feed.id} className="rounded-[1.35rem] border border-white/10 bg-black/15 p-4">
            <h4 className="text-sm font-semibold text-white/70">{feedTitle(feed)}</h4>
            <dl className="mt-4 space-y-3">
              {recipients.map((recipient) => {
                const cell = cellFor(feed, recipient);
                const selected =
                  selectedFeed.id === feed.id &&
                  selectedRecipient.id === recipient.id;
                return (
                  <div key={recipient.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <dt className="text-xs leading-5 text-white/40">{recipientTitle(recipient)}</dt>
                    <dd>
                      <MatrixCell cell={cell} selected={selected} onSelect={onSelectCell} />
                    </dd>
                  </div>
                );
              })}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function SelectedFeedInspector({
  selectedFeed,
  selectedRecipient,
  selectedDelivery,
  alternatePaths,
  informationLoss,
}) {
  const layer = SIGNAL_LAYERS.find((item) => item.id === selectedFeed.layerId);
  const blockers = selectedDelivery.blockers ?? [];
  const activeAlternate = selectedDelivery.alternatePath;
  const alternatePath = activeAlternate?.detail ?? alternatePaths?.summary;
  const loss = selectedDelivery.informationLoss ?? informationLoss;

  return (
    <section aria-labelledby="selected-feed-heading" className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-[1.55rem] border border-cyan-300/20 bg-cyan-300/[0.035] p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/70">
            Selected feed inspector
          </p>
          <div className="flex flex-wrap gap-2">
            <EvidenceBadge badge={EVIDENCE_BADGES[selectedFeed.evidenceId]} />
            <EvidenceBadge
              badge={EVIDENCE_BADGES[selectedFeed.routeEvidenceId]}
            />
          </div>
        </div>
        <h3 id="selected-feed-heading" className="mt-4 text-2xl font-semibold text-white">
          {feedTitle(selectedFeed)}
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/55">
          {selectedFeed.payload}
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ["Information layer", layer?.label ?? selectedFeed.layerLabel],
            ["Selected recipient", recipientTitle(selectedRecipient)],
            ["Source role", selectedFeed.source],
            ["Current status", selectedDelivery.statusLabel ?? text(selectedDelivery.status)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-black/15 p-4">
              <dt className="text-[0.56rem] uppercase tracking-[0.13em] text-white/30">{label}</dt>
              <dd className="mt-2 text-xs leading-6 text-white/55">{text(value)}</dd>
            </div>
          ))}
        </dl>
      </article>

      <article className="rounded-[1.55rem] border border-white/10 bg-black/15 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            Delivery interpretation
          </p>
          <StatusBadge status={selectedDelivery.statusId ?? selectedDelivery.status} />
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[0.56rem] uppercase tracking-[0.13em] text-white/30">First blocker</p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {text(selectedDelivery.firstBlocker, "No blocker in the current reconstruction.")}
            </p>
          </div>

          {blockers.length > 1 ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {blockers.map((blocker) => (
                <li key={text(blocker)} className="flex items-start gap-2 rounded-xl border border-white/10 p-3 text-xs leading-5 text-white/45">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-100/70" aria-hidden="true" />
                  {text(blocker)}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.035] p-4">
            <div className="flex items-start gap-3">
              <Route className="mt-0.5 h-4 w-4 shrink-0 text-amber-100/70" aria-hidden="true" />
              <div>
                <p className="text-[0.56rem] uppercase tracking-[0.13em] text-amber-100/70">Configured alternate path</p>
                {activeAlternate ? (
                  <div className="mt-2">
                    <EvidenceBadge
                      badge={EVIDENCE_BADGES[activeAlternate.evidenceId]}
                    />
                  </div>
                ) : null}
                <p className="mt-2 text-xs leading-6 text-white/50">
                  {text(alternatePath, "No alternate path is configured for this delivery.")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[0.56rem] uppercase tracking-[0.13em] text-white/30">Information loss</p>
            <p className="mt-2 text-xs leading-6 text-white/50">
              {text(loss, "No information-loss note applies to the selected path.")}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

function WhatChanged({ whatChanged, standardsContext }) {
  const standards = Array.isArray(standardsContext)
    ? standardsContext
    : standardsContext
      ? [standardsContext]
      : [];

  return (
    <aside className="mt-6 rounded-[1.6rem] border border-accent/20 bg-accent/[0.035] p-5 sm:p-7">
      <div className="flex items-start gap-3">
        <Workflow className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">What changed?</p>
          <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">
            {whatChanged.title}
          </h3>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-white/55">
            {whatChanged.body ?? whatChanged.detail}
          </p>
          {whatChanged.caveat ? (
            <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-6 text-white/35">
              {whatChanged.caveat}
            </p>
          ) : null}
        </div>
      </div>

      {standards.length ? (
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex flex-wrap items-center gap-3">
            <EvidenceBadge badge={EVIDENCE_BADGES.current} />
            <p className="text-[0.58rem] uppercase tracking-[0.13em] text-white/30">
              Context—not original coursework evidence
            </p>
          </div>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {standards.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.025] p-4"
              >
                <p className="text-xs font-semibold text-cyan-100/70">
                  {item.label}
                </p>
                <p className="mt-2 text-xs leading-6 text-white/45">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

export default function IncidentSignalBoard() {
  const reduceMotion = useReducedMotion();
  const [state, dispatch] = useReducer(
    incidentSignalReducer,
    undefined,
    createInitialIncidentSignalState,
  );
  const [announcement, setAnnouncement] = useState("");
  const derived = useMemo(() => deriveIncidentSignalBoard(state), [state]);
  const {
    drill,
    perspective,
    perspectives,
    recipients,
    visibleFeeds,
    visibleMatrix,
    selectedFeed,
    selectedRecipient,
    selectedDelivery,
    alternatePaths,
    informationLoss,
    whatChanged,
    standardsContext,
    operating,
  } = derived;

  const applyAction = (action, message) => {
    dispatch(action);
    setAnnouncement(message);
  };

  const selectDrill = (nextDrill) => {
    applyAction(
      { type: "select-drill", drillId: nextDrill.id },
      `${drillTitle(nextDrill)} selected. Board filters and operating conditions retain their modeled values.`,
    );
  };

  const selectPerspective = (nextPerspective) => {
    applyAction(
      { type: "select-perspective", perspectiveId: nextPerspective.id },
      `${perspectiveTitle(nextPerspective)} perspective selected.`,
    );
  };

  const toggleLayer = (layer) => {
    const nextState = incidentSignalReducer(state, {
      type: "toggle-layer",
      layerId: layer.id,
    });
    const remainsEnabled = nextState.enabledLayerIds.includes(layer.id);
    const unchanged = nextState === state;
    dispatch({ type: "toggle-layer", layerId: layer.id });
    setAnnouncement(
      unchanged
        ? `${layer.label} remains visible because at least one information layer is required.`
        : `${layer.label} ${remainsEnabled ? "shown" : "hidden"}. Delivery logic is unchanged.`,
    );
  };

  const changeOperatingCondition = (definition, option) => {
    const condition = definition.id ?? definition.key;
    const action = {
      type: "set-operating-condition",
      condition,
      value: option.value,
    };
    const nextDerived = deriveIncidentSignalBoard(incidentSignalReducer(state, action));
    dispatch(action);
    setAnnouncement(
      `${definition.label ?? definition.title} set to ${option.label}. ${nextDerived.whatChanged.title}.`,
    );
  };

  const selectFeed = (feed) => {
    applyAction(
      { type: "select-feed", feedId: feed.id },
      `${feedTitle(feed)} selected for inspection.`,
    );
  };

  const selectRecipient = (recipient) => {
    const action = { type: "select-recipient", recipientId: recipient.id };
    const nextDerived = deriveIncidentSignalBoard(incidentSignalReducer(state, action));
    dispatch(action);
    setAnnouncement(
      `${recipientTitle(recipient)} selected. ${nextDerived.selectedDelivery.statusLabel ?? text(nextDerived.selectedDelivery.status)}.`,
    );
  };

  const selectCell = (cell) => {
    const feedAction = { type: "select-feed", feedId: cell.feed.id };
    const recipientAction = {
      type: "select-recipient",
      recipientId: cell.recipient.id,
    };
    dispatch(feedAction);
    dispatch(recipientAction);
    setAnnouncement(
      `${feedTitle(cell.feed)} to ${recipientTitle(cell.recipient)} selected. ${cell.statusLabel ?? text(cell.status)}.`,
    );
  };

  const resetBoard = () => {
    dispatch({ type: "reset" });
    setAnnouncement("Incident Signal Board reset to its default drill and operating conditions.");
  };

  return (
    <div
      id="incident-signal-board"
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
              Interactive portfolio reconstruction of public-safety information
              coordination. It does not connect to an emergency network,
              responder, UAV, camera, sensor, vehicle or location service.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={resetBoard}
          className="min-h-11 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f]"
        >
          <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Reset board
        </Button>
      </div>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      <div className="mt-8">
        <DrillSelector activeId={state.drillId} onSelect={selectDrill} />
      </div>

      <section aria-labelledby="active-drill-heading" className="mt-8 border-t border-white/10 pt-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/70">
                Active coordination drill
              </p>
              <EvidenceBadge badge={EVIDENCE_BADGES[drill.evidenceId]} />
            </div>
            <h3 id="active-drill-heading" className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              {drill.title ?? drillTitle(drill)}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/55">
              {drill.summary ?? drill.description}
            </p>
          </div>
          <PerspectiveSelector
            perspectives={perspectives}
            activeId={perspective.id}
            onSelect={selectPerspective}
          />
        </div>
      </section>

      <div className="mt-8">
        <LayerFilters
          layers={SIGNAL_LAYERS}
          enabledIds={state.enabledLayerIds}
          onToggle={toggleLayer}
        />
      </div>

      <OperatingControls operating={operating} onChange={changeOperatingCondition} />

      <AbstractSectorMap
        drill={drill}
        visibleFeeds={visibleFeeds}
        recipients={recipients}
        selectedFeed={selectedFeed}
        selectedRecipient={selectedRecipient}
        selectedDelivery={selectedDelivery}
        matrix={derived.matrix}
        onSelectFeed={selectFeed}
        onSelectRecipient={selectRecipient}
        reduceMotion={reduceMotion}
      />

      <DeliveryMatrix
        feeds={visibleFeeds}
        recipients={recipients}
        matrix={visibleMatrix}
        selectedFeed={selectedFeed}
        selectedRecipient={selectedRecipient}
        onSelectCell={selectCell}
      />

      <SelectedFeedInspector
        selectedFeed={selectedFeed}
        selectedRecipient={selectedRecipient}
        selectedDelivery={selectedDelivery}
        alternatePaths={alternatePaths}
        informationLoss={informationLoss}
      />

      <WhatChanged whatChanged={whatChanged} standardsContext={standardsContext} />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {Object.values(derived.evidenceBadges).map((badge) => (
          <div key={badge.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <EvidenceBadge badge={badge} />
            {badge.description ? (
              <p className="mt-3 text-xs leading-6 text-white/40">{badge.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
