import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import tripService from '../services/api/tripService';
import itineraryService from '../services/api/itineraryService';
import expenseService from '../services/api/expenseService';

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tripsData, itineraryData, expenseData] = await Promise.all([
          tripService.getAll(),
          itineraryService.getAll(),
          expenseService.getAll()
        ]);
        
        setTrips(tripsData);
        setUpcomingActivities(itineraryData.slice(0, 3));
        
        const budget = tripsData.reduce((sum, trip) => sum + trip.budget, 0);
        const expenses = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalBudget(budget);
        setTotalExpenses(expenses);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-surface-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
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

  const activeTrips = trips.filter(trip => new Date(trip.startDate) <= new Date() && new Date(trip.endDate) >= new Date());
  const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 lg:pb-6 space-y-6"
    >
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">Welcome back, Explorer!</h1>
          <p className="text-surface-600 mt-1">Ready to plan your next adventure?</p>
        </div>
        <Link
          to="/plan-trip"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>New Trip</span>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Map" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-surface-600">Total Trips</p>
              <p className="text-2xl font-bold text-surface-900">{trips.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm text-surface-600">Active Trips</p>
              <p className="text-2xl font-bold text-surface-900">{activeTrips.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-surface-600">Total Budget</p>
              <p className="text-2xl font-bold text-surface-900">${totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-surface-600">Spent</p>
              <p className="text-2xl font-bold text-surface-900">${totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Feature */}
      <MainFeature 
        trips={trips}
        upcomingActivities={upcomingActivities}
        totalBudget={totalBudget}
        totalExpenses={totalExpenses}
      />

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/explore"
            className="flex flex-col items-center p-4 rounded-lg hover:bg-surface-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ApperIcon name="Compass" size={24} className="text-primary" />
            </div>
            <span className="text-sm font-medium text-surface-700">Explore</span>
          </Link>
          
          <Link
            to="/bookings"
            className="flex flex-col items-center p-4 rounded-lg hover:bg-surface-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ApperIcon name="Calendar" size={24} className="text-secondary" />
            </div>
            <span className="text-sm font-medium text-surface-700">Bookings</span>
          </Link>
          
          <Link
            to="/budget"
            className="flex flex-col items-center p-4 rounded-lg hover:bg-surface-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ApperIcon name="PieChart" size={24} className="text-accent" />
            </div>
            <span className="text-sm font-medium text-surface-700">Budget</span>
          </Link>
          
          <Link
            to="/dashboard"
            className="flex flex-col items-center p-4 rounded-lg hover:bg-surface-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ApperIcon name="Map" size={24} className="text-green-600" />
            </div>
            <span className="text-sm font-medium text-surface-700">My Trips</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;