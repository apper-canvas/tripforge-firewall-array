import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorMessage = ({ message = 'Something went wrong.', details, onRetry }) => {
  return (
    <div className="p-6 flex items-center justify-center min-h-96">
      <div className="text-center">
        <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">{message}</h3>
        {details && <p className="text-surface-600 mb-4">{details}</p>}
        {onRetry && (
          <Button onClick={onRetry} className="bg-primary text-white hover:bg-blue-700">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;