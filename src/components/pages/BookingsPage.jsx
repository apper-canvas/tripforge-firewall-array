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
  const [showTicketViewer, setShowTicketViewer] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
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

  const handleViewTicket = async (booking) => {
    try {
      const ticketData = await bookingService.generateTicket(booking.id);
      setSelectedTicket(ticketData);
      setShowTicketViewer(true);
    } catch (error) {
      toast.error('Failed to load ticket');
      console.error('Ticket loading error:', error);
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
        onViewTicket={handleViewTicket}
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

      <Modal isOpen={showTicketViewer} onClose={() => setShowTicketViewer(false)}>
        {selectedTicket && (
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900">E-Ticket</h3>
                <Button
                  variant="secondary"
                  onClick={() => setShowTicketViewer(false)}
                  className="p-2"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center border-b pb-4">
                  <h4 className="text-lg font-medium text-surface-900">
                    Ticket Number: {selectedTicket.ticketNumber}
                  </h4>
                  <p className="text-surface-600">
                    Confirmation: {selectedTicket.confirmationNumber}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-surface-600">Passenger</label>
                    <p className="text-surface-900">{selectedTicket.passengerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600">Generated</label>
                    <p className="text-surface-900">
                      {new Date(selectedTicket.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <div className="bg-surface-100 rounded-lg p-4">
                    <ApperIcon name="QrCode" size={64} className="mx-auto text-surface-600" />
                    <p className="text-sm text-surface-600 mt-2">
                      QR Code: {selectedTicket.qrCode}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button variant="secondary" className="flex-1">
                    <ApperIcon name="Download" size={16} className="mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <ApperIcon name="Mail" size={16} className="mr-2" />
                    Email Ticket
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default BookingsPage;