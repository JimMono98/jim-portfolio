// Pure, browser-independent model for the portfolio's public-safety signal board.
// It represents information reachability and explicit alternate-path choices,
// never network performance, automatic failover, or an operational outcome.

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value);
}

export const EVIDENCE_BADGES = deepFreeze({
  paper: {
    id: "paper",
    label: "Original paper evidence",
    description:
      "A concept or use case described in the preserved university paper.",
  },
  current: {
    id: "current",
    label: "Current standards context",
    description:
      "Contemporary public-safety communications context, kept separate from the original paper.",
  },
  reconstruction: {
    id: "reconstruction",
    label: "Portfolio reconstruction",
    description:
      "A deterministic explanatory model created for this portfolio experience.",
  },
});

export const SIGNAL_STATUSES = deepFreeze({
  available: {
    id: "available",
    label: "Available",
    tone: "available",
    description: "The modeled primary information path is open.",
  },
  conditional: {
    id: "conditional",
    label: "Conditional",
    tone: "conditional",
    description:
      "The primary path is blocked, but the explicitly selected alternate can carry a scoped form of this feed.",
  },
  unavailable: {
    id: "unavailable",
    label: "Unavailable",
    tone: "unavailable",
    description:
      "At least one required condition blocks this feed for this recipient.",
  },
  "not-applicable": {
    id: "not-applicable",
    label: "Not applicable",
    tone: "neutral",
    description: "This feed is not routed to this recipient in the selected drill.",
  },
});

export const SIGNAL_LAYERS = deepFreeze([
  {
    id: "instructions-alerts",
    label: "Instructions / alerts",
    shortLabel: "Instructions",
    description:
      "Human-readable directions, warnings, acknowledgements and incident updates.",
    evidenceId: "reconstruction",
  },
  {
    id: "video-thermal",
    label: "Video / thermal",
    shortLabel: "Visual",
    description:
      "Camera or thermal imagery that can add visual context to an incident.",
    evidenceId: "paper",
  },
  {
    id: "sensor-telemetry",
    label: "Sensor telemetry",
    shortLabel: "Telemetry",
    description:
      "Machine observations and equipment state carried as structured data.",
    evidenceId: "paper",
  },
  {
    id: "asset-location",
    label: "Asset / location",
    shortLabel: "Location",
    description:
      "The modeled position or assignment of a responder, vehicle, device or incident zone.",
    evidenceId: "reconstruction",
  },
]);

export const OPERATING_CONDITIONS = deepFreeze({
  sourceAvailability: {
    id: "sourceAvailability",
    label: "Source availability",
    description: "Whether the endpoint can produce the selected information.",
    options: [
      { value: "available", label: "Available" },
      { value: "unavailable", label: "Unavailable" },
    ],
  },
  broadbandBackhaul: {
    id: "broadbandBackhaul",
    label: "Broadband / backhaul",
    description:
      "Whether the modeled primary broadband path can carry the information onward.",
    options: [
      { value: "available", label: "Available" },
      { value: "unavailable", label: "Unavailable" },
    ],
  },
  applicationService: {
    id: "applicationService",
    label: "Application service",
    description:
      "Whether the shared application can process and present incident information.",
    options: [
      { value: "available", label: "Available" },
      { value: "unavailable", label: "Unavailable" },
    ],
  },
  authorizationPolicy: {
    id: "authorizationPolicy",
    label: "Authorization / group policy",
    description:
      "Whether the modeled recipient is authorized for the information path.",
    options: [
      { value: "ready", label: "Ready" },
      { value: "not-ready", label: "Not ready" },
    ],
  },
  partnerInterworking: {
    id: "partnerInterworking",
    label: "Partner interworking",
    description:
      "Whether an authorized cross-organization recipient can join the modeled path.",
    options: [
      { value: "ready", label: "Ready" },
      { value: "not-ready", label: "Not ready" },
    ],
  },
});

