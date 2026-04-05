# Quick Start Guide 🚀

Get the Weather Compare app running in 5 minutes!

## Option 1: Run Locally (Recommended for Development)

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- npm (comes with Node.js)

### Installation

1. **Navigate to project folder:**
```bash
cd weather-compare
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

You'll see the app with mock data. It's fully functional!

## Option 2: Using Docker

### Prerequisites
- Docker installed ([Download](https://www.docker.com/products/docker-desktop))

### Run

```bash
# Build image
docker build -t weather-compare .

# Run container
docker run -p 3000:3000 weather-compare
```

Open [http://localhost:3000](http://localhost:3000)

## Option 3: Deploy to Vercel (Production)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Select your repo
4. Click "Deploy"
5. Your app is live! 🎉

## Integrate Real APIs (Optional)

The app comes with beautiful mock data. To use real weather:

### 1. Get Free API Keys

- **Open-Meteo** (Free, no key needed): [open-meteo.com](https://open-meteo.com)
- **AccuWeather** (Free tier): [accuweather.com](https://developer.accuweather.com)
- **OpenWeather** (Free tier): [openweathermap.org](https://openweathermap.org/api)

### 2. Create `.env.local` file:

```env
ACCUWEATHER_API_KEY=your_key_here
OPENWEATHER_API_KEY=your_key_here
```

### 3. Update API route:

Replace the mock data in `/pages/api/weather.js` with real fetch calls, or copy implementation from `/pages/api/weather-real.js`

### 4. Restart development server:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Project Structure

```
📁 weather-compare
├── 📄 pages/
│   ├── index.jsx          ← Main page
│   ├── _app.jsx           ← App wrapper
│   ├── api/weather.js     ← API endpoint
│   └── _document.jsx      ← HTML document
├── 📁 components/
│   ├── WeatherCard.jsx    ← Weather display card
│   ├── Header.jsx         ← Top header
│   └── LoadingState.jsx   ← Loading skeleton
├── 📁 styles/
│   └── globals.css        ← Global styling
├── 📁 utils/
│   └── weatherIcons.js    ← Weather emoji icons
├── 📄 package.json        ← Dependencies
└── 📄 README.md          ← Full documentation
```

## Features at a Glance

✨ **Beautiful Design** - Apple glass morphism aesthetic
🌤️ **Multi-source** - Compare 4+ weather sources
📱 **Responsive** - Works on all devices
⚡ **Fast** - Built with Next.js for performance
🎯 **Easy to Use** - Clean, minimal interface

## Common Tasks

### Change Location

Edit `/pages/api/weather.js`:
```javascript
// Change these coordinates:
const VILNIUS_LAT = 54.6872;  // Your latitude
const VILNIUS_LON = 25.2797;  // Your longitude
```

### Customize Colors

Edit `tailwind.config.js` or `styles/globals.css`:
```css
/* Example: Change primary blue */
@apply from-blue-600 to-purple-600
```

### Add More Weather Sources

1. Create fetch function in `/pages/api/weather.js`
2. Add data to response
3. Component automatically adapts!

## Troubleshooting

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Dependencies missing?
```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

### API keys not working?
- Check `.env.local` exists
- Verify API key is correct
- Restart dev server
- Check browser console for errors

### Styling looks broken?
```bash
# Rebuild Tailwind CSS
npm run build
```

## Next Steps

1. ✅ App is running
2. 📖 Read [README.md](./README.md) for full docs
3. 🔑 Add API keys for real data
4. 🎨 Customize colors/layout to your liking
5. 🚀 Deploy to production

## Get Help

- 📖 [Full Documentation](./README.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 💬 Check console errors: Press `F12` → Console tab
- 🐛 Look at network requests: `F12` → Network tab

---

**You're all set! Happy weather comparing!** 🌤️☀️🌧️
