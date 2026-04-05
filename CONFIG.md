# Configuration Guide

Customize the Weather Compare app to your needs.

## Location Settings

### Change Default Location

Edit `/pages/api/weather.js`:

```javascript
// Current: Vilnius, Lithuania
const VILNIUS_LAT = 54.6872;
const VILNIUS_LON = 25.2797;
const LOCATION_NAME = 'Vilnius, Lithuania';

// Example: Change to Kaunas
const VILNIUS_LAT = 54.9039;
const VILNIUS_LON = 24.1383;
const LOCATION_NAME = 'Kaunas, Lithuania';
```

### Find Coordinates

Use [Google Maps](https://maps.google.com) or [GPS Coordinates](https://www.gps-coordinates.net/):
1. Search for city name
2. Right-click → "What's here?"
3. Copy coordinates (latitude, longitude)

## API Configuration

### Enable/Disable Sources

In `/pages/api/weather.js`, comment out sources you don't want:

```javascript
// In the handler function:
const [openMeteo, accuWeather, openWeather] = await Promise.all([
  fetchOpenMeteo(),        // ✓ Always active (free)
  fetchAccuWeather(),      // Comment to disable: // fetchAccuWeather(),
  fetchOpenWeather(),      // Comment to disable: // fetchOpenWeather(),
]);
```

### API Rate Limits

Configure cache headers to respect API limits:

```javascript
// pages/api/weather.js
export default async function handler(req, res) {
  // Cache response for 10 minutes (600 seconds)
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');

  // ... rest of handler
}
```

### API Keys

Store in `.env.local`:

```env
# Required for AccuWeather
ACCUWEATHER_API_KEY=your_key

# Required for OpenWeather
OPENWEATHER_API_KEY=your_key

# Required for WeatherKit (optional)
WEATHERKIT_PRIVATE_KEY=your_key
WEATHERKIT_KEY_ID=your_id
WEATHERKIT_TEAM_ID=your_team_id
```

Access in code:
```javascript
const apiKey = process.env.ACCUWEATHER_API_KEY;
```

## Design Customization

### Global Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#0066FF',
      secondary: '#6366F1',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
}
```

### Theme Variants

Create a theme in `styles/globals.css`:

```css
/* Dark theme example */
@media (prefers-color-scheme: dark) {
  body {
    @apply bg-gray-900 text-white;
  }

  .glass {
    @apply bg-gray-800/40 border-gray-700/20;
  }
}
```

### Typography

Customize fonts in `pages/_document.jsx`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet" />
```

## Feature Toggles

### Enable/Disable Features

Create `config/features.js`:

```javascript
export const features = {
  showComparisonTable: true,
  enableHourlyForecast: false,
  enableHistoricalData: false,
  enableAlerts: true,
  enableAutoRefresh: true,
};
```

Use in components:
```javascript
import { features } from '@/config/features';

{features.showComparisonTable && <ComparisonTable />}
```

## Auto-Refresh Configuration

Edit `pages/index.jsx`:

```javascript
// Refresh every 5 minutes (300000ms)
useEffect(() => {
  const interval = setInterval(() => {
    fetchWeather();
  }, 300000);

  return () => clearInterval(interval);
}, []);
```

## Performance Optimization

### Image Optimization

Already handled by Next.js Image component.

### CSS Optimization

```javascript
// next.config.js
module.exports = {
  swcMinify: true,
  compress: true,
}
```

### Cache Strategy

```javascript
// pages/api/weather.js
res.setHeader('Cache-Control', 'public, s-maxage=600');
```

## Database Configuration (Future)

When adding a database:

```javascript
// pages/api/db.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
```

## Analytics Configuration

Add Vercel Analytics:

```bash
npm install @vercel/analytics @vercel/web-vitals
```

In `pages/_app.jsx`:
```javascript
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

## Error Tracking

Add Sentry for production:

```bash
npm install @sentry/nextjs
```

In `next.config.js`:
```javascript
const withSentry = require('@sentry/nextjs/withSentry');

module.exports = withSentry({
  integrations: [
    new Sentry.Replay(),
  ],
});
```

## Logging Configuration

Create `utils/logger.js`:

```javascript
export const logger = {
  info: (msg) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('ℹ️', msg);
    }
  },
  error: (msg, error) => {
    console.error('❌', msg, error);
  },
  warn: (msg) => {
    console.warn('⚠️', msg);
  },
};
```

## Multi-Language Support

Install i18n:
```bash
npm install next-i18next
```

Create `public/locales/en/common.json`:
```json
{
  "title": "Weather Compare",
  "location": "Vilnius, Lithuania",
  "temperature": "Temperature"
}
```

Use in components:
```javascript
import { useTranslation } from 'next-i18next';

export default function Component() {
  const { t } = useTranslation('common');
  return <h1>{t('title')}</h1>;
}
```

## Environment-Specific Config

### Development

```env
# .env.development.local
NEXT_PUBLIC_API_URL=http://localhost:3000
LOG_LEVEL=debug
```

### Production

```env
# .env.production.local
NEXT_PUBLIC_API_URL=https://weather-compare.com
LOG_LEVEL=error
```

## Advanced: Custom Hooks

Create `hooks/useWeather.js`:

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useWeather() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/weather');
        setData(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
```

Usage in components:
```javascript
const { data, loading, error } = useWeather();
```

## Testing Configuration

Add Jest:

```bash
npm install --save-dev jest @testing-library/react
```

Create `jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

Run tests:
```bash
npm test
```

---

For more info, see the [README.md](./README.md) and [DEPLOYMENT.md](./DEPLOYMENT.md).
