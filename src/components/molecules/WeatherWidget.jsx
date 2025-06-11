import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const WeatherWidget = ({ 
  weather, 
  location, 
  className = '' 
}) => {
  // Handle missing weather data gracefully
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