export const DEGRADED_MODES = deepFreeze([
  {
    id: "none",
    label: "No alternate selected",
    shortLabel: "None",
    evidenceId: "reconstruction",
    eligibleLayers: [],
    bypasses: [],
    description:
      "Only the primary modeled path is evaluated. The board never selects a fallback automatically.",
  },
  {
    id: "local-deployable",
    label: "Local / deployable system",
    shortLabel: "Local / deployable",
    evidenceId: "current",
    eligibleLayers: SIGNAL_LAYERS.map((layer) => layer.id),
    bypasses: ["broadbandBackhaul", "applicationService"],
    description:
      "An explicitly selected, incident-local path may carry scoped information when the wider broadband or application path is unavailable.",
  },
  {
    id: "lmr",
    label: "LMR voice path",
    shortLabel: "LMR",
    evidenceId: "current",
    eligibleLayers: ["instructions-alerts"],
    bypasses: ["broadbandBackhaul", "applicationService"],
    description:
      "An explicitly selected land-mobile-radio path can preserve a voice-oriented instruction or alert, not the other structured feeds.",
  },
]);

export const DEFAULT_OPERATING_STATE = deepFreeze({
  sourceAvailability: "available",
  broadbandBackhaul: "available",
  applicationService: "available",
  authorizationPolicy: "ready",
  partnerInterworking: "ready",
  degradedMode: "none",
});

export const STANDARDS_CONTEXT = deepFreeze([
  {
    id: "mcx",
    label: "3GPP mission-critical services (MCX)",
    evidenceId: "current",
    description:
      "Current service context for authorized mission-critical voice, data and video. MCX is not presented as a feature of the original paper.",
  },
  {
    id: "lmr",
    label: "Land mobile radio (LMR)",
    evidenceId: "current",
    description:
      "A current public-safety communications context represented here only as a scoped, voice-oriented alternate.",
  },
  {
    id: "signal-board",
    label: "Incident signal board",
    evidenceId: "reconstruction",
    description:
      "The shared feed-recipient matrix is a portfolio reconstruction, not a recovered deployment architecture.",
  },
]);

const COMMON_REQUIREMENTS = [
  "sourceAvailability",
  "broadbandBackhaul",
  "applicationService",
  "authorizationPolicy",
];

