import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  DEFAULT_DRILL_ID,
  DEFAULT_OPERATING_STATE,
  DEGRADED_MODES,
  EVIDENCE_BADGES,
  INCIDENT_DRILLS,
  INCIDENT_SIGNAL_MANIFEST,
  OPERATING_CONDITIONS,
  SIGNAL_LAYERS,
  SIGNAL_STATUSES,
  STANDARDS_CONTEXT,
  createInitialIncidentSignalState,
  deriveFeedRecipientStatus,
  deriveIncidentSignalBoard,
  getDegradedModeById,
  getDrillById,
  incidentSignalReducer,
} from "../../src/components/case-studies/5g-public-safety/incidentSignalModel.mjs";

const modelPath =
  "src/components/case-studies/5g-public-safety/incidentSignalModel.mjs";
const expectedDrillIds = [
  "remote-area-search",
  "smart-building-safety",
  "connected-road-response",
];
const expectedLayerIds = [
  "instructions-alerts",
  "video-thermal",
  "sensor-telemetry",
  "asset-location",
];
const expectedStatusLabels = {
  available: "Available",
  conditional: "Conditional",
  unavailable: "Unavailable",
  "not-applicable": "Not applicable",
};
const expectedRequirementOrder = [
  "sourceAvailability",
  "broadbandBackhaul",
  "applicationService",
  "authorizationPolicy",
];
const blockerOrder = [
  "sourceAvailability",
  "broadbandBackhaul",
  "applicationService",
  "authorizationPolicy",
  "partnerInterworking",
];

function assertUnique(values, label) {
  assert.equal(
    new Set(values).size,
    values.length,
    `${label} must contain unique values`,
  );
}

function assertDeepFrozen(value, label) {
  if (!value || typeof value !== "object") {
    return;
  }

  assert.ok(Object.isFrozen(value), `${label} must be deeply frozen`);

  for (const [key, nestedValue] of Object.entries(value)) {
    assertDeepFrozen(nestedValue, `${label}.${key}`);
  }
}

function verifyManifestAndEvidence() {
  assertDeepFrozen(INCIDENT_SIGNAL_MANIFEST, "INCIDENT_SIGNAL_MANIFEST");
  assert.deepEqual(
    Object.keys(EVIDENCE_BADGES),
    ["paper", "current", "reconstruction"],
  );
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(SIGNAL_STATUSES).map(([id, status]) => [
        id,
        status.label,
      ]),
    ),
    expectedStatusLabels,
  );
  assert.deepEqual(
    SIGNAL_LAYERS.map((layer) => layer.id),
    expectedLayerIds,
  );
  assert.deepEqual(
    DEGRADED_MODES.map((mode) => mode.id),
    ["none", "local-deployable", "lmr"],
  );
  assert.deepEqual(
    Object.keys(OPERATING_CONDITIONS),
    [
      "sourceAvailability",
      "broadbandBackhaul",
      "applicationService",
      "authorizationPolicy",
      "partnerInterworking",
    ],
  );
  assert.equal(getDegradedModeById("none").bypasses.length, 0);
  assert.deepEqual(getDegradedModeById("lmr").eligibleLayers, [
    "instructions-alerts",
  ]);
  assert.deepEqual(
    getDegradedModeById("local-deployable").eligibleLayers,
    expectedLayerIds,
  );
  assert.ok(
    DEGRADED_MODES.every((mode) =>
      ["current", "reconstruction"].includes(mode.evidenceId),
    ),
  );

  const mcx = STANDARDS_CONTEXT.find((item) => item.id === "mcx");
  assert.ok(mcx, "MCX current-standards context must be present");
  assert.equal(mcx.evidenceId, "current");
  assert.match(mcx.description, /not presented as a feature of the original paper/u);
  assert.ok(
    STANDARDS_CONTEXT.every((item) => item.evidenceId !== "paper"),
    "Current standards and reconstruction concepts must not inherit original-paper evidence",
  );
}

