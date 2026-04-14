// Utility functions for aggregating weather data from multiple sources

// Average that excludes 0 values (for wind, pressure, humidity where 0 means unavailable)
export function averageNonZero(values) {
  const valid = values.filter(v => v !== null && v !== undefined && v > 0);
  if (valid.length === 0) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

// Average that includes 0 values (for rain chance where 0% is a valid forecast)
export function averageWithZero(values) {
  const valid = values.filter(v => v !== null && v !== undefined);
  if (valid.length === 0) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}
