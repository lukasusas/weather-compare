# Weather Compare 🌤️

A beautiful, minimalistic weather comparison app for Vilnius that displays 3-day forecasts side-by-side from multiple sources. Built with a modern Apple glass morphism design aesthetic.

## Features

✨ **Multi-source comparison** - Display weather data from multiple providers simultaneously
🎨 **Glass Morphism UI** - Beautiful frosted glass effect with smooth animations
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
⚡ **Real-time Data** - Live weather updates from multiple sources
🎯 **3-Day Forecast** - Easy-to-compare side-by-side layout
🔄 **Auto-refresh** - Periodically updates weather data

## Tech Stack

- **Frontend**: Next.js 14 + React 18
- **Styling**: Tailwind CSS + Custom CSS (Glass Morphism)
- **Backend**: Next.js API Routes
- **HTTP Client**: Axios

## Getting Started

### Installation

```bash
cd weather-compare
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
weather-compare/
├── pages/
│   ├── index.jsx           # Main page
│   ├── _app.jsx            # App wrapper
│   └── api/
│       └── weather.js      # Weather API aggregator
├── components/
│   ├── WeatherCard.jsx     # Individual weather source card
│   ├── Header.jsx          # Top header
│   └── LoadingState.jsx    # Loading skeleton
├── utils/
│   └── weatherIcons.js     # Weather icon mapping
├── styles/
│   └── globals.css         # Global styles + glass morphism
└── public/                 # Static assets
```

## API Integration Guide

The app currently uses mock data. To integrate real weather data:

### 1. **Meteo.lt** (Lithuanian Meteorological Service)
```javascript
// /pages/api/weather.js
const meteoData = await fetch('https://www.meteo.lt/lt/api/...');
```

### 2. **AccuWeather**
```javascript
// Get API key from https://developer.accuweather.com
const apiKey = process.env.ACCUWEATHER_API_KEY;
const response = await axios.get(
  `https://api.accuweather.com/forecasts/v1/daily/3day/231',
  { params: { apikey: apiKey, details: true } }
);
```

### 3. **Apple WeatherKit** (via REST API)
```javascript
// Requires JWT token from Apple Developer account
const response = await fetch(
  `https://weatherkit.apple.com/api/v1/weather/en_US/60.1699/24.9384`,
  { headers: { Authorization: `Bearer ${jwtToken}` } }
);
```

### 4. **Open-Meteo** (Free, No Auth)
```javascript
// Easy integration - no API key needed
const response = await fetch(
  'https://api.open-meteo.com/v1/forecast?' +
  'latitude=54.6872&longitude=25.2797&' +
  'daily=temperature_2m_max,temperature_2m_min,precipitation_sum'
);
```

### 5. **OpenWeatherMap**
```javascript
const apiKey = process.env.OPENWEATHER_API_KEY;
const response = await axios.get(
  'https://api.openweathermap.org/data/3.0/onecall',
  {
    params: {
      lat: 54.6872,
      lon: 25.2797,
      appid: apiKey
    }
  }
);
```

## Environment Variables

Create a `.env.local` file:

```env
ACCUWEATHER_API_KEY=your_key_here
OPENWEATHER_API_KEY=your_key_here
WEATHERKIT_PRIVATE_KEY=your_key_here
WEATHERKIT_KEY_ID=your_key_id
WEATHERKIT_TEAM_ID=your_team_id
```

## Design System

### Colors
- **Background**: Soft blue gradient (`#f0f9ff` to `#f8fafc`)
- **Glass**: Semi-transparent white with backdrop blur
- **Text**: Gray scale (`#1e293b` to `#cbd5e1`)

### Components
- **Glass Cards**: `backdrop-blur-xl bg-white/40 border border-white/20`
- **Animations**: Smooth blob animations + hover effects
- **Shadows**: Soft glass effect shadows

## Customization

### Change Location
Update coordinates in `/pages/api/weather.js`:
```javascript
// Vilnius coordinates: 54.6872°N, 25.2797°E
```

### Adjust Styling
- Colors: `tailwind.config.js`
- Global styles: `styles/globals.css`
- Component styles: Individual `.jsx` files

### Add More Weather Sources
1. Create new API integration in `/pages/api/weather.js`
2. Add source to response data
3. Component automatically adapts to new sources

## Performance

- Uses Next.js static generation + ISR
- Optimized images with next/image
- CSS-in-JS for minimal bundle size
- Lazy component loading

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

- [ ] Hourly forecast view
- [ ] Weather alerts/warnings
- [ ] Multiple city comparison
- [ ] Historical weather data
- [ ] Weather trends/charts
- [ ] User preferences (°F vs °C)
- [ ] Dark mode toggle
- [ ] Geolocation support
- [ ] PWA support

## License

MIT

## Support

For issues and feature requests, create an issue on the project repository.
