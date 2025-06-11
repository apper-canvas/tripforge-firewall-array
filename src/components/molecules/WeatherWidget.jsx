import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
const WeatherWidget = ({ 
  cityName, 
  className = '' 
}) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!cityName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { default: weatherService } = await import('@/services/api/weatherService');
        const weatherData = await weatherService.getWeatherByCity(cityName);
        setWeather(weatherData);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityName]);

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
        <span className="text-sm">Loading weather...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <ApperIcon name="cloud" className="w-4 h-4" />
        <span className="text-sm">Weather unavailable</span>
      </div>
    );
  }

  // No weather data
  if (!weather) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <ApperIcon name="cloud" className="w-4 h-4" />
        <span className="text-sm">Weather unavailable</span>
      </div>
    );
  }

  const {
    temperature = '--',
    condition = 'Unknown',
    icon = 'cloud',
    humidity,
    windSpeed
  } = weather;

  return (
    <div className={`flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg ${className}`}>
      <div className="flex items-center gap-2">
        <ApperIcon 
          name={icon} 
          className="w-5 h-5 text-white" 
        />
        <div className="text-white">
          <div className="text-lg font-semibold">
            {typeof temperature === 'number' ? `${temperature}°` : temperature}
          </div>
          <div className="text-xs opacity-90 capitalize">
            {condition}
          </div>
        </div>
      </div>
      
      {location && (
        <div className="text-xs text-white/80 ml-auto">
          {location}
        </div>
      )}
      
      {(humidity || windSpeed) && (
        <div className="flex flex-col text-xs text-white/70 ml-2">
          {humidity && <span>Humidity: {humidity}%</span>}
          {windSpeed && <span>Wind: {windSpeed} km/h</span>}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;