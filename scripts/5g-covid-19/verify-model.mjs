import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  CAPABILITY_CLASSIFICATIONS,
  CAPABILITY_GROUPS,
  DEFAULT_DEPENDENCIES,
  DEFAULT_SCENARIO_ID,
  DEPENDENCY_OPTIONS,
  EVIDENCE_LABELS,
  SCENARIOS,
  createInitialExplorerState,
  deriveCapabilityMatches,
  deriveDependencyPath,
  deriveExplorer,
  deriveProcessingSelection,
  deriveTransportSelection,
  explorerReducer,
  getScenarioById,
  getScenarioRoute,
  getSelectedRouteStage,
} from "../../src/components/case-studies/5g-covid-19/pandemicResponseModel.mjs";

const modelPath =
  "src/components/case-studies/5g-covid-19/pandemicResponseModel.mjs";
const explorerPath =
  "src/components/case-studies/5g-covid-19/PandemicResponseExplorer.jsx";

const expectedScenarioIds = [
  "remote-consultation",
  "patient-monitoring",
  "remote-education",
  "contactless-logistics",
  "contact-monitoring",
];
const expectedCapabilityIds = [
  "embb",
  "urllc",
  "mmtc",
  "mec",
  "network-slicing",
  "nfv",
];
const allowedClassifications = new Set([
  "direct",
  "conditional",
  "paper-wide",
  "not-central",
]);
const expectedClassificationLabels = {
  direct: "Direct",
  conditional: "Conditional",
  "paper-wide": "Paper-wide",
  "not-central": "Not central",
};
const allowedStageStatuses = new Set([
  "reachable",
  "unavailable",
  "downstream-unreachable",
]);

function assertUnique(values, label) {
  assert.equal(
    new Set(values).size,
    values.length,
    `${label} must contain unique values`,
  );
}

function verifyTaxonomyAndScenarios() {
  assert.deepEqual(
    SCENARIOS.map((scenario) => scenario.id),
    expectedScenarioIds,
  );
  assert.equal(DEFAULT_SCENARIO_ID, expectedScenarioIds[0]);
  assert.ok(Object.isFrozen(SCENARIOS));
  assert.deepEqual(
    CAPABILITY_GROUPS.trafficProfiles.items.map((item) => item.id),
    ["embb", "urllc", "mmtc"],
  );
  assert.deepEqual(
    CAPABILITY_GROUPS.architecturalConcepts.items.map((item) => item.id),
    ["mec", "network-slicing", "nfv"],
  );
  assertUnique(expectedCapabilityIds, "Capability taxonomy");
  assert.deepEqual(
    Object.keys(CAPABILITY_CLASSIFICATIONS).sort(),
    [...allowedClassifications].sort(),
  );
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(CAPABILITY_CLASSIFICATIONS).map(([id, value]) => [
        id,
        value.label,
      ]),
    ),
    expectedClassificationLabels,
  );

  for (const scenario of SCENARIOS) {
    assert.ok(Object.isFrozen(scenario));
    assert.ok(scenario.title.length > 0);
    assert.ok(scenario.shortTitle.length > 0);
    assert.ok(scenario.domain.length > 0);
    assert.ok(scenario.summary.length > 0);
    assert.ok(scenario.data.length > 0);
    assert.ok(scenario.evidenceNote.length > 0);
    assert.ok(scenario.opportunity.length > 0);
    assert.ok(scenario.constraint.length > 0);
    assert.equal(scenario.evidenceLabel, EVIDENCE_LABELS.coursework);
    assert.equal(scenario.reconstructionLabel, EVIDENCE_LABELS.reconstruction);
    assert.equal(scenario.steps.length, 6);
    assertUnique(
      scenario.steps.map((step) => step.id),
      `${scenario.id} route steps`,
    );

    for (const [index, step] of scenario.steps.entries()) {
      assert.equal(step.index, index);
      assert.ok(step.label.length > 0);
      assert.ok(step.role.length > 0);
      assert.ok(step.data.length > 0);
      assert.ok(step.technology.length > 0);
      assert.ok(
        ["endpoint", "transport", "processing", "serviceReady"].includes(
          step.dependency,
        ),
      );
      assert.equal(step.evidenceLabel, EVIDENCE_LABELS.reconstruction);
    }

    assert.deepEqual(
      Object.keys(scenario.capabilities).sort(),
      [...expectedCapabilityIds].sort(),
      `${scenario.id} must classify the complete capability taxonomy`,
    );

    for (const capability of Object.values(scenario.capabilities)) {
      assert.ok(allowedClassifications.has(capability.classification));
      assert.ok(capability.note.length > 0);
    }

    const derivedCapabilities = deriveCapabilityMatches(scenario.id);
    assert.equal(derivedCapabilities.trafficProfiles.length, 3);
    assert.equal(derivedCapabilities.architecturalConcepts.length, 3);

    for (const match of [
      ...derivedCapabilities.trafficProfiles,
      ...derivedCapabilities.architecturalConcepts,
    ]) {
      assert.ok(expectedCapabilityIds.includes(match.id));
      assert.ok(allowedClassifications.has(match.classification));
      assert.equal(
        match.classificationLabel,
        CAPABILITY_CLASSIFICATIONS[match.classification].label,
      );
    }
  }

  assert.equal(getScenarioById("does-not-exist"), null);
  assert.equal(getScenarioById(DEFAULT_SCENARIO_ID).id, DEFAULT_SCENARIO_ID);
}

