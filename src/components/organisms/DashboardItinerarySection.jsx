import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EmptyState from '@/components/atoms/EmptyState';
import ActivityCard from '@/components/molecules/ActivityCard';

const DashboardItinerarySection = ({ upcomingActivities }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-surface-900">Upcoming Activities</h3>
        <Link to="/dashboard" className="text-primary hover:text-blue-700 text-sm font-medium">
          Manage Itinerary
        </Link>
      </div>
      
      {upcomingActivities.length === 0 ? (
        <EmptyState
          icon="Clock"
          title="No activities planned"
          message="Start building your itinerary for your next trip"
          actionLink="/plan-trip"
          actionText="Plan Activities"
          animateIcon
          className="py-12 bg-surface-50"
        />
      ) : (
        <div className="space-y-4">
          {upcomingActivities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardItinerarySection;