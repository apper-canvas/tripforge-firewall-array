import React from 'react';

const Textarea = ({ label, id, name, value, onChange, placeholder, rows = 4, className = '', required = false, ...props }) => {
  return (
    <textarea
      id={id || name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className={`w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export default Textarea;