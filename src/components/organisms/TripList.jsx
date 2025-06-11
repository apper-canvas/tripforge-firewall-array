import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TripCard from '@/components/molecules/TripCard';
import EmptyState from '@/components/atoms/EmptyState';

const TripList = ({ trips, onDeleteTrip, noTripsMessage, noTripsActionLink, noTripsActionText }) => {
  return (
    <AnimatePresence>
      {trips.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title={noTripsMessage || "No trips found"}
          message="Try adjusting your filters or create a new trip to get started."
          actionLink={noTripsActionLink}
          actionText={noTripsActionText}
          animateIcon
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={onDeleteTrip}
              // Pass initial/animate/transition for staggered animation on parent list if needed
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default TripList;