// Pure, browser-independent timing model for the portfolio reconstruction.
export const MIN_PATTERN_SEGMENTS = 1;
export const MAX_PATTERN_SEGMENTS = 9;
export const MIN_PULSE_MS = 20;
export const MAX_PULSE_MS = 500;
export const MIN_PAUSE_MS = 20;
export const MAX_PAUSE_MS = 1000;
export const MAX_TOTAL_MS = 3000;
export const MAX_ACTIVE_MS = 1500;

function freezePreset(preset) {
  return Object.freeze({
    ...preset,
    pattern: Object.freeze([...preset.pattern]),
  });
}

export const HAPTIC_PRESETS = Object.freeze(
  [
    {
      id: "coursework-double-pulse",
      label: "Coursework Double Pulse",
      source: "Original coursework",
      pattern: [200, 100, 200],
      use: "Two documented 200 ms pulses separated by a 100 ms pause.",
    },
    {
      id: "coursework-short-pulse",
      label: "Coursework Short Pulse",
      source: "Original coursework",
      pattern: [200],
      use: "The documented short, single-pulse control.",
    },
    {
      id: "tap",
      label: "Tap",
      source: "Portfolio reconstruction",
      pattern: [40],
      use: "A compact acknowledgement candidate, not a standardized semantic mapping.",
    },
    {
      id: "confirmation",
      label: "Confirmation",
      source: "Portfolio reconstruction",
      pattern: [60, 50, 100],
      use: "A short two-part sequence that may complement a visible confirmation.",
    },
    {
      id: "warning",
      label: "Warning",
      source: "Portfolio reconstruction",
      pattern: [120, 80, 120],
      use: "A separated repeat that may reinforce a visible warning state.",
    },
    {
      id: "error",
      label: "Error",
      source: "Portfolio reconstruction",
      pattern: [160, 70, 160, 70, 220],
      use: "A longer three-part sequence that may accompany a visible error state.",
    },
  ].map(freezePreset),
);

function validationResult(errors) {
  return {
    valid: errors.length === 0,
    error: errors[0] ?? "",
    errors,
  };
}

export function validatePattern(pattern) {
  if (!Array.isArray(pattern)) {
    return validationResult(["A pattern must be an array of durations."]);
  }

  const errors = [];

  if (
    pattern.length < MIN_PATTERN_SEGMENTS ||
    pattern.length > MAX_PATTERN_SEGMENTS
  ) {
    errors.push(
      `Use between ${MIN_PATTERN_SEGMENTS} and ${MAX_PATTERN_SEGMENTS} segments.`,
    );
  }

  if (pattern.length % 2 === 0) {
    errors.push("A pattern must begin and end with a pulse.");
  }

  let activeMs = 0;
  let totalMs = 0;
  let everyDurationIsValidNumber = true;

  for (let index = 0; index < pattern.length; index += 1) {
    const duration = pattern[index];
    const isPulse = index % 2 === 0;
    const segmentLabel = isPulse ? "Pulse" : "Pause";

    if (!Number.isSafeInteger(duration)) {
      errors.push(`${segmentLabel} ${index + 1} must be a whole number.`);
      everyDurationIsValidNumber = false;
      continue;
    }

    const minimum = isPulse ? MIN_PULSE_MS : MIN_PAUSE_MS;
    const maximum = isPulse ? MAX_PULSE_MS : MAX_PAUSE_MS;

    if (duration < minimum || duration > maximum) {
      errors.push(
        `${segmentLabel} ${index + 1} must be between ${minimum} and ${maximum} ms.`,
      );
    }

    totalMs += duration;

    if (isPulse) {
      activeMs += duration;
    }
  }

  if (everyDurationIsValidNumber && totalMs > MAX_TOTAL_MS) {
    errors.push(`Keep the complete pattern within ${MAX_TOTAL_MS} ms.`);
  }

  if (everyDurationIsValidNumber && activeMs > MAX_ACTIVE_MS) {
    errors.push(`Keep active vibration time within ${MAX_ACTIVE_MS} ms.`);
  }

  return validationResult(errors);
}

