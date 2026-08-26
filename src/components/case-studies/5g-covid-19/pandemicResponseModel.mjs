// Pure, browser-independent model for the portfolio's explanatory reconstruction.
// It models dependency reachability, not network performance or health outcomes.

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value);
}

export const EVIDENCE_LABELS = deepFreeze({
  coursework: "Original paper evidence",
  standard: "Current standards fact",
  reconstruction: "Portfolio reconstruction",
});

export const CAPABILITY_CLASSIFICATIONS = deepFreeze({
  direct: {
    id: "direct",
    label: "Direct",
    description:
      "The paper directly connects this profile or concept with the selected scenario.",
  },
  conditional: {
    id: "conditional",
    label: "Conditional",
    description:
      "Its relevance depends on the workload, scale, response target, or implementation choices.",
  },
  "paper-wide": {
    id: "paper-wide",
    label: "Paper-wide",
    description:
      "The paper discusses this as a broader architectural consideration rather than a scenario-specific requirement.",
  },
  "not-central": {
    id: "not-central",
    label: "Not central",
    description:
      "This is not a central requirement for the selected scenario in the preserved paper.",
  },
});

export const CAPABILITY_GROUPS = deepFreeze({
  trafficProfiles: {
    id: "traffic-profiles",
    label: "IMT-2020 traffic profiles",
    description:
      "Usage profiles describe different network-demand shapes; they are not application guarantees.",
    items: [
      {
        id: "embb",
        label: "eMBB",
        name: "Enhanced Mobile Broadband",
        role: "Higher-capacity data delivery for media-rich or data-intensive experiences.",
      },
      {
        id: "urllc",
        label: "URLLC",
        name: "Ultra-Reliable and Low-Latency Communications",
        role: "A profile for workloads with genuinely strict responsiveness and reliability needs.",
      },
      {
        id: "mmtc",
        label: "mMTC",
        name: "Massive Machine-Type Communications",
        role: "A profile for large populations of connected machine-type devices.",
      },
    ],
  },
  architecturalConcepts: {
    id: "architectural-concepts",
    label: "Architectural concepts",
    description:
      "These concepts can shape where work runs or how logical resources are organized; they are not additional traffic profiles.",
    items: [
      {
        id: "mec",
        label: "MEC",
        name: "Multi-access Edge Computing",
        role: "Places application processing nearer the access network when that placement is useful.",
      },
      {
        id: "network-slicing",
        label: "Network Slicing",
        name: "Logical network slices",
        role: "Organizes logical network resources for different service requirements without guaranteeing an application outcome.",
      },
      {
        id: "nfv",
        label: "NFV",
        name: "Network Functions Virtualisation",
        role: "Implements network functions in software to support more flexible service operation.",
      },
    ],
  },
});

export const DEPENDENCY_OPTIONS = deepFreeze({
  endpoint: {
    id: "endpoint",
    label: "Endpoint / sensing",
    kind: "boolean",
    options: [
      { value: true, label: "Available" },
      { value: false, label: "Unavailable" },
    ],
  },
  transport: {
    id: "transport",
    label: "Transport",
    kind: "choice",
    options: [
      { value: "5g", label: "5G" },
      { value: "other", label: "Other suitable network" },
      { value: "unavailable", label: "Unavailable" },
    ],
  },
  processing: {
    id: "processing",
    label: "Processing",
    kind: "choice",
    options: [
      { value: "edge", label: "Edge / MEC" },
      { value: "cloud", label: "Cloud" },
      { value: "unavailable", label: "Unavailable" },
    ],
  },
  serviceReady: {
    id: "serviceReady",
    label: "Application / workflow",
    kind: "boolean",
    options: [
      { value: true, label: "Ready" },
      { value: false, label: "Not ready" },
    ],
  },
  governanceReady: {
    id: "governanceReady",
    label: "Governance / consent",
    kind: "boolean",
    options: [
      { value: true, label: "Ready" },
      { value: false, label: "Not ready" },
    ],
  },
});

export const DEFAULT_DEPENDENCIES = deepFreeze({
  endpoint: true,
  transport: "5g",
  processing: "edge",
  serviceReady: true,
  governanceReady: true,
});

