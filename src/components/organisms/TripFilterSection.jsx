import React from 'react';
import FilterButton from '@/components/atoms/FilterButton';

const TripFilterSection = ({ filters, currentFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ key, label, count }) => (
        <FilterButton
          key={key}
          onClick={() => onFilterChange(key)}
          label={label}
          count={count}
          active={currentFilter === key}
        />
      ))}
    </div>
  );
};

export default TripFilterSection;