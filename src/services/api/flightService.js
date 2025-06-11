import { delay } from '../index';

// Mock flight data
const mockFlights = [
  {
    id: 'fl_001',
    airline: 'Delta Airlines',
    flightNumber: 'DL 1234',
    origin: { code: 'JFK', name: 'John F. Kennedy International', city: 'New York' },
    destination: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
    departure: { time: '08:30', date: '2024-12-15' },
    arrival: { time: '11:45', date: '2024-12-15' },
    duration: '5h 15m',
    stops: 0,
    price: 489,
    class: 'economy',
    aircraft: 'Boeing 737-800',
    amenities: ['WiFi', 'Entertainment', 'Power Outlets']
  },
  {
    id: 'fl_002',
    airline: 'American Airlines',
    flightNumber: 'AA 5678',
    origin: { code: 'JFK', name: 'John F. Kennedy International', city: 'New York' },
    destination: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
    departure: { time: '14:20', date: '2024-12-15' },
    arrival: { time: '17:35', date: '2024-12-15' },
    duration: '5h 15m',
    stops: 0,
    price: 524,
    class: 'economy',
    aircraft: 'Airbus A321',
    amenities: ['WiFi', 'Entertainment']
  },
  {
    id: 'fl_003',
    airline: 'United Airlines',
    flightNumber: 'UA 9012',
    origin: { code: 'JFK', name: 'John F. Kennedy International', city: 'New York' },
    destination: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
    departure: { time: '19:45', date: '2024-12-15' },
    arrival: { time: '23:00', date: '2024-12-15' },
    duration: '5h 15m',
    stops: 0,
    price: 445,
    class: 'economy',
    aircraft: 'Boeing 777-200',
    amenities: ['WiFi', 'Entertainment', 'Power Outlets', 'USB Ports']
  },
  {
    id: 'fl_004',
    airline: 'Southwest Airlines',
    flightNumber: 'WN 3456',
    origin: { code: 'JFK', name: 'John F. Kennedy International', city: 'New York' },
    destination: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
    departure: { time: '06:15', date: '2024-12-15' },
    arrival: { time: '12:30', date: '2024-12-15' },
    duration: '8h 15m',
    stops: 1,
    price: 329,
    class: 'economy',
    aircraft: 'Boeing 737-700',
    stopover: { code: 'DEN', name: 'Denver International', duration: '1h 30m' }
  },
  {
    id: 'fl_005',
    airline: 'JetBlue Airways',
    flightNumber: 'B6 7890',
    origin: { code: 'JFK', name: 'John F. Kennedy International', city: 'New York' },
    destination: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
    departure: { time: '16:10', date: '2024-12-15' },
    arrival: { time: '22:25', date: '2024-12-15' },
    duration: '8h 15m',
    stops: 1,
    price: 398,
    class: 'economy',
    aircraft: 'Airbus A320',
    stopover: { code: 'PHX', name: 'Phoenix Sky Harbor', duration: '2h 00m' }
  },
  {
    id: 'fl_006',
    airline: 'Delta Airlines',
    flightNumber: 'DL 2468',
    origin: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
    destination: { code: 'JFK', name: 'John F. Kennedy International', city: 'New York' },
    departure: { time: '09:15', date: '2024-12-20' },
    arrival: { time: '17:30', date: '2024-12-20' },
    duration: '5h 15m',
    stops: 0,
    price: 512,
    class: 'economy',
    aircraft: 'Boeing 757-200'
  }
];

