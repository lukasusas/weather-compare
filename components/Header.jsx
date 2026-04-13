import { useState, useEffect } from 'react';
import CitySelector from './CitySelector';
import UnitsPanel from './UnitsPanel';
import CITIES_LIST from '../utils/cities';

const SHORT_LABEL = Object.fromEntries(CITIES_LIST.map((c) => [c.key, c.shortLabel]));

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

export default function Header({ city, cities, onCityChange, totalDays, cachedAt, onForceRefresh }) {
  const dataAgeLabel = useDataAge(cachedAt);
  const isLive = dataAgeLabel === 'Live data';
  const [hovered, setHovered] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [unitsOpen, setUnitsOpen] = useState(false);

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
                {SHORT_LABEL[c] ?? c}
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

          {/* Choose Cities button */}
          <div className="header-panel-anchor">
            <button
              className={`choose-cities-btn${citiesOpen ? ' active' : ''}`}
              onClick={() => { setCitiesOpen((v) => !v); setUnitsOpen(false); }}
            >
              Choose Cities
            </button>
            <CitySelector isOpen={citiesOpen} onClose={() => setCitiesOpen(false)} />
          </div>

          {/* Units / Settings button */}
          <div className="header-panel-anchor">
            <button
              className={`settings-button${unitsOpen ? ' active' : ''}`}
              onClick={() => { setUnitsOpen((v) => !v); setCitiesOpen(false); }}
              title="Units"
              aria-label="Units settings"
            >
              ⚙️
            </button>
            <UnitsPanel isOpen={unitsOpen} onClose={() => setUnitsOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
}
