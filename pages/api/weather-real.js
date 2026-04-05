// This is a reference implementation showing how to integrate real APIs
// Uncomment and configure with your actual API keys in .env.local

import axios from 'axios';

// Vilnius coordinates
const VILNIUS_LAT = 54.6872;
const VILNIUS_LON = 25.2797;

// Example: Fetch from Open-Meteo (Free, no auth required)
async function fetchOpenMeteo() {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: VILNIUS_LAT,
        longitude: VILNIUS_LON,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max',
        timezone: 'Europe/Vilnius',
        forecast_days: 3,
      },
    });

    const data = response.data.daily;
    return {
      id: 'openmeteo',
      source: 'Open-Meteo',
      days: data.time.map((date, idx) => ({
        date,
        temperature: Math.round(data.temperature_2m_max[idx]),
        minTemp: Math.round(data.temperature_2m_min[idx]),
        maxTemp: Math.round(data.temperature_2m_max[idx]),
        condition: getWeatherCode(data.weather_code[idx]),
        humidity: 0, // Open-Meteo doesn't provide humidity in free tier
        windSpeed: Math.round(data.wind_speed_10m_max[idx]),
        pressure: 0,
        rainChance: Math.round((data.precipitation_sum[idx] || 0) * 10),
        feelsLike: Math.round(data.temperature_2m_max[idx] - 2),
      })),
    };
  } catch (error) {
    console.error('Open-Meteo error:', error);
    return null;
  }
}

// Example: Fetch from AccuWeather
async function fetchAccuWeather() {
  const apiKey = process.env.ACCUWEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    // First get location key for Vilnius
    const locationResponse = await axios.get(
      'https://api.accuweather.com/locations/v1/cities/search',
      {
        params: {
          apikey: apiKey,
          q: 'Vilnius',
          details: true,
        },
      }
    );

    const locationKey = locationResponse.data[0].Key;

    // Get 3-day forecast
    const forecastResponse = await axios.get(
      `https://api.accuweather.com/forecasts/v1/daily/3day/${locationKey}`,
      {
        params: {
          apikey: apiKey,
          details: true,
          metric: true,
        },
      }
    );

    return {
      id: 'accuweather',
      source: 'AccuWeather',
      days: forecastResponse.data.DailyForecasts.map((day) => ({
        date: new Date(day.Date).toLocaleDateString(),
        temperature: Math.round((day.Temperature.Maximum.Value + day.Temperature.Minimum.Value) / 2),
        minTemp: Math.round(day.Temperature.Minimum.Value),
        maxTemp: Math.round(day.Temperature.Maximum.Value),
        condition: day.Headline.Category,
        humidity: day.DailyForecasts?.[0]?.RelativeHumidity || 0,
        windSpeed: Math.round(day.Wind?.Speed?.Value || 0),
        pressure: 0,
        rainChance: day.PrecipitationProbability || 0,
        feelsLike: Math.round((day.Temperature.Maximum.Value + day.Temperature.Minimum.Value) / 2 - 1),
      })),
    };
  } catch (error) {
    console.error('AccuWeather error:', error);
    return null;
  }
}

// Example: Fetch from OpenWeather
async function fetchOpenWeather() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast/daily', {
      params: {
        lat: VILNIUS_LAT,
        lon: VILNIUS_LON,
        cnt: 3,
        appid: apiKey,
        units: 'metric',
      },
    });

    return {
      id: 'openweather',
      source: 'OpenWeather',
      days: response.data.list.map((day) => ({
        date: new Date(day.dt * 1000).toLocaleDateString(),
        temperature: Math.round(day.temp.day),
        minTemp: Math.round(day.temp.min),
        maxTemp: Math.round(day.temp.max),
        condition: day.weather[0].main,
        humidity: day.humidity,
        windSpeed: Math.round(day.speed),
        pressure: day.pressure,
        rainChance: Math.round((day.clouds || 0)),
        feelsLike: Math.round(day.feels_like),
      })),
    };
  } catch (error) {
    console.error('OpenWeather error:', error);
    return null;
  }
}

// Helper: Convert WMO weather codes to readable conditions
function getWeatherCode(code) {
  const weatherCodes = {
    0: 'Clear',
    1: 'Mostly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Mist',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Heavy drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return weatherCodes[code] || 'Unknown';
}

// Main API endpoint
export default async function handler(req, res) {
  try {
    // Fetch from multiple sources in parallel
    const [openMeteo, accuWeather, openWeather] = await Promise.all([
      fetchOpenMeteo(),
      fetchAccuWeather(),
      fetchOpenWeather(),
    ]);

    // Format response
    const sources = [openMeteo, accuWeather, openWeather].filter(Boolean);

    if (sources.length === 0) {
      return res.status(500).json({ error: 'No weather data available' });
    }

    // Group by date
    const weatherByDate = {};

    sources.forEach((source) => {
      source.days.forEach((day, index) => {
        const dateKey = `day_${index}`;
        if (!weatherByDate[dateKey]) {
          weatherByDate[dateKey] = {
            date: day.date,
            sources: [],
          };
        }

        weatherByDate[dateKey].sources.push({
          id: `${source.id}-day-${index}`,
          source: source.source,
          ...day,
        });
      });
    });

    const days = Object.values(weatherByDate);

    res.status(200).json({ days });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}
