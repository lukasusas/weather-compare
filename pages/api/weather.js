import { checkRateLimit } from '../../utils/rateLimiter';

const CITIES = {
  vilnius: { name: 'Vilnius', lat: 54.6872, lon: 25.2797, meteoCode: 'vilnius' },
  kaunas:  { name: 'Kaunas',  lat: 54.9039, lon: 24.1383, meteoCode: 'kaunas' },
  palanga: { name: 'Palanga', lat: 55.9184, lon: 21.0678, meteoCode: 'palanga' },
  capetown: { name: 'Cape Town, SA', lat: -33.9249, lon: 18.4241, meteoCode: null },
  paracuru: { name: 'Paracuru, Brazil', lat: -3.3775, lon: -39.2591, meteoCode: null },
  warsaw: { name: 'Warsaw, Poland', lat: 52.2297, lon: 21.0122, meteoCode: null },
  paris: { name: 'Paris, France', lat: 48.8566, lon: 2.3522, meteoCode: null },
  amsterdam: { name: 'Amsterdam, Netherlands', lat: 52.3676, lon: 4.9041, meteoCode: null },
  riodejaneiro: { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lon: -43.1729, meteoCode: null },
};

const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatDate(date, isToday) {
  const weekday = WEEKDAYS[date.getDay()];
  const month   = MONTHS[date.getMonth()];
  const day     = date.getDate();
  return isToday ? `Today, ${month} ${day}` : `${weekday}, ${month} ${day}`;
}

function getNextNDays(n) {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Vilnius' }));
  return Array.from({ length: n }, (_, offset) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return { date: d, label: formatDate(d, offset === 0) };
  });
}

// ── Meteo.lt condition code → readable label ──────────────────────────────────
const METEO_CONDITIONS = {
  'clear':                'Clear sky',
  'isolated-clouds':      'Mostly clear',
  'scattered-clouds':     'Partly cloudy',
  'overcast':             'Overcast',
  'light-rain':           'Light rain',
  'moderate-rain':        'Moderate rain',
  'heavy-rain':           'Heavy rain',
  'sleet':                'Sleet',
  'light-snow':           'Light snow',
  'moderate-snow':        'Moderate snow',
  'heavy-snow':           'Heavy snow',
  'fog':                  'Foggy',
  'na':                   'N/A',
  'thunderstorms':        'Thunderstorm',
  'isolated-thunderstorms': 'Isolated thunderstorm',
  'light-sleet':          'Light sleet',
  'moderate-sleet':       'Moderate sleet',
};

function meteoCondition(code) {
  return METEO_CONDITIONS[code] || code || 'Unknown';
}

// ── Open-Meteo WMO condition codes ────────────────────────────────────────────
function omCondition(code) {
  const map = {
    0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Freezing fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Light showers', 81: 'Moderate showers', 82: 'Heavy showers',
    85: 'Light snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm + hail', 99: 'Severe thunderstorm',
  };
  return map[code] || 'Unknown';
}

// ── Fetch: Meteo.lt ───────────────────────────────────────────────────────────
async function fetchMeteoLt(meteoCode) {
  try {
    const url = `https://api.meteo.lt/v1/places/${meteoCode}/forecasts/long-term`;
    const res = await fetch(url, { headers: { 'User-Agent': 'weather-compare/1.0' } });
    if (!res.ok) throw new Error(`meteo.lt ${res.status}`);
    const data = await res.json();
    return data.forecastTimestamps || [];
  } catch (err) {
    console.error('Meteo.lt error:', err.message);
    return null;
  }
}

// ── Aggregate hourly meteo.lt timestamps into daily buckets ──────────────────
function aggregateMeteoLtDay(timestamps, targetDateStr) {
  // forecastTimeUtc looks like "2024-03-29 12:00:00"
  const rows = timestamps.filter((t) => t.forecastTimeUtc.startsWith(targetDateStr));
  if (!rows.length) return null;

  const temps  = rows.map((r) => r.airTemperature);
  const humid  = rows.map((r) => r.relativeHumidity).filter(Boolean);
  const winds  = rows.map((r) => r.windSpeed);
  const precip = rows.map((r) => r.totalPrecipitation || 0);
  const press  = rows.map((r) => r.seaLevelPressure).filter(Boolean);

  // Pick condition from midday (12:00) if available, else first entry
  const midday = rows.find((r) => r.forecastTimeUtc.includes('12:00')) || rows[Math.floor(rows.length / 2)];
  // For "current" today: pick closest timestamp to now
  const nowUtc = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const closest = rows.reduce((prev, cur) =>
    Math.abs(cur.forecastTimeUtc.localeCompare(nowUtc)) < Math.abs(prev.forecastTimeUtc.localeCompare(nowUtc)) ? cur : prev
  );

  return {
    currentTemp:   closest.airTemperature,
    minTemp:       Math.min(...temps),
    maxTemp:       Math.max(...temps),
    condition:     meteoCondition(midday.conditionCode),
    humidity:      humid.length ? Math.round(humid.reduce((a, b) => a + b, 0) / humid.length) : 0,
    windSpeed:     Math.round(Math.max(...winds)),
    pressure:      press.length ? Math.round(press.reduce((a, b) => a + b, 0) / press.length) : 1013,
    rainChance:    Math.min(100, Math.round(precip.reduce((a, b) => a + b, 0) * 5)),
  };
}

