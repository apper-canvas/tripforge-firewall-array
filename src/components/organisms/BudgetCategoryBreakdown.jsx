import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const BudgetCategoryBreakdown = ({ categories, currency }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Spending by Category</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.key} className="flex items-center space-x-3 p-4 rounded-lg border border-surface-200">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
              <ApperIcon name={category.icon} size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-900">{category.label}</p>
              <p className="text-lg font-bold text-surface-900">
                {currency} {category.total.toLocaleString()}
              </p>
              <p className="text-xs text-surface-500">{category.count} expenses</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetCategoryBreakdown;