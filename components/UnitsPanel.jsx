import { useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import useClickOutside from '../utils/useClickOutside';

const UNIT_GROUPS = [
  {
    key: 'temperature',
    label: 'Temperature',
    options: [
      { value: 'C', label: '°C' },
      { value: 'F', label: '°F' },
    ],
  },
  {
    key: 'windSpeed',
    label: 'Wind Speed',
    options: [
      { value: 'ms',    label: 'm/s'  },
      { value: 'kmh',   label: 'km/h' },
      { value: 'knots', label: 'kn'   },
    ],
  },
  {
    key: 'pressure',
    label: 'Pressure',
    options: [
      { value: 'mb',    label: 'mb'   },
      { value: 'mmhg',  label: 'mmHg' },
    ],
  },
];

export default function UnitsPanel({ isOpen, onClose }) {
  const { settings, setUnit } = useSettings();
  const { units } = settings;
  const ref = useRef(null);

  useClickOutside(ref, () => { if (isOpen) onClose(); });

  if (!isOpen) return null;

  return (
    <div className="panel units-panel" ref={ref}>
      <div className="panel-header">Units</div>
      <div className="units-groups">
        {UNIT_GROUPS.map((group) => (
          <div key={group.key} className="units-group">
            <span className="units-group-label">{group.label}</span>
            <div className="unit-toggle-group">
              {group.options.map((opt) => (
                <button
                  key={opt.value}
                  className={`unit-toggle-btn${units[group.key] === opt.value ? ' unit-toggle-btn--active' : ''}`}
                  onClick={() => setUnit(group.key, opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