const drillDefinitions = [
  {
    id: "remote-area-search",
    shortTitle: "Remote-area search",
    title: "Remote-area search & rescue",
    domain: "Emergency response",
    summary:
      "Search teams, an aerial endpoint and partner responders coordinate incident information across difficult terrain.",
    evidenceNote:
      "The paper discusses emergency-service communications and UAVs used for inaccessible-area search, responder direction, thermal imagery and delivery of rescue supplies.",
    opportunity:
      "A shared broadband path can bring instructions, aerial context and location information into one coordination view when every required layer is available.",
    constraint:
      "Connectivity does not locate a missing person, make an aerial system safe, authorize data sharing or replace responder judgment.",
    perspectives: [
      {
        id: "incident-command",
        label: "Incident command",
        recipientId: "coordination-board",
        focus: "Coordinate the common information picture and issue instructions.",
      },
      {
        id: "search-team",
        label: "Field search team",
        recipientId: "field-search-team",
        focus: "Use relevant incident information while operating in the search area.",
      },
      {
        id: "medical-partner",
        label: "Medical partner",
        recipientId: "medical-partner",
        focus: "Receive only the information routed to the supporting partner workflow.",
      },
    ],
    recipients: [
      {
        id: "coordination-board",
        label: "Coordination board",
        shortLabel: "Command",
        isCoordinationBoard: true,
        requiresPartnerInterworking: false,
      },
      {
        id: "field-search-team",
        label: "Field search team",
        shortLabel: "Search team",
        isCoordinationBoard: false,
        requiresPartnerInterworking: false,
      },
      {
        id: "medical-partner",
        label: "Medical response partner",
        shortLabel: "Medical",
        isCoordinationBoard: false,
        requiresPartnerInterworking: true,
      },
    ],
    feeds: [
      {
        id: "search-instructions",
        layerId: "instructions-alerts",
        title: "Search instructions",
        source: "Incident command",
        payload: "Search-area directions and incident alerts",
        evidenceId: "paper",
        routeEvidenceId: "reconstruction",
        recipientIds: [
          "coordination-board",
          "field-search-team",
          "medical-partner",
        ],
      },
      {
        id: "aerial-visual",
        layerId: "video-thermal",
        title: "Aerial video / thermal context",
        source: "UAV camera or thermal sensor",
        payload: "Visual and thermal incident context",
        evidenceId: "paper",
        routeEvidenceId: "reconstruction",
        recipientIds: ["coordination-board", "field-search-team"],
      },
      {
        id: "aerial-telemetry",
        layerId: "sensor-telemetry",
        title: "Aerial platform telemetry",
        source: "UAV sensing endpoint",
        payload: "Platform and sensor state",
        evidenceId: "paper",
        routeEvidenceId: "reconstruction",
        recipientIds: ["coordination-board", "field-search-team"],
      },
      {
        id: "search-assets",
        layerId: "asset-location",
        title: "Search assets / zones",
        source: "Incident assignment state",
        payload: "Modeled responder, vehicle and search-zone positions",
        evidenceId: "reconstruction",
        routeEvidenceId: "reconstruction",
        recipientIds: [
          "coordination-board",
          "field-search-team",
          "medical-partner",
        ],
      },
    ],
  },
  {
    id: "smart-building-safety",
    shortTitle: "Smart-building safety",
    title: "Smart-building safety response",
    domain: "Connected buildings",
    summary:
      "Building operations and public-safety teams inspect alerts, visual context and sensor state during a building incident.",
    evidenceNote:
      "The paper discusses smart-building IoT sensing, actuators, occupancy, security monitoring, environmental control and emergency-service coordination.",
    opportunity:
      "Connected building information can give operations and responders a shared view of alerts, spaces and equipment state.",
    constraint:
      "A network does not validate a sensor, guarantee life safety, authorize surveillance or replace building and emergency procedures.",
    perspectives: [
      {
        id: "public-safety-command",
        label: "Public-safety command",
        recipientId: "coordination-board",
        focus: "Coordinate selected building and response information.",
      },
      {
        id: "building-operations",
        label: "Building operations",
        recipientId: "building-operations",
        focus: "Inspect building systems and communicate local operating state.",
      },
      {
        id: "fire-response",
        label: "Fire response partner",
        recipientId: "fire-response",
        focus: "Receive authorized incident information routed across organizations.",
      },
    ],
    recipients: [
      {
        id: "coordination-board",
        label: "Coordination board",
        shortLabel: "Command",
        isCoordinationBoard: true,
        requiresPartnerInterworking: false,
      },
      {
        id: "building-operations",
        label: "Building operations",
        shortLabel: "Operations",
        isCoordinationBoard: false,
        requiresPartnerInterworking: false,
      },
      {
        id: "fire-response",
        label: "Fire response partner",
        shortLabel: "Fire response",
        isCoordinationBoard: false,
        requiresPartnerInterworking: true,
      },
    ],
    feeds: [
      {
        id: "building-alerts",
        layerId: "instructions-alerts",
        title: "Building safety alerts",
        source: "Building or incident workflow",
        payload: "Warnings, instructions and acknowledgements",
        evidenceId: "paper",
        routeEvidenceId: "reconstruction",
        recipientIds: [
          "coordination-board",
          "building-operations",
          "fire-response",
        ],
      },
      {
        id: "building-visual",
        layerId: "video-thermal",
        title: "Building visual context",
        source: "Authorized security camera",
        payload: "Selected incident-area video",
        evidenceId: "paper",
        routeEvidenceId: "reconstruction",
        recipientIds: ["coordination-board", "building-operations"],
      },
      {
        id: "building-sensors",
        layerId: "sensor-telemetry",
        title: "Building sensor state",
        source: "IoT sensors and building controls",
        payload: "Occupancy, environment and equipment state",
        evidenceId: "paper",
        routeEvidenceId: "reconstruction",
        recipientIds: [
          "coordination-board",
          "building-operations",
          "fire-response",
        ],
      },
      {
        id: "building-zones",
        layerId: "asset-location",
        title: "Incident zones / response assets",
        source: "Modeled incident assignment state",
        payload: "Affected zones and response assignments",
        evidenceId: "reconstruction",
        routeEvidenceId: "reconstruction",
        recipientIds: ["coordination-board", "fire-response"],
      },
    ],
  },
  {
    id: "connected-road-response",
    shortTitle: "Connected-road response",
    title: "Connected-road incident response",
    domain: "Transportation",
    summary:
      "Vehicle, roadside and authority information is routed into a coordinated road-incident workflow.",
    evidenceNote:
      "The paper discusses connected vehicles, onboard sensing, vehicle-to-vehicle and infrastructure communication, authority alerts and traffic-signal coordination.",
    opportunity:
      "Connected road information can help authorities and responders assemble incident context and coordinate a response path.",
    constraint:
      "Connectivity does not make a vehicle autonomous, validate sensor interpretation, prevent a collision or authorize every data recipient.",
    perspectives: [
      {
        id: "transport-command",
        label: "Transport command",
        recipientId: "coordination-board",
        focus: "Coordinate selected vehicle, road and response information.",
      },
      {
        id: "traffic-management",
        label: "Traffic management",
        recipientId: "traffic-management",
        focus: "Inspect traffic and infrastructure information relevant to the incident.",
      },
      {
        id: "roadside-response",
        label: "Roadside response partner",
        recipientId: "roadside-response",
        focus: "Receive authorized information for a field response workflow.",
      },
    ],
    recipients: [
      {
        id: "coordination-board",
        label: "Coordination board",
        shortLabel: "Command",
        isCoordinationBoard: true,
        requiresPartnerInterworking: false,
      },
      {
        id: "traffic-management",
        label: "Traffic management",
        shortLabel: "Traffic",
        isCoordinationBoard: false,
        requiresPartnerInterworking: false,
      },
      {
        id: "roadside-response",
        label: "Roadside response partner",
        shortLabel: "Roadside",
        isCoordinationBoard: false,
        requiresPartnerInterworking: true,
      },
    ],
    feeds: [
      {
        id: "road-alerts",
        layerId: "instructions-alerts",
        title: "Road incident instructions",
        source: "Transport or incident authority",
        payload: "Incident alerts and response directions",
        evidenceId: "paper",
        routeEvidenceId: "reconstruction",
        recipientIds: [
          "coordination-board",
          "traffic-management",
          "roadside-response",
        ],
      },
      {
        id: "road-visual",
        layerId: "video-thermal",
        title: "Vehicle / roadside visual context",
        source: "Vehicle or roadside camera",
        payload: "Selected road-incident imagery",
        evidenceId: "paper",
        routeEvidenceId: "reconstruction",
        recipientIds: ["coordination-board", "traffic-management"],
      },
      {
        id: "vehicle-telemetry",
        layerId: "sensor-telemetry",
        title: "Vehicle / infrastructure telemetry",
        source: "Connected vehicle or road sensor",
        payload: "Modeled vehicle and infrastructure state",
        evidenceId: "paper",
        routeEvidenceId: "reconstruction",
        recipientIds: ["coordination-board", "traffic-management"],
      },
      {
        id: "road-assets",
        layerId: "asset-location",
        title: "Incident / response location",
        source: "Modeled vehicle and response assignment state",
        payload: "Incident zone and response-asset positions",
        evidenceId: "reconstruction",
        routeEvidenceId: "reconstruction",
        recipientIds: [
          "coordination-board",
          "traffic-management",
          "roadside-response",
        ],
      },
    ],
  },
];

