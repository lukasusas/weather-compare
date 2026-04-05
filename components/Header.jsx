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

export default function Header({ city, cities, onCityChange, totalDays, enabledCities, onCitiesChange }) {
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
          <div className="live-badge">
            <span className="live-dot"></span>
            Live data
          </div>
          <SettingsDropdown enabledCities={enabledCities} onCitiesChange={onCitiesChange} />
        </div>
      </div>
    </header>
  );
}
