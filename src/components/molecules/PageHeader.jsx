import React from 'react';
import LinkButton from '@/components/atoms/LinkButton';
import Button from '@/components/atoms/Button';

const PageHeader = ({ title, subtitle, actionButton, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 ${className}`}>
      <div>
        <h1 className="text-3xl font-heading font-bold text-surface-900">{title}</h1>
        {subtitle && <p className="text-surface-600 mt-1">{subtitle}</p>}
      </div>
      {actionButton && (
        actionButton.to ? (
          <LinkButton
            to={actionButton.to}
            icon={actionButton.icon}
            className="self-start sm:self-auto"
          >
            {actionButton.text}
          </LinkButton>
        ) : (
          <Button
            onClick={actionButton.onClick}
            className="bg-primary text-white hover:bg-blue-700 transition-all hover:scale-105 flex items-center space-x-2 self-start sm:self-auto"
          >
            {actionButton.icon && <ApperIcon name={actionButton.icon} size={16} />}
            <span>{actionButton.text}</span>
          </Button>
        )
      )}
    </div>
  );
};

export default PageHeader;