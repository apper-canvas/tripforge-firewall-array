import { delay } from '../index';

let itineraryItems = [];

// Load initial data
const loadItinerary = async () => {
  try {
    const { default: mockItinerary } = await import('../mockData/itinerary.json');
    itineraryItems = [...mockItinerary];
  } catch (error) {
    console.error('Failed to load itinerary data:', error);
    itineraryItems = [];
  }
};

// Initialize data
loadItinerary();

const itineraryService = {
  async getAll() {
    await delay(250);
    return [...itineraryItems];
  },

  async getById(id) {
    await delay(200);
    const item = itineraryItems.find(i => i.id === id);
    if (!item) throw new Error('Itinerary item not found');
    return { ...item };
  },

  async getByTripId(tripId) {
    await delay(300);
    return itineraryItems.filter(item => item.tripId === tripId).map(item => ({ ...item }));
  },

  async create(itemData) {
    await delay(350);
    const newItem = {
      id: Date.now().toString(),
      ...itemData,
      createdAt: new Date().toISOString()
    };
    itineraryItems.push(newItem);
    return { ...newItem };
  },

  async update(id, updateData) {
    await delay(300);
    const index = itineraryItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Itinerary item not found');
    
    itineraryItems[index] = { ...itineraryItems[index], ...updateData, updatedAt: new Date().toISOString() };
    return { ...itineraryItems[index] };
  },

  async delete(id) {
    await delay(200);
    const index = itineraryItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Itinerary item not found');
    
    itineraryItems.splice(index, 1);
    return { success: true };
  }
};

export default itineraryService;