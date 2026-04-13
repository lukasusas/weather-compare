import { useState, useEffect } from 'react';
import WeatherCard from '../components/WeatherCard';
import Header from '../components/Header';
import LoadingState from '../components/LoadingState';
import CollapsedDayRow from '../components/CollapsedDayRow';
import ExpandedDayHeader from '../components/ExpandedDayHeader';
import { SettingsProvider, useSettings } from '../context/SettingsContext';

function WeatherApp() {
  const { settings, setEnabledCities } = useSettings();
  const { enabledCities } = settings;

  const [city, setCity] = useState('vilnius');
  const [allCities, setAllCities] = useState(null);
  const [cachedAt, setCachedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDays, setExpandedDays] = useState(new Set([0]));

  // If the active city tab is removed from the enabled list, switch to the first remaining city
  useEffect(() => {
    if (!enabledCities.includes(city) && enabledCities.length > 0) {
      setCity(enabledCities[0]);
    }
  }, [enabledCities]);

  const toggleDayExpansion = (dayIndex) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayIndex)) {
      newExpanded.delete(dayIndex);
    } else {
      newExpanded.add(dayIndex);
    }
    setExpandedDays(newExpanded);
  };

  const fetchWeather = (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    const url = forceRefresh ? `/api/weather?force=true&t=${Date.now()}` : '/api/weather';
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setAllCities(data.cities);
        setCachedAt(data.cachedAt);
        setLoading(false);
      })
      .catch(() => { setError('Failed to fetch weather data'); setLoading(false); });
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(() => fetchWeather(), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const weatherData = allCities?.[city] || null;

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
          cachedAt={cachedAt}
          onForceRefresh={() => fetchWeather(true)}
        />

        <main className="main-content">
          {loading && <LoadingState />}
          {error && <div className="error-state">{error}</div>}

          {weatherData && !loading && weatherData.days.map((day, index) => (
            <div key={index} className="day-section">
              <h2 className="day-heading">{day.date}</h2>
              {expandedDays.has(index) ? (
                <>
                  <ExpandedDayHeader
                    day={day}
                    onToggle={() => toggleDayExpansion(index)}
                  />
                  <div className="cards-grid">
                    {day.sources.map((source) => (
                      <WeatherCard key={source.id} data={source} />
                    ))}
                  </div>
                </>
              ) : (
                <CollapsedDayRow
                  day={day}
                  onToggle={() => toggleDayExpansion(index)}
                />
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SettingsProvider>
      <WeatherApp />
    </SettingsProvider>
  );
}
