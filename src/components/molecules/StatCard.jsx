import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ icon, iconBgClass, iconColorClass, label, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgClass}`}>
          <ApperIcon name={icon} size={24} className={iconColorClass} />
        </div>
        <div>
          <p className="text-sm text-surface-600">{label}</p>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;