function decorateDrill(drill) {
  return {
    ...drill,
    evidenceId: "paper",
    reconstructionEvidenceId: "reconstruction",
    perspectives: drill.perspectives.map((perspective) => ({
      ...perspective,
      evidenceId: "reconstruction",
    })),
    recipients: drill.recipients.map((recipient) => ({
      ...recipient,
      evidenceId: "reconstruction",
    })),
    feeds: drill.feeds.map((feed, index) => ({
      ...feed,
      index,
      requirements: [...COMMON_REQUIREMENTS],
    })),
  };
}

export const INCIDENT_DRILLS = deepFreeze(drillDefinitions.map(decorateDrill));
export const DEFAULT_DRILL_ID = INCIDENT_DRILLS[0].id;

export const INCIDENT_SIGNAL_MANIFEST = deepFreeze({
  evidenceBadges: EVIDENCE_BADGES,
  statuses: SIGNAL_STATUSES,
  layers: SIGNAL_LAYERS,
  operatingConditions: OPERATING_CONDITIONS,
  degradedModes: DEGRADED_MODES,
  standardsContext: STANDARDS_CONTEXT,
  drills: INCIDENT_DRILLS,
  notice:
    "Interactive portfolio reconstruction based on the paper's public-safety use cases. It models information reachability, not a live network, automatic failover, response performance or incident outcome.",
});

function getDrillById(drillId) {
  return INCIDENT_DRILLS.find((drill) => drill.id === drillId) ?? null;
}

export { getDrillById };

function resolveDrill(drillId) {
  return getDrillById(drillId) ?? INCIDENT_DRILLS[0];
}

export function getLayerById(layerId) {
  return SIGNAL_LAYERS.find((layer) => layer.id === layerId) ?? null;
}