function verifyContactAndLogisticsBoundaries() {
  const contact = getScenarioById("contact-monitoring");
  const sensingIndex = contact.steps.findIndex(
    (step) => step.id === "proximity-location-input",
  );
  const transportIndex = contact.steps.findIndex(
    (step) => step.dependency === "transport",
  );

  assert.ok(sensingIndex >= 0);
  assert.ok(transportIndex >= 0);
  assert.ok(
    sensingIndex < transportIndex,
    "BLE/GPS sensing must precede any cellular transport",
  );
  assert.match(contact.steps[sensingIndex].label, /BLE.*GPS/u);
  assert.match(contact.steps[sensingIndex].technology, /BLE.*GPS/u);
  assert.doesNotMatch(contact.steps[sensingIndex].technology, /5G/u);
  assert.match(contact.steps[transportIndex].role, /after sensing/u);
  assert.match(contact.constraint, /does not perform BLE proximity sensing/u);

  const logistics = getScenarioById("contactless-logistics");
  const automatedStep = logistics.steps.find(
    (step) => step.id === "automation-device",
  );
  assert.ok(automatedStep);
  assert.match(automatedStep.label, /AGV, UAV or robot/u);
  assert.match(automatedStep.role, /generic product-logistics action/u);
  assert.match(logistics.evidenceNote, /product-logistics examples/u);
  assert.doesNotMatch(
    `${logistics.summary} ${logistics.evidenceNote} ${logistics.steps
      .map((step) => `${step.label} ${step.role}`)
      .join(" ")}`,
    /medical[- ]supply/iu,
  );
}

function expectedFirstMissing(dependencies) {
  if (!dependencies.endpoint) {
    return "endpoint";
  }
  if (dependencies.transport === "unavailable") {
    return "transport";
  }
  if (dependencies.processing === "unavailable") {
    return "processing";
  }
  if (!dependencies.serviceReady) {
    return "serviceReady";
  }
  return null;
}