function verifyDrillCompleteness() {
  assert.deepEqual(
    INCIDENT_DRILLS.map((drill) => drill.id),
    expectedDrillIds,
  );
  assert.equal(DEFAULT_DRILL_ID, expectedDrillIds[0]);
  assertUnique(expectedDrillIds, "Drills");

  for (const drill of INCIDENT_DRILLS) {
    assert.ok(drill.title.length > 0);
    assert.ok(drill.shortTitle.length > 0);
    assert.ok(drill.domain.length > 0);
    assert.ok(drill.summary.length > 0);
    assert.ok(drill.evidenceNote.length > 0);
    assert.ok(drill.opportunity.length > 0);
    assert.ok(drill.constraint.length > 0);
    assert.equal(drill.evidenceId, "paper");
    assert.equal(drill.reconstructionEvidenceId, "reconstruction");
    assert.equal(drill.perspectives.length, 3);
    assert.equal(drill.recipients.length, 3);
    assert.equal(drill.feeds.length, 4);
    assert.equal(
      drill.recipients.filter((recipient) => recipient.isCoordinationBoard)
        .length,
      1,
      `${drill.id} must have exactly one coordination board`,
    );
    assertUnique(
      drill.perspectives.map((perspective) => perspective.id),
      `${drill.id} perspectives`,
    );
    assertUnique(
      drill.recipients.map((recipient) => recipient.id),
      `${drill.id} recipients`,
    );
    assertUnique(
      drill.feeds.map((feed) => feed.id),
      `${drill.id} feeds`,
    );
    assert.deepEqual(
      drill.feeds.map((feed) => feed.layerId),
      expectedLayerIds,
      `${drill.id} must expose one feed for every information layer`,
    );

    const recipientIds = new Set(
      drill.recipients.map((recipient) => recipient.id),
    );

    for (const perspective of drill.perspectives) {
      assert.equal(perspective.evidenceId, "reconstruction");
      assert.ok(recipientIds.has(perspective.recipientId));
      assert.ok(perspective.focus.length > 0);
    }

    for (const recipient of drill.recipients) {
      assert.equal(recipient.evidenceId, "reconstruction");
      assert.equal(typeof recipient.requiresPartnerInterworking, "boolean");
    }

    for (const [index, feed] of drill.feeds.entries()) {
      assert.equal(feed.index, index);
      assert.ok(expectedLayerIds.includes(feed.layerId));
      assert.ok(["paper", "reconstruction"].includes(feed.evidenceId));
      assert.equal(feed.routeEvidenceId, "reconstruction");
      assert.deepEqual(feed.requirements, expectedRequirementOrder);
      assert.ok(feed.recipientIds.length > 0);
      assertUnique(feed.recipientIds, `${drill.id}/${feed.id} recipients`);
      assert.ok(
        feed.recipientIds.every((recipientId) => recipientIds.has(recipientId)),
      );
    }

    assert.ok(
      drill.feeds.some(
        (feed) => feed.recipientIds.length < drill.recipients.length,
      ),
      `${drill.id} must exercise Not applicable cells`,
    );
  }

  assert.equal(getDrillById("not-a-drill"), null);
}

function allOperatingCombinations() {
  const values = Object.fromEntries(
    Object.entries(OPERATING_CONDITIONS).map(([condition, definition]) => [
      condition,
      definition.options.map((option) => option.value),
    ]),
  );
  const combinations = [];

  for (const sourceAvailability of values.sourceAvailability) {
    for (const broadbandBackhaul of values.broadbandBackhaul) {
      for (const applicationService of values.applicationService) {
        for (const authorizationPolicy of values.authorizationPolicy) {
          for (const partnerInterworking of values.partnerInterworking) {
            for (const degradedMode of DEGRADED_MODES.map((mode) => mode.id)) {
              combinations.push({
                sourceAvailability,
                broadbandBackhaul,
                applicationService,
                authorizationPolicy,
                partnerInterworking,
                degradedMode,
              });
            }
          }
        }
      }
    }
  }

  assert.equal(combinations.length, 96);
  return combinations;
}

function expectedBlockers(feed, recipient, operating) {
  const required = recipient.requiresPartnerInterworking
    ? [...expectedRequirementOrder, "partnerInterworking"]
    : expectedRequirementOrder;

  const blocked = {
    sourceAvailability: operating.sourceAvailability === "unavailable",
    broadbandBackhaul: operating.broadbandBackhaul === "unavailable",
    applicationService: operating.applicationService === "unavailable",
    authorizationPolicy: operating.authorizationPolicy === "not-ready",
    partnerInterworking: operating.partnerInterworking === "not-ready",
  };

  return blockerOrder.filter(
    (condition) => required.includes(condition) && blocked[condition],
  );
}

