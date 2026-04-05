import { useState, useEffect } from 'react';
import SettingsDropdown from './SettingsDropdown';

const CITY_LABELS = {
  vilnius: 'Vilnius',
  kaunas: 'Kaunas',
  palanga: 'Palanga',
  capetown: 'Cape Town',
  paracuru: 'Paracuru',
  warsaw: 'Warsaw',
  paris: 'Paris',
  amsterdam: 'Amsterdam',
  riodejaneiro: 'Rio',
};

function useDataAge(cachedAt) {
  const [label, setLabel] = useState('Live data');

  useEffect(() => {
    if (!cachedAt) return;

    const update = () => {
      const seconds = Math.floor((Date.now() - cachedAt) / 1000);
      if (seconds < 60) {
        setLabel('Live data');
      } else {
        const minutes = Math.floor(seconds / 60);
        setLabel(`${minutes} min${minutes !== 1 ? 's' : ''} ago`);
      }
    };

    update();
    const interval = setInterval(update, 15000);
    return () => clearInterval(interval);
  }, [cachedAt]);

  return label;
}

export default function Header({ city, cities, onCityChange, totalDays, cachedAt, enabledCities, onCitiesChange, onForceRefresh }) {
  const dataAgeLabel = useDataAge(cachedAt);
  const isLive = dataAgeLabel === 'Live data';
  const [hovered, setHovered] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <h1>Weather Compare</h1>
          <p className="header-subtitle">{totalDays}-day forecast</p>
        </div>

        <div className="header-center">
          <nav className="city-switcher" role="tablist" aria-label="Select city">
            {cities.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={city === c}
                className={`city-tab${city === c ? ' active' : ''}`}
                onClick={() => onCityChange(c)}
              >
                {CITY_LABELS[c]}
              </button>
            ))}
          </nav>
        </div>

        <div className="header-right">
          <div
            className={`live-badge${!isLive ? ' live-badge--stale' : ''}`}
            onClick={!isLive ? onForceRefresh : undefined}
            onMouseEnter={() => !isLive && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <span className={`live-dot${isLive ? '' : ' live-dot--stale'}`}></span>
            {!isLive && hovered ? 'Refresh now?' : dataAgeLabel}
          </div>
          <SettingsDropdown
            enabledCities={enabledCities}
            onCitiesChange={onCitiesChange}
          />
        </div>
      </div>
    </header>
  );
}
