import React from 'react';
import FormField from '@/components/molecules/FormField';
import FilterButton from '@/components/atoms/FilterButton';

const BookingFilterAndSearchSection = ({ searchTerm, onSearchChange, filters, currentFilter, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="flex-1">
        <FormField
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={onSearchChange}
          icon="Search"
          className="text-lg"
        />
      </div>
      
      <div className="flex space-x-2">
        {filters.map(({ key, label }) => (
          <FilterButton
            key={key}
            onClick={() => onFilterChange(key)}
            label={label}
            active={currentFilter === key}
          />
        ))}
      </div>
    </div>
  );
};

export default BookingFilterAndSearchSection;