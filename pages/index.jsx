import { useState, useEffect } from 'react';
import WeatherCard from '../components/WeatherCard';
import Header from '../components/Header';
import LoadingState from '../components/LoadingState';
import CollapsedDayRow from '../components/CollapsedDayRow';
import ExpandedDayHeader from '../components/ExpandedDayHeader';

const DEFAULT_ENABLED_CITIES = ['vilnius', 'kaunas', 'palanga'];

export default function Home() {
  const [enabledCities, setEnabledCities] = useState(DEFAULT_ENABLED_CITIES);
  const [city, setCity] = useState('vilnius');
  const [allCities, setAllCities] = useState(null); // all cities data from one fetch
  const [cachedAt, setCachedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDays, setExpandedDays] = useState(new Set([0])); // Track which days are expanded (0 = today)

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

  const handleCitiesChange = (newCities) => {
    setEnabledCities(newCities);
    localStorage.setItem('enabledCities', JSON.stringify(newCities));
    if (!newCities.includes(city) && newCities.length > 0) {
      setCity(newCities[0]);
    }
  };

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
    // Force refresh uses a timestamp to create a unique URL the CDN hasn't cached
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

  // Fetch all cities once on load, then re-check every 15 min while page is open.
  // The server only hits external APIs when its own cache is stale — so if multiple
  // users are active, they all share the same server-side refresh cycle.
  // If nobody has the page open, no requests are made and the server rests.
  useEffect(() => {
    fetchWeather();
    const interval = setInterval(() => fetchWeather(), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // City switching is instant — no API call needed
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
