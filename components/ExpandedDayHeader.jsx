import { getWeatherIcon } from '../utils/weatherIcons';
import { useSettings } from '../context/SettingsContext';
import { convertTemperature, convertWindSpeed, tempUnit, windUnit } from '../utils/conversions';

function calculateAverage(values) {
  const valid = values.filter(v => v !== null && v !== undefined && v > 0);
  if (valid.length === 0) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

export default function ExpandedDayHeader({ day, onToggle }) {
  const { settings } = useSettings();
  const { units } = settings;

  const available = day.sources.filter(s => !s.unavailable);

  const maxTemps    = available.map(s => s.maxTemp).filter(t => t != null);
  const minTemps    = available.map(s => s.minTemp).filter(t => t != null);
  const conditions  = available.map(s => s.condition).filter(Boolean);
  const humidities  = available.map(s => s.humidity).filter(h => h != null && h >= 0);
  const windSpeeds  = available.map(s => s.windSpeed).filter(w => w != null && w >= 0);
  const rainChances = available.map(s => s.rainChance).filter(r => r != null && r >= 0);

  // Aggregate in base units, convert for display
  const rawMaxTemp  = maxTemps.length > 0 ? Math.round(maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length) : null;
  const rawMinTemp  = minTemps.length > 0 ? Math.round(minTemps.reduce((a, b) => a + b, 0) / minTemps.length) : null;
  const avgHumidity = Math.round(calculateAverage(humidities));
  const rawAvgWind  = calculateAverage(windSpeeds);
  const avgRain     = Math.round(calculateAverage(rainChances));

  const avgMaxTemp = rawMaxTemp != null ? convertTemperature(rawMaxTemp, units.temperature) : '—';
  const avgMinTemp = rawMinTemp != null ? convertTemperature(rawMinTemp, units.temperature) : '—';
  const avgWind    = convertWindSpeed(rawAvgWind, units.windSpeed);
  const wUnit      = windUnit(units.windSpeed);
  const tUnit      = tempUnit(units.temperature);

  const mostCommonCondition = conditions.length > 0 ? conditions[0] : '—';
  const weatherIcon = getWeatherIcon(mostCommonCondition);

  return (
    <div className="expanded-day-header" onClick={onToggle}>
      <div className="expanded-left">
        <div className="expanded-icon">{weatherIcon}</div>
        <div className="expanded-temps">
          <span className="expanded-max-temp">{avgMaxTemp}{typeof avgMaxTemp === 'number' ? tUnit : ''}</span>
          <span className="expanded-temp-sep">/</span>
          <span className="expanded-min-temp">{avgMinTemp}{typeof avgMinTemp === 'number' ? tUnit : ''}</span>
        </div>
      </div>

      <div className="expanded-middle">
        <p className="expanded-condition">{mostCommonCondition}</p>
        <p className="expanded-source-count">
          {available.length} source{available.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="expanded-right">
        <div className="expanded-detail">
          <span className="expanded-detail-label">💧</span>
          <span className="expanded-detail-value">{avgHumidity}%</span>
        </div>
        <div className="expanded-detail">
          <span className="expanded-detail-label">💨</span>
          <span className="expanded-detail-value">{avgWind} {wUnit}</span>
        </div>
        <div className="expanded-detail">
          <span className="expanded-detail-label">🌧️</span>
          <span className="expanded-detail-value">{avgRain}%</span>
        </div>
      </div>

      <div className="expanded-collapse-hint">▲</div>
    </div>
  );
}
