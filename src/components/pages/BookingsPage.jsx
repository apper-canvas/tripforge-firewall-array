import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import BookingFilterAndSearchSection from '@/components/organisms/BookingFilterAndSearchSection';
import BookingList from '@/components/organisms/BookingList';
import Modal from '@/components/atoms/Modal';
import FlightBookingModalContent from '@/components/organisms/FlightBookingModalContent';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import bookingService from '@/services/api/bookingService';

const BookingsPage = () => {
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

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'flight', label: 'Flights' },
    { key: 'hotel', label: 'Hotels' },
    { key: 'car', label: 'Cars' },
    { key: 'activity', label: 'Activities' }
  ];

  const emptyStateProps = {
    title: bookings.length === 0 ? 'No bookings yet' : 'No bookings match your search',
    message: bookings.length === 0 ? 'Start by making your first reservation' : 'Try adjusting your search or filters',
    actionText: bookings.length === 0 ? 'Make Your First Booking' : undefined,
    onActionClick: bookings.length === 0 ? () => setShowBookingForm(true) : undefined,
  };

  if (loading) {
    return <LoadingSpinner message="Loading your bookings..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load bookings" details={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 lg:pb-6 space-y-6"
    >
      <PageHeader
        title="My Bookings"
        subtitle="Manage all your travel reservations"
        actionButton={{ onClick: () => setShowBookingForm(true), icon: 'Plus', text: 'New Booking' }}
      />

      <BookingFilterAndSearchSection
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        filters={filterOptions}
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      <BookingList
        bookings={filteredBookings}
        onDeleteBooking={handleDeleteBooking}
        getBookingIcon={getBookingIcon}
        getBookingColor={getBookingColor}
        emptyStateProps={emptyStateProps}
      />
<Modal isOpen={showBookingForm} onClose={() => setShowBookingForm(false)}>
        <FlightBookingModalContent 
          onCancel={() => setShowBookingForm(false)}
          onBookingComplete={(newBooking) => {
            setBookings(prev => [newBooking, ...prev]);
          }}
        />
      </Modal>
    </motion.div>
  );
};

export default BookingsPage;