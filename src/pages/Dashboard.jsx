import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import tripService from '../services/api/tripService';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await tripService.getAll();
        setTrips(result);
      } catch (err) {
        setError(err.message || 'Failed to load trips');
        toast.error('Failed to load trips');
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      await tripService.delete(tripId);
      setTrips(trips.filter(trip => trip.id !== tripId));
      toast.success('Trip deleted successfully');
    } catch (err) {
      toast.error('Failed to delete trip');
    }
  };

  const getFilteredTrips = () => {
    const now = new Date();
    switch (filter) {
      case 'active':
        return trips.filter(trip => new Date(trip.startDate) <= now && new Date(trip.endDate) >= now);
      case 'upcoming':
        return trips.filter(trip => new Date(trip.startDate) > now);
      case 'past':
        return trips.filter(trip => new Date(trip.endDate) < now);
      default:
        return trips;
    }
  };

  const filteredTrips = getFilteredTrips();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-surface-200 rounded-lg"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load trips</h3>
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

  if (trips.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="MapPin" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No trips yet</h3>
          <p className="mt-2 text-surface-500">Start planning your first adventure!</p>
          <Link
            to="/plan-trip"
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Plan Your First Trip</span>
          </Link>
        </motion.div>
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
          <h1 className="text-3xl font-heading font-bold text-surface-900">My Trips</h1>
          <p className="text-surface-600 mt-1">Manage and track all your adventures</p>
        </div>
        <Link
          to="/plan-trip"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center space-x-2 self-start sm:self-auto"
        >
          <ApperIcon name="Plus" size={16} />
          <span>New Trip</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Trips', count: trips.length },
          { key: 'active', label: 'Active', count: trips.filter(t => new Date(t.startDate) <= new Date() && new Date(t.endDate) >= new Date()).length },
          { key: 'upcoming', label: 'Upcoming', count: trips.filter(t => new Date(t.startDate) > new Date()).length },
          { key: 'past', label: 'Past', count: trips.filter(t => new Date(t.endDate) < new Date()).length }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-surface-700 hover:bg-surface-50 border border-surface-200'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      <AnimatePresence>
        {filteredTrips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="Filter" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900">No trips match your filter</h3>
            <p className="text-surface-500 mt-2">Try selecting a different filter or create a new trip</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden group"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary to-secondary">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-heading font-semibold">{trip.destination}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <ApperIcon name="Calendar" size={14} />
                      <span className="text-sm">
                        {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors group">
                        <ApperIcon name="MoreVertical" size={16} className="text-white" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-surface-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button className="w-full px-4 py-2 text-left text-sm text-surface-700 hover:bg-surface-50 flex items-center space-x-2">
                          <ApperIcon name="Edit2" size={14} />
                          <span>Edit Trip</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <ApperIcon name="Trash2" size={14} />
                          <span>Delete Trip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Users" size={16} className="text-surface-500" />
                      <span className="text-sm text-surface-600">{trip.travelers} travelers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="DollarSign" size={16} className="text-accent" />
                      <span className="text-sm font-medium text-surface-900">${trip.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Globe" size={16} className="text-surface-500" />
                    <span className="text-sm text-surface-600">{trip.currency}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-surface-100">
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-2 bg-surface-100 text-surface-700 rounded-lg text-sm font-medium hover:bg-surface-200 transition-colors">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;