function expectedStatus(feed, recipient, operating) {
  if (!feed.recipientIds.includes(recipient.id)) {
    return "not-applicable";
  }

  const blockers = expectedBlockers(feed, recipient, operating);

  if (blockers.length === 0) {
    return "available";
  }

  const mode = getDegradedModeById(operating.degradedMode);
  const eligibleAlternate =
    mode.id !== "none" &&
    mode.eligibleLayers.includes(feed.layerId) &&
    blockers.every((blocker) => mode.bypasses.includes(blocker));

  return eligibleAlternate ? "conditional" : "unavailable";
}

function verifyExhaustiveDeliveryMatrix() {
  const combinations = allOperatingCombinations();
  let checkedCells = 0;

  for (const drill of INCIDENT_DRILLS) {
    for (const operating of combinations) {
      for (const feed of drill.feeds) {
        for (const recipient of drill.recipients) {
          const result = deriveFeedRecipientStatus(
            drill.id,
            feed.id,
            recipient.id,
            operating,
          );
          const blockers = expectedBlockers(feed, recipient, operating);
          const statusId = expectedStatus(feed, recipient, operating);

          assert.equal(result.statusId, statusId);
          assert.equal(result.status, SIGNAL_STATUSES[statusId].label);
          assert.deepEqual(
            result.blockers.map((blocker) => blocker.id),
            feed.recipientIds.includes(recipient.id) ? blockers : [],
          );
          assert.equal(
            result.firstBlocker?.id ?? null,
            feed.recipientIds.includes(recipient.id)
              ? (blockers[0] ?? null)
              : null,
          );

          if (statusId === "available" || statusId === "not-applicable") {
            assert.equal(result.alternatePath, null);
            assert.deepEqual(result.informationLoss, []);
          } else {
            assert.ok(result.informationLoss.length > 0);
          }

          if (statusId === "conditional") {
            assert.ok(result.alternatePath);
            assert.equal(result.alternatePath.automatic, false);
            assert.equal(
              result.alternatePath.modeId,
              operating.degradedMode,
            );
            assert.ok(
              ["broadbandBackhaul", "applicationService"].includes(
                result.firstBlocker.id,
              ),
            );
          } else {
            assert.equal(result.alternatePath, null);
          }

          checkedCells += 1;
        }
      }

      const state = {
        ...createInitialIncidentSignalState(),
        drillId: drill.id,
        perspectiveId: drill.perspectives[0].id,
        selectedFeedId: drill.feeds[0].id,
        selectedRecipientId: drill.recipients[0].id,
        operating,
      };
      const derived = deriveIncidentSignalBoard(state);

      assert.equal(derived.matrix.length, 12);
      assert.equal(derived.coordinationBoard.feeds.length, 4);
      assert.equal(derived.alternatePaths.automatic, false);
      assert.ok(
        derived.alternatePaths.active.every(
          (cell) => cell.statusId === "conditional",
        ),
      );
      assert.deepEqual(
        derived.coordinationBoard.feeds,
        derived.matrix.filter((cell) =>
          cell.recipient.isCoordinationBoard,
        ),
      );
    }
  }

  assert.equal(checkedCells, 3 * 96 * 4 * 3);
}