function verifyOneDependencyCombination(scenario, dependencies) {
  const result = deriveDependencyPath(scenario.id, dependencies);
  const missingDependency = expectedFirstMissing(dependencies);

  assert.ok(
    result.stages.every((stage) => allowedStageStatuses.has(stage.status)),
  );
  assert.equal(
    result.firstMissingDependency?.id ?? null,
    missingDependency,
  );
  assert.equal(
    result.firstUnavailableStage?.dependency ?? null,
    missingDependency,
  );

  if (missingDependency === null) {
    assert.ok(result.stages.every((stage) => stage.reachable));
    assert.equal(result.reachableStepIds.length, scenario.steps.length);
    assert.equal(result.technicalPath.status, "complete");
    assert.equal(
      result.responsibleUse.status,
      dependencies.governanceReady ? "ready" : "not-ready",
    );
    assert.equal(
      result.status,
      dependencies.governanceReady
        ? "responsible-ready"
        : "technical-only",
    );
  } else {
    const blockedIndex = result.stages.findIndex(
      (stage) => stage.status === "unavailable",
    );
    assert.ok(blockedIndex >= 0);
    assert.ok(
      result.stages
        .slice(0, blockedIndex)
        .every((stage) => stage.status === "reachable"),
    );
    assert.ok(
      result.stages
        .slice(blockedIndex + 1)
        .every((stage) => stage.status === "downstream-unreachable"),
    );
    assert.equal(result.technicalPath.status, "blocked");
    assert.equal(result.responsibleUse.status, "blocked");
    assert.equal(result.status, "blocked");
  }

  assert.deepEqual(
    result.reachableStepIds,
    result.stages
      .filter((stage) => stage.status === "reachable")
      .map((stage) => stage.id),
  );
}

function verifyEveryDependencyTransition() {
  const endpointValues = DEPENDENCY_OPTIONS.endpoint.options.map(
    (option) => option.value,
  );
  const transportValues = DEPENDENCY_OPTIONS.transport.options.map(
    (option) => option.value,
  );
  const processingValues = DEPENDENCY_OPTIONS.processing.options.map(
    (option) => option.value,
  );
  const serviceValues = DEPENDENCY_OPTIONS.serviceReady.options.map(
    (option) => option.value,
  );
  const governanceValues = DEPENDENCY_OPTIONS.governanceReady.options.map(
    (option) => option.value,
  );
  let checkedCombinations = 0;

  for (const scenario of SCENARIOS) {
    for (const endpoint of endpointValues) {
      for (const transport of transportValues) {
        for (const processing of processingValues) {
          for (const serviceReady of serviceValues) {
            for (const governanceReady of governanceValues) {
              verifyOneDependencyCombination(scenario, {
                endpoint,
                transport,
                processing,
                serviceReady,
                governanceReady,
              });
              checkedCombinations += 1;
            }
          }
        }
      }
    }
  }

  assert.equal(checkedCombinations, 360);
}

function verifySubstitutionsAndGovernance() {
  for (const scenario of SCENARIOS) {
    const with5g = deriveDependencyPath(scenario.id, DEFAULT_DEPENDENCIES);
    const withOtherTransport = deriveDependencyPath(scenario.id, {
      ...DEFAULT_DEPENDENCIES,
      transport: "other",
    });
    const withCloud = deriveDependencyPath(scenario.id, {
      ...DEFAULT_DEPENDENCIES,
      processing: "cloud",
    });

    assert.equal(with5g.transport.uses5g, true);
    assert.equal(with5g.transport.requiresValidation, true);
    assert.equal(withOtherTransport.transport.uses5g, false);
    assert.equal(withOtherTransport.transport.available, true);
    assert.equal(withOtherTransport.transport.requiresValidation, true);
    assert.match(withOtherTransport.transport.detail, /structurally possible/u);
    assert.match(withOtherTransport.transport.detail, /validation/u);
    assert.deepEqual(
      withOtherTransport.reachableStepIds,
      with5g.reachableStepIds,
      "An available alternate transport should preserve structural reachability",
    );

    assert.equal(with5g.processing.isEdge, true);
    assert.equal(withCloud.processing.isEdge, false);
    assert.equal(withCloud.processing.available, true);
    assert.equal(withCloud.processing.requiresValidation, true);
    assert.deepEqual(withCloud.reachableStepIds, with5g.reachableStepIds);

    const governanceNotReady = deriveDependencyPath(scenario.id, {
      ...DEFAULT_DEPENDENCIES,
      governanceReady: false,
    });
    assert.deepEqual(governanceNotReady.stages, with5g.stages);
    assert.deepEqual(
      governanceNotReady.firstMissingDependency,
      with5g.firstMissingDependency,
    );
    assert.deepEqual(governanceNotReady.technicalPath, with5g.technicalPath);
    assert.deepEqual(governanceNotReady.transport, with5g.transport);
    assert.deepEqual(governanceNotReady.processing, with5g.processing);
    assert.equal(with5g.responsibleUse.status, "ready");
    assert.equal(governanceNotReady.responsibleUse.status, "not-ready");
    assert.equal(governanceNotReady.status, "technical-only");
  }

  assert.throws(() => deriveTransportSelection("satellite"), TypeError);
  assert.throws(() => deriveProcessingSelection("device"), TypeError);
  assert.throws(
    () =>
      deriveDependencyPath(DEFAULT_SCENARIO_ID, {
        ...DEFAULT_DEPENDENCIES,
        transport: "invalid",
      }),
    TypeError,
  );
}

