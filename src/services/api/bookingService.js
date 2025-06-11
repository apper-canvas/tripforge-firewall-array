import { delay } from '../index';

let bookings = [];

// Load initial data
const loadBookings = async () => {
  try {
    const { default: mockBookings } = await import('../mockData/bookings.json');
    bookings = [...mockBookings];
  } catch (error) {
    console.error('Failed to load bookings data:', error);
    bookings = [];
  }
};

// Initialize data
loadBookings();

const bookingService = {
  async getAll() {
    await delay(350);
    return [...bookings];
  },

  async getById(id) {
    await delay(200);
    const booking = bookings.find(b => b.id === id);
    if (!booking) throw new Error('Booking not found');
    return { ...booking };
  },

  async getByType(type) {
    await delay(250);
    return bookings.filter(booking => booking.type === type).map(booking => ({ ...booking }));
  },

  async create(bookingData) {
    await delay(400);
    const newBooking = {
      id: Date.now().toString(),
      ...bookingData,
      confirmationNumber: `TF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    return { ...newBooking };
  },

  async update(id, updateData) {
    await delay(300);
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    
    bookings[index] = { ...bookings[index], ...updateData, updatedAt: new Date().toISOString() };
    return { ...bookings[index] };
  },

  async delete(id) {
    await delay(250);
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    
    bookings.splice(index, 1);
    return { success: true };
  }
};

export default bookingService;