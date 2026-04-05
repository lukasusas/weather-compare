# Deployment Guide

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps.

### Steps:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Add environment variables from `.env.example`:
   - `ACCUWEATHER_API_KEY`
   - `OPENWEATHER_API_KEY`
   - `WEATHERKIT_PRIVATE_KEY` (if using Apple WeatherKit)
5. Click "Deploy"

Your app will be live at `your-project.vercel.app`

## Docker

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and run:

```bash
docker build -t weather-compare .
docker run -p 3000:3000 \
  -e ACCUWEATHER_API_KEY=your_key \
  -e OPENWEATHER_API_KEY=your_key \
  weather-compare
```

## Traditional VPS (DigitalOcean, AWS, etc.)

### Prerequisites:
- Node.js 18+ installed
- npm or yarn
- Git

### Steps:

1. Clone repository:
```bash
git clone <your-repo-url>
cd weather-compare
```

2. Install dependencies:
```bash
npm install
```

3. Build the app:
```bash
npm run build
```

4. Set environment variables:
```bash
export ACCUWEATHER_API_KEY=your_key
export OPENWEATHER_API_KEY=your_key
```

5. Start the server:
```bash
npm start
```

### Using PM2 for production:

```bash
npm install -g pm2

pm2 start npm --name "weather-compare" -- start
pm2 save
pm2 startup
```

### Using Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables for Production

Create `.env.production.local`:

```env
# API Keys
ACCUWEATHER_API_KEY=your_production_key
OPENWEATHER_API_KEY=your_production_key
WEATHERKIT_PRIVATE_KEY=your_production_key

# Optional
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

## Performance Optimization

1. **Enable compression**: Add to `next.config.js`
```javascript
const withCompression = require('next-compression');
module.exports = withCompression({});
```

2. **Use CDN**: Vercel includes CDN by default
3. **Enable caching**: Set cache headers in `next.config.js`
4. **Monitor performance**: Use Vercel Analytics

## SSL/TLS

For production domains:
- **Vercel**: Automatic SSL
- **Traditional VPS**: Use Let's Encrypt + Certbot

```bash
sudo certbot certonly --nginx -d yourdomain.com
```

## Monitoring

### Health Check

Add health check endpoint to `pages/api/health.js`:

```javascript
export default function handler(req, res) {
  res.status(200).json({ status: 'ok' });
}
```

### Monitor with services like:
- DataDog
- New Relic
- Sentry (for error tracking)

## Backups

Ensure you backup:
- `.env.production.local` (API keys)
- Database records (if added)
- Configuration files

## Maintenance

### Update dependencies:
```bash
npm update
npm audit fix
```

### Check for security issues:
```bash
npm audit
```

### Monitor API rate limits:
- AccuWeather: 50 calls/day (free tier)
- OpenWeather: 60 calls/minute
- Open-Meteo: Unlimited

Consider caching responses to reduce API calls.
