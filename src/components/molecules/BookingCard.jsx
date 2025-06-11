import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Pill from '@/components/atoms/Pill';
import IconLabel from '@/components/atoms/IconLabel';

const BookingCard = ({ booking, onDelete, getIcon, getColor, onViewTicket }) => {
  const bookingTypeIcon = getIcon(booking.type);
  const bookingTypeColor = getColor(booking.type);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bookingTypeColor}`}>
            <ApperIcon name={bookingTypeIcon} size={24} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-surface-900">
                {booking.details?.destination || booking.provider}
              </h3>
              <Pill className="bg-surface-100 text-surface-600">
                {booking.type}
              </Pill>
            </div>
            
<div className="space-y-2">
              <div className="flex items-center space-x-4 text-sm text-surface-600">
                <IconLabel icon="Building">
                  {booking.provider}
                </IconLabel>
                <IconLabel icon="Hash">
                  {booking.confirmationNumber}
                </IconLabel>
              </div>
              
              {/* Flight-specific information */}
              {booking.type === 'flight' && booking.details?.flightNumber && (
                <div className="flex items-center space-x-4 text-sm text-surface-600">
                  <IconLabel icon="Plane">
                    {booking.details.flightNumber}
                  </IconLabel>
                  <IconLabel icon="MapPin">
                    {booking.details.origin?.code} → {booking.details.destination?.code}
                  </IconLabel>
                </div>
              )}
              
              {booking.details?.date && (
                <IconLabel icon="Calendar">
                  <span>{format(new Date(booking.details.date), 'MMM d, yyyy')}</span>
                  {booking.details?.time && (
                    <>
                      <span>•</span>
                      <span>{booking.details.time}</span>
                    </>
                  )}
                </IconLabel>
              )}
              
              {/* Flight departure/arrival times */}
              {booking.type === 'flight' && booking.details?.departure && booking.details?.arrival && (
                <IconLabel icon="Clock">
                  {booking.details.departure.time} - {booking.details.arrival.time}
                  {booking.details.duration && (
                    <>
                      <span>•</span>
                      <span>{booking.details.duration}</span>
                    </>
                  )}
                </IconLabel>
              )}
              
              {booking.details?.guests && (
                <IconLabel icon="Users">
                  {booking.details.guests} guests
                </IconLabel>
              )}
              
              {booking.details?.passengers && (
                <IconLabel icon="Users">
                  {booking.details.passengers} passenger{booking.details.passengers !== 1 ? 's' : ''}
                </IconLabel>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-surface-900 mb-2">
            ${booking.price.toLocaleString()}
          </div>
          <div className="flex items-center space-x-2">
{booking.ticketGenerated && (
              <Button 
                onClick={() => onViewTicket && onViewTicket(booking)}
                className="p-2 text-surface-400 hover:text-surface-600 transition-colors bg-transparent"
                title="View E-Ticket"
              >
                <ApperIcon name="FileText" size={16} />
              </Button>
            )}
            <Button className="p-2 text-surface-400 hover:text-surface-600 transition-colors bg-transparent">
              <ApperIcon name="Download" size={16} />
            </Button>
            <Button className="p-2 text-surface-400 hover:text-surface-600 transition-colors bg-transparent">
              <ApperIcon name="Share" size={16} />
            </Button>
            <Button 
              onClick={() => onDelete(booking.id)}
              className="p-2 text-surface-400 hover:text-red-600 transition-colors bg-transparent"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;