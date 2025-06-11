import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import FlightSearchResult from '@/components/molecules/FlightSearchResult';
import flightService from '@/services/api/flightService';
import bookingService from '@/services/api/bookingService';

const FlightBookingModalContent = ({ onCancel, onBookingComplete }) => {
const [step, setStep] = useState('search'); // 'search', 'results', 'payment', 'booking'
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });
  
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filters, setFilters] = useState({
    airlines: [],
    stops: '',
    priceRange: { min: 0, max: 1000 },
    maxDuration: null
  });
  const [sortBy, setSortBy] = useState('price-low');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [airportData, airlineData] = await Promise.all([
          flightService.getAirports(),
          flightService.getAirlines()
        ]);
        setAirports(airportData);
        setAirlines(airlineData);
      } catch (error) {
        console.error('Failed to load flight data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (flights.length > 0) {
      applyFiltersAndSort();
    }
  }, [flights, filters, sortBy]);

  const handleSearch = async () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      toast.error('Please fill in origin, destination, and departure date');
      return;
    }

    setLoading(true);
    try {
      const results = await flightService.searchFlights(searchParams);
      setFlights(results);
      
      if (results.length === 0) {
        toast.warning('No flights found for your search criteria');
      } else {
        setStep('results');
        // Update price range based on results
        const priceRange = flightService.getPriceRange(results);
        setFilters(prev => ({ ...prev, priceRange }));
      }
    } catch (error) {
      toast.error('Failed to search flights');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = async () => {
    try {
      let filtered = await flightService.filterFlights(flights, filters);
      filtered = await flightService.sortFlights(filtered, sortBy);
      setFilteredFlights(filtered);
    } catch (error) {
      console.error('Filter/sort error:', error);
    }
  };

const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setStep('payment');
  };

  const handlePaymentComplete = async (payment) => {
    setPaymentData(payment);
    setPaymentLoading(true);
    
    try {
      const bookingData = await flightService.bookFlight(selectedFlight.id, {
        passengers: searchParams.passengers,
        paymentInfo: payment
      });
      
      const savedBooking = await bookingService.create({
        ...bookingData,
        paymentStatus: 'completed',
        paymentId: payment.paymentId,
        ticketGenerated: true
      });
      
      toast.success(`Flight booked successfully! Confirmation: ${savedBooking.confirmationNumber}`);
      onBookingComplete && onBookingComplete(savedBooking);
      onCancel();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleBookFlight = async (flight) => {
    handleSelectFlight(flight);
  };

  const renderSearchForm = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <ApperIcon name="Plane" size={24} className="text-primary-600" />
        <h2 className="text-2xl font-bold text-surface-900">Search Flights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">From</label>
          <Input
            placeholder="Origin city or airport code"
            value={searchParams.origin}
            onChange={(e) => setSearchParams(prev => ({ ...prev, origin: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">To</label>
          <Input
            placeholder="Destination city or airport code"
            value={searchParams.destination}
            onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Departure Date</label>
          <Input
            type="date"
            value={searchParams.departureDate}
            onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Passengers</label>
          <Select
            value={searchParams.passengers}
            onChange={(e) => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
            options={[
              { value: 1, label: '1 Passenger' },
              { value: 2, label: '2 Passengers' },
              { value: 3, label: '3 Passengers' },
              { value: 4, label: '4 Passengers' },
              { value: 5, label: '5+ Passengers' }
            ]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Class</label>
          <Select
            value={searchParams.class}
            onChange={(e) => setSearchParams(prev => ({ ...prev, class: e.target.value }))}
            options={[
              { value: 'economy', label: 'Economy' },
              { value: 'premium', label: 'Premium Economy' },
              { value: 'business', label: 'Business' },
              { value: 'first', label: 'First Class' }
            ]}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button 
          onClick={onCancel}
          className="px-6 py-2 border border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
        >
          {loading ? 'Searching...' : 'Search Flights'}
        </Button>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="bg-surface-50 p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-surface-900">Filters & Sort</h3>
        <Button
          onClick={() => setStep('search')}
          className="text-sm text-primary-600 hover:text-primary-700 bg-transparent p-1"
        >
          ← New Search
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Sort By</label>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'duration', label: 'Duration' },
              { value: 'departure', label: 'Departure Time' },
              { value: 'arrival', label: 'Arrival Time' }
            ]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Stops</label>
          <Select
            value={filters.stops}
            onChange={(e) => setFilters(prev => ({ ...prev, stops: e.target.value }))}
            options={[
              { value: '', label: 'Any' },
              { value: 'nonstop', label: 'Nonstop' },
              { value: '1stop', label: '1 Stop' },
              { value: '2+stops', label: '2+ Stops' }
            ]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Max Price</label>
          <Input
            type="number"
            placeholder="Max price"
            value={filters.priceRange.max}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              priceRange: { ...prev.priceRange, max: parseInt(e.target.value) || 1000 }
            }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Max Duration (hrs)</label>
          <Input
            type="number"
            placeholder="Max hours"
            value={filters.maxDuration ? Math.floor(filters.maxDuration / 60) : ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              maxDuration: e.target.value ? parseInt(e.target.value) * 60 : null
            }))}
          />
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">
            {searchParams.origin} → {searchParams.destination}
          </h2>
          <p className="text-surface-600">
            {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {renderFilters()}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredFlights.map((flight) => (
            <FlightSearchResult
              key={flight.id}
              flight={flight}
              onBook={handleBookFlight}
              loading={bookingLoading && selectedFlight?.id === flight.id}
            />
          ))}
        </AnimatePresence>
        
        {filteredFlights.length === 0 && (
          <div className="text-center py-8">
            <ApperIcon name="Search" size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No flights match your filters</p>
            <Button 
              onClick={() => setFilters({
                airlines: [],
                stops: '',
                priceRange: flightService.getPriceRange(flights),
                maxDuration: null
              })}
              className="mt-2 text-primary-600 hover:text-primary-700 bg-transparent"
            >
Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <ApperIcon name="CreditCard" size={24} className="text-primary-600" />
        <h3 className="text-lg font-semibold text-surface-900">Payment Details</h3>
      </div>
      
      {selectedFlight && (
        <div className="bg-surface-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-surface-900 mb-2">Flight Summary</h4>
          <div className="flex justify-between items-center">
            <span className="text-surface-600">
              {selectedFlight.origin.code} → {selectedFlight.destination.code}
            </span>
            <span className="font-semibold text-primary-600">${selectedFlight.price}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            required
          />
          <Input
            label="Cardholder Name"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry Date"
            placeholder="MM/YY"
            required
          />
          <Input
            label="CVV"
            placeholder="123"
            required
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-surface-900">Billing Address</h4>
          <Input
            label="Street Address"
            placeholder="123 Main St"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="New York"
              required
            />
            <Input
              label="ZIP Code"
              placeholder="10001"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <Button
          variant="secondary"
          onClick={() => setStep('results')}
          className="flex-1"
        >
          Back to Flights
        </Button>
        <Button
          onClick={() => handlePaymentComplete({
            paymentId: `pay_${Date.now()}`,
            amount: selectedFlight.price,
            currency: 'USD',
            status: 'completed'
          })}
          loading={paymentLoading}
          className="flex-1"
        >
          Complete Payment
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner message="Searching for flights..." />;
  }

  return (
<div className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
      {step === 'search' && renderSearchForm()}
      {step === 'results' && renderResults()}
      {step === 'payment' && renderPaymentForm()}
    </div>
  );
};

export default FlightBookingModalContent;