function dispatch(state, action) {
  return explorerReducer(state, action);
}

function verifyStateAndSelection() {
  const first = createInitialExplorerState();
  const second = createInitialExplorerState();
  assert.deepEqual(first, second);
  assert.notEqual(first, second);
  assert.notEqual(first.dependencies, second.dependencies);
  assert.deepEqual(first.dependencies, DEFAULT_DEPENDENCIES);
  assert.equal(first.scenarioId, DEFAULT_SCENARIO_ID);
  assert.equal(first.activeStepIndex, 0);
  assert.equal(first.lens, "opportunity");

  for (const [dependency, definition] of Object.entries(DEPENDENCY_OPTIONS)) {
    for (const option of definition.options) {
      const changed = dispatch(first, {
        type: "set-dependency",
        dependency,
        value: option.value,
      });
      assert.equal(changed.dependencies[dependency], option.value);
    }
  }

  assert.equal(getScenarioRoute(first.scenarioId).length, 6);
  assert.equal(getSelectedRouteStage(first).id, "patient-endpoint");

  let state = dispatch(first, { type: "next-step" });
  assert.equal(state.activeStepIndex, 1);
  state = dispatch(state, { type: "set-step", index: 999 });
  assert.equal(state.activeStepIndex, 5);
  state = dispatch(state, { type: "next-step" });
  assert.equal(state.activeStepIndex, 5);
  state = dispatch(state, { type: "set-step", index: -12 });
  assert.equal(state.activeStepIndex, 0);
  state = dispatch(state, { type: "previous-step" });
  assert.equal(state.activeStepIndex, 0);

  state = dispatch(state, {
    type: "set-dependency",
    dependency: "transport",
    value: "other",
  });
  state = dispatch(state, { type: "set-step", index: 4 });
  state = dispatch(state, {
    type: "select-scenario",
    scenarioId: "contact-monitoring",
  });
  assert.equal(state.scenarioId, "contact-monitoring");
  assert.equal(state.activeStepIndex, 0);
  assert.equal(state.dependencies.transport, "other");

  state = dispatch(state, { type: "set-lens", lens: "constraint" });
  const derived = deriveExplorer(state);
  assert.equal(derived.scenario.id, "contact-monitoring");
  assert.equal(derived.activeStep.id, "personal-endpoint");
  assert.equal(derived.lens.active, "constraint");
  assert.equal(derived.explanation.body, derived.scenario.constraint);
  assert.match(derived.whatChanged.title, /not synonymous with 5G/u);
  assert.equal(derived.dependency.technicalPath.status, "complete");

  const unchangedForUnknownScenario = dispatch(state, {
    type: "select-scenario",
    scenarioId: "unknown",
  });
  assert.equal(unchangedForUnknownScenario, state);
  const unchangedForInvalidDependency = dispatch(state, {
    type: "set-dependency",
    dependency: "transport",
    value: "unverified-network",
  });
  assert.equal(unchangedForInvalidDependency, state);
  assert.equal(dispatch(state, { type: "unknown-action" }), state);

  const reset = dispatch(state, { type: "reset" });
  assert.deepEqual(reset, createInitialExplorerState());
  assert.deepEqual(
    deriveExplorer(reset),
    deriveExplorer(createInitialExplorerState()),
    "The initial derived model must be deterministic",
  );
}