const scenarioDefinitions = [
  {
    id: "remote-consultation",
    shortTitle: "Remote consultation",
    title: "Remote consultation & medical imaging",
    domain: "Telemedicine",
    summary:
      "A patient-facing endpoint carries consultation media or imaging data to a clinical service and clinician.",
    data: "Voice, video and medical-imaging data",
    evidenceNote:
      "The paper discusses telemedicine, remote diagnosis, medical imaging and higher-quality video as pandemic-era connectivity use cases.",
    opportunity:
      "Capacity and responsive connectivity can support richer remote consultation media and help keep care workflows connected across distance.",
    constraint:
      "Connectivity does not validate a diagnosis, guarantee clinical quality, provide equipment, or make every consultation dependent on 5G.",
    steps: [
      {
        id: "patient-endpoint",
        label: "Patient endpoint",
        role: "Starts a remote consultation session.",
        data: "Consultation media",
        technology: "Phone, tablet or clinical endpoint",
        dependency: "endpoint",
      },
      {
        id: "media-capture",
        label: "Media / imaging capture",
        role: "Produces video, audio or imaging data for the session.",
        data: "Video, voice or image data",
        technology: "Camera or imaging device",
        dependency: "endpoint",
      },
      {
        id: "network-transport",
        label: "Network transport",
        role: "Carries application data between the endpoints and service.",
        data: "Application traffic",
        technology: "5G or another suitable network",
        dependency: "transport",
      },
      {
        id: "processing-layer",
        label: "Processing layer",
        role: "Runs service processing at an edge or cloud location.",
        data: "Session and media processing",
        technology: "MEC / edge or cloud",
        dependency: "processing",
      },
      {
        id: "telemedicine-service",
        label: "Telemedicine service",
        role: "Presents the remote-care workflow and its visible state.",
        data: "Consultation context",
        technology: "Healthcare application",
        dependency: "serviceReady",
      },
      {
        id: "clinician-action",
        label: "Clinician action",
        role: "A qualified professional interprets the available information.",
        data: "Human decision context",
        technology: "Clinical workflow",
        dependency: "serviceReady",
      },
    ],
    capabilities: {
      embb: {
        classification: "direct",
        note: "Media-rich consultation and imaging are the clearest capacity-oriented workload in this scenario.",
      },
      urllc: {
        classification: "conditional",
        note: "Strict response characteristics matter only for particular interactions; ordinary video does not automatically require URLLC.",
      },
      mmtc: {
        classification: "not-central",
        note: "A single consultation path is not inherently a massive device-deployment workload.",
      },
      mec: {
        classification: "conditional",
        note: "Nearby processing may be useful for some media or interactive workloads, but placement alone does not guarantee end-to-end performance.",
      },
      "network-slicing": {
        classification: "paper-wide",
        note: "The paper presents slicing as a wider scalability and service-organization concept, not as a proven consultation implementation.",
      },
      nfv: {
        classification: "paper-wide",
        note: "NFV appears as a wider architectural concept rather than a recovered feature of a telemedicine system.",
      },
    },
  },
  {
    id: "patient-monitoring",
    shortTitle: "Connected care",
    title: "Patient monitoring & hospital robots",
    domain: "Connected healthcare",
    summary:
      "Sensors and connected machines send observations or operational data into a monitoring workflow used by clinical staff.",
    data: "Sensor observations and robot telemetry",
    evidenceNote:
      "The paper discusses remote patient monitoring, connected devices and robots used in hospital contexts.",
    opportunity:
      "Connected monitoring can move observations between devices and care teams while reducing some unnecessary physical interactions.",
    constraint:
      "A network cannot establish sensor accuracy, clinical validity, safe robotic behavior, or appropriate human oversight.",
    steps: [
      {
        id: "patient-or-robot",
        label: "Patient device / robot",
        role: "Hosts the sensing or physical endpoint.",
        data: "Device observations or telemetry",
        technology: "Wearable, sensor or hospital robot",
        dependency: "endpoint",
      },
      {
        id: "local-sensing",
        label: "Local sensing",
        role: "Produces a device observation or operational event.",
        data: "Sensor readings or robot state",
        technology: "IoT sensing and local control",
        dependency: "endpoint",
      },
      {
        id: "network-transport",
        label: "Network transport",
        role: "Carries device data toward its processing service.",
        data: "Device telemetry",
        technology: "5G or another suitable network",
        dependency: "transport",
      },
      {
        id: "processing-layer",
        label: "Processing layer",
        role: "Processes incoming observations at an edge or cloud location.",
        data: "Monitoring events",
        technology: "MEC / edge or cloud",
        dependency: "processing",
      },
      {
        id: "monitoring-service",
        label: "Monitoring service",
        role: "Organizes device state for a care workflow.",
        data: "Visible monitoring state",
        technology: "Connected-care application",
        dependency: "serviceReady",
      },
      {
        id: "care-team-action",
        label: "Care-team action",
        role: "A professional reviews the service output and decides what follows.",
        data: "Human decision context",
        technology: "Clinical or operational workflow",
        dependency: "serviceReady",
      },
    ],
    capabilities: {
      embb: {
        classification: "conditional",
        note: "Its relevance rises when endpoints carry media-rich data rather than compact observations.",
      },
      urllc: {
        classification: "conditional",
        note: "Only genuinely time-critical control or monitoring paths call for strict response characteristics.",
      },
      mmtc: {
        classification: "direct",
        note: "The paper connects 5G and IoT with populations of monitoring devices, while a single device alone is not mMTC.",
      },
      mec: {
        classification: "conditional",
        note: "Nearby processing can shorten part of some paths, subject to the rest of the service architecture.",
      },
      "network-slicing": {
        classification: "paper-wide",
        note: "Slicing is discussed broadly; the preserved paper does not document a deployed healthcare slice.",
      },
      nfv: {
        classification: "paper-wide",
        note: "NFV is a wider network-operations concept, not an implemented monitoring component in the paper.",
      },
    },
  },
  {
    id: "remote-education",
    shortTitle: "Remote education",
    title: "Remote education, video & immersive media",
    domain: "Education",
    summary:
      "Student media and interaction data travel through a network and learning service to an educator or assessment workflow.",
    data: "Video, learning interactions and optional VR/AR media",
    evidenceNote:
      "The paper discusses video learning, VR/AR possibilities and remotely proctored examinations during periods of restricted physical access.",
    opportunity:
      "Higher-capacity connectivity can support richer learning media and interactive remote participation where devices and services are available.",
    constraint:
      "Connectivity does not supply suitable devices, inclusive course design, teaching quality, privacy safeguards, or equitable access.",
    steps: [
      {
        id: "student-endpoint",
        label: "Student endpoint",
        role: "Hosts the learning session and user interaction.",
        data: "Learning interaction",
        technology: "Computer, tablet or mobile device",
        dependency: "endpoint",
      },
      {
        id: "media-input",
        label: "Media / interaction input",
        role: "Produces video, audio or an immersive-media interaction.",
        data: "Course media and input",
        technology: "Camera, microphone or VR/AR interface",
        dependency: "endpoint",
      },
      {
        id: "network-transport",
        label: "Network transport",
        role: "Carries learning data between endpoints and the service.",
        data: "Application traffic",
        technology: "5G or another suitable network",
        dependency: "transport",
      },
      {
        id: "processing-layer",
        label: "Processing layer",
        role: "Runs media or learning-service processing at the edge or cloud.",
        data: "Session processing",
        technology: "MEC / edge or cloud",
        dependency: "processing",
      },
      {
        id: "learning-service",
        label: "Learning service",
        role: "Presents course or assessment functions.",
        data: "Learning state",
        technology: "Education platform",
        dependency: "serviceReady",
      },
      {
        id: "educator-action",
        label: "Educator / assessment action",
        role: "A person or governed workflow interprets the interaction.",
        data: "Teaching or assessment context",
        technology: "Education workflow",
        dependency: "serviceReady",
      },
    ],
    capabilities: {
      embb: {
        classification: "direct",
        note: "Video and richer VR/AR media make capacity the strongest traffic-profile connection.",
      },
      urllc: {
        classification: "conditional",
        note: "Strict response characteristics may matter for particular immersive interactions, not for every lesson or video stream.",
      },
      mmtc: {
        classification: "not-central",
        note: "Remote learning in the paper is not framed primarily as a massive machine-device workload.",
      },
      mec: {
        classification: "conditional",
        note: "Nearby processing may assist some interactive media, but ordinary education services can also use cloud processing.",
      },
      "network-slicing": {
        classification: "paper-wide",
        note: "Slicing is a broader paper-level network concept, not a documented education deployment.",
      },
      nfv: {
        classification: "paper-wide",
        note: "NFV remains a wider operational concept rather than an education feature in the preserved artifact.",
      },
    },
  },
  {
    id: "contactless-logistics",
    shortTitle: "Contactless logistics",
    title: "Contactless automation & product logistics",
    domain: "Retail and supply chains",
    summary:
      "Warehouse, retail and logistics endpoints coordinate product movement through connected automation workflows.",
    data: "Machine telemetry, status updates and control data",
    evidenceNote:
      "The paper discusses retail and supply-chain automation using AGVs, UAVs and robots as product-logistics examples.",
    opportunity:
      "Connected automation can coordinate product handling and reduce some close-contact tasks when the machines and operational systems are already in place.",
    constraint:
      "The network does not provide safe autonomy, navigation, inventory correctness, machinery, or a viable operating process.",
    steps: [
      {
        id: "logistics-endpoint",
        label: "Warehouse / retail endpoint",
        role: "Hosts or requests a product-logistics task.",
        data: "Product or task state",
        technology: "Warehouse or retail system",
        dependency: "endpoint",
      },
      {
        id: "automation-device",
        label: "AGV, UAV or robot",
        role: "Senses local state or performs a generic product-logistics action.",
        data: "Machine state and task events",
        technology: "AGV, UAV or robot",
        dependency: "endpoint",
      },
      {
        id: "network-transport",
        label: "Network transport",
        role: "Carries machine and coordination data.",
        data: "Telemetry and commands",
        technology: "5G or another suitable network",
        dependency: "transport",
      },
      {
        id: "processing-layer",
        label: "Processing layer",
        role: "Processes coordination data at an edge or cloud location.",
        data: "Automation events",
        technology: "MEC / edge or cloud",
        dependency: "processing",
      },
      {
        id: "logistics-service",
        label: "Logistics service",
        role: "Coordinates product handling and visible operational state.",
        data: "Workflow state",
        technology: "Supply-chain application",
        dependency: "serviceReady",
      },
      {
        id: "operator-action",
        label: "Operator action",
        role: "A responsible operator supervises or acts on the workflow.",
        data: "Operational decision context",
        technology: "Human-supervised workflow",
        dependency: "serviceReady",
      },
    ],
    capabilities: {
      embb: {
        classification: "conditional",
        note: "Capacity becomes more relevant if machines carry richer sensor or visual data.",
      },
      urllc: {
        classification: "conditional",
        note: "Strict response characteristics apply only to genuinely time-critical control paths, not every logistics update.",
      },
      mmtc: {
        classification: "conditional",
        note: "A sufficiently large device population may resemble an mMTC workload; one robot or UAV does not.",
      },
      mec: {
        classification: "conditional",
        note: "Nearby processing may support selected control and coordination paths but cannot make machines autonomous or safe by itself.",
      },
      "network-slicing": {
        classification: "paper-wide",
        note: "The paper discusses slicing generally; it does not document a deployed logistics slice.",
      },
      nfv: {
        classification: "paper-wide",
        note: "NFV is discussed as an architectural enabler rather than a recovered logistics implementation.",
      },
    },
  },
  {
    id: "contact-monitoring",
    shortTitle: "Contact monitoring",
    title: "Contact detection & public-health monitoring",
    domain: "Public-health monitoring",
    summary:
      "A phone or wearable performs proximity or location sensing before any optional network carries the resulting application data.",
    data: "Proximity events or separately collected location data",
    evidenceNote:
      "The paper discusses BLE/GPS-based contact or location monitoring and mass-surveillance examples, with important privacy implications.",
    opportunity:
      "Connectivity can transport authorized application data at scale after a device has produced a proximity or location event.",
    constraint:
      "5G does not perform BLE proximity sensing, establish exposure meaning, create consent, guarantee data accuracy, or make surveillance proportionate.",
    steps: [
      {
        id: "personal-endpoint",
        label: "Phone / wearable",
        role: "Hosts the sensing application and its local state.",
        data: "Local encounter or location context",
        technology: "Mobile or wearable endpoint",
        dependency: "endpoint",
      },
      {
        id: "proximity-location-input",
        label: "BLE proximity / GPS input",
        role: "Produces a proximity event or a separate location signal before cellular transport.",
        data: "BLE encounter or GPS/location input",
        technology: "BLE proximity or GPS/location sensing",
        dependency: "endpoint",
      },
      {
        id: "network-transport",
        label: "Optional network transport",
        role: "Carries application data after sensing; it does not perform the sensing itself.",
        data: "Application traffic",
        technology: "5G or another suitable network",
        dependency: "transport",
      },
      {
        id: "processing-layer",
        label: "Processing layer",
        role: "Processes application data at an edge or cloud location.",
        data: "Application events",
        technology: "MEC / edge or cloud",
        dependency: "processing",
      },
      {
        id: "monitoring-service",
        label: "Monitoring service",
        role: "Presents a public-health application workflow.",
        data: "Service-visible state",
        technology: "Public-health application",
        dependency: "serviceReady",
      },
      {
        id: "public-health-action",
        label: "Public-health action",
        role: "A responsible process determines any follow-up action.",
        data: "Decision context",
        technology: "Public-health workflow",
        dependency: "serviceReady",
      },
    ],
    capabilities: {
      embb: {
        classification: "not-central",
        note: "Basic proximity events are not inherently a media-rich eMBB workload.",
      },
      urllc: {
        classification: "not-central",
        note: "The preserved discussion does not establish a strict URLLC requirement for contact-monitoring data.",
      },
      mmtc: {
        classification: "conditional",
        note: "Large populations of connected endpoints can make device scale relevant, subject to the actual architecture.",
      },
      mec: {
        classification: "conditional",
        note: "Processing placement may affect a specific design, but MEC is not the BLE/GPS sensing mechanism.",
      },
      "network-slicing": {
        classification: "paper-wide",
        note: "Slicing is a broader architecture concept and does not itself provide consent, accuracy or privacy.",
      },
      nfv: {
        classification: "paper-wide",
        note: "NFV is discussed at paper level, not as a demonstrated contact-monitoring component.",
      },
    },
  },
];

