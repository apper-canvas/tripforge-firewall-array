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
    const ticketNumber = `TKT${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const newBooking = {
      id: Date.now().toString(),
      ...bookingData,
      confirmationNumber: `TF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      ticketNumber: ticketNumber,
      ticketGenerated: bookingData.ticketGenerated || false,
      paymentStatus: bookingData.paymentStatus || 'pending',
      paymentId: bookingData.paymentId || null,
      eTicketUrl: bookingData.ticketGenerated ? `/tickets/${ticketNumber}.pdf` : null,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    bookings.unshift(newBooking); // Add to beginning for most recent first
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
  },

  async generateTicket(bookingId) {
    await delay(300);
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    
    const ticketData = {
      ticketNumber: booking.ticketNumber,
      bookingId: booking.id,
      confirmationNumber: booking.confirmationNumber,
      passengerName: booking.passengerDetails?.name || 'Passenger',
      flightDetails: booking.flightDetails,
      qrCode: `QR_${booking.ticketNumber}`,
      generatedAt: new Date().toISOString()
    };
    
    return ticketData;
  }
};

export default bookingService;