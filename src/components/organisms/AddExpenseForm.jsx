import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const AddExpenseForm = ({ newExpense, categories, onInputChange, onSubmit, onCancel }) => {
  return (
    <>
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Add New Expense</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Category"
          type="select"
          name="category"
          value={newExpense.category}
          onChange={onInputChange}
          options={categories.map(cat => ({ value: cat.key, label: cat.label }))}
        />
        
        <FormField
          label="Amount"
          type="number"
          name="amount"
          value={newExpense.amount}
          onChange={onInputChange}
          placeholder="0.00"
          step="0.01"
          required
        />
        
        <FormField
          label="Description"
          type="text"
          name="description"
          value={newExpense.description}
          onChange={onInputChange}
          placeholder="What did you spend on?"
          required
        />
        
        <FormField
          label="Date"
          type="date"
          name="date"
          value={newExpense.date}
          onChange={onInputChange}
          required
        />
        
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-surface-100 text-surface-700 hover:bg-surface-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary text-white hover:bg-blue-700"
          >
            Add Expense
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddExpenseForm;