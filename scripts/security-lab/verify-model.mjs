import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  MAX_EVENT_HISTORY,
  QUERY_PRESETS,
  RECONSTRUCTION_LIMIT,
  canonicalizeLiteralDotPath,
  createInitialSecurityLabState,
  deriveQueryComparison,
  deriveRouteComparison,
  deriveSecurityPipeline,
  deriveWhatChanged,
  securityLabReducer,
  validateLocalPath,
  validateQueryInput,
} from "../../src/components/case-studies/hack-the-box-no-threshold/securityLabModel.mjs";

const modelPath =
  "src/components/case-studies/hack-the-box-no-threshold/securityLabModel.mjs";
const componentPath =
  "src/components/case-studies/hack-the-box-no-threshold/SecurityLab.jsx";

function dispatch(state, action) {
  return securityLabReducer(state, action);
}

function verifyPathModel() {
  for (const path of ["/auth/login", "/./auth/login", "/dashboard", "/"]) {
    assert.equal(validateLocalPath(path).valid, true, `${path} should be valid`);
  }

  const rejectedPaths = [
    "",
    "auth/login",
    "https://example.test/auth/login",
    "//example.test/auth/login",
    "/auth/login?next=/dashboard",
    "/auth/login#result",
    "/%2e/auth/login",
    "/../auth/login",
    "/auth\\login",
    "/auth//login",
    "/auth/login/",
    "/auth/ login",
    `/auth/${String.fromCharCode(0)}login`,
  ];

  for (const path of rejectedPaths) {
    assert.equal(
      validateLocalPath(path).valid,
      false,
      `${JSON.stringify(path)} should be rejected`,
    );
  }

  assert.equal(
    canonicalizeLiteralDotPath("/./auth/./login").canonicalPath,
    "/auth/login",
  );
  assert.equal(canonicalizeLiteralDotPath("/").canonicalPath, "/");

  let state = createInitialSecurityLabState();
  let comparison = deriveRouteComparison(state);
  assert.equal(comparison.policyMismatch, true);
  assert.equal(comparison.observed.status, "Policy mismatch represented");
  assert.equal(comparison.hardened.status, "Blocked");

  state = dispatch(state, { type: "set-route", value: "/auth/login" });
  comparison = deriveRouteComparison(state);
  assert.equal(comparison.policyMismatch, false);
  assert.equal(comparison.observed.status, "Blocked");
  assert.equal(comparison.hardened.status, "Blocked");

  state = dispatch(state, { type: "set-route", value: "/dashboard" });
  comparison = deriveRouteComparison(state);
  assert.equal(comparison.targetsModeledAuthRoute, false);
  assert.equal(comparison.observed.status, "Outside modeled auth route");

  const outsidePipeline = deriveSecurityPipeline(state);
  assert.match(outsidePipeline.observed.overall, /outside the narrow authentication flow/i);
  assert.match(outsidePipeline.hardened.overall, /outside the narrow authentication flow/i);
  assert.ok(
    [...outsidePipeline.observed.steps, ...outsidePipeline.hardened.steps]
      .slice(1)
      .every((step) => !/earlier boundary stopped/i.test(step.status)),
    "An out-of-scope path must not be described as blocked by an earlier boundary",
  );
}

function verifyQueryModel() {
  assert.equal(validateQueryInput("visitor").valid, true);
  assert.equal(validateQueryInput(QUERY_PRESETS.report.value).valid, true);
  assert.equal(validateQueryInput("").valid, false);
  assert.equal(validateQueryInput(`visitor${String.fromCharCode(10)}`).valid, false);
  assert.equal(validateQueryInput("x".repeat(65)).valid, false);

  let state = createInitialSecurityLabState();
  const reportComparison = deriveQueryComparison(state);
  assert.equal(reportComparison.isRecordedPreset, true);
  assert.equal(
    reportComparison.observed.status,
    "Data mixed with statement structure",
  );
  assert.equal(reportComparison.hardened.status, "Input bound separately");
  assert.deepEqual(reportComparison.hardened.boundValues, [
    QUERY_PRESETS.report.value,
  ]);

  state = dispatch(state, { type: "select-query-preset", value: "benign" });
  const benignComparison = deriveQueryComparison(state);
  assert.equal(benignComparison.isRecordedPreset, false);
  assert.equal(
    benignComparison.hardened.statement,
    reportComparison.hardened.statement,
    "The parameterized statement must remain byte-identical",
  );
  assert.notEqual(
    benignComparison.observed.statement,
    reportComparison.observed.statement,
    "The interpolated illustration should genuinely change with its input",
  );

  state = dispatch(state, { type: "select-query-preset", value: "custom" });
  state = dispatch(state, {
    type: "set-custom-query",
    value: QUERY_PRESETS.report.value,
  });
  const customComparison = deriveQueryComparison(state);
  assert.equal(
    customComparison.isRecordedPreset,
    false,
    "A custom value must never inherit the report's recorded outcome",
  );
  assert.match(customComparison.evidenceNote, /no recorded outcome/i);

  state = dispatch(state, {
    type: "set-custom-query",
    value: "<img src=x onerror=alert(1)>",
  });
  const htmlLikeComparison = deriveQueryComparison(state);
  assert.equal(htmlLikeComparison.isRecordedPreset, false);
  assert.deepEqual(htmlLikeComparison.hardened.boundValues, [
    "<img src=x onerror=alert(1)>",
  ]);
  assert.match(htmlLikeComparison.observed.statement, /<img src=x/u);
}

function verifyIdentityModel() {
  let state = createInitialSecurityLabState();

  for (let attempt = 0; attempt < RECONSTRUCTION_LIMIT; attempt += 1) {
    state = dispatch(state, { type: "record-attempt" });
    assert.equal(state.events[0].observed, "attempt admitted");
    assert.equal(state.events[0].hardened, "attempt admitted");
  }

  state = dispatch(state, { type: "record-attempt" });
  assert.equal(state.events[0].observed, "attempt blocked");
  assert.equal(state.events[0].hardened, "attempt blocked");
  assert.equal(state.observedAttemptsBySource["source-a"], RECONSTRUCTION_LIMIT);
  assert.equal(state.hardenedAttempts, RECONSTRUCTION_LIMIT);

  state = dispatch(state, { type: "set-source", value: "source-b" });
  let pipeline = deriveSecurityPipeline(state);
  assert.equal(pipeline.identity.observedNextAdmitted, true);
  assert.equal(pipeline.identity.hardenedNextAdmitted, false);

  state = dispatch(state, { type: "record-attempt" });
  assert.equal(state.events[0].observed, "attempt admitted");
  assert.equal(state.events[0].hardened, "attempt blocked");
  assert.equal(state.observedAttemptsBySource["source-b"], 1);
  assert.equal(state.hardenedAttempts, RECONSTRUCTION_LIMIT);

  for (let attempt = 0; attempt < MAX_EVENT_HISTORY + 3; attempt += 1) {
    state = dispatch(state, { type: "record-attempt" });
  }
  assert.equal(state.events.length, MAX_EVENT_HISTORY);

  state = dispatch(state, { type: "reset" });
  assert.deepEqual(state, createInitialSecurityLabState());
}

function verifyPipelineInvariants() {
  let state = createInitialSecurityLabState();
  let pipeline = deriveSecurityPipeline(state);

  assert.equal(pipeline.recordedChainReachesTwoFactor, true);
  assert.equal(
    pipeline.observed.steps[2].status,
    "Reached in recorded presentation",
  );
  assert.equal(
    pipeline.observed.overall,
    "Documented chain reaches the 2FA/rate-limit boundary; this reconstruction does not test an OTP or reproduce the original target.",
  );
  assert.equal(pipeline.hardened.steps[0].status, "Blocked");
  assert.ok(
    pipeline.hardened.steps
      .slice(1)
      .every(
        (step) =>
          step.status ===
          "Not reached because an earlier boundary stopped the path",
      ),
  );

  state = dispatch(state, { type: "select-query-preset", value: "custom" });
  state = dispatch(state, { type: "set-custom-query", value: "visitor" });
  pipeline = deriveSecurityPipeline(state);
  assert.equal(pipeline.recordedChainReachesTwoFactor, false);
  assert.equal(pipeline.observed.steps[2].status, "Not simulated");

  state = dispatch(state, { type: "set-route", value: "/auth/login" });
  pipeline = deriveSecurityPipeline(state);
  assert.equal(pipeline.observed.steps[0].status, "Blocked");
  assert.equal(
    pipeline.observed.steps[1].status,
    "Not reached because an earlier boundary stopped the path",
  );

  const routeExplanation = deriveWhatChanged(
    createInitialSecurityLabState(),
    "route",
  );
  assert.match(routeExplanation.title, /two representations/i);
}

async function verifySafetyBoundaries() {
  const source = `${await readFile(modelPath, "utf8")}\n${await readFile(
    componentPath,
    "utf8",
  )}`;
  const forbiddenRuntimePatterns = [
    ["network request API", /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b/u],
    ["beacon API", /\bsendBeacon\b/u],
    ["browser persistence", /\blocalStorage\b|\bsessionStorage\b|document\.cookie/u],
    ["dynamic execution", /\beval\s*\(|\bFunction\s*\(/u],
    ["unsafe HTML", /dangerouslySetInnerHTML/u],
    ["timer-driven simulation", /\bsetTimeout\s*\(|\bsetInterval\s*\(/u],
    ["form action", /<form[^>]+\saction=/u],
  ];

  for (const [label, pattern] of forbiddenRuntimePatterns) {
    assert.doesNotMatch(source, pattern, `${label} must not appear in the lab`);
  }

  for (const forbiddenOutcome of [
    "authenticated",
    "compromised",
    "OTP discovered",
    "flag captured",
  ]) {
    assert.equal(
      source.includes(forbiddenOutcome),
      false,
      `Forbidden outcome wording found: ${forbiddenOutcome}`,
    );
  }
}

verifyPathModel();
verifyQueryModel();
verifyIdentityModel();
verifyPipelineInvariants();
await verifySafetyBoundaries();

console.log(
  "Security lab verification passed: route, query, identity, pipeline, and safety boundaries are deterministic.",
);
