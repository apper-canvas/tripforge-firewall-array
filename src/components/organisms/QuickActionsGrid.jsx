import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const QuickActionsGrid = () => {
  const actions = [
    { to: "/explore", icon: "Compass", label: "Explore", iconBg: "bg-primary/10", iconColor: "text-primary" },
    { to: "/bookings", icon: "Calendar", label: "Bookings", iconBg: "bg-secondary/10", iconColor: "text-secondary" },
    { to: "/budget", icon: "PieChart", label: "Budget", iconBg: "bg-accent/10", iconColor: "text-accent" },
    { to: "/dashboard", icon: "Map", label: "My Trips", iconBg: "bg-green-100", iconColor: "text-green-600" },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-surface-50 transition-colors group"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform ${action.iconBg}`}>
              <ApperIcon name={action.icon} size={24} className={action.iconColor} />
            </div>
            <span className="text-sm font-medium text-surface-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;