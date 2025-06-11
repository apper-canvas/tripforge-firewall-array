import { delay } from '../index';

let trips = [];

// Load initial data
const loadTrips = async () => {
  try {
    const { default: mockTrips } = await import('../mockData/trips.json');
    trips = [...mockTrips];
  } catch (error) {
    console.error('Failed to load trips data:', error);
    trips = [];
  }
};

// Initialize data
loadTrips();

const tripService = {
  async getAll() {
    await delay(300);
    return [...trips];
  },

  async getById(id) {
    await delay(200);
    const trip = trips.find(t => t.id === id);
    if (!trip) throw new Error('Trip not found');
    return { ...trip };
  },

  async create(tripData) {
    await delay(400);
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      createdAt: new Date().toISOString()
    };
    trips.push(newTrip);
    return { ...newTrip };
  },

  async update(id, updateData) {
    await delay(300);
    const index = trips.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Trip not found');
    
    trips[index] = { ...trips[index], ...updateData, updatedAt: new Date().toISOString() };
    return { ...trips[index] };
  },

  async delete(id) {
    await delay(250);
    const index = trips.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Trip not found');
    
    trips.splice(index, 1);
    return { success: true };
  }
};

export default tripService;