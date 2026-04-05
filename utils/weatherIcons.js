export function getWeatherIcon(condition) {
  const normalizedCondition = condition.toLowerCase();

  const iconMap = {
    'clear': '☀️',
    'sunny': '☀️',
    'mostly clear': '🌤️',
    'partly cloudy': '⛅',
    'cloudy': '☁️',
    'overcast': '☁️',
    'light rain': '🌦️',
    'rain': '🌧️',
    'heavy rain': '⛈️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'light snow': '🌨️',
    'sleet': '🌨️',
    'fog': '🌫️',
    'mist': '🌫️',
    'drizzle': '🌦️',
    'scattered showers': '🌧️',
  };

  // Find matching condition
  for (const [key, emoji] of Object.entries(iconMap)) {
    if (normalizedCondition.includes(key)) {
      return emoji;
    }
  }

  // Default icon
  return '🌤️';
}