const airports = [
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas' },
  { code: 'DEN', name: 'Denver International', city: 'Denver' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco' },
  { code: 'MIA', name: 'Miami International', city: 'Miami' },
  { code: 'BOS', name: 'Logan International', city: 'Boston' }
];

const airlines = [
  'Delta Airlines',
  'American Airlines',
  'United Airlines',
  'Southwest Airlines',
  'JetBlue Airways',
  'Alaska Airlines',
  'Spirit Airlines',
  'Frontier Airlines'
];

const flightService = {
  async searchFlights(searchParams) {
    await delay(800);
    
    let results = [...mockFlights];
    
    // Filter by origin/destination
    if (searchParams.origin) {
      results = results.filter(flight => 
        flight.origin.code.toLowerCase().includes(searchParams.origin.toLowerCase()) ||
        flight.origin.city.toLowerCase().includes(searchParams.origin.toLowerCase())
      );
    }
    
    if (searchParams.destination) {
      results = results.filter(flight => 
        flight.destination.code.toLowerCase().includes(searchParams.destination.toLowerCase()) ||
        flight.destination.city.toLowerCase().includes(searchParams.destination.toLowerCase())
      );
    }
    
    // Filter by date
    if (searchParams.departureDate) {
      results = results.filter(flight => flight.departure.date === searchParams.departureDate);
    }
    
    return results.map(flight => ({ ...flight }));
  },

  async filterFlights(flights, filters) {
    await delay(200);
    
    let filtered = [...flights];
    
    // Filter by airline
    if (filters.airlines?.length > 0) {
      filtered = filtered.filter(flight => filters.airlines.includes(flight.airline));
    }
    
    // Filter by stops
    if (filters.stops !== undefined) {
      if (filters.stops === 'nonstop') {
        filtered = filtered.filter(flight => flight.stops === 0);
      } else if (filters.stops === '1stop') {
        filtered = filtered.filter(flight => flight.stops === 1);
      } else if (filters.stops === '2+stops') {
        filtered = filtered.filter(flight => flight.stops >= 2);
      }
    }
    
    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(flight => 
        flight.price >= filters.priceRange.min && 
        flight.price <= filters.priceRange.max
      );
    }
    
    // Filter by duration
    if (filters.maxDuration) {
      filtered = filtered.filter(flight => {
        const durationMinutes = parseInt(flight.duration.split('h')[0]) * 60 + 
                               parseInt(flight.duration.split('h')[1]?.replace('m', '') || 0);
        return durationMinutes <= filters.maxDuration;
      });
    }
    
    return filtered;
  },

  async sortFlights(flights, sortBy) {
    await delay(100);
    
    const sorted = [...flights];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'duration':
        return sorted.sort((a, b) => {
          const aDuration = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1]?.replace('m', '') || 0);
          const bDuration = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1]?.replace('m', '') || 0);
          return aDuration - bDuration;
        });
      case 'departure':
        return sorted.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
      case 'arrival':
        return sorted.sort((a, b) => a.arrival.time.localeCompare(b.arrival.time));
      default:
        return sorted;
    }
  },

  async bookFlight(flightId, passengerInfo) {
    await delay(600);
    
    const flight = mockFlights.find(f => f.id === flightId);
    if (!flight) throw new Error('Flight not found');
    
    const booking = {
      type: 'flight',
      provider: flight.airline,
      price: flight.price,
      details: {
        flightNumber: flight.flightNumber,
        origin: flight.origin,
        destination: flight.destination,
        departure: flight.departure,
        arrival: flight.arrival,
        duration: flight.duration,
        stops: flight.stops,
        aircraft: flight.aircraft,
        passengers: passengerInfo.passengers || 1,
        class: flight.class,
        date: flight.departure.date,
        time: flight.departure.time
      }
    };
    
    return booking;
  },

  async getAirports(query = '') {
    await delay(150);
    
    if (!query) return airports.map(airport => ({ ...airport }));
    
    return airports.filter(airport => 
      airport.code.toLowerCase().includes(query.toLowerCase()) ||
      airport.name.toLowerCase().includes(query.toLowerCase()) ||
      airport.city.toLowerCase().includes(query.toLowerCase())
    ).map(airport => ({ ...airport }));
  },

  async getAirlines() {
    await delay(100);
    return [...airlines];
  },

  getPriceRange(flights) {
    if (!flights.length) return { min: 0, max: 1000 };
    
    const prices = flights.map(f => f.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }
};

export default flightService;