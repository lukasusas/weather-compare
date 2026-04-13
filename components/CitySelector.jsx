import { useRef } from 'react';
import CITIES_LIST from '../utils/cities';
import { useSettings } from '../context/SettingsContext';
import useClickOutside from '../utils/useClickOutside';

export default function CitySelector({ isOpen, onClose }) {
  const { settings, setEnabledCities } = useSettings();
  const { enabledCities } = settings;
  const ref = useRef(null);

  useClickOutside(ref, () => { if (isOpen) onClose(); });

  const toggleCity = (key) => {
    const next = enabledCities.includes(key)
      ? enabledCities.filter((c) => c !== key)
      : [...enabledCities, key];
    setEnabledCities(next);
  };

  if (!isOpen) return null;

  return (
    <div className="panel city-selector-panel" ref={ref}>
      <div className="panel-header">Choose Cities</div>
      <div className="city-selector-list">
        {CITIES_LIST.map((city) => {
          const active = enabledCities.includes(city.key);
          return (
            <button
              key={city.key}
              className={`city-toggle-btn${active ? ' city-toggle-btn--active' : ''}`}
              onClick={() => toggleCity(city.key)}
            >
              <span className="city-toggle-check">{active ? '✓' : ''}</span>
              {city.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
