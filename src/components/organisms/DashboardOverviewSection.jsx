import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import EmptyState from '@/components/atoms/EmptyState';
import IconLabel from '@/components/atoms/IconLabel';

const DashboardOverviewSection = ({ trips }) => {
  const activeTrips = trips.filter(trip => 
    new Date(trip.startDate) <= new Date() && new Date(trip.endDate) >= new Date()
  ).slice(0, 2);
  
  const upcomingTrips = trips.filter(trip => 
    new Date(trip.startDate) > new Date()
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Active Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-surface-900">Active Trips</h3>
          <Link to="/dashboard" className="text-primary hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {activeTrips.length === 0 ? (
          <EmptyState
            icon="Plane"
            title="No active trips"
            message=""
            actionLink="/plan-trip"
            actionText="Plan a trip"
            className="py-8 bg-surface-50"
          />
        ) : (
          <div className="space-y-3">
            {activeTrips.map((trip) => (
              <div key={trip.id} className="flex items-center space-x-4 p-4 bg-surface-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="MapPin" size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-surface-900">{trip.destination}</h4>
                  <p className="text-sm text-surface-600">
                    {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-surface-900">${trip.budget.toLocaleString()}</p>
                  <p className="text-xs text-surface-500">{trip.travelers} travelers</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-surface-900">Upcoming Trips</h3>
          <Link to="/dashboard" className="text-primary hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {upcomingTrips.length === 0 ? (
          <EmptyState
            icon="Calendar"
            title="No upcoming trips"
            message=""
            actionLink="/plan-trip"
            actionText="Plan your next adventure"
            className="py-8 bg-surface-50"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTrips.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-surface-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="MapPin" size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-surface-900">{trip.destination}</h4>
                    <p className="text-xs text-surface-600">{trip.travelers} travelers</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <IconLabel icon="Calendar" textClassName="text-sm text-surface-600">
                    {format(new Date(trip.startDate), 'MMM d, yyyy')}
                  </IconLabel>
                  <IconLabel icon="DollarSign" textClassName="text-sm text-surface-600">
                    ${trip.budget.toLocaleString()}
                  </IconLabel>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverviewSection;