// In-memory rate limiter: 180 req/min, 20k req/day
// Shared across all API routes via module-level state (survives between requests in the same Node process)

const state = {
  minuteWindow: [],   // timestamps of requests in the rolling 60s window
  dayWindow: [],      // timestamps of requests in the rolling 24h window
};

const LIMIT_PER_MINUTE = 180;
const LIMIT_PER_DAY = 20_000;

export function checkRateLimit() {
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;
  const oneDayAgo = now - 86_400_000;

  // Prune old entries
  state.minuteWindow = state.minuteWindow.filter((t) => t > oneMinuteAgo);
  state.dayWindow = state.dayWindow.filter((t) => t > oneDayAgo);

  if (state.minuteWindow.length >= LIMIT_PER_MINUTE) {
    return {
      allowed: false,
      reason: 'Rate limit exceeded: 180 requests per minute',
      retryAfterMs: state.minuteWindow[0] + 60_000 - now,
    };
  }

  if (state.dayWindow.length >= LIMIT_PER_DAY) {
    return {
      allowed: false,
      reason: 'Rate limit exceeded: 20,000 requests per day',
      retryAfterMs: state.dayWindow[0] + 86_400_000 - now,
    };
  }

  // Record this request
  state.minuteWindow.push(now);
  state.dayWindow.push(now);

  return {
    allowed: true,
    remaining: {
      minute: LIMIT_PER_MINUTE - state.minuteWindow.length,
      day: LIMIT_PER_DAY - state.dayWindow.length,
    },
  };
}
