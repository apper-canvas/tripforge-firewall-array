import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickBookingSearchModalContent = ({ onCancel }) => {
  return (
    <>
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Booking Search</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button className="flex flex-col items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors bg-transparent">
            <ApperIcon name="Plane" size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium">Flights</span>
          </Button>
          <Button className="flex flex-col items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors bg-transparent">
            <ApperIcon name="Building" size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium">Hotels</span>
          </Button>
          <Button className="flex flex-col items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors bg-transparent">
            <ApperIcon name="Car" size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium">Car Rental</span>
          </Button>
          <Button className="flex flex-col items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors bg-transparent">
            <ApperIcon name="Camera" size={24} className="text-orange-600 mb-2" />
            <span className="text-sm font-medium">Activities</span>
          </Button>
        </div>
        
        <div className="pt-4 border-t border-surface-200">
          <Button
            onClick={onCancel}
            className="w-full bg-surface-100 text-surface-700 hover:bg-surface-200"
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default QuickBookingSearchModalContent;