import { getWeatherIcon } from '../utils/weatherIcons';
import { useSettings } from '../context/SettingsContext';
import { convertTemperature, convertWindSpeed, tempUnit, windUnit } from '../utils/conversions';
import { averageNonZero, averageWithZero } from '../utils/aggregations';

export default function CollapsedDayRow({ day, onToggle }) {
  const { settings } = useSettings();
  const { units } = settings;

  const available = day.sources.filter(s => !s.unavailable);

  const maxTemps   = available.map(s => s.maxTemp).filter(t => t != null);
  const minTemps   = available.map(s => s.minTemp).filter(t => t != null);
  const conditions = available.map(s => s.condition).filter(Boolean);
  const humidities = available.map(s => s.humidity).filter(h => h != null && h >= 0);
  const windSpeeds = available.map(s => s.windSpeed).filter(w => w != null && w >= 0);
  const rainChances = available.map(s => s.rainChance).filter(r => r != null && r >= 0);

  // Aggregate in base units, convert for display
  const rawMaxTemp  = maxTemps.length  > 0 ? Math.round(maxTemps.reduce((a, b) => a + b, 0)  / maxTemps.length)  : null;
  const rawMinTemp  = minTemps.length  > 0 ? Math.round(minTemps.reduce((a, b) => a + b, 0)  / minTemps.length)  : null;
  const avgHumidity = Math.round(averageNonZero(humidities));
  const rawAvgWind  = averageNonZero(windSpeeds);
  const avgRain     = Math.round(averageWithZero(rainChances));

  const avgMaxTemp = rawMaxTemp != null ? convertTemperature(rawMaxTemp, units.temperature) : '—';
  const avgMinTemp = rawMinTemp != null ? convertTemperature(rawMinTemp, units.temperature) : '—';
  const avgWind    = convertWindSpeed(rawAvgWind, units.windSpeed);
  const wUnit      = windUnit(units.windSpeed);
  const tUnit      = tempUnit(units.temperature);

  const mostCommonCondition = conditions.length > 0 ? conditions[0] : '—';
  const weatherIcon = getWeatherIcon(mostCommonCondition);

  return (
    <div className="collapsed-day-row" onClick={onToggle}>
      <div className="collapsed-left">
        <div className="collapsed-icon">{weatherIcon}</div>
        <div className="collapsed-temps">
          <span className="collapsed-max-temp">{avgMaxTemp}{typeof avgMaxTemp === 'number' ? tUnit.replace('°', '°') : ''}</span>
          <span className="collapsed-temp-sep">/</span>
          <span className="collapsed-min-temp">{avgMinTemp}{typeof avgMinTemp === 'number' ? tUnit.replace('°', '°') : ''}</span>
        </div>
      </div>

      <div className="collapsed-middle">
        <p className="collapsed-condition">{mostCommonCondition}</p>
        <p className="collapsed-source-count">
          {available.length} source{available.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="collapsed-right">
        <div className="collapsed-detail">
          <span className="collapsed-detail-label">💧</span>
          <span className="collapsed-detail-value">{avgHumidity}%</span>
        </div>
        <div className="collapsed-detail">
          <span className="collapsed-detail-label">💨</span>
          <span className="collapsed-detail-value">{avgWind} {wUnit}</span>
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
