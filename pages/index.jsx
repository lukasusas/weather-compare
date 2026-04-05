import { useState, useEffect } from 'react';
import WeatherCard from '../components/WeatherCard';
import Header from '../components/Header';
import LoadingState from '../components/LoadingState';

const DEFAULT_ENABLED_CITIES = ['vilnius', 'kaunas', 'palanga'];

export default function Home() {
  const [enabledCities, setEnabledCities] = useState(DEFAULT_ENABLED_CITIES);
  const [city, setCity] = useState('vilnius');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load enabled cities from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('enabledCities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEnabledCities(parsed);
      } catch (e) {
        setEnabledCities(DEFAULT_ENABLED_CITIES);
      }
    }
  }, []);

  // Save enabled cities to localStorage when they change
  const handleCitiesChange = (newCities) => {
    setEnabledCities(newCities);
    localStorage.setItem('enabledCities', JSON.stringify(newCities));
    // If current city is disabled, switch to first enabled city
    if (!newCities.includes(city) && newCities.length > 0) {
      setCity(newCities[0]);
    }
  };

  const fetchWeather = (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    const url = `/api/weather?city=${city}${forceRefresh ? '&force=true' : ''}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setWeatherData(data); setLoading(false); })
      .catch(() => { setError('Failed to fetch weather data'); setLoading(false); });
  };

  useEffect(() => { fetchWeather(); }, [city]);

  return (
    <div className="app-wrapper">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="content-layer">
        <Header
          city={city}
          cities={enabledCities}
          onCityChange={setCity}
          totalDays={weatherData?.totalDays || 3}
          cachedAt={weatherData?.cachedAt || null}
          enabledCities={enabledCities}
          onCitiesChange={handleCitiesChange}
          onForceRefresh={() => fetchWeather(true)}
        />

        <main className="main-content">
          {loading && <LoadingState />}
          {error && <div className="error-state">{error}</div>}

          {weatherData && !loading && weatherData.days.map((day, index) => (
            <div key={index} className="day-section">
              <h2 className="day-heading">{day.date}</h2>
              <div className="cards-grid">
                {day.sources.map((source) => (
                  <WeatherCard key={source.id} data={source} />
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