function verifyAlternatePathScope() {
  for (const drill of INCIDENT_DRILLS) {
    for (const blockedCondition of [
      "broadbandBackhaul",
      "applicationService",
    ]) {
      const blockedOperating = {
        ...DEFAULT_OPERATING_STATE,
        [blockedCondition]: "unavailable",
      };
      const noAlternate = deriveIncidentSignalBoard({
        ...createInitialIncidentSignalState(),
        drillId: drill.id,
        perspectiveId: drill.perspectives[0].id,
        selectedFeedId: drill.feeds[0].id,
        selectedRecipientId: drill.recipients[0].id,
        operating: blockedOperating,
      });
      assert.ok(
        noAlternate.matrix
          .filter((cell) => cell.statusId !== "not-applicable")
          .every((cell) => cell.statusId === "unavailable"),
      );
      assert.equal(noAlternate.alternatePaths.active.length, 0);

      const local = deriveIncidentSignalBoard({
        ...createInitialIncidentSignalState(),
        drillId: drill.id,
        perspectiveId: drill.perspectives[0].id,
        selectedFeedId: drill.feeds[0].id,
        selectedRecipientId: drill.recipients[0].id,
        operating: {
          ...blockedOperating,
          degradedMode: "local-deployable",
        },
      });
      assert.ok(
        local.matrix
          .filter((cell) => cell.statusId !== "not-applicable")
          .every((cell) => cell.statusId === "conditional"),
      );

      const lmr = deriveIncidentSignalBoard({
        ...createInitialIncidentSignalState(),
        drillId: drill.id,
        perspectiveId: drill.perspectives[0].id,
        selectedFeedId: drill.feeds[0].id,
        selectedRecipientId: drill.recipients[0].id,
        operating: { ...blockedOperating, degradedMode: "lmr" },
      });

      for (const cell of lmr.matrix) {
        if (cell.statusId === "not-applicable") {
          continue;
        }

        assert.equal(
          cell.statusId,
          cell.feed.layerId === "instructions-alerts"
            ? "conditional"
            : "unavailable",
        );
      }
    }

    for (const [condition, unavailableValue] of [
      ["sourceAvailability", "unavailable"],
      ["authorizationPolicy", "not-ready"],
    ]) {
      const derived = deriveIncidentSignalBoard({
        ...createInitialIncidentSignalState(),
        drillId: drill.id,
        perspectiveId: drill.perspectives[0].id,
        selectedFeedId: drill.feeds[0].id,
        selectedRecipientId: drill.recipients[0].id,
        operating: {
          ...DEFAULT_OPERATING_STATE,
          [condition]: unavailableValue,
          degradedMode: "local-deployable",
        },
      });

      assert.ok(
        derived.matrix
          .filter((cell) => cell.statusId !== "not-applicable")
          .every((cell) => cell.statusId === "unavailable"),
        `${condition} must never be bypassed by a degraded mode`,
      );
      assert.equal(derived.alternatePaths.active.length, 0);
    }
  }
}

function verifyPartnerAndAuthorizationSemantics() {
  for (const drill of INCIDENT_DRILLS) {
    const ready = deriveIncidentSignalBoard({
      ...createInitialIncidentSignalState(),
      drillId: drill.id,
      perspectiveId: drill.perspectives[0].id,
      selectedFeedId: drill.feeds[0].id,
      selectedRecipientId: drill.recipients[0].id,
      operating: DEFAULT_OPERATING_STATE,
    });
    const noInterworking = deriveIncidentSignalBoard({
      ...createInitialIncidentSignalState(),
      drillId: drill.id,
      perspectiveId: drill.perspectives[0].id,
      selectedFeedId: drill.feeds[0].id,
      selectedRecipientId: drill.recipients[0].id,
      operating: {
        ...DEFAULT_OPERATING_STATE,
        partnerInterworking: "not-ready",
      },
    });

    for (const readyCell of ready.matrix) {
      const changedCell = noInterworking.matrix.find(
        (cell) => cell.id === readyCell.id,
      );

      if (
        readyCell.recipient.requiresPartnerInterworking &&
        readyCell.statusId !== "not-applicable"
      ) {
        assert.equal(changedCell.statusId, "unavailable");
        assert.equal(changedCell.firstBlocker.id, "partnerInterworking");
      } else {
        assert.deepEqual(changedCell, readyCell);
      }
    }

    assert.deepEqual(
      noInterworking.coordinationBoard.feeds,
      ready.coordinationBoard.feeds,
      "Partner interworking must not alter the internal coordination-board path",
    );

    const noAuthorization = deriveIncidentSignalBoard({
      ...createInitialIncidentSignalState(),
      drillId: drill.id,
      perspectiveId: drill.perspectives[0].id,
      selectedFeedId: drill.feeds[0].id,
      selectedRecipientId: drill.recipients[0].id,
      operating: {
        ...DEFAULT_OPERATING_STATE,
        authorizationPolicy: "not-ready",
      },
    });
    assert.ok(
      noAuthorization.matrix
        .filter((cell) => cell.statusId !== "not-applicable")
        .every(
          (cell) =>
            cell.statusId === "unavailable" &&
            cell.blockers.some(
              (blocker) => blocker.id === "authorizationPolicy",
            ),
        ),
    );
  }
}

