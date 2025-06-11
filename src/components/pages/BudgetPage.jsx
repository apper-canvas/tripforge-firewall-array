import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import FormField from '@/components/molecules/FormField';
import BudgetSummary from '@/components/organisms/BudgetSummary';
import BudgetCategoryBreakdown from '@/components/organisms/BudgetCategoryBreakdown';
import ExpenseList from '@/components/organisms/ExpenseList';
import Modal from '@/components/atoms/Modal';
import AddExpenseForm from '@/components/organisms/AddExpenseForm';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import EmptyState from '@/components/atoms/EmptyState';
import ProgressBar from '@/components/atoms/ProgressBar';
import ApperIcon from '@/components/ApperIcon';
import expenseService from '@/services/api/expenseService';
import tripService from '@/services/api/tripService';

const BudgetPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    tripId: '',
    category: 'food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { key: 'food', label: 'Food & Dining', icon: 'Utensils', color: 'bg-orange-100 text-orange-600' },
    { key: 'transport', label: 'Transportation', icon: 'Car', color: 'bg-blue-100 text-blue-600' },
    { key: 'accommodation', label: 'Accommodation', icon: 'Building', color: 'bg-purple-100 text-purple-600' },
    { key: 'activities', label: 'Activities', icon: 'Camera', color: 'bg-green-100 text-green-600' },
    { key: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-100 text-pink-600' },
    { key: 'other', label: 'Other', icon: 'MoreHorizontal', color: 'bg-gray-100 text-gray-600' }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [expenseData, tripData] = await Promise.all([
          expenseService.getAll(),
          tripService.getAll()
        ]);
        setExpenses(expenseData);
        setTrips(tripData);
        if (tripData.length > 0 && !selectedTrip) {
          setSelectedTrip(tripData[0].id);
          setNewExpense(prev => ({...prev, tripId: tripData[0].id }));
        }
      } catch (err) {
        setError(err.message || 'Failed to load budget data');
        toast.error('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const expense = await expenseService.create({
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        tripId: selectedTrip
      });
      setExpenses([...expenses, expense]);
      setNewExpense({
        tripId: selectedTrip, // Keep selected trip
        category: 'food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddExpense(false);
      toast.success('Expense added successfully!');
    } catch (err) {
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await expenseService.delete(expenseId);
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      toast.success('Expense deleted successfully');
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const handleNewExpenseInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const getFilteredExpenses = () => {
    return selectedTrip ? expenses.filter(expense => expense.tripId === selectedTrip) : expenses;
  };

  const getCurrentTrip = () => {
    return trips.find(trip => trip.id === selectedTrip);
  };

  const totalExpensesForSelectedTrip = getFilteredExpenses().reduce((sum, expense) => sum + expense.amount, 0);

  const getExpensesByCategory = () => {
    const filtered = getFilteredExpenses();
    return categories.map(category => {
      const categoryExpenses = filtered.filter(expense => expense.category === category.key);
      const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        ...category,
        total,
        count: categoryExpenses.length
      };
    });
  };

  const currentTrip = getCurrentTrip();
  const budgetUsedPercentage = currentTrip ? (totalExpensesForSelectedTrip / currentTrip.budget) * 100 : 0;
  const categoryBreakdown = getExpensesByCategory();

  if (loading) {
    return <LoadingSpinner message="Loading budget data..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load budget data" details={error} onRetry={() => window.location.reload()} />;
  }

  if (trips.length === 0) {
    return (
      <EmptyState
        icon="DollarSign"
        title="No trips to track"
        message="Create a trip first to start tracking your budget."
        actionLink="/plan-trip"
        actionText="Plan Your First Trip"
        animateIcon
        className="min-h-96"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 lg:pb-6 space-y-6"
    >
      <PageHeader
        title="Budget Tracker"
        subtitle="Monitor your travel expenses and stay on budget"
        actionButton={{ onClick: () => setShowAddExpense(true), icon: 'Plus', text: 'Add Expense' }}
      />

      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <FormField
          label="Select Trip"
          type="select"
          value={selectedTrip}
          onChange={(e) => {
            setSelectedTrip(e.target.value);
            setNewExpense(prev => ({...prev, tripId: e.target.value }));
          }}
          options={trips.map(trip => ({ 
            value: trip.id, 
            label: `${trip.destination} - ${trip.currency} ${trip.budget.toLocaleString()}` 
          }))}
        />
      </div>

      {currentTrip && (
        <>
          <BudgetSummary
            totalBudget={currentTrip.budget}
            totalExpenses={totalExpensesForSelectedTrip}
            currency={currentTrip.currency}
          />

          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Budget Progress</h3>
              <span className="text-sm font-medium text-surface-600">
                {budgetUsedPercentage.toFixed(1)}% used
              </span>
            </div>
            <ProgressBar value={budgetUsedPercentage} />
            {budgetUsedPercentage > 100 && (
              <p className="text-sm text-red-600 mt-2">
                <ApperIcon name="AlertTriangle" size={16} className="inline mr-1" />
                You're over budget by {currentTrip.currency} {(totalExpensesForSelectedTrip - currentTrip.budget).toLocaleString()}
              </p>
            )}
          </div>
        </>
      )}

      <BudgetCategoryBreakdown categories={categoryBreakdown} currency={currentTrip?.currency || 'USD'} />

      <ExpenseList
        expenses={getFilteredExpenses()}
        currency={currentTrip?.currency || 'USD'}
        categories={categories}
        onDeleteExpense={handleDeleteExpense}
        onAddExpenseClick={() => setShowAddExpense(true)}
      />

      <Modal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)}>
        <AddExpenseForm
          newExpense={newExpense}
          categories={categories}
          onInputChange={handleNewExpenseInputChange}
          onSubmit={handleAddExpense}
          onCancel={() => setShowAddExpense(false)}
        />
      </Modal>
    </motion.div>
  );
};

export default BudgetPage;