function assertValidPattern(pattern) {
  const validation = validatePattern(pattern);

  if (!validation.valid) {
    throw new RangeError(validation.errors.join(" "));
  }
}

export function analyzePattern(pattern) {
  assertValidPattern(pattern);

  const activeMs = pattern.reduce(
    (total, duration, index) => total + (index % 2 === 0 ? duration : 0),
    0,
  );
  const pauseMs = pattern.reduce(
    (total, duration, index) => total + (index % 2 === 1 ? duration : 0),
    0,
  );
  const totalMs = activeMs + pauseMs;
  const pulseCount = Math.ceil(pattern.length / 2);
  const pauseCount = Math.floor(pattern.length / 2);
  let elapsedMs = 0;

  const timeline = pattern.map((durationMs, index) => {
    const type = index % 2 === 0 ? "pulse" : "pause";
    const startMs = elapsedMs;
    const endMs = startMs + durationMs;
    elapsedMs = endMs;

    return {
      index,
      type,
      label:
        type === "pulse"
          ? `Pulse ${index / 2 + 1}`
          : `Pause ${(index + 1) / 2}`,
      durationMs,
      startMs,
      endMs,
      startRatio: startMs / totalMs,
      endRatio: endMs / totalMs,
      widthPercent: (durationMs / totalMs) * 100,
    };
  });

  return {
    pattern: [...pattern],
    timeline,
    segmentCount: pattern.length,
    pulseCount,
    pauseCount,
    activeMs,
    pauseMs,
    totalMs,
    activeRatio: activeMs / totalMs,
    rhythmDensity: pulseCount / (totalMs / 1000),
  };
}

function signedDifference(right, left) {
  return right - left;
}

function durationObservation(delta, subject) {
  if (delta === 0) {
    return `${subject} is the same in both patterns.`;
  }

  const direction = delta > 0 ? "more" : "less";
  return `Pattern B has ${Math.abs(delta)} ms ${direction} ${subject.toLowerCase()} than Pattern A.`;
}

export function comparePatterns(patternA, patternB) {
  const a = analyzePattern(patternA);
  const b = analyzePattern(patternB);
  const delta = {
    segmentCount: signedDifference(b.segmentCount, a.segmentCount),
    pulseCount: signedDifference(b.pulseCount, a.pulseCount),
    activeMs: signedDifference(b.activeMs, a.activeMs),
    pauseMs: signedDifference(b.pauseMs, a.pauseMs),
    totalMs: signedDifference(b.totalMs, a.totalMs),
    activeRatio: signedDifference(b.activeRatio, a.activeRatio),
    rhythmDensity: signedDifference(b.rhythmDensity, a.rhythmDensity),
  };
  const observations = [
    durationObservation(delta.totalMs, "Total duration"),
    durationObservation(delta.activeMs, "Active vibration time"),
  ];

  if (delta.pulseCount === 0) {
    observations.push("Both patterns contain the same number of pulse events.");
  } else {
    const direction = delta.pulseCount > 0 ? "more" : "fewer";
    observations.push(
      `Pattern B contains ${Math.abs(delta.pulseCount)} ${direction} pulse event${Math.abs(delta.pulseCount) === 1 ? "" : "s"} than Pattern A.`,
    );
  }

  if (Math.abs(delta.activeRatio) < Number.EPSILON) {
    observations.push("Both patterns spend the same share of time vibrating.");
  } else {
    const denser = delta.activeRatio > 0 ? "B" : "A";
    observations.push(
      `Pattern ${denser} spends a larger share of its timeline vibrating, which may make it read as the denser sequence on some devices.`,
    );
  }

  return {
    a,
    b,
    delta,
    samePattern:
      patternA.length === patternB.length &&
      patternA.every((duration, index) => duration === patternB[index]),
    observations,
  };
}

