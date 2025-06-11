import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ value, max = 100, className = 'h-3', barClassName = 'bg-primary' }) => {
  const progressWidth = Math.min(Math.max(value, 0), max); // Ensure value is between 0 and max

  let colorClass = 'bg-primary';
  if (value > 90) {
    colorClass = 'bg-red-500';
  } else if (value > 75) {
    colorClass = 'bg-accent';
  }

  return (
    <div className={`w-full bg-surface-200 rounded-full ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progressWidth}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
  );
};

export default ProgressBar;