import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import IconLabel from '@/components/atoms/IconLabel';
import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip, onDelete }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/trips/${trip.id}`);
  };

  const renderActions = (tripId) => (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-surface-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
      <Button className="w-full px-4 py-2 text-left text-sm text-surface-700 hover:bg-surface-50 flex items-center space-x-2 bg-transparent" onClick={() => console.log('Edit clicked')}>
        <ApperIcon name="Edit2" size={14} />
        <span>Edit Trip</span>
      </Button>
      <Button onClick={() => onDelete(tripId)} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 bg-transparent">
        <ApperIcon name="Trash2" size={14} />
        <span>Delete Trip</span>
      </Button>
    </div>
  );

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden group"
    >
      <div className="relative h-48 bg-gradient-to-br from-primary to-secondary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-heading font-semibold">{trip.destination}</h3>
          <IconLabel icon="Calendar" size={14} className="text-white" textClassName="text-sm text-white">
            {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </IconLabel>
        </div>
        <div className="absolute top-4 right-4">
          <div className="relative">
            <Button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors group">
              <ApperIcon name="MoreVertical" size={16} className="text-white" />
            </Button>
            {renderActions(trip.id)}
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <IconLabel icon="Users" className="text-surface-500" textClassName="text-sm text-surface-600">
            {trip.travelers} travelers
          </IconLabel>
          <IconLabel icon="DollarSign" className="text-accent" textClassName="text-sm font-medium text-surface-900">
            ${trip.budget.toLocaleString()}
          </IconLabel>
        </div>
        
        <IconLabel icon="Globe" className="text-surface-500" textClassName="text-sm text-surface-600">
          {trip.currency}
        </IconLabel>
        
<div className="pt-4 border-t border-surface-100">
          <div className="flex space-x-2">
            <Button 
              onClick={handleViewDetails}
              className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View Details
            </Button>
            <Button className="px-3 py-2 bg-surface-100 text-surface-700 rounded-lg text-sm font-medium hover:bg-surface-200 transition-colors">
              Share
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;