export function describePattern(pattern) {
  const analysis = analyzePattern(pattern);
  const pulses = analysis.timeline.filter(
    (segment) => segment.type === "pulse",
  );
  const pauses = analysis.timeline.filter(
    (segment) => segment.type === "pause",
  );
  const averagePulseMs = analysis.activeMs / analysis.pulseCount;
  const averagePauseMs = analysis.pauseCount
    ? analysis.pauseMs / analysis.pauseCount
    : 0;

  let title;
  let why;
  let where;

  if (analysis.pulseCount === 1 && analysis.totalMs <= 80) {
    title = "A compact single cue";
    why =
      "One brief pulse keeps the temporal footprint small and may read as a light acknowledgement.";
    where =
      "It may complement an already-visible tap or selection state without becoming the only feedback.";
  } else if (analysis.pulseCount === 1) {
    title = "A sustained single cue";
    why =
      "A single longer pulse carries no internal rhythm and may feel more prominent than a brief tap.";
    where =
      "It may suit a deliberately emphasized state when a shorter cue would be too easy to miss.";
  } else if (analysis.pauseMs >= analysis.activeMs) {
    title = "A widely separated rhythm";
    why =
      "The pauses occupy at least as much time as the pulses, so the events may feel distinctly separated.";
    where =
      "It may help distinguish a repeated cue, provided the same meaning is also communicated visually.";
  } else if (analysis.activeRatio >= 0.7) {
    title = "A dense pulse sequence";
    why =
      "Most of the timeline is active vibration, with shorter gaps dividing the pulse events.";
    where =
      "It may suit a more prominent warning or error cue, but its longer active time warrants restraint.";
  } else {
    title = "A measured pulse sequence";
    why =
      "Multiple pulses and visible pauses create a recognizable rhythm without keeping the actuator active continuously.";
    where =
      "It may complement a confirmation or warning when the pattern is tested on the intended devices and users.";
  }

  return {
    title,
    why,
    where,
    caveat:
      "Perception varies with hardware, system settings, context, and the person using the device; this timing analysis cannot confirm physical sensation.",
    averagePulseMs,
    averagePauseMs,
    longestPulseMs: Math.max(...pulses.map((segment) => segment.durationMs)),
    longestPauseMs: pauses.length
      ? Math.max(...pauses.map((segment) => segment.durationMs))
      : 0,
    analysis,
  };
}

function freezeArtifact(record) {
  return Object.freeze({
    ...record,
    presentation: Object.freeze({ ...record.presentation }),
    hostedSource: Object.freeze({ ...record.hostedSource }),
  });
}

export const ARTIFACT_DRIFT = Object.freeze(
  [
    {
      id: "cancellation-control",
      title: "Cancellation control",
      presentation: {
        label: "Presentation snapshot",
        value: "navigator.vibrate(0)",
        detail:
          "The preserved slide presents a zero-duration cancellation call.",
      },
      hostedSource: {
        label: "Surviving hosted source",
        value: "navigator.vibrate(10)",
        detail: "The currently surviving page instead requests a 10 ms pulse.",
      },
      currentReading:
        "A zero duration or empty pattern is the explicit cancellation form used by the current API model.",
      interpretation:
        "The artifacts preserve different snapshots; neither proves a uniquely canonical final source version.",
    },
    {
      id: "color-pattern-timing",
      title: "Color-pattern timing",
      presentation: {
        label: "Presentation snapshot",
        value:
          "A different fourth-scenario pause formula is visible in the deck.",
        detail:
          "The slide evidence and surviving implementation do not expose one identical formula.",
      },
      hostedSource: {
        label: "Surviving hosted source",
        value: "10 + index × 10 ms",
        detail:
          "The currently surviving page uses this pause progression in its fourth scenario.",
      },
      currentReading:
        "The portfolio does not promote either snapshot into a standardized haptic meaning.",
      interpretation:
        "The mismatch is presented as version drift, not silently resolved into invented source history.",
    },
  ].map(freezeArtifact),
);