export function getDegradedModeById(modeId) {
  return DEGRADED_MODES.find((mode) => mode.id === modeId) ?? null;
}

function snapshotState(state) {
  return {
    drillId: state.drillId,
    perspectiveId: state.perspectiveId,
    selectedFeedId: state.selectedFeedId,
    selectedRecipientId: state.selectedRecipientId,
    enabledLayerIds: [...state.enabledLayerIds],
    operating: { ...state.operating },
  };
}

export function createInitialIncidentSignalState() {
  const drill = INCIDENT_DRILLS[0];
  const perspective = drill.perspectives[0];

  return {
    drillId: drill.id,
    perspectiveId: perspective.id,
    selectedFeedId: drill.feeds[0].id,
    selectedRecipientId: perspective.recipientId,
    enabledLayerIds: SIGNAL_LAYERS.map((layer) => layer.id),
    operating: { ...DEFAULT_OPERATING_STATE },
    previous: null,
    revision: 0,
  };
}

export const initialIncidentSignalState = deepFreeze(
  createInitialIncidentSignalState(),
);

function isValidOperatingValue(condition, value) {
  if (condition === "degradedMode") {
    return Boolean(getDegradedModeById(value));
  }

  return Boolean(
    OPERATING_CONDITIONS[condition]?.options.some(
      (option) => option.value === value,
    ),
  );
}

function commitState(state, patch) {
  return {
    ...state,
    ...patch,
    previous: snapshotState(state),
    revision: state.revision + 1,
  };
}

export function incidentSignalReducer(state, action) {
  switch (action.type) {
    case "select-drill": {
      const drill = getDrillById(action.drillId);

      if (!drill || drill.id === state.drillId) {
        return state;
      }

      const perspective = drill.perspectives[0];

      return commitState(state, {
        drillId: drill.id,
        perspectiveId: perspective.id,
        selectedFeedId: drill.feeds[0].id,
        selectedRecipientId: perspective.recipientId,
      });
    }
    case "select-perspective": {
      const drill = resolveDrill(state.drillId);
      const perspective = drill.perspectives.find(
        (candidate) => candidate.id === action.perspectiveId,
      );

      if (!perspective || perspective.id === state.perspectiveId) {
        return state;
      }

      return commitState(state, {
        perspectiveId: perspective.id,
        selectedRecipientId: perspective.recipientId,
      });
    }
    case "select-feed": {
      const drill = resolveDrill(state.drillId);

      if (
        !drill.feeds.some((feed) => feed.id === action.feedId) ||
        action.feedId === state.selectedFeedId
      ) {
        return state;
      }

      return commitState(state, { selectedFeedId: action.feedId });
    }
    case "select-recipient": {
      const drill = resolveDrill(state.drillId);

      if (
        !drill.recipients.some(
          (recipient) => recipient.id === action.recipientId,
        ) ||
        action.recipientId === state.selectedRecipientId
      ) {
        return state;
      }

      return commitState(state, { selectedRecipientId: action.recipientId });
    }
    case "toggle-layer": {
      if (!getLayerById(action.layerId)) {
        return state;
      }

      const isEnabled = state.enabledLayerIds.includes(action.layerId);

      if (isEnabled && state.enabledLayerIds.length === 1) {
        return state;
      }

      const enabledLayerIds = isEnabled
        ? state.enabledLayerIds.filter((layerId) => layerId !== action.layerId)
        : SIGNAL_LAYERS.map((layer) => layer.id).filter(
            (layerId) =>
              state.enabledLayerIds.includes(layerId) ||
              layerId === action.layerId,
          );

      return commitState(state, { enabledLayerIds });
    }
    case "set-operating-condition": {
      if (!isValidOperatingValue(action.condition, action.value)) {
        return state;
      }

      if (state.operating[action.condition] === action.value) {
        return state;
      }

      return commitState(state, {
        operating: {
          ...state.operating,
          [action.condition]: action.value,
        },
      });
    }
    case "reset":
      return createInitialIncidentSignalState();
    default:
      return state;
  }
}

const CONDITION_ORDER = [
  "sourceAvailability",
  "broadbandBackhaul",
  "applicationService",
  "authorizationPolicy",
  "partnerInterworking",
];

