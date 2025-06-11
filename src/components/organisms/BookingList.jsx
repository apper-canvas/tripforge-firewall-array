import React from 'react';
import { AnimatePresence } from 'framer-motion';
import BookingCard from '@/components/molecules/BookingCard';
import EmptyState from '@/components/atoms/EmptyState';

const BookingList = ({ bookings, onDeleteBooking, getBookingIcon, getBookingColor, emptyStateProps }) => {
  return (
    <AnimatePresence>
      {bookings.length === 0 ? (
        <EmptyState
          icon="Calendar"
          title="No bookings found"
          message="Try adjusting your search or filters."
          animateIcon
          {...emptyStateProps}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onDelete={onDeleteBooking}
              getIcon={getBookingIcon}
              getColor={getBookingColor}
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

export default BookingList;