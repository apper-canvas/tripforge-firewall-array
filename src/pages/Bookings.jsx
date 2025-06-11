import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import bookingService from '../services/api/bookingService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await bookingService.getAll();
        setBookings(result);
      } catch (err) {
        setError(err.message || 'Failed to load bookings');
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingService.delete(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const getFilteredBookings = () => {
    let filtered = bookings;
    
    if (filter !== 'all') {
      filtered = filtered.filter(booking => booking.type === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.details?.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.confirmationNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getBookingIcon = (type) => {
    switch (type) {
      case 'flight': return 'Plane';
      case 'hotel': return 'Building';
      case 'car': return 'Car';
      case 'activity': return 'Camera';
      default: return 'Calendar';
    }
  };

  const getBookingColor = (type) => {
    switch (type) {
      case 'flight': return 'bg-blue-100 text-blue-600';
      case 'hotel': return 'bg-purple-100 text-purple-600';
      case 'car': return 'bg-green-100 text-green-600';
      case 'activity': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredBookings = getFilteredBookings();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load bookings</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 lg:pb-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">My Bookings</h1>
          <p className="text-surface-600 mt-1">Manage all your travel reservations</p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center space-x-2 self-start sm:self-auto"
        >
          <ApperIcon name="Plus" size={16} />
          <span>New Booking</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'flight', label: 'Flights' },
            { key: 'hotel', label: 'Hotels' },
            { key: 'car', label: 'Cars' },
            { key: 'activity', label: 'Activities' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-surface-700 hover:bg-surface-50 border border-surface-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <AnimatePresence>
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-surface-900">
              {bookings.length === 0 ? 'No bookings yet' : 'No bookings match your search'}
            </h3>
            <p className="mt-2 text-surface-500">
              {bookings.length === 0 
                ? 'Start by making your first reservation'
                : 'Try adjusting your search or filters'
              }
            </p>
            {bookings.length === 0 && (
              <button
                onClick={() => setShowBookingForm(true)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
              >
                Make Your First Booking
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getBookingColor(booking.type)}`}>
                      <ApperIcon name={getBookingIcon(booking.type)} size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-surface-900">
                          {booking.details?.destination || booking.provider}
                        </h3>
                        <span className="px-2 py-1 bg-surface-100 text-surface-600 rounded text-xs font-medium uppercase">
                          {booking.type}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm text-surface-600">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Building" size={14} />
                            <span>{booking.provider}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Hash" size={14} />
                            <span>{booking.confirmationNumber}</span>
                          </div>
                        </div>
                        
                        {booking.details?.date && (
                          <div className="flex items-center space-x-1 text-sm text-surface-600">
                            <ApperIcon name="Calendar" size={14} />
                            <span>{format(new Date(booking.details.date), 'MMM d, yyyy')}</span>
                            {booking.details?.time && (
                              <>
                                <span>•</span>
                                <span>{booking.details.time}</span>
                              </>
                            )}
                          </div>
                        )}
                        
                        {booking.details?.guests && (
                          <div className="flex items-center space-x-1 text-sm text-surface-600">
                            <ApperIcon name="Users" size={14} />
                            <span>{booking.details.guests} guests</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-surface-900 mb-2">
                      ${booking.price.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-surface-400 hover:text-surface-600 transition-colors">
                        <ApperIcon name="Download" size={16} />
                      </button>
                      <button className="p-2 text-surface-400 hover:text-surface-600 transition-colors">
                        <ApperIcon name="Share" size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="p-2 text-surface-400 hover:text-red-600 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Quick Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Booking Search</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">
                  <ApperIcon name="Plane" size={24} className="text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Flights</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">
                  <ApperIcon name="Building" size={24} className="text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Hotels</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">
                  <ApperIcon name="Car" size={24} className="text-green-600 mb-2" />
                  <span className="text-sm font-medium">Car Rental</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">
                  <ApperIcon name="Camera" size={24} className="text-orange-600 mb-2" />
                  <span className="text-sm font-medium">Activities</span>
                </button>
              </div>
              
              <div className="pt-4 border-t border-surface-200">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="w-full px-4 py-2 bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Bookings;