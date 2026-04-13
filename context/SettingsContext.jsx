import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'weatherAppSettings';
const LEGACY_KEY = 'enabledCities';

const DEFAULTS = {
  enabledCities: ['vilnius', 'kaunas', 'palanga'],
  units: {
    temperature: 'C',   // 'C' | 'F'
    windSpeed: 'ms',    // 'ms' | 'kmh' | 'knots'
    pressure: 'mb',     // 'mb' | 'mmhg'
  },
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  // Read from localStorage on mount (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with defaults to handle any missing keys from older saved data
        setSettings({
          enabledCities: parsed.enabledCities ?? DEFAULTS.enabledCities,
          units: { ...DEFAULTS.units, ...(parsed.units ?? {}) },
        });
      } else {
        // One-time migration from legacy key
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy);
          setSettings((s) => ({ ...s, enabledCities: parsed }));
          localStorage.removeItem(LEGACY_KEY);
        }
      }
    } catch {
      // Ignore parse errors, keep defaults
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors (e.g. private browsing quota)
    }
  }, [settings]);

  const setEnabledCities = useCallback((cities) => {
    setSettings((s) => ({ ...s, enabledCities: cities }));
  }, []);

  const setUnit = useCallback((key, value) => {
    setSettings((s) => ({ ...s, units: { ...s.units, [key]: value } }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setEnabledCities, setUnit }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
