import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ label, type = 'text', options, id, name, value, onChange, placeholder, required = false, icon, rows, className = '' }) => {
  const renderInputComponent = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            options={options}
            required={required}
            className={className}
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className={className}
          />
        );
      default:
        return (
          <Input
            id={id || name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            icon={icon}
            className={className}
          />
        );
    }
  };

  return (
    <div>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-surface-700 mb-2">
          {label}
        </label>
      )}
      {renderInputComponent()}
    </div>
  );
};

export default FormField;