function decorateScenario(scenario) {
  return {
    ...scenario,
    evidenceLabel: EVIDENCE_LABELS.coursework,
    reconstructionLabel: EVIDENCE_LABELS.reconstruction,
    steps: scenario.steps.map((step, index) => ({
      ...step,
      index,
      evidenceLabel: EVIDENCE_LABELS.reconstruction,
    })),
  };
}

export const PANDEMIC_SCENARIOS = deepFreeze(
  scenarioDefinitions.map(decorateScenario),
);
export const SCENARIOS = PANDEMIC_SCENARIOS;
export const DEFAULT_SCENARIO_ID = PANDEMIC_SCENARIOS[0].id;

export function getScenarioById(scenarioId) {
  return (
    PANDEMIC_SCENARIOS.find((scenario) => scenario.id === scenarioId) ?? null
  );
}

function resolveScenario(scenarioId) {
  return getScenarioById(scenarioId) ?? PANDEMIC_SCENARIOS[0];
}

export function getScenarioRoute(scenarioId = DEFAULT_SCENARIO_ID) {
  return resolveScenario(scenarioId).steps;
}

function clampStepIndex(index, routeLength) {
  if (!Number.isSafeInteger(index)) {
    return 0;
  }

  return Math.min(Math.max(index, 0), routeLength - 1);
}

