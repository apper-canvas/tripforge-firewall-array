import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const ActivityCard = ({ activity, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start space-x-4 p-4 border border-surface-200 rounded-lg"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
        <ApperIcon name="MapPin" size={20} className="text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-surface-900">{activity.activity}</h4>
        <p className="text-sm text-surface-600 mt-1">{activity.location}</p>
        <div className="flex items-center space-x-4 mt-2 text-xs text-surface-500">
          <span>{format(new Date(activity.date), 'MMM d, yyyy')}</span>
          <span>{activity.time}</span>
          <span>{activity.duration} hours</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-surface-900">${activity.cost}</p>
      </div>
    </motion.div>
  );
};

export default ActivityCard;