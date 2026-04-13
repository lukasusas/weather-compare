// All conversions assume API base units: °C, m/s, mb
// Aggregate raw values first, then convert for display

export function convertTemperature(celsius, unit) {
  if (unit === 'F') return Math.round(celsius * 9 / 5 + 32);
  return Math.round(celsius);
}

export function convertWindSpeed(ms, unit) {
  if (unit === 'kmh') return Math.round(ms * 3.6);
  if (unit === 'knots') return Math.round(ms * 1.944);
  return Math.round(ms);
}

export function convertPressure(mb, unit) {
  if (unit === 'mmhg') return Math.round(mb * 0.750064);
  return Math.round(mb);
}

export function tempUnit(unit) {
  return unit === 'F' ? '°F' : '°C';
}

export function windUnit(unit) {
  if (unit === 'kmh') return 'km/h';
  if (unit === 'knots') return 'kn';
  return 'm/s';
}

export function pressureUnit(unit) {
  return unit === 'mmhg' ? 'mmHg' : 'mb';
}
