import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Pill from '@/components/atoms/Pill';

const FlightSearchResult = ({ flight, onBook, loading }) => {
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-surface-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 flex-1">
          {/* Airline Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ApperIcon name="Plane" size={24} className="text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-surface-900">{flight.airline}</div>
              <div className="text-sm text-surface-500">{flight.flightNumber}</div>
            </div>
          </div>

          {/* Flight Route */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="text-center">
              <div className="text-xl font-bold text-surface-900">
                {formatTime(flight.departure.time)}
              </div>
              <div className="text-sm text-surface-600">{flight.origin.code}</div>
              <div className="text-xs text-surface-500">{flight.origin.city}</div>
            </div>

            <div className="flex-1 relative">
              <div className="flex items-center justify-center">
                <div className="h-px bg-surface-200 flex-1"></div>
                <div className="mx-3 bg-surface-100 rounded-full p-2">
                  <ApperIcon name="Plane" size={16} className="text-surface-600 rotate-90" />
                </div>
                <div className="h-px bg-surface-200 flex-1"></div>
              </div>
              <div className="text-center mt-1">
                <div className="text-xs text-surface-500">{flight.duration}</div>
                {flight.stops > 0 && (
                  <div className="text-xs text-orange-600">
                    {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-surface-900">
                {formatTime(flight.arrival.time)}
              </div>
              <div className="text-sm text-surface-600">{flight.destination.code}</div>
              <div className="text-xs text-surface-500">{flight.destination.city}</div>
            </div>
          </div>
        </div>

        {/* Price and Book */}
        <div className="text-right ml-6">
          <div className="text-2xl font-bold text-surface-900 mb-2">
            ${flight.price}
          </div>
          <div className="text-sm text-surface-500 mb-3">per person</div>
          
          <div className="flex items-center space-x-2 mb-3">
            {flight.stops === 0 && (
              <Pill className="bg-green-100 text-green-700 text-xs">Nonstop</Pill>
            )}
            <Pill className="bg-blue-100 text-blue-700 text-xs capitalize">
              {flight.class}
            </Pill>
          </div>

          <Button
            onClick={() => onBook(flight)}
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book Flight'}
          </Button>
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-4 pt-4 border-t border-surface-100">
        <div className="flex items-center justify-between text-sm text-surface-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ApperIcon name="Settings" size={14} />
              <span>{flight.aircraft}</span>
            </span>
            {flight.amenities && flight.amenities.length > 0 && (
              <span className="flex items-center space-x-1">
                <ApperIcon name="Wifi" size={14} />
                <span>{flight.amenities.join(', ')}</span>
              </span>
            )}
          </div>
          
          {flight.stopover && (
            <span className="text-orange-600">
              Stop in {flight.stopover.code} ({flight.stopover.duration})
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FlightSearchResult;