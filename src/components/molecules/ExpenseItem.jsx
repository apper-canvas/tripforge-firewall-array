import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ExpenseItem = ({ expense, currency, categoryInfo, onDelete }) => {
  const { icon, color, label } = categoryInfo;

  return (
    <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg border border-surface-200">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <ApperIcon name={icon} size={16} />
        </div>
        <div>
          <p className="font-medium text-surface-900">{expense.description}</p>
          <p className="text-sm text-surface-500">{expense.date} • {label}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-bold text-surface-900">
          {currency} {expense.amount.toLocaleString()}
        </span>
        <Button
          onClick={() => onDelete(expense.id)}
          className="p-1 text-surface-400 hover:text-red-600 transition-colors bg-transparent"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ExpenseItem;