import React from 'react';
import { AnimatePresence } from 'framer-motion';
import DestinationCard from '@/components/molecules/DestinationCard';
import EmptyState from '@/components/atoms/EmptyState';

const ExploreDestinationsGrid = ({ destinations, savedDestinations, onToggleSave }) => {
  return (
    <AnimatePresence>
      {destinations.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title="No destinations found"
          message="Try adjusting your search or filter criteria"
          animateIcon
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              isSaved={savedDestinations.has(destination.id)}
              onToggleSave={onToggleSave}
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

export default ExploreDestinationsGrid;