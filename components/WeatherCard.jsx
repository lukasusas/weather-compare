import { getWeatherIcon } from '../utils/weatherIcons';

export default function WeatherCard({ data }) {
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

  return (
    <div className="weather-card">
      <div className="card-source-name">{data.source}</div>
      <div className="card-source-bar"></div>

      <div className="card-temp-row">
        <span className="card-temp">{data.maxTemp}</span>
        <span className="card-temp-unit">°C</span>
      </div>
      <p className="card-condition">{data.condition}</p>

      <div className="card-icon">{getWeatherIcon(data.condition)}</div>

      <div className="card-details">
        <div className="detail-row">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">{data.feelsLike}°C</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{data.humidity}%</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{data.windSpeed} km/h</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{data.pressure > 0 ? `${data.pressure} mb` : '—'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Rain chance</span>
          <span className="detail-value">{data.rainChance}%</span>
        </div>
      </div>

      <div className="card-minmax">
        <div>
          <p className="minmax-label">Min</p>
          <p className="minmax-min">{data.minTemp}°</p>
        </div>
        <div>
          <p className="minmax-label">Avg</p>
          <p className="minmax-max">{Math.round((data.minTemp + data.maxTemp) / 2)}°</p>
        </div>
      </div>

      <p className="card-updated">Updated: {data.updated}</p>
    </div>
  );
}