function reduce(state, action) {
  return incidentSignalReducer(state, action);
}

function verifyStateAndWhatChanged() {
  const first = createInitialIncidentSignalState();
  const second = createInitialIncidentSignalState();
  assert.deepEqual(first, second);
  assert.notEqual(first, second);
  assert.notEqual(first.operating, second.operating);
  assert.notEqual(first.enabledLayerIds, second.enabledLayerIds);
  assert.equal(first.drillId, DEFAULT_DRILL_ID);
  assert.deepEqual(first.operating, DEFAULT_OPERATING_STATE);
  assert.deepEqual(first.enabledLayerIds, expectedLayerIds);
  assert.equal(first.previous, null);
  assert.equal(first.revision, 0);

  let state = reduce(first, {
    type: "set-operating-condition",
    condition: "broadbandBackhaul",
    value: "unavailable",
  });
  assert.equal(state.revision, 1);
  assert.deepEqual(state.previous.operating, DEFAULT_OPERATING_STATE);
  let derived = deriveIncidentSignalBoard(state);
  assert.equal(derived.selectedDelivery.status, "Unavailable");
  assert.equal(derived.firstBlocker.id, "broadbandBackhaul");
  assert.equal(derived.whatChanged.fromStatus, "Available");
  assert.equal(derived.whatChanged.toStatus, "Unavailable");
  assert.match(derived.whatChanged.title, /Broadband \/ backhaul/u);

  state = reduce(state, {
    type: "set-operating-condition",
    condition: "degradedMode",
    value: "local-deployable",
  });
  derived = deriveIncidentSignalBoard(state);
  assert.equal(derived.selectedDelivery.status, "Conditional");
  assert.equal(derived.whatChanged.fromStatus, "Unavailable");
  assert.equal(derived.whatChanged.toStatus, "Conditional");
  assert.match(derived.whatChanged.body, /never automatically/u);

  const beforeLayerToggle = derived;
  state = reduce(state, { type: "toggle-layer", layerId: "video-thermal" });
  derived = deriveIncidentSignalBoard(state);
  assert.equal(derived.enabledLayerIds.includes("video-thermal"), false);
  assert.equal(derived.visibleFeeds.length, 3);
  assert.equal(derived.visibleMatrix.length, 9);
  assert.deepEqual(derived.matrix, beforeLayerToggle.matrix);
  assert.deepEqual(
    derived.coordinationBoard.informationLoss,
    beforeLayerToggle.coordinationBoard.informationLoss,
  );
  assert.match(derived.whatChanged.body, /view/u);

  for (const layerId of [
    "instructions-alerts",
    "sensor-telemetry",
    "asset-location",
  ]) {
    state = reduce(state, { type: "toggle-layer", layerId });
  }
  assert.deepEqual(state.enabledLayerIds, ["asset-location"]);
  const finalLayerNoOp = reduce(state, {
    type: "toggle-layer",
    layerId: "asset-location",
  });
  assert.equal(finalLayerNoOp, state);

  state = reduce(state, {
    type: "select-drill",
    drillId: "smart-building-safety",
  });
  const building = getDrillById("smart-building-safety");
  assert.equal(state.perspectiveId, building.perspectives[0].id);
  assert.equal(state.selectedFeedId, building.feeds[0].id);
  assert.equal(state.selectedRecipientId, building.perspectives[0].recipientId);
  assert.equal(state.operating.broadbandBackhaul, "unavailable");
  assert.equal(state.enabledLayerIds.length, 1);
  assert.match(deriveIncidentSignalBoard(state).whatChanged.title, /Drill changed/u);

  state = reduce(state, {
    type: "select-perspective",
    perspectiveId: "fire-response",
  });
  assert.equal(state.selectedRecipientId, "fire-response");
  assert.match(
    deriveIncidentSignalBoard(state).whatChanged.title,
    /Perspective changed/u,
  );

  state = reduce(state, {
    type: "select-feed",
    feedId: "building-sensors",
  });
  assert.match(deriveIncidentSignalBoard(state).whatChanged.title, /Feed focus/u);

  state = reduce(state, {
    type: "select-recipient",
    recipientId: "building-operations",
  });
  assert.match(deriveIncidentSignalBoard(state).whatChanged.title, /Recipient/u);

  assert.equal(reduce(state, { type: "unknown" }), state);
  assert.equal(
    reduce(state, { type: "select-drill", drillId: "unknown" }),
    state,
  );
  assert.equal(
    reduce(state, {
      type: "set-operating-condition",
      condition: "broadbandBackhaul",
      value: "satellite",
    }),
    state,
  );
  assert.equal(
    reduce(state, { type: "toggle-layer", layerId: "unknown" }),
    state,
  );

  const reset = reduce(state, { type: "reset" });
  assert.deepEqual(reset, createInitialIncidentSignalState());
  assert.deepEqual(
    deriveIncidentSignalBoard(reset),
    deriveIncidentSignalBoard(createInitialIncidentSignalState()),
    "Reset/default derivation must be deterministic",
  );
}

