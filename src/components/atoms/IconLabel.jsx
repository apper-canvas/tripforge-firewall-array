import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const IconLabel = ({ icon, size = 16, className = 'text-surface-500', textClassName = 'text-sm text-surface-600', children }) => {
  return (
    <div className="flex items-center space-x-2">
      <ApperIcon name={icon} size={size} className={className} />
      <span className={textClassName}>{children}</span>
    </div>
  );
};

export default IconLabel;