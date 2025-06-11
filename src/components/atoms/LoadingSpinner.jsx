import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const LoadingSpinner = ({ size = 48, className = 'text-primary', message = 'Loading...', icon = 'Loader2' }) => {
  return (
    <div className="p-6 flex items-center justify-center min-h-96">
      <div className="text-center">
        <ApperIcon name={icon} size={size} className={`animate-spin mx-auto mb-4 ${className}`} />
        <p className="text-lg font-medium text-surface-900">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;