export function getSelectedRouteStage(state) {
  const route = getScenarioRoute(state?.scenarioId);
  return route[clampStepIndex(state?.activeStepIndex, route.length)];
}

export function createInitialExplorerState() {
  return {
    scenarioId: DEFAULT_SCENARIO_ID,
    activeStepIndex: 0,
    dependencies: { ...DEFAULT_DEPENDENCIES },
    lens: "opportunity",
  };
}

export const createInitialPandemicResponseState = createInitialExplorerState;
export const initialExplorerState = deepFreeze(createInitialExplorerState());

function isAllowedDependencyValue(dependency, value) {
  const definition = DEPENDENCY_OPTIONS[dependency];
  return Boolean(
    definition?.options.some((option) => Object.is(option.value, value)),
  );
}

export function explorerReducer(state, action) {
  switch (action.type) {
    case "select-scenario": {
      if (!getScenarioById(action.scenarioId)) {
        return state;
      }

      return {
        ...state,
        scenarioId: action.scenarioId,
        activeStepIndex: 0,
      };
    }
    case "set-step": {
      const route = getScenarioRoute(state.scenarioId);
      const nextIndex = clampStepIndex(action.index, route.length);

      return nextIndex === state.activeStepIndex
        ? state
        : { ...state, activeStepIndex: nextIndex };
    }
    case "next-step": {
      const route = getScenarioRoute(state.scenarioId);
      const nextIndex = clampStepIndex(state.activeStepIndex + 1, route.length);

      return nextIndex === state.activeStepIndex
        ? state
        : { ...state, activeStepIndex: nextIndex };
    }
    case "previous-step": {
      const previousIndex = clampStepIndex(
        state.activeStepIndex - 1,
        getScenarioRoute(state.scenarioId).length,
      );

      return previousIndex === state.activeStepIndex
        ? state
        : { ...state, activeStepIndex: previousIndex };
    }
    case "set-dependency": {
      if (!isAllowedDependencyValue(action.dependency, action.value)) {
        return state;
      }

      if (Object.is(state.dependencies[action.dependency], action.value)) {
        return state;
      }

      return {
        ...state,
        dependencies: {
          ...state.dependencies,
          [action.dependency]: action.value,
        },
      };
    }
    case "set-lens":
      return action.lens === "opportunity" || action.lens === "constraint"
        ? { ...state, lens: action.lens }
        : state;
    case "reset":
      return createInitialExplorerState();
    default:
      return state;
  }
}

