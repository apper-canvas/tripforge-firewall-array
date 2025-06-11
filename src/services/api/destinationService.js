import { delay } from '../index';

let destinations = [];

// Load initial data
const loadDestinations = async () => {
  try {
    const { default: mockDestinations } = await import('../mockData/destinations.json');
    destinations = [...mockDestinations];
  } catch (error) {
    console.error('Failed to load destinations data:', error);
    destinations = [];
  }
};

// Initialize data
loadDestinations();

const destinationService = {
  async getAll() {
    await delay(400);
    return [...destinations];
  },

  async getById(id) {
    await delay(200);
    const destination = destinations.find(d => d.id === id);
    if (!destination) throw new Error('Destination not found');
    return { ...destination };
  },

  async getByCategory(category) {
    await delay(300);
    return destinations.filter(dest => dest.category === category).map(dest => ({ ...dest }));
  },

  async search(query) {
    await delay(350);
    const searchTerm = query.toLowerCase();
    return destinations.filter(dest => 
      dest.city.toLowerCase().includes(searchTerm) ||
      dest.country.toLowerCase().includes(searchTerm) ||
      dest.description.toLowerCase().includes(searchTerm)
    ).map(dest => ({ ...dest }));
  },

  async create(destinationData) {
    await delay(400);
    const newDestination = {
      id: Date.now().toString(),
      ...destinationData,
      createdAt: new Date().toISOString()
    };
    destinations.push(newDestination);
    return { ...newDestination };
  },

  async update(id, updateData) {
    await delay(300);
    const index = destinations.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Destination not found');
    
    destinations[index] = { ...destinations[index], ...updateData, updatedAt: new Date().toISOString() };
    return { ...destinations[index] };
  },

  async delete(id) {
    await delay(250);
    const index = destinations.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Destination not found');
    
    destinations.splice(index, 1);
    return { success: true };
  }
};

export default destinationService;