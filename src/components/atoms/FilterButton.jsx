import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterButton = ({ onClick, label, active, count, icon, ...props }) => {
  return (
    <Button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
        active
          ? 'bg-primary text-white shadow-sm'
          : 'bg-white text-surface-700 hover:bg-surface-50 border border-surface-200'
      }`}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={16} />}
      <span>{label} {count !== undefined && `(${count})`}</span>
    </Button>
  );
};

export default FilterButton;