// ── Fetch: Open-Meteo ─────────────────────────────────────────────────────────
async function fetchOpenMeteo(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_max` +
      `&timezone=Europe/Vilnius&forecast_days=16`;
    const res = await fetch(url, { headers: { 'User-Agent': 'weather-compare/1.0' } });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = await res.json();
    return { current: data.current, daily: data.daily };
  } catch (err) {
    console.error('Open-Meteo error:', err.message);
    return null;
  }
}

// AccuWeather Core Weather API location keys
const ACCUWEATHER_KEYS = {
  vilnius: '231459',
  kaunas:  '228309',
  palanga: '228460',
  capetown: '306633',
  paracuru: '38045',
  warsaw: '274663',
  paris: '623',
  amsterdam: '249758',
  riodejaneiro: '45449',
};

// ── Fetch: AccuWeather 5-day forecast via Core Weather API ────────────────────
// Core Weather uses dataservice.accuweather.com + Bearer token auth
async function fetchAccuWeather(cityKey) {
  const apiKey = process.env.ACCUWEATHER_API_KEY;
  if (!apiKey) return { unavailable: true, source: 'AccuWeather', reason: 'Add ACCUWEATHER_API_KEY to .env.local' };

  const locationKey = ACCUWEATHER_KEYS[cityKey];
  if (!locationKey) return { unavailable: true, source: 'AccuWeather', reason: 'City not configured' };

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'User-Agent': 'weather-compare/1.0',
  };

  try {
    // First try 5-day forecast
    const forecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?details=true&metric=true`;
    console.log('[AccuWeather] Fetching 5-day forecast from Core Weather API');
    const fRes = await fetch(forecastUrl, { headers });

    if (fRes.ok) {
      const data = await fRes.json();
      if (data.DailyForecasts?.length) return { data: data.DailyForecasts, type: 'forecast' };
    }

    console.log('[AccuWeather] 5-day forecast status:', fRes.status, '— trying current conditions');

    // Fallback: current conditions
    const currentUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?details=true&metric=true`;
    const cRes = await fetch(currentUrl, { headers });

    if (!cRes.ok) {
      const errText = await cRes.text();
      console.error('[AccuWeather] Current conditions error:', cRes.status, errText);
      throw new Error(`HTTP ${cRes.status}`);
    }

    const cData = await cRes.json();
    if (!cData?.[0]) throw new Error('No data in response');

    return { data: cData, type: 'current' };
  } catch (err) {
    console.error('AccuWeather error:', err.message);
    return { unavailable: true, source: 'AccuWeather', reason: `Error: ${err.message}` };
  }
}


// ── Format helpers ─────────────────────────────────────────────────────────────
function fmtMeteoLt(dayIndex, isToday, dayData) {
  if (!dayData) return null;
  return {
    id: `meteolt-day${dayIndex}`,
    source: 'Meteo.lt',
    temperature: Math.round(isToday ? dayData.currentTemp : dayData.maxTemp),
    minTemp:     Math.round(dayData.minTemp),
    maxTemp:     Math.round(dayData.maxTemp),
    condition:   dayData.condition,
    feelsLike:   Math.round((isToday ? dayData.currentTemp : dayData.maxTemp) - 2),
    humidity:    dayData.humidity,
    windSpeed:   dayData.windSpeed,
    pressure:    dayData.pressure,
    rainChance:  dayData.rainChance,
    updated:     'now',
  };
}

function fmtOpenMeteo(dayIndex, isToday, current, daily) {
  const temp = isToday ? current.temperature_2m : daily.temperature_2m_max[dayIndex];
  return {
    id: `openmeteo-day${dayIndex}`,
    source: 'Open-Meteo',
    temperature: Math.round(temp),
    minTemp:     Math.round(daily.temperature_2m_min[dayIndex]),
    maxTemp:     Math.round(daily.temperature_2m_max[dayIndex]),
    condition:   isToday ? omCondition(current.weather_code) : omCondition(daily.weather_code[dayIndex]),
    feelsLike:   Math.round(temp - 2),
    humidity:    isToday ? current.relative_humidity_2m : daily.relative_humidity_2m_max[dayIndex],
    windSpeed:   Math.round(isToday ? current.wind_speed_10m : daily.wind_speed_10m_max[dayIndex]),
    pressure:    1013,
    rainChance:  Math.min(100, Math.round((daily.precipitation_sum[dayIndex] || 0) * 10)),
    updated:     'now',
  };
}

function fmtAccuWeather(dayIndex, dayData) {
  return {
    id: `accuweather-day${dayIndex}`,
    source: 'AccuWeather',
    temperature: Math.round((dayData.Temperature.Maximum.Value + dayData.Temperature.Minimum.Value) / 2),
    minTemp:     Math.round(dayData.Temperature.Minimum.Value),
    maxTemp:     Math.round(dayData.Temperature.Maximum.Value),
    condition:   dayData.Day?.IconPhrase || dayData.Headline?.Category || 'Unknown',
    feelsLike:   Math.round(dayData.RealFeelTemperature?.Maximum?.Value || dayData.Temperature.Maximum.Value - 2),
    humidity:    dayData.Day?.RelativeHumidity?.Average || 0,
    windSpeed:   Math.round(dayData.Day?.Wind?.Speed?.Value || 0),
    pressure:    0,
    rainChance:  dayData.Day?.PrecipitationProbability || 0,
    updated:     'now',
  };
}

function unavailableCard(source, reason, dayIndex) {
  return {
    id: `${source.toLowerCase().replace(' ', '-')}-day${dayIndex}`,
    source,
    unavailable: true,
    reason,
  };
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const limit = checkRateLimit();
  if (!limit.allowed) {
    res.setHeader('Retry-After', Math.ceil(limit.retryAfterMs / 1000));
    return res.status(429).json({ error: limit.reason });
  }
  res.setHeader('X-RateLimit-Remaining-Minute', limit.remaining.minute);
  res.setHeader('X-RateLimit-Remaining-Day',    limit.remaining.day);
  res.setHeader('Cache-Control', 'no-store');

  const cityKey = (req.query.city || 'vilnius').toLowerCase();
  const city    = CITIES[cityKey] || CITIES.vilnius;

  const [meteoTimestamps, openMeteoData, accuResult] = await Promise.all([
    fetchMeteoLt(city.meteoCode),
    fetchOpenMeteo(city.lat, city.lon),
    fetchAccuWeather(cityKey),
  ]);

  // Determine the MAXIMUM available days across all APIs
  let maxDays = 1; // At least 1 day

  // Count available days from Meteo.lt (unique dates in timestamps)
  if (meteoTimestamps?.length) {
    const uniqueDates = new Set(meteoTimestamps.map(t => t.forecastTimeUtc.split(' ')[0]));
    maxDays = Math.max(maxDays, uniqueDates.size);
  }

  // Count available days from Open-Meteo
  if (openMeteoData?.daily?.temperature_2m_max?.length) {
    maxDays = Math.max(maxDays, openMeteoData.daily.temperature_2m_max.length);
  }

  // Count available days from AccuWeather
  if (accuResult?.type === 'forecast' && accuResult.data?.length) {
    maxDays = Math.max(maxDays, accuResult.data.length);
  } else if (accuResult?.type === 'current') {
    maxDays = Math.max(maxDays, 1); // Current conditions covers today
  }

  const days = getNextNDays(maxDays).map(({ label, date }, dayIndex) => {
    const isToday   = dayIndex === 0;
    const dateStr   = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const sources   = [];

    // 1. Meteo.lt
    if (meteoTimestamps) {
      const dayData = aggregateMeteoLtDay(meteoTimestamps, dateStr);
      const card    = fmtMeteoLt(dayIndex, isToday, dayData);
      if (card) sources.push(card);
      else sources.push(unavailableCard('Meteo.lt', 'No forecast data for this day', dayIndex));
    } else {
      sources.push(unavailableCard('Meteo.lt', 'Data unavailable', dayIndex));
    }

    // 2. AccuWeather
    if (accuResult?.unavailable) {
      sources.push(unavailableCard(accuResult.source, accuResult.reason, dayIndex));
    } else if (accuResult?.type === 'forecast' && accuResult.data?.[dayIndex]) {
      sources.push(fmtAccuWeather(dayIndex, accuResult.data[dayIndex]));
    } else if (accuResult?.type === 'current' && accuResult.data?.[0] && isToday) {
      const curr = accuResult.data[0];
      const temp = curr.Temperature?.Metric?.Value ?? curr.Temperature ?? 0;
      sources.push({
        id: `accuweather-day${dayIndex}`,
        source: 'AccuWeather',
        temperature: Math.round(temp),
        minTemp: Math.round(temp - 3),
        maxTemp: Math.round(temp + 3),
        condition: curr.WeatherText || 'Unknown',
        feelsLike: Math.round(curr.RealFeelTemperature?.Metric?.Value ?? temp - 2),
        humidity: curr.RelativeHumidity || 0,
        windSpeed: Math.round(curr.Wind?.Speed?.Metric?.Value ?? 0),
        pressure: Math.round(curr.Pressure?.Metric?.Value ?? 1013),
        rainChance: curr.PrecipitationSummary ? 10 : 0,
        updated: 'now',
      });
    } else if (accuResult && !accuResult.unavailable) {
      sources.push(unavailableCard('AccuWeather', 'No forecast data for this day', dayIndex));
    }

    // 3. Open-Meteo
    if (openMeteoData) {
      sources.push(fmtOpenMeteo(dayIndex, isToday, openMeteoData.current, openMeteoData.daily));
    } else {
      sources.push(unavailableCard('Open-Meteo', 'Data unavailable', dayIndex));
    }

    return { date: label, sources };
  });

  res.status(200).json({ city: city.name, totalDays: maxDays, days });
}
