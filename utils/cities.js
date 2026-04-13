// Single source of truth for city metadata used by client components.
// Keep separate from pages/api/weather.js (which is server-only and holds lat/lon).
const CITIES_LIST = [
  { key: 'vilnius',      label: 'Vilnius',                  shortLabel: 'Vilnius'    },
  { key: 'kaunas',       label: 'Kaunas',                   shortLabel: 'Kaunas'     },
  { key: 'palanga',      label: 'Palanga',                  shortLabel: 'Palanga'    },
  { key: 'capetown',     label: 'Cape Town, SA',            shortLabel: 'Cape Town'  },
  { key: 'paracuru',     label: 'Paracuru, Brazil',         shortLabel: 'Paracuru'   },
  { key: 'warsaw',       label: 'Warsaw, Poland',           shortLabel: 'Warsaw'     },
  { key: 'paris',        label: 'Paris, France',            shortLabel: 'Paris'      },
  { key: 'amsterdam',    label: 'Amsterdam, Netherlands',   shortLabel: 'Amsterdam'  },
  { key: 'riodejaneiro', label: 'Rio de Janeiro, Brazil',   shortLabel: 'Rio'        },
];

export default CITIES_LIST;
