import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import TripFilterSection from '@/components/organisms/TripFilterSection';
import TripList from '@/components/organisms/TripList';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import tripService from '@/services/api/tripService';

const DashboardPage = () => {
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

  const filterOptions = [
    { key: 'all', label: 'All Trips', count: trips.length },
    { key: 'active', label: 'Active', count: trips.filter(t => new Date(t.startDate) <= new Date() && new Date(t.endDate) >= new Date()).length },
    { key: 'upcoming', label: 'Upcoming', count: trips.filter(t => new Date(t.startDate) > new Date()).length },
    { key: 'past', label: 'Past', count: trips.filter(t => new Date(t.endDate) < new Date()).length }
  ];

  if (loading) {
    return <LoadingSpinner message="Loading your trips..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load trips" details={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 lg:pb-6 space-y-6"
    >
      <PageHeader
        title="My Trips"
        subtitle="Manage and track all your adventures"
        actionButton={{ to: '/plan-trip', icon: 'Plus', text: 'New Trip' }}
      />

      <TripFilterSection
        filters={filterOptions}
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      <TripList
        trips={filteredTrips}
        onDeleteTrip={handleDeleteTrip}
        noTripsMessage={trips.length === 0 ? "No trips yet" : "No trips match your filter"}
        noTripsActionLink={trips.length === 0 ? "/plan-trip" : undefined}
        noTripsActionText={trips.length === 0 ? "Plan Your First Trip" : undefined}
      />
    </motion.div>
  );
};

export default DashboardPage;