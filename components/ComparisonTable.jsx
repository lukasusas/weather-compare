// Optional comparison table view
// Can be imported and used as an alternative to card layout

export default function ComparisonTable({ sources }) {
  if (!sources || sources.length === 0) return null;

  const metrics = [
    { label: 'Temperature', key: 'temperature', unit: '°C' },
    { label: 'Feels Like', key: 'feelsLike', unit: '°C' },
    { label: 'Min/Max', key: 'minMaxTemp', unit: '°C' },
    { label: 'Humidity', key: 'humidity', unit: '%' },
    { label: 'Wind Speed', key: 'windSpeed', unit: 'km/h' },
    { label: 'Rain Chance', key: 'rainChance', unit: '%' },
    { label: 'Pressure', key: 'pressure', unit: 'mb' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Metric</th>
            {sources.map((source) => (
              <th key={source.id} className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                {source.source}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.key} className="border-b border-white/10 hover:bg-white/10 transition">
              <td className="py-3 px-4 text-sm text-gray-700 font-medium">{metric.label}</td>
              {sources.map((source) => (
                <td key={`${source.id}-${metric.key}`} className="text-center py-3 px-4">
                  <span className="text-sm font-medium text-gray-900">
                    {renderMetricValue(source, metric)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderMetricValue(source, metric) {
  switch (metric.key) {
    case 'minMaxTemp':
      return `${source.minTemp}° / ${source.maxTemp}°`;
    case 'temperature':
      return `${source.temperature}${metric.unit}`;
    case 'feelsLike':
      return `${source.feelsLike}${metric.unit}`;
    case 'humidity':
      return `${source.humidity}${metric.unit}`;
    case 'windSpeed':
      return `${source.windSpeed}${metric.unit}`;
    case 'rainChance':
      return `${source.rainChance}${metric.unit}`;
    case 'pressure':
      return `${source.pressure}${metric.unit}`;
    default:
      return '-';
  }
}
