type EventName =
  | "session_start"
  | "tutorial_complete"
  | "first_win"
  | "first_lose"
  | "return_visit";

interface TelemetryEvent {
  name: EventName;
  occurredAt: string;
  sessionId: string;
  releaseChannel: string;
  properties?: Record<string, unknown>;
}

const LAST_VISIT_KEY = "snake_last_visit_at";
const SESSION_ID_KEY = "snake_session_id";
const FALLBACK_LOG_KEY = "snake_telemetry_log";
const RETURN_VISIT_THRESHOLD_HOURS = 24;

function makeSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `sess_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function pushFallbackLog(event: TelemetryEvent): void {
  const currentRaw = localStorage.getItem(FALLBACK_LOG_KEY);
  let current: TelemetryEvent[] = [];

  if (currentRaw) {
    try {
      current = JSON.parse(currentRaw) as TelemetryEvent[];
    } catch {
      current = [];
    }
  }

  const next = [...current, event].slice(-200);
  localStorage.setItem(FALLBACK_LOG_KEY, JSON.stringify(next));
}

function postEvent(endpoint: string, event: TelemetryEvent): void {
  void fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => {
    pushFallbackLog(event);
  });
}

export function createTelemetry() {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();
  const releaseChannel = import.meta.env.VITE_RELEASE_CHANNEL?.trim() || "dev";
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY) || makeSessionId();
  let tutorialCompleteSent = false;
  let firstWinSent = false;
  let firstLoseSent = false;

  sessionStorage.setItem(SESSION_ID_KEY, sessionId);

  function track(name: EventName, properties?: Record<string, unknown>) {
    const event: TelemetryEvent = {
      name,
      occurredAt: new Date().toISOString(),
      sessionId,
      releaseChannel,
      properties,
    };

    if (endpoint) {
      postEvent(endpoint, event);
      return;
    }

    pushFallbackLog(event);
  }

  return {
    trackSessionStart() {
      const now = Date.now();
      const lastVisitRaw = localStorage.getItem(LAST_VISIT_KEY);
      const lastVisit = lastVisitRaw ? Number(lastVisitRaw) : null;
      const hoursSinceLastVisit =
        lastVisit && Number.isFinite(lastVisit) ? Math.round(((now - lastVisit) / 36e5) * 100) / 100 : null;
      const isReturnVisit =
        hoursSinceLastVisit !== null && hoursSinceLastVisit >= RETURN_VISIT_THRESHOLD_HOURS;

      track("session_start", {
        isReturnVisit,
        hoursSinceLastVisit,
      });

      if (isReturnVisit) {
        track("return_visit", {
          hoursSinceLastVisit,
        });
      }

      localStorage.setItem(LAST_VISIT_KEY, String(now));
    },

    trackTutorialComplete() {
      if (tutorialCompleteSent) return;
      tutorialCompleteSent = true;
      track("tutorial_complete");
    },

    trackFirstWin(score: number) {
      if (firstWinSent) return;
      firstWinSent = true;
      track("first_win", { score });
    },

    trackFirstLose(score: number) {
      if (firstLoseSent) return;
      firstLoseSent = true;
      track("first_lose", { score });
    },
  };
}
