import { delay } from '../index';

let weatherData = [];

// Load initial weather data
const loadWeatherData = async () => {
  try {
    const { default: mockWeather } = await import('../mockData/weather.json');
    weatherData = [...mockWeather];
  } catch (error) {
    console.error('Failed to load weather data:', error);
    weatherData = [];
  }
};

// Initialize data
loadWeatherData();

const weatherService = {
  async getWeatherByCity(cityName) {
    try {
      await delay(300);
      
      if (!cityName || typeof cityName !== 'string') {
        throw new Error('Valid city name is required');
      }
    // Find weather data for the city (case-insensitive)
    const weather = weatherData.find(w => 
      w.city.toLowerCase() === cityName.toLowerCase()
    );
    
if (!weather) {
      // Return default weather data if city not found
      return {
        city: cityName,
        location: cityName, // Add location property for consistency
        temperature: Math.floor(Math.random() * 30) + 5, // Random temp between 5-35°C
        condition: 'partly cloudy',
        icon: 'cloud',
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5 // 5-25 km/h
      };
    }
    
    // Ensure consistent structure with location property
    const weatherResult = { ...weather };
    if (!weatherResult.location && weatherResult.city) {
      weatherResult.location = weatherResult.city;
    }
    
    return weatherResult;
return weatherResult;
    } catch (error) {
      console.error('Weather service error:', error);
      // Return safe fallback data on error
      return {
        city: cityName || 'Unknown',
        location: cityName || 'Unknown',
        temperature: 'N/A',
        condition: 'Unknown',
        icon: 'cloud',
        humidity: null,
        windSpeed: null,
        error: true
      };
    }
  },
  async getAll() {
    await delay(200);
    return [...weatherData];
  },

  async create(weatherInfo) {
    await delay(300);
    const newWeather = {
      id: Date.now().toString(),
      ...weatherInfo,
      createdAt: new Date().toISOString()
    };
    weatherData.push(newWeather);
    return { ...newWeather };
  },

  async update(id, updateData) {
    await delay(250);
    const index = weatherData.findIndex(w => w.id === id);
    if (index === -1) throw new Error('Weather data not found');
    
    weatherData[index] = { ...weatherData[index], ...updateData, updatedAt: new Date().toISOString() };
    return { ...weatherData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = weatherData.findIndex(w => w.id === id);
    if (index === -1) throw new Error('Weather data not found');
    
    weatherData.splice(index, 1);
    return { success: true };
  }
};

export default weatherService;