import React from 'react';

const Pill = ({ children, className = '' }) => {
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${className}`}>
      {children}
    </span>
  );
};

export default Pill;