function assertOperatingState(operating) {
  for (const condition of Object.keys(OPERATING_CONDITIONS)) {
    if (!isValidOperatingValue(condition, operating?.[condition])) {
      throw new TypeError(`Invalid ${condition} operating value.`);
    }
  }

  if (!isValidOperatingValue("degradedMode", operating?.degradedMode)) {
    throw new TypeError("Invalid degradedMode operating value.");
  }
}

function conditionIsReady(condition, value) {
  switch (condition) {
    case "sourceAvailability":
    case "broadbandBackhaul":
    case "applicationService":
      return value === "available";
    case "authorizationPolicy":
    case "partnerInterworking":
      return value === "ready";
    default:
      return false;
  }
}

function deriveBlocker(condition) {
  return {
    id: condition,
    label: OPERATING_CONDITIONS[condition].label,
    evidenceId: "reconstruction",
  };
}

function primaryBlockers(feed, recipient, operating) {
  const requirements = recipient.requiresPartnerInterworking
    ? [...feed.requirements, "partnerInterworking"]
    : feed.requirements;

  return CONDITION_ORDER.filter(
    (condition) =>
      requirements.includes(condition) &&
      !conditionIsReady(condition, operating[condition]),
  ).map(deriveBlocker);
}

function informationLossForBlocker(blockerId, layer) {
  switch (blockerId) {
    case "sourceAvailability":
      return `No ${layer.shortLabel.toLowerCase()} information enters the modeled path because its source is unavailable.`;
    case "broadbandBackhaul":
      return `The primary broadband path cannot carry the ${layer.shortLabel.toLowerCase()} feed.`;
    case "applicationService":
      return `The shared application cannot present the ${layer.shortLabel.toLowerCase()} feed.`;
    case "authorizationPolicy":
      return `The ${layer.shortLabel.toLowerCase()} feed is withheld because authorization / group policy is not ready.`;
    case "partnerInterworking":
      return `The partner recipient cannot receive the ${layer.shortLabel.toLowerCase()} feed through the modeled interworking path.`;
    default:
      return "The selected information path is unavailable.";
  }
}

function deriveAlternatePath(feed, recipient, blockers, operating) {
  const mode = getDegradedModeById(operating.degradedMode);

  if (!mode || mode.id === "none" || blockers.length === 0) {
    return null;
  }

  if (!mode.eligibleLayers.includes(feed.layerId)) {
    return null;
  }

  if (!blockers.every((blocker) => mode.bypasses.includes(blocker.id))) {
    return null;
  }

  if (mode.id === "lmr") {
    return {
      id: `${mode.id}:${feed.id}:${recipient.id}`,
      modeId: mode.id,
      label: mode.label,
      evidenceId: mode.evidenceId,
      automatic: false,
      detail:
        "The selected LMR path carries a voice-oriented instruction or alert; it does not recreate the structured broadband feed.",
      informationLoss: [
        "Rich media, structured telemetry, location objects and shared application history do not travel through this modeled LMR path.",
      ],
    };
  }

  return {
    id: `${mode.id}:${feed.id}:${recipient.id}`,
    modeId: mode.id,
    label: mode.label,
    evidenceId: mode.evidenceId,
    automatic: false,
    detail:
      "The explicitly selected local / deployable path carries this feed within a scoped incident context.",
    informationLoss: [
      "Wider-area reach, central-service continuity and shared history are not represented by this local path.",
    ],
  };
}

