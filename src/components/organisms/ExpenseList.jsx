import React from 'react';
import ExpenseItem from '@/components/molecules/ExpenseItem';
import EmptyState from '@/components/atoms/EmptyState';
import Button from '@/components/atoms/Button';

const ExpenseList = ({ expenses, currency, categories, onDeleteExpense, onAddExpenseClick }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Expenses</h3>
      {expenses.length === 0 ? (
        <EmptyState
          icon="Receipt"
          title="No expenses recorded yet"
          message=""
          actionText="Add your first expense"
          onActionClick={onAddExpenseClick}
          className="py-8"
        />
      ) : (
        <div className="space-y-3">
          {expenses.slice(0, 10).map((expense) => {
            const category = categories.find(cat => cat.key === expense.category);
            return (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                currency={currency}
                categoryInfo={{
                  icon: category?.icon || 'MoreHorizontal',
                  color: category?.color || 'bg-gray-100 text-gray-600',
                  label: category?.label
                }}
                onDelete={onDeleteExpense}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;