function verifyContextualExplanations() {
  const cases = [
    [
      { ...DEFAULT_DEPENDENCIES, endpoint: false },
      /No data enters the path/u,
    ],
    [
      { ...DEFAULT_DEPENDENCIES, transport: "unavailable" },
      /route stops before processing/u,
    ],
    [
      { ...DEFAULT_DEPENDENCIES, processing: "unavailable" },
      /processing is not/u,
    ],
    [
      { ...DEFAULT_DEPENDENCIES, serviceReady: false },
      /does not create the service/u,
    ],
    [
      { ...DEFAULT_DEPENDENCIES, governanceReady: false },
      /not responsibly ready/u,
    ],
    [
      { ...DEFAULT_DEPENDENCIES, transport: "other" },
      /not synonymous with 5G/u,
    ],
    [
      { ...DEFAULT_DEPENDENCIES, processing: "cloud" },
      /Processing moved/u,
    ],
  ];

  for (const [dependencies, expectedTitle] of cases) {
    const derived = deriveExplorer({
      ...createInitialExplorerState(),
      dependencies,
    });
    assert.match(derived.whatChanged.title, expectedTitle);
    assert.match(derived.explanation.caveat, /does not simulate traffic/u);
  }
}

async function verifyPureModelBoundaries() {
  const sources = await Promise.all(
    [modelPath, explorerPath].map(async (path) => ({
      path,
      source: await readFile(path, "utf8"),
    })),
  );
  const forbiddenRuntimePatterns = [
    [
      "network request API",
      /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bEventSource\b/u,
    ],
    ["beacon API", /\bsendBeacon\b/u],
    [
      "browser persistence",
      /\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b|document\.cookie/u,
    ],
    [
      "sensor or permission access",
      /navigator\.(?:geolocation|permissions)|DeviceMotionEvent|DeviceOrientationEvent/u,
    ],
    ["timers", /\bsetTimeout\s*\(|\bsetInterval\s*\(/u],
    ["nondeterministic randomness", /\bMath\.random\s*\(/u],
    ["dynamic execution", /\beval\s*\(|\bFunction\s*\(/u],
    ["unsafe HTML", /dangerouslySetInnerHTML/u],
    [
      "invented performance values",
      /\b\d+(?:\.\d+)?\s*(?:ms|Mbit\/s|Mb\/s|Gbit\/s|Gb\/s)\b/iu,
    ],
    [
      "synthetic patient observations",
      /blood pressure|heart rate|oxygen saturation|temperature reading/iu,
    ],
  ];

  for (const { path, source } of sources) {
    for (const [label, pattern] of forbiddenRuntimePatterns) {
      assert.doesNotMatch(source, pattern, `${label} must not appear in ${path}`);
    }
  }

  const modelSource = sources.find(({ path }) => path === modelPath).source;
  assert.match(modelSource, /structurally possible/u);
  assert.match(modelSource, /does not perform BLE proximity sensing/u);
  assert.match(modelSource, /does not simulate traffic/u);
  assert.doesNotMatch(modelSource, /5G guarantees/iu);
}

verifyTaxonomyAndScenarios();
verifyContactAndLogisticsBoundaries();
verifyEveryDependencyTransition();
verifySubstitutionsAndGovernance();
verifyStateAndSelection();
verifyContextualExplanations();
await verifyPureModelBoundaries();

console.log(
  "5G pandemic-response verification passed: 5 scenarios, 360 dependency combinations, capability taxonomy, substitutions, evidence boundaries, and deterministic state all hold.",
);
