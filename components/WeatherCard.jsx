import { getWeatherIcon } from '../utils/weatherIcons';
import { useSettings } from '../context/SettingsContext';
import {
  convertTemperature, convertWindSpeed, convertPressure,
  tempUnit, windUnit, pressureUnit,
} from '../utils/conversions';

export default function WeatherCard({ data }) {
  const { settings } = useSettings();
  const { units } = settings;

  if (data.unavailable) {
    return (
      <div className="weather-card weather-card--unavailable">
        <div className="card-source-name">{data.source}</div>
        <div className="card-source-bar card-source-bar--grey"></div>
        <div className="card-unavailable-body">
          <div className="card-unavailable-icon">🔑</div>
          <p className="card-unavailable-title">API key required</p>
          <p className="card-unavailable-hint">{data.reason}</p>
        </div>
      </div>
    );
  }

  const maxTemp   = convertTemperature(data.maxTemp, units.temperature);
  const minTemp   = convertTemperature(data.minTemp, units.temperature);
  const feelsLike = convertTemperature(data.feelsLike, units.temperature);
  const wind      = convertWindSpeed(data.windSpeed, units.windSpeed);
  const pressure  = convertPressure(data.pressure, units.pressure);
  const tUnit     = tempUnit(units.temperature);
  const wUnit     = windUnit(units.windSpeed);
  const pUnit     = pressureUnit(units.pressure);

  return (
    <div className="weather-card">
      <div className="card-source-name">{data.source}</div>
      <div className="card-source-bar"></div>

      <div className="card-temp-row">
        <span className="card-temp">{maxTemp}</span>
        <span className="card-temp-unit">{tUnit}</span>
      </div>
      <p className="card-condition">{data.condition}</p>

      <div className="card-icon">{getWeatherIcon(data.condition)}</div>

      <div className="card-details">
        <div className="detail-row">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">{feelsLike}{tUnit}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{data.humidity}%</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{wind} {wUnit}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{pressure > 0 ? `${pressure} ${pUnit}` : '—'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Rain chance</span>
          <span className="detail-value">{data.rainChance}%</span>
        </div>
      </div>

      <div className="card-minmax">
        <div>
          <p className="minmax-label">Min</p>
          <p className="minmax-min">{minTemp}°</p>
        </div>
        <div>
          <p className="minmax-label">Avg</p>
          <p className="minmax-max">{convertTemperature(Math.round((data.minTemp + data.maxTemp) / 2), units.temperature)}°</p>
        </div>
      </div>

      <p className="card-updated">Updated: {data.updated}</p>
    </div>
  );
}