export function deriveFeedRecipientStatus(
  drillId,
  feedId,
  recipientId,
  operating = DEFAULT_OPERATING_STATE,
) {
  assertOperatingState(operating);

  const drill = resolveDrill(drillId);
  const feed = drill.feeds.find((candidate) => candidate.id === feedId);
  const recipient = drill.recipients.find(
    (candidate) => candidate.id === recipientId,
  );

  if (!feed || !recipient) {
    throw new TypeError("Unknown feed or recipient for the selected drill.");
  }

  const layer = getLayerById(feed.layerId);
  const applicable = feed.recipientIds.includes(recipient.id);

  if (!applicable) {
    const status = SIGNAL_STATUSES["not-applicable"];

    return {
      id: `${feed.id}:${recipient.id}`,
      feed,
      recipient,
      layer,
      status: status.label,
      statusId: status.id,
      tone: status.tone,
      firstBlocker: null,
      blockers: [],
      alternatePath: null,
      informationLoss: [],
      evidenceId: "reconstruction",
      detail: "This drill does not route this feed to the selected recipient.",
    };
  }

  const blockers = primaryBlockers(feed, recipient, operating);
  const alternatePath = deriveAlternatePath(
    feed,
    recipient,
    blockers,
    operating,
  );
  const status =
    blockers.length === 0
      ? SIGNAL_STATUSES.available
      : alternatePath
        ? SIGNAL_STATUSES.conditional
        : SIGNAL_STATUSES.unavailable;
  const informationLoss = alternatePath
    ? alternatePath.informationLoss
    : blockers.map((blocker) => informationLossForBlocker(blocker.id, layer));

  return {
    id: `${feed.id}:${recipient.id}`,
    feed,
    recipient,
    layer,
    status: status.label,
    statusId: status.id,
    tone: status.tone,
    firstBlocker: blockers[0] ?? null,
    blockers,
    alternatePath,
    informationLoss,
    evidenceId: "reconstruction",
    detail:
      status.id === "available"
        ? "Every modeled condition for this primary feed-recipient path is ready."
        : status.id === "conditional"
          ? alternatePath.detail
          : informationLoss[0],
  };
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

function findFirstBlocker(cells) {
  for (const condition of CONDITION_ORDER) {
    const cell = cells.find((candidate) =>
      candidate.blockers.some((blocker) => blocker.id === condition),
    );

    if (cell) {
      return cell.blockers.find((blocker) => blocker.id === condition);
    }
  }

  return null;
}

function conditionValueLabel(condition, value) {
  if (condition === "degradedMode") {
    return getDegradedModeById(value)?.label ?? value;
  }

  return (
    OPERATING_CONDITIONS[condition]?.options.find(
      (option) => option.value === value,
    )?.label ?? value
  );
}

function deriveWhatChanged(state, current) {
  const previous = state.previous;

  if (!previous) {
    return {
      title: "Signal paths ready to inspect",
      body: `${current.selectedFeed.title} is focused for ${current.selectedRecipient.label}. Change one condition to inspect how the modeled path responds.`,
      evidenceId: "reconstruction",
      fromStatus: null,
      toStatus: current.selectedDelivery.status,
    };
  }

  let title;
  let body;

  if (previous.drillId !== state.drillId) {
    title = `Drill changed to ${current.drill.shortTitle}`;
    body = current.drill.summary;
  } else if (previous.perspectiveId !== state.perspectiveId) {
    title = `Perspective changed to ${current.perspective.label}`;
    body = current.perspective.focus;
  } else if (previous.selectedFeedId !== state.selectedFeedId) {
    title = `Feed focus changed to ${current.selectedFeed.title}`;
    body = `${current.selectedFeed.payload} is now evaluated for ${current.selectedRecipient.label}.`;
  } else if (previous.selectedRecipientId !== state.selectedRecipientId) {
    title = `Recipient changed to ${current.selectedRecipient.label}`;
    body = `The same feed is now evaluated against this recipient's modeled route and interworking requirements.`;
  } else {
    const changedLayerId = SIGNAL_LAYERS.find(
      (layer) =>
        previous.enabledLayerIds.includes(layer.id) !==
        state.enabledLayerIds.includes(layer.id),
    )?.id;
    const changedCondition = [
      ...Object.keys(OPERATING_CONDITIONS),
      "degradedMode",
    ].find(
      (condition) =>
        previous.operating[condition] !== state.operating[condition],
    );

    if (changedLayerId) {
      const layer = getLayerById(changedLayerId);
      const enabled = state.enabledLayerIds.includes(changedLayerId);
      title = `${layer.label} layer ${enabled ? "shown" : "hidden"}`;
      body =
        "Layer visibility changes only the board view; delivery statuses and modeled information loss remain unchanged.";
    } else if (changedCondition === "degradedMode") {
      const mode = getDegradedModeById(state.operating.degradedMode);
      title = `${mode.label} selected`;
      body =
        mode.id === "none"
          ? "No alternate is selected; blocked primary paths remain unavailable."
          : `${mode.description} It is applied only when an eligible primary path is blocked, never automatically.`;
    } else if (changedCondition) {
      const definition = OPERATING_CONDITIONS[changedCondition];
      const valueLabel = conditionValueLabel(
        changedCondition,
        state.operating[changedCondition],
      );
      title = `${definition.label}: ${valueLabel}`;
      body = current.selectedDelivery.firstBlocker
        ? `${current.selectedDelivery.firstBlocker.label} is the first blocker for the focused path. ${current.selectedDelivery.detail}`
        : `The focused path is ${current.selectedDelivery.status.toLowerCase()}. ${current.selectedDelivery.detail}`;
    } else {
      title = "Signal-board state unchanged";
      body = current.selectedDelivery.detail;
    }
  }

  let previousStatus = null;

  try {
    previousStatus = deriveFeedRecipientStatus(
      previous.drillId,
      previous.selectedFeedId,
      previous.selectedRecipientId,
      previous.operating,
    ).status;
  } catch {
    previousStatus = null;
  }

  return {
    title,
    body,
    evidenceId: "reconstruction",
    fromStatus: previousStatus,
    toStatus: current.selectedDelivery.status,
  };
}

export function deriveIncidentSignalBoard(
  state = createInitialIncidentSignalState(),
) {
  assertOperatingState(state.operating);

  const drill = resolveDrill(state.drillId);
  const perspective =
    drill.perspectives.find(
      (candidate) => candidate.id === state.perspectiveId,
    ) ?? drill.perspectives[0];
  const selectedFeed =
    drill.feeds.find((feed) => feed.id === state.selectedFeedId) ??
    drill.feeds[0];
  const selectedRecipient =
    drill.recipients.find(
      (recipient) => recipient.id === state.selectedRecipientId,
    ) ?? drill.recipients[0];
  const enabledLayerIds = SIGNAL_LAYERS.map((layer) => layer.id).filter(
    (layerId) => state.enabledLayerIds.includes(layerId),
  );
  const enabledLayers = SIGNAL_LAYERS.filter((layer) =>
    enabledLayerIds.includes(layer.id),
  );
  const matrix = drill.feeds.flatMap((feed) =>
    drill.recipients.map((recipient) =>
      deriveFeedRecipientStatus(
        drill.id,
        feed.id,
        recipient.id,
        state.operating,
      ),
    ),
  );
  const visibleFeeds = drill.feeds.filter((feed) =>
    enabledLayerIds.includes(feed.layerId),
  );
  const visibleMatrix = matrix.filter((cell) =>
    enabledLayerIds.includes(cell.feed.layerId),
  );
  const selectedDelivery = matrix.find(
    (cell) =>
      cell.feed.id === selectedFeed.id &&
      cell.recipient.id === selectedRecipient.id,
  );
  const coordinationRecipient = drill.recipients.find(
    (recipient) => recipient.isCoordinationBoard,
  );
  const coordinationFeeds = matrix.filter(
    (cell) => cell.recipient.id === coordinationRecipient.id,
  );
  const coordinationVisibleFeeds = coordinationFeeds.filter((cell) =>
    enabledLayerIds.includes(cell.feed.layerId),
  );
  const alternateCells = matrix.filter((cell) => cell.alternatePath);
  const current = {
    drill,
    perspective,
    perspectives: drill.perspectives,
    recipients: drill.recipients,
    feeds: drill.feeds,
    layers: SIGNAL_LAYERS,
    enabledLayerIds,
    enabledLayers,
    selectedFeed,
    selectedRecipient,
    selectedDelivery,
    matrix,
    visibleFeeds,
    visibleMatrix,
    operating: { ...state.operating },
    firstBlocker: selectedDelivery.firstBlocker,
    informationLoss: uniqueStrings(selectedDelivery.informationLoss),
    coordinationBoard: {
      recipient: coordinationRecipient,
      feeds: coordinationFeeds,
      visibleFeeds: coordinationVisibleFeeds,
      firstBlocker: findFirstBlocker(coordinationFeeds),
      informationLoss: uniqueStrings(
        coordinationFeeds.flatMap((cell) => cell.informationLoss),
      ),
    },
    alternatePaths: {
      selectedMode: getDegradedModeById(state.operating.degradedMode),
      automatic: false,
      active: alternateCells,
      summary:
        alternateCells.length > 0
          ? "The selected alternate applies only to the eligible blocked paths shown as Conditional."
          : "No scoped alternate is active for the current operating conditions.",
    },
    evidenceBadges: EVIDENCE_BADGES,
    standardsContext: STANDARDS_CONTEXT,
    notice: INCIDENT_SIGNAL_MANIFEST.notice,
  };

  return {
    ...current,
    whatChanged: deriveWhatChanged(state, current),
  };
}

export const deriveIncidentSignal = deriveIncidentSignalBoard;
