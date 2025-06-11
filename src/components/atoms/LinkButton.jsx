import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const LinkButton = ({ to, children, className = '', icon, iconSize = 16, type = 'primary', ...props }) => {
  let baseClasses = '';
  if (type === 'primary') {
    baseClasses = 'bg-primary text-white hover:bg-blue-700 transition-all hover:scale-105';
  } else if (type === 'secondary') {
    baseClasses = 'bg-white text-surface-700 hover:bg-surface-50 border border-surface-200';
  } else if (type === 'ghost') {
    baseClasses = 'text-primary hover:text-blue-700';
  }

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${baseClasses} ${className}`}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={iconSize} />}
      <span>{children}</span>
    </Link>
  );
};

export default LinkButton;