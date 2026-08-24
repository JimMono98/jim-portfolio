export const AUTH_ROUTE = "/auth/login";
export const RECONSTRUCTION_LIMIT = 3;
export const MAX_PATH_LENGTH = 96;
export const MAX_QUERY_INPUT_LENGTH = 64;
export const MAX_EVENT_HISTORY = 8;

export const ROUTE_PRESETS = [
  { value: "/auth/login", label: "Direct login route" },
  { value: "/./auth/login", label: "Literal-dot route" },
  { value: "/dashboard", label: "Discovery route" },
];

export const QUERY_PRESETS = {
  benign: {
    label: "Benign identifier",
    value: "visitor",
    recordedEvidence: false,
  },
  report: {
    label: "Report-derived syntax",
    value: "admin' or 1=1 -- -",
    recordedEvidence: true,
  },
  custom: {
    label: "Custom input",
    recordedEvidence: false,
  },
};

export const SOURCE_OPTIONS = ["source-a", "source-b", "source-c"];

function blockedResult(message) {
  return { valid: false, error: message };
}

export function validateLocalPath(rawPath) {
  if (typeof rawPath !== "string") {
    return blockedResult("Enter a text path.");
  }

  if (!rawPath) {
    return blockedResult("Enter a local path to inspect.");
  }

  if (rawPath.length > MAX_PATH_LENGTH) {
    return blockedResult(
      `Keep the local path within ${MAX_PATH_LENGTH} characters.`,
    );
  }

  if (!rawPath.startsWith("/") || rawPath.startsWith("//")) {
    return blockedResult("Use a root-relative path, not a scheme or host.");
  }

  if (
    [...rawPath].some((character) => {
      const characterCode = character.charCodeAt(0);
      return characterCode <= 32 || characterCode === 127;
    })
  ) {
    return blockedResult("Whitespace and control characters are not accepted.");
  }

  if (/[?#%\\]/u.test(rawPath)) {
    return blockedResult(
      "Query strings, fragments, encoding, and backslashes are outside this model.",
    );
  }

  if (rawPath.includes("//")) {
    return blockedResult("Duplicate slashes are outside this narrow model.");
  }

  if (rawPath.length > 1 && rawPath.endsWith("/")) {
    return blockedResult("Trailing slashes are outside this narrow model.");
  }

  if (rawPath === "/") {
    return { valid: true, error: "" };
  }

  const segments = rawPath.split("/").slice(1);

  if (segments.includes("..")) {
    return blockedResult("Parent-directory traversal is not accepted.");
  }

  if (
    segments.some(
      (segment) => segment !== "." && !/^[A-Za-z0-9._~-]+$/u.test(segment),
    )
  ) {
    return blockedResult("Use only simple local path segments in this model.");
  }

  return { valid: true, error: "" };
}

export function canonicalizeLiteralDotPath(rawPath) {
  const validation = validateLocalPath(rawPath);

  if (!validation.valid) {
    return { ...validation, canonicalPath: null };
  }

  const canonicalSegments = rawPath
    .split("/")
    .slice(1)
    .filter((segment) => segment !== ".");
  const canonicalPath = `/${canonicalSegments.join("/")}`;

  return {
    valid: true,
    error: "",
    canonicalPath: canonicalPath === "" ? "/" : canonicalPath,
  };
}

export function validateQueryInput(value) {
  if (typeof value !== "string" || value.length === 0) {
    return blockedResult("Enter an identifier to inspect.");
  }

  if (value.length > MAX_QUERY_INPUT_LENGTH) {
    return blockedResult(
      `Keep the identifier within ${MAX_QUERY_INPUT_LENGTH} characters.`,
    );
  }

  if (
    [...value].some((character) => {
      const characterCode = character.charCodeAt(0);
      return characterCode <= 31 || characterCode === 127;
    })
  ) {
    return blockedResult("Control characters are not accepted.");
  }

  return { valid: true, error: "" };
}

export function createInitialSecurityLabState() {
  return {
    routeInput: "/./auth/login",
    queryPreset: "report",
    customQueryInput: "visitor",
    identitySource: SOURCE_OPTIONS[0],
    observedAttemptsBySource: {},
    hardenedAttempts: 0,
    events: [],
    nextEventId: 1,
  };
}

export const initialSecurityLabState = createInitialSecurityLabState();

function activeQueryValue(state) {
  if (state.queryPreset === "custom") {
    return state.customQueryInput;
  }

  return QUERY_PRESETS[state.queryPreset]?.value ?? "";
}

export function deriveRouteComparison(state) {
  const normalized = canonicalizeLiteralDotPath(state.routeInput);

  if (!normalized.valid) {
    const blocked = {
      status: "Blocked",
      tone: "blocked",
      detail: normalized.error,
      policyInput: state.routeInput,
      downstreamPath: null,
    };

    return {
      valid: false,
      error: normalized.error,
      rawPath: state.routeInput,
      canonicalPath: null,
      targetsModeledAuthRoute: false,
      observed: blocked,
      hardened: { ...blocked },
    };
  }

  const targetsModeledAuthRoute = normalized.canonicalPath === AUTH_ROUTE;
  const rawPolicyBlocks = state.routeInput === AUTH_ROUTE;
  const policyMismatch = targetsModeledAuthRoute && !rawPolicyBlocks;

  const observed = rawPolicyBlocks
    ? {
        status: "Blocked",
        tone: "blocked",
        detail: "The raw policy recognizes the direct protected route.",
        policyInput: state.routeInput,
        downstreamPath: normalized.canonicalPath,
      }
    : policyMismatch
      ? {
          status: "Policy mismatch represented",
          tone: "warning",
          detail:
            "The raw policy and downstream router inspect different representations of the same modeled route.",
          policyInput: state.routeInput,
          downstreamPath: normalized.canonicalPath,
        }
      : {
          status: "Outside modeled auth route",
          tone: "neutral",
          detail:
            "This path does not resolve to the protected login route in the narrow reconstruction.",
          policyInput: state.routeInput,
          downstreamPath: normalized.canonicalPath,
        };

  const hardened = targetsModeledAuthRoute
    ? {
        status: "Blocked",
        tone: "secure",
        detail:
          "One canonical representation is used for both policy and routing.",
        policyInput: normalized.canonicalPath,
        downstreamPath: normalized.canonicalPath,
      }
    : {
        status: "Outside modeled auth route",
        tone: "neutral",
        detail:
          "The canonical path does not resolve to the protected login route in this model.",
        policyInput: normalized.canonicalPath,
        downstreamPath: normalized.canonicalPath,
      };

  return {
    valid: true,
    error: "",
    rawPath: state.routeInput,
    canonicalPath: normalized.canonicalPath,
    targetsModeledAuthRoute,
    policyMismatch,
    observed,
    hardened,
  };
}

export function deriveQueryComparison(state) {
  const input = activeQueryValue(state);
  const validation = validateQueryInput(input);
  const isRecordedPreset =
    state.queryPreset === "report" &&
    input === QUERY_PRESETS.report.value &&
    validation.valid;

  if (!validation.valid) {
    return {
      valid: false,
      error: validation.error,
      input,
      isRecordedPreset: false,
      observed: {
        status: "Blocked",
        tone: "blocked",
        detail: validation.error,
        statement: "",
      },
      hardened: {
        status: "Blocked",
        tone: "blocked",
        detail: validation.error,
        statement: "SELECT id FROM users WHERE username = ?",
        boundValues: [],
      },
    };
  }

  return {
    valid: true,
    error: "",
    input,
    isRecordedPreset,
    hasSyntaxMarkers: /['";#]|--/u.test(input),
    evidenceNote: isRecordedPreset
      ? "The preserved presentation records this syntax-bearing step before the 2FA screen. This lab does not execute it."
      : "This local input has no recorded outcome in the original presentation.",
    observed: {
      status: "Data mixed with statement structure",
      tone: "warning",
      detail:
        "Changing the identifier changes the illustrative statement text itself.",
      statement: `SELECT id FROM users WHERE username = '${input}'`,
    },
    hardened: {
      status: "Input bound separately",
      tone: "secure",
      detail:
        "The statement remains byte-identical while the value travels separately.",
      statement: "SELECT id FROM users WHERE username = ?",
      boundValues: [input],
    },
  };
}

export function deriveIdentityComparison(state) {
  const observedCount = state.observedAttemptsBySource[state.identitySource] ?? 0;
  const hardenedCount = state.hardenedAttempts;
  const latestEvent = state.events[0] ?? null;

  return {
    source: state.identitySource,
    stablePrincipal: "verification-session",
    limit: RECONSTRUCTION_LIMIT,
    observedCount,
    hardenedCount,
    observedNextAdmitted: observedCount < RECONSTRUCTION_LIMIT,
    hardenedNextAdmitted: hardenedCount < RECONSTRUCTION_LIMIT,
    latestEvent,
    observed: {
      status:
        observedCount < RECONSTRUCTION_LIMIT
          ? "Next attempt admitted"
          : "Next attempt blocked",
      tone:
        observedCount < RECONSTRUCTION_LIMIT ? "warning" : "blocked",
      detail: `${state.identitySource} has ${observedCount} of ${RECONSTRUCTION_LIMIT} admitted attempts in its visitor-controlled bucket.`,
    },
    hardened: {
      status:
        hardenedCount < RECONSTRUCTION_LIMIT
          ? "Next attempt admitted"
          : "Next attempt blocked",
      tone: hardenedCount < RECONSTRUCTION_LIMIT ? "secure" : "blocked",
      detail: `The stable verification principal has ${hardenedCount} of ${RECONSTRUCTION_LIMIT} admitted attempts across every symbolic source.`,
    },
  };
}

function notReachedStep(label) {
  return {
    label,
    status: "Not reached because an earlier boundary stopped the path",
    tone: "neutral",
  };
}

function outsideModeledFlowStep(label) {
  return {
    label,
    status: "Not reached because this path is outside the modeled authentication flow",
    tone: "neutral",
  };
}

export function deriveSecurityPipeline(state) {
  const route = deriveRouteComparison(state);
  const query = deriveQueryComparison(state);
  const identity = deriveIdentityComparison(state);
  const observedRouteContinues = route.valid && route.policyMismatch;
  const routeIsOutsideModeledFlow =
    route.valid && !route.targetsModeledAuthRoute;
  const recordedChainReachesTwoFactor =
    observedRouteContinues && query.valid && query.isRecordedPreset;
  const observedLaterStep = routeIsOutsideModeledFlow
    ? outsideModeledFlowStep
    : notReachedStep;

  const observedSteps = [
    {
      label: "Route authorization",
      status: route.observed.status,
      tone: route.observed.tone,
    },
    observedRouteContinues
      ? {
          label: "Query / data boundary",
          status: query.observed.status,
          tone: query.observed.tone,
        }
      : observedLaterStep("Query / data boundary"),
    observedRouteContinues
      ? {
          label: "2FA boundary",
          status: recordedChainReachesTwoFactor
            ? "Reached in recorded presentation"
            : "Not simulated",
          tone: recordedChainReachesTwoFactor ? "warning" : "neutral",
        }
      : observedLaterStep("2FA boundary"),
    recordedChainReachesTwoFactor
      ? {
          label: "Rate-limit identity",
          status: identity.latestEvent
            ? `Local reconstruction · next attempt ${
                identity.observedNextAdmitted ? "admitted" : "blocked"
              }`
            : "Ready for manual reconstruction",
          tone: "warning",
        }
      : observedLaterStep("Rate-limit identity"),
  ];

  const observedOverall = recordedChainReachesTwoFactor
    ? "Documented chain reaches the 2FA/rate-limit boundary; this reconstruction does not test an OTP or reproduce the original target."
    : observedRouteContinues
      ? "The local comparison stops before any original outcome is inferred."
      : routeIsOutsideModeledFlow
        ? "This path is outside the narrow authentication flow; no downstream outcome is inferred."
        : "The modeled path stops at route authorization.";

  const hardenedLaterStep = routeIsOutsideModeledFlow
    ? outsideModeledFlowStep
    : notReachedStep;

  const hardenedSteps = [
    {
      label: "Route authorization",
      status: route.hardened.status,
      tone: route.hardened.tone,
    },
    hardenedLaterStep("Query / data boundary"),
    hardenedLaterStep("2FA boundary"),
    hardenedLaterStep("Rate-limit identity"),
  ];

  return {
    route,
    query,
    identity,
    recordedChainReachesTwoFactor,
    observed: {
      label: "Observed assumptions",
      steps: observedSteps,
      overall: observedOverall,
    },
    hardened: {
      label: "Hardened reconstruction",
      steps: hardenedSteps,
      overall: routeIsOutsideModeledFlow
        ? "This path is outside the narrow authentication flow; no downstream outcome is inferred."
        : "Stopped at the canonical route-policy boundary.",
    },
  };
}

export function deriveWhatChanged(state, activeScenario) {
  const pipeline = deriveSecurityPipeline(state);

  if (activeScenario === "query") {
    const { query } = pipeline;
    if (!query.valid) {
      return {
        title: "The bounded local input was rejected.",
        body: query.error,
      };
    }

    return {
      title: "The trust boundary moved outside the statement text.",
      body: query.isRecordedPreset
        ? "Interpolation lets the report-derived syntax alter the illustrative statement. Parameter binding keeps that same value separate. The original presentation records reaching 2FA; this lab does not execute a query or infer a custom-input outcome."
        : "Interpolation changes the illustrative statement whenever the identifier changes. Parameter binding keeps the statement stable, and this custom or benign value receives no original-project outcome.",
    };
  }

  if (activeScenario === "identity") {
    const { identity } = pipeline;
    const divergent =
      identity.observedNextAdmitted !== identity.hardenedNextAdmitted;

    return {
      title: divergent
        ? "Changing the claimed source reopened only the observed bucket."
        : "The two ledgers currently make the same next-attempt decision.",
      body: `The observed reconstruction counts ${identity.source} independently (${identity.observedCount}/${identity.limit}). The hardened reconstruction keeps one server-derived verification principal (${identity.hardenedCount}/${identity.limit}) across all symbolic sources.`,
    };
  }

  const { route } = pipeline;
  if (!route.valid) {
    return {
      title: "The bounded local path was rejected.",
      body: route.error,
    };
  }

  if (route.policyMismatch) {
    return {
      title: "The same modeled route had two representations.",
      body: `The observed policy checks ${route.rawPath}, while downstream routing sees ${route.canonicalPath}. The hardened lane canonicalizes once and applies policy to that same value.`,
    };
  }

  return {
    title: "Both lanes agree at the route boundary.",
    body:
      route.canonicalPath === AUTH_ROUTE
        ? "The direct protected route is blocked in both lanes."
        : "This path remains outside the modeled authentication route; no later original outcome is inferred.",
  };
}

export function securityLabReducer(state, action) {
  switch (action.type) {
    case "set-route":
      return { ...state, routeInput: String(action.value) };
    case "select-query-preset":
      return Object.prototype.hasOwnProperty.call(QUERY_PRESETS, action.value)
        ? { ...state, queryPreset: action.value }
        : state;
    case "set-custom-query":
      return { ...state, customQueryInput: String(action.value) };
    case "set-source":
      return SOURCE_OPTIONS.includes(action.value)
        ? { ...state, identitySource: action.value }
        : state;
    case "record-attempt": {
      const source = state.identitySource;
      const observedBefore = state.observedAttemptsBySource[source] ?? 0;
      const hardenedBefore = state.hardenedAttempts;
      const observedAdmitted = observedBefore < RECONSTRUCTION_LIMIT;
      const hardenedAdmitted = hardenedBefore < RECONSTRUCTION_LIMIT;
      const observedAfter = observedAdmitted
        ? observedBefore + 1
        : observedBefore;
      const hardenedAfter = hardenedAdmitted
        ? hardenedBefore + 1
        : hardenedBefore;
      const event = {
        id: state.nextEventId,
        source,
        observed: observedAdmitted ? "attempt admitted" : "attempt blocked",
        hardened: hardenedAdmitted ? "attempt admitted" : "attempt blocked",
        observedCount: observedAfter,
        hardenedCount: hardenedAfter,
      };

      return {
        ...state,
        observedAttemptsBySource: {
          ...state.observedAttemptsBySource,
          [source]: observedAfter,
        },
        hardenedAttempts: hardenedAfter,
        events: [event, ...state.events].slice(0, MAX_EVENT_HISTORY),
        nextEventId: state.nextEventId + 1,
      };
    }
    case "reset":
      return createInitialSecurityLabState();
    default:
      return state;
  }
}