function verifyFirstBlockerOrderAndInformationLoss() {
  for (const drill of INCIDENT_DRILLS) {
    const recipient = drill.recipients.find(
      (candidate) => candidate.requiresPartnerInterworking,
    );
    const applicableFeed = drill.feeds.find((feed) =>
      feed.recipientIds.includes(recipient.id),
    );
    const allBlocked = deriveFeedRecipientStatus(
      drill.id,
      applicableFeed.id,
      recipient.id,
      {
        sourceAvailability: "unavailable",
        broadbandBackhaul: "unavailable",
        applicationService: "unavailable",
        authorizationPolicy: "not-ready",
        partnerInterworking: "not-ready",
        degradedMode: "local-deployable",
      },
    );
    assert.deepEqual(
      allBlocked.blockers.map((blocker) => blocker.id),
      blockerOrder,
    );
    assert.equal(allBlocked.firstBlocker.id, "sourceAvailability");
    assert.equal(allBlocked.statusId, "unavailable");
    assert.equal(allBlocked.alternatePath, null);
    assert.equal(allBlocked.informationLoss.length, blockerOrder.length);
  }
}

async function verifyRuntimeBoundaries() {
  const source = await readFile(modelPath, "utf8");
  const forbiddenPatterns = [
    [
      "network request API",
      /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bEventSource\b|\bsendBeacon\b/u,
    ],
    [
      "browser persistence",
      /\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b|document\.cookie/u,
    ],
    [
      "sensor or permission access",
      /navigator\.|DeviceMotionEvent|DeviceOrientationEvent/u,
    ],
    ["timer", /\bsetTimeout\s*\(|\bsetInterval\s*\(/u],
    ["randomness", /\bMath\.random\s*\(|\bcrypto\.getRandomValues\b/u],
    ["dynamic execution", /\beval\s*\(|\bFunction\s*\(/u],
    ["unsafe HTML", /dangerouslySetInnerHTML/u],
    [
      "invented performance value",
      /\b\d+(?:\.\d+)?\s*(?:ms|Mbps|Mbit\/s|Gbps|Gbit\/s|km\/h)\b/iu,
    ],
    [
      "invented incident outcome",
      /lives saved|response time improved|incident resolved|casualties prevented/iu,
    ],
    ["automatic fallback", /automatic\s*:\s*true/u],
  ];

  for (const [label, pattern] of forbiddenPatterns) {
    assert.doesNotMatch(source, pattern, `${label} must not appear in model`);
  }

  assert.match(source, /models information reachability/u);
  assert.match(source, /never selects a fallback automatically/u);
  assert.match(source, /MCX is not presented as a feature of the original paper/u);
}

verifyManifestAndEvidence();
verifyDrillCompleteness();
verifyExhaustiveDeliveryMatrix();
verifyAlternatePathScope();
verifyPartnerAndAuthorizationSemantics();
verifyStateAndWhatChanged();
verifyFirstBlockerOrderAndInformationLoss();
await verifyRuntimeBoundaries();

console.log(
  "5G public-safety signal verification passed: 3 drills, 96 operating combinations per drill, 3,456 feed-recipient cells, scoped alternates, evidence boundaries, reducer history and runtime guards all hold.",
);