export const pandemicResponseReducer = explorerReducer;

function allCapabilityDefinitions() {
  return [
    ...CAPABILITY_GROUPS.trafficProfiles.items.map((item) => ({
      ...item,
      groupId: CAPABILITY_GROUPS.trafficProfiles.id,
      groupLabel: CAPABILITY_GROUPS.trafficProfiles.label,
    })),
    ...CAPABILITY_GROUPS.architecturalConcepts.items.map((item) => ({
      ...item,
      groupId: CAPABILITY_GROUPS.architecturalConcepts.id,
      groupLabel: CAPABILITY_GROUPS.architecturalConcepts.label,
    })),
  ];
}

export function deriveCapabilityMatches(scenarioId = DEFAULT_SCENARIO_ID) {
  const scenario = resolveScenario(scenarioId);
  const matches = allCapabilityDefinitions().map((definition) => {
    const scenarioMatch = scenario.capabilities[definition.id];
    const classification =
      CAPABILITY_CLASSIFICATIONS[scenarioMatch.classification];

    return {
      ...definition,
      classification: classification.id,
      classificationLabel: classification.label,
      classificationDescription: classification.description,
      note: scenarioMatch.note,
    };
  });

  return {
    trafficProfiles: matches.filter(
      (match) => match.groupId === "traffic-profiles",
    ),
    architecturalConcepts: matches.filter(
      (match) => match.groupId === "architectural-concepts",
    ),
  };
}

