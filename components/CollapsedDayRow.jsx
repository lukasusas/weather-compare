import { getWeatherIcon } from '../utils/weatherIcons';

function calculateAverage(values) {
  const validValues = values.filter(v => v !== null && v !== undefined && v > 0);
  if (validValues.length === 0) return 0;
  return Math.round(validValues.reduce((a, b) => a + b, 0) / validValues.length);
}

export default function CollapsedDayRow({ day, onToggle }) {
  // Calculate aggregated data from all sources
  const maxTemps = day.sources
    .filter(s => !s.unavailable)
    .map(s => s.maxTemp)
    .filter(t => t !== null && t !== undefined);
  const minTemps = day.sources
    .filter(s => !s.unavailable)
    .map(s => s.minTemp)
    .filter(t => t !== null && t !== undefined);
  const conditions = day.sources
    .filter(s => !s.unavailable)
    .map(s => s.condition)
    .filter(c => c);
  const humidities = day.sources
    .filter(s => !s.unavailable)
    .map(s => s.humidity)
    .filter(h => h !== null && h !== undefined && h >= 0);
  const windSpeeds = day.sources
    .filter(s => !s.unavailable)
    .map(s => s.windSpeed)
    .filter(w => w !== null && w !== undefined && w >= 0);
  const pressures = day.sources
    .filter(s => !s.unavailable)
    .map(s => s.pressure)
    .filter(p => p !== null && p !== undefined && p > 0);
  const rainChances = day.sources
    .filter(s => !s.unavailable)
    .map(s => s.rainChance)
    .filter(r => r !== null && r !== undefined && r >= 0);

  const avgMaxTemp = maxTemps.length > 0 ? Math.round(maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length) : '—';
  const avgMinTemp = minTemps.length > 0 ? Math.round(minTemps.reduce((a, b) => a + b, 0) / minTemps.length) : '—';
  const avgHumidity = calculateAverage(humidities);
  const avgWind = calculateAverage(windSpeeds);
  const avgPressure = calculateAverage(pressures);
  const avgRain = calculateAverage(rainChances);
  const mostCommonCondition = conditions.length > 0 ? conditions[0] : '—';
  const weatherIcon = getWeatherIcon(mostCommonCondition);

  return (
    <div className="collapsed-day-row" onClick={onToggle}>
      <div className="collapsed-left">
        <div className="collapsed-icon">{weatherIcon}</div>
        <div className="collapsed-temps">
          <span className="collapsed-max-temp">{avgMaxTemp}°</span>
          <span className="collapsed-temp-sep">/</span>
          <span className="collapsed-min-temp">{avgMinTemp}°</span>
        </div>
      </div>

      <div className="collapsed-middle">
        <p className="collapsed-condition">{mostCommonCondition}</p>
        <p className="collapsed-source-count">
          {day.sources.filter(s => !s.unavailable).length} source{day.sources.filter(s => !s.unavailable).length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="collapsed-right">
        <div className="collapsed-detail">
          <span className="collapsed-detail-label">💧</span>
          <span className="collapsed-detail-value">{avgHumidity}%</span>
        </div>
        <div className="collapsed-detail">
          <span className="collapsed-detail-label">💨</span>
          <span className="collapsed-detail-value">{avgWind} km/h</span>
        </div>
        <div className="collapsed-detail">
          <span className="collapsed-detail-label">🌧️</span>
          <span className="collapsed-detail-value">{avgRain}%</span>
        </div>
      </div>

      <div className="collapsed-expand-hint">▼</div>
    </div>
  );
}
