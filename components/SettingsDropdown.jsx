import { useState } from 'react';

const ALL_AVAILABLE_CITIES = [
  { key: 'vilnius', label: 'Vilnius' },
  { key: 'kaunas', label: 'Kaunas' },
  { key: 'palanga', label: 'Palanga' },
  { key: 'capetown', label: 'Cape Town, SA' },
  { key: 'paracuru', label: 'Paracuru, Brazil' },
  { key: 'warsaw', label: 'Warsaw, Poland' },
  { key: 'paris', label: 'Paris, France' },
  { key: 'amsterdam', label: 'Amsterdam, Netherlands' },
  { key: 'riodejaneiro', label: 'Rio de Janeiro, Brazil' },
];

export default function SettingsDropdown({ enabledCities, onCitiesChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCity = (cityKey) => {
    const newEnabled = enabledCities.includes(cityKey)
      ? enabledCities.filter(c => c !== cityKey)
      : [...enabledCities, cityKey];
    onCitiesChange(newEnabled);
  };

  return (
    <div className="settings-dropdown">
      <button
        className="settings-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Settings"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="settings-menu">
          <div className="settings-header">Select Cities</div>
          <div className="settings-list">
            {ALL_AVAILABLE_CITIES.map((city) => (
              <label key={city.key} className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={enabledCities.includes(city.key)}
                  onChange={() => toggleCity(city.key)}
                />
                <span>{city.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