function assertDependencies(dependencies) {
  for (const dependency of Object.keys(DEPENDENCY_OPTIONS)) {
    if (!isAllowedDependencyValue(dependency, dependencies?.[dependency])) {
      throw new TypeError(`Invalid ${dependency} dependency value.`);
    }
  }
}

export function deriveTransportSelection(transport) {
  if (!isAllowedDependencyValue("transport", transport)) {
    throw new TypeError("Invalid transport dependency value.");
  }

  if (transport === "5g") {
    return {
      value: transport,
      label: "5G",
      available: true,
      uses5g: true,
      requiresValidation: true,
      detail:
        "5G is the selected transport layer. This reconstruction does not claim it is the only suitable network or validate application performance.",
    };
  }

  if (transport === "other") {
    return {
      value: transport,
      label: "Other suitable network",
      available: true,
      uses5g: false,
      requiresValidation: true,
      detail:
        "The route remains structurally possible, while coverage, capacity, responsiveness, security and application requirements still need independent validation.",
    };
  }

  return {
    value: transport,
    label: "Unavailable",
    available: false,
    uses5g: false,
    requiresValidation: false,
    detail: "Without a transport layer, data cannot reach downstream processing.",
  };
}

export function deriveProcessingSelection(processing) {
  if (!isAllowedDependencyValue("processing", processing)) {
    throw new TypeError("Invalid processing dependency value.");
  }

  if (processing === "edge") {
    return {
      value: processing,
      label: "Edge / MEC",
      available: true,
      isEdge: true,
      requiresValidation: true,
      detail:
        "Processing is placed nearer the access network. MEC does not guarantee the complete service path or its outcome.",
    };
  }

  if (processing === "cloud") {
    return {
      value: processing,
      label: "Cloud",
      available: true,
      isEdge: false,
      requiresValidation: true,
      detail:
        "Cloud processing preserves the structural route, while response, data-governance and application requirements still need validation.",
    };
  }

  return {
    value: processing,
    label: "Unavailable",
    available: false,
    isEdge: false,
    requiresValidation: false,
    detail: "Without an available processing layer, the application service is not reached.",
  };
}

