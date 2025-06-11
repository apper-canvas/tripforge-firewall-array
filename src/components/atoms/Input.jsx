import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ label, id, name, value, onChange, placeholder, type = 'text', required = false, className = '', icon, ...props }) => {
  const inputClasses = `w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${icon ? 'pl-10' : ''} ${className}`;

  return (
    <div className="relative">
      {icon && (
        <ApperIcon name={icon} size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={inputClasses}
        {...props}
      />
    </div>
  );
};

export default Input;