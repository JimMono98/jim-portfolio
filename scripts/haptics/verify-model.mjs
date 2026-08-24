import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  ARTIFACT_DRIFT,
  HAPTIC_PRESETS,
  MAX_ACTIVE_MS,
  MAX_PATTERN_SEGMENTS,
  MAX_PAUSE_MS,
  MAX_PULSE_MS,
  MAX_TOTAL_MS,
  MIN_PATTERN_SEGMENTS,
  MIN_PAUSE_MS,
  MIN_PULSE_MS,
  analyzePattern,
  comparePatterns,
  describePattern,
  validatePattern,
} from "../../src/components/case-studies/vibration-api-examination/hapticPatternModel.mjs";

const modelPath =
  "src/components/case-studies/vibration-api-examination/hapticPatternModel.mjs";

function assertValid(pattern, message) {
  assert.equal(validatePattern(pattern).valid, true, message);
}

function assertInvalid(pattern, expectedMessage) {
  const result = validatePattern(pattern);
  assert.equal(
    result.valid,
    false,
    `${JSON.stringify(pattern)} should be invalid`,
  );
  assert.match(result.errors.join(" "), expectedMessage);
}

function verifyLimitsAndValidation() {
  assert.equal(MIN_PATTERN_SEGMENTS, 1);
  assert.equal(MAX_PATTERN_SEGMENTS, 9);
  assert.equal(MIN_PULSE_MS, 20);
  assert.equal(MAX_PULSE_MS, 500);
  assert.equal(MIN_PAUSE_MS, 20);
  assert.equal(MAX_PAUSE_MS, 1000);
  assert.equal(MAX_TOTAL_MS, 3000);
  assert.equal(MAX_ACTIVE_MS, 1500);

  for (const pattern of [
    [20],
    [500],
    [20, 20, 20],
    [20, 1000, 20],
    [500, 20, 500, 20, 500],
    [500, 750, 500, 750, 500],
    [300, 100, 300, 100, 300, 100, 300, 100, 300],
  ]) {
    assertValid(pattern, `${JSON.stringify(pattern)} should be valid`);
  }

  assertInvalid(null, /array of durations/i);
  assertInvalid([], /between 1 and 9 segments/i);
  assertInvalid([100, 100], /begin and end with a pulse/i);
  assertInvalid(
    [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
    /between 1 and 9 segments/i,
  );
  assertInvalid([19], /between 20 and 500 ms/i);
  assertInvalid([501], /between 20 and 500 ms/i);
  assertInvalid([100, 19, 100], /between 20 and 1000 ms/i);
  assertInvalid([100, 1001, 100], /between 20 and 1000 ms/i);
  assertInvalid([40.5], /whole number/i);
  assertInvalid(["40"], /whole number/i);
  assertInvalid([Number.NaN], /whole number/i);
  assertInvalid([500, 1000, 500, 1000, 500], /within 3000 ms/i);
  assertInvalid([500, 20, 500, 20, 500, 20, 500], /active vibration time/i);

  assert.throws(() => analyzePattern([10]), RangeError);
}

function preset(id) {
  const match = HAPTIC_PRESETS.find((candidate) => candidate.id === id);
  assert.ok(match, `Missing preset: ${id}`);
  return match;
}

function verifyPresetsAndAnalysis() {
  assert.equal(HAPTIC_PRESETS.length, 6);
  assert.deepEqual(preset("coursework-double-pulse").pattern, [200, 100, 200]);
  assert.deepEqual(preset("coursework-short-pulse").pattern, [200]);
  assert.deepEqual(preset("tap").pattern, [40]);
  assert.deepEqual(preset("confirmation").pattern, [60, 50, 100]);
  assert.deepEqual(preset("warning").pattern, [120, 80, 120]);
  assert.deepEqual(preset("error").pattern, [160, 70, 160, 70, 220]);

  for (const item of HAPTIC_PRESETS) {
    assertValid(item.pattern, `${item.label} must satisfy the studio bounds`);
    assert.ok(Object.isFrozen(item));
    assert.ok(Object.isFrozen(item.pattern));
    assert.match(item.source, /Original coursework|Portfolio reconstruction/u);
  }

  const doublePulse = analyzePattern(preset("coursework-double-pulse").pattern);
  assert.equal(doublePulse.segmentCount, 3);
  assert.equal(doublePulse.pulseCount, 2);
  assert.equal(doublePulse.pauseCount, 1);
  assert.equal(doublePulse.activeMs, 400);
  assert.equal(doublePulse.pauseMs, 100);
  assert.equal(doublePulse.totalMs, 500);
  assert.equal(doublePulse.activeRatio, 0.8);
  assert.equal(doublePulse.rhythmDensity, 4);
  assert.deepEqual(
    doublePulse.timeline.map(({ type, startMs, endMs }) => ({
      type,
      startMs,
      endMs,
    })),
    [
      { type: "pulse", startMs: 0, endMs: 200 },
      { type: "pause", startMs: 200, endMs: 300 },
      { type: "pulse", startMs: 300, endMs: 500 },
    ],
  );
  assert.ok(
    Math.abs(
      doublePulse.timeline.reduce(
        (total, segment) => total + segment.widthPercent,
        0,
      ) - 100,
    ) < 1e-10,
  );

  const shortPulse = analyzePattern(preset("coursework-short-pulse").pattern);
  assert.equal(shortPulse.activeMs, 200);
  assert.equal(shortPulse.pauseMs, 0);
  assert.equal(shortPulse.totalMs, 200);
  assert.equal(shortPulse.activeRatio, 1);
  assert.equal(shortPulse.rhythmDensity, 5);

  const errorPattern = analyzePattern(preset("error").pattern);
  assert.equal(errorPattern.pulseCount, 3);
  assert.equal(errorPattern.activeMs, 540);
  assert.equal(errorPattern.pauseMs, 140);
  assert.equal(errorPattern.totalMs, 680);

  const copiedPattern = [...doublePulse.pattern];
  copiedPattern[0] = 20;
  assert.deepEqual(
    preset("coursework-double-pulse").pattern,
    [200, 100, 200],
    "Analysis must not mutate preset data",
  );
}

function verifyComparisonAndDescription() {
  const comparison = comparePatterns(
    preset("coursework-double-pulse").pattern,
    preset("coursework-short-pulse").pattern,
  );

  assert.equal(comparison.delta.pulseCount, -1);
  assert.equal(comparison.delta.activeMs, -200);
  assert.equal(comparison.delta.pauseMs, -100);
  assert.equal(comparison.delta.totalMs, -300);
  assert.equal(comparison.samePattern, false);
  assert.match(comparison.observations.join(" "), /Pattern B has 300 ms less/i);

  const identical = comparePatterns([40], [40]);
  assert.equal(identical.samePattern, true);
  assert.equal(identical.delta.totalMs, 0);
  assert.match(identical.observations.join(" "), /same share of time/i);

  const compact = describePattern([40]);
  assert.equal(compact.title, "A compact single cue");
  assert.match(compact.why, /may read/i);
  assert.match(compact.caveat, /cannot confirm physical sensation/i);

  const dense = describePattern([160, 70, 160, 70, 220]);
  assert.equal(dense.title, "A dense pulse sequence");
  assert.equal(dense.longestPulseMs, 220);
  assert.equal(dense.longestPauseMs, 70);
}

function verifyArtifactInvariants() {
  assert.equal(ARTIFACT_DRIFT.length, 2);
  assert.ok(Object.isFrozen(ARTIFACT_DRIFT));

  const cancellation = ARTIFACT_DRIFT.find(
    (record) => record.id === "cancellation-control",
  );
  assert.ok(cancellation);
  assert.equal(cancellation.presentation.value, "navigator.vibrate(0)");
  assert.equal(cancellation.hostedSource.value, "navigator.vibrate(10)");
  assert.notEqual(
    cancellation.presentation.value,
    cancellation.hostedSource.value,
  );
  assert.match(cancellation.interpretation, /different snapshots/i);
  assert.match(cancellation.interpretation, /neither proves/i);

  const patternTiming = ARTIFACT_DRIFT.find(
    (record) => record.id === "color-pattern-timing",
  );
  assert.ok(patternTiming);
  assert.equal(patternTiming.hostedSource.value, "10 + index × 10 ms");
  assert.match(patternTiming.interpretation, /version drift/i);

  for (const record of ARTIFACT_DRIFT) {
    assert.ok(Object.isFrozen(record));
    assert.ok(Object.isFrozen(record.presentation));
    assert.ok(Object.isFrozen(record.hostedSource));
    assert.ok(record.currentReading.length > 0);
  }
}

async function verifyPureModelBoundaries() {
  const source = await readFile(modelPath, "utf8");
  const forbiddenRuntimePatterns = [
    ["network request API", /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b/u],
    [
      "browser persistence",
      /\blocalStorage\b|\bsessionStorage\b|document\.cookie/u,
    ],
    ["timers", /\bsetTimeout\s*\(|\bsetInterval\s*\(/u],
    ["nondeterministic randomness", /\bMath\.random\s*\(/u],
    ["dynamic execution", /\beval\s*\(|\bFunction\s*\(/u],
    ["unsafe HTML", /dangerouslySetInnerHTML/u],
  ];

  for (const [label, pattern] of forbiddenRuntimePatterns) {
    assert.doesNotMatch(
      source,
      pattern,
      `${label} must not appear in the model`,
    );
  }
}

verifyLimitsAndValidation();
verifyPresetsAndAnalysis();
verifyComparisonAndDescription();
verifyArtifactInvariants();
await verifyPureModelBoundaries();

console.log(
  "Haptic pattern verification passed: bounds, presets, timelines, comparisons, explanations, artifact drift, and pure-model boundaries are deterministic.",
);