function dependencyAvailable(dependency, dependencies) {
  switch (dependency) {
    case "endpoint":
      return dependencies.endpoint;
    case "transport":
      return dependencies.transport !== "unavailable";
    case "processing":
      return dependencies.processing !== "unavailable";
    case "serviceReady":
      return dependencies.serviceReady;
    default:
      return false;
  }
}

export function deriveDependencyPath(
  scenarioId = DEFAULT_SCENARIO_ID,
  dependencies = DEFAULT_DEPENDENCIES,
) {
  assertDependencies(dependencies);

  const scenario = resolveScenario(scenarioId);
  const transport = deriveTransportSelection(dependencies.transport);
  const processing = deriveProcessingSelection(dependencies.processing);
  let pathOpen = true;

  const stages = scenario.steps.map((step) => {
    const available = dependencyAvailable(step.dependency, dependencies);
    let status;

    if (!pathOpen) {
      status = "downstream-unreachable";
    } else if (!available) {
      status = "unavailable";
      pathOpen = false;
    } else {
      status = "reachable";
    }

    return {
      ...step,
      available,
      reachable: status === "reachable",
      status,
    };
  });

  const firstUnavailableStage =
    stages.find((stage) => stage.status === "unavailable") ?? null;
  const firstMissingDependency = firstUnavailableStage
    ? {
        id: firstUnavailableStage.dependency,
        label: DEPENDENCY_OPTIONS[firstUnavailableStage.dependency].label,
        routeStepId: firstUnavailableStage.id,
        routeStepLabel: firstUnavailableStage.label,
      }
    : null;
  const technicalComplete = firstUnavailableStage === null;
  const responsibleReady = technicalComplete && dependencies.governanceReady;

  const technicalPath = technicalComplete
    ? {
        status: "complete",
        label: "Technical path represented",
        detail:
          "Every modeled technical dependency is available. This confirms structural reachability only, not performance or service quality.",
      }
    : {
        status: "blocked",
        label: `Path stops at ${firstUnavailableStage.label}`,
        detail: `${DEPENDENCY_OPTIONS[firstUnavailableStage.dependency].label} is unavailable, so later stages are not technically reachable in this reconstruction.`,
      };

  let responsibleUse;

  if (!technicalComplete) {
    responsibleUse = {
      status: "blocked",
      label: "Responsible-use path not reached",
      detail:
        "An earlier technical dependency stops the path before governance can complete the workflow.",
    };
  } else if (!dependencies.governanceReady) {
    responsibleUse = {
      status: "not-ready",
      label: "Governance / consent not ready",
      detail:
        "The data path is technically reachable, but that does not make its use authorized, proportionate or responsible.",
    };
  } else {
    responsibleUse = {
      status: "ready",
      label: "Responsible-use prerequisites represented",
      detail:
        "Technical reachability and the modeled governance prerequisite are present. This still does not validate a real deployment or outcome.",
    };
  }

  const status = !technicalComplete
    ? "blocked"
    : responsibleReady
      ? "responsible-ready"
      : "technical-only";

  return {
    stages,
    firstUnavailableStage,
    firstMissingDependency,
    reachableStepIds: stages
      .filter((stage) => stage.reachable)
      .map((stage) => stage.id),
    technicalPath,
    responsibleUse,
    responsibleUsePath: responsibleUse,
    transport,
    processing,
    status,
    summary:
      status === "responsible-ready"
        ? "The reconstructed technical path and governance prerequisite are available."
        : status === "technical-only"
          ? "The reconstructed data path is technically reachable, but responsible use is not ready."
          : technicalPath.detail,
  };
}

export function deriveContextualExplanation(
  scenarioId,
  dependencies,
  lens = "opportunity",
) {
  const scenario = resolveScenario(scenarioId);
  const dependency = deriveDependencyPath(scenario.id, dependencies);

  let whatChanged;

  if (!dependencies.endpoint) {
    whatChanged = {
      title: "No data enters the path",
      detail:
        "Without an endpoint or sensing layer, connectivity has nothing to carry.",
    };
  } else if (dependencies.transport === "unavailable") {
    whatChanged = {
      title: "The route stops before processing",
      detail:
        "The endpoint can produce data, but an unavailable transport layer prevents it from reaching edge or cloud processing.",
    };
  } else if (dependencies.processing === "unavailable") {
    whatChanged = {
      title: "Connectivity is present; processing is not",
      detail:
        "A working network alone cannot complete the application path when no processing layer is available.",
    };
  } else if (!dependencies.serviceReady) {
    whatChanged = {
      title: "Infrastructure does not create the service",
      detail:
        "Data can reach processing, but the downstream application and professional workflow are not ready.",
    };
  } else if (!dependencies.governanceReady) {
    whatChanged = {
      title: "Technically possible is not responsibly ready",
      detail:
        "The route is structurally reachable, but consent and governance remain a separate prerequisite.",
    };
  } else if (dependencies.transport === "other") {
    whatChanged = {
      title: "Connectivity is not synonymous with 5G",
      detail:
        "Another suitable network keeps the structural route open; its fitness for the actual workload still requires validation.",
    };
  } else if (dependencies.processing === "cloud") {
    whatChanged = {
      title: "Processing moved; the route remains open",
      detail:
        "The model uses cloud rather than nearby edge processing. That changes placement, not the need to validate the complete service.",
    };
  } else {
    whatChanged = {
      title: "Every modeled layer is available",
      detail:
        "5G and edge processing support the reconstructed route, while the devices, service and governance remain equally necessary.",
    };
  }

  return {
    lens,
    title:
      lens === "constraint"
        ? "What connectivity does not solve"
        : "Where connectivity may help",
    body: lens === "constraint" ? scenario.constraint : scenario.opportunity,
    opportunity: scenario.opportunity,
    constraint: scenario.constraint,
    whatChanged,
    currentStatus: dependency.summary,
    caveat:
      "This deterministic model explains dependencies; it does not simulate traffic, clinical outcomes, public-health impact or a deployed network.",
  };
}

export function deriveExplorer(state) {
  const scenario = resolveScenario(state?.scenarioId);
  const dependencies = {
    ...DEFAULT_DEPENDENCIES,
    ...(state?.dependencies ?? {}),
  };
  assertDependencies(dependencies);

  const dependency = deriveDependencyPath(scenario.id, dependencies);
  const activeStepIndex = clampStepIndex(
    state?.activeStepIndex,
    dependency.stages.length,
  );
  const lens =
    state?.lens === "constraint" ? "constraint" : "opportunity";
  const explanation = deriveContextualExplanation(
    scenario.id,
    dependencies,
    lens,
  );

  return {
    scenario,
    steps: dependency.stages,
    route: dependency.stages,
    activeStep: dependency.stages[activeStepIndex],
    selectedStage: dependency.stages[activeStepIndex],
    activeStepIndex,
    capabilities: deriveCapabilityMatches(scenario.id),
    dependency,
    dependencyPath: dependency,
    lens: {
      active: lens,
      opportunity: scenario.opportunity,
      constraint: scenario.constraint,
    },
    explanation,
    whatChanged: explanation.whatChanged,
  };
}

export const derivePandemicResponse = deriveExplorer;
