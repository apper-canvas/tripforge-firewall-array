import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import QuickStatsGrid from '@/components/organisms/QuickStatsGrid';
import FeatureTabSection from '@/components/organisms/FeatureTabSection';
import QuickActionsGrid from '@/components/organisms/QuickActionsGrid';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import tripService from '@/services/api/tripService';
import itineraryService from '@/services/api/itineraryService';
import expenseService from '@/services/api/expenseService';

const HomePage = () => {
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

  const activeTripsCount = trips.filter(trip => new Date(trip.startDate) <= new Date() && new Date(trip.endDate) >= new Date()).length;

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load dashboard data" details={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 lg:pb-6 space-y-6"
    >
      <PageHeader
        title="Welcome back, Explorer!"
        subtitle="Ready to plan your next adventure?"
        actionButton={{ to: '/plan-trip', icon: 'Plus', text: 'New Trip' }}
      />

      <QuickStatsGrid
        totalTrips={trips.length}
        activeTripsCount={activeTripsCount}
        totalBudget={totalBudget}
        totalExpenses={totalExpenses}
      />

      <FeatureTabSection 
        trips={trips}
        upcomingActivities={upcomingActivities}
        totalBudget={totalBudget}
        totalExpenses={totalExpenses}
      />

      <QuickActionsGrid />
    </motion.div>
  );
};

export default HomePage;