import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import expenseService from '../services/api/expenseService';
import tripService from '../services/api/tripService';

const Budget = () => {
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
        tripId: '',
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

  const getFilteredExpenses = () => {
    return selectedTrip ? expenses.filter(expense => expense.tripId === selectedTrip) : expenses;
  };

  const getCurrentTrip = () => {
    return trips.find(trip => trip.id === selectedTrip);
  };

  const getTotalExpenses = () => {
    return getFilteredExpenses().reduce((sum, expense) => sum + expense.amount, 0);
  };

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
  const totalExpenses = getTotalExpenses();
  const budgetUsed = currentTrip ? (totalExpenses / currentTrip.budget) * 100 : 0;
  const categoryBreakdown = getExpensesByCategory();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-surface-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load budget data</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <ApperIcon name="DollarSign" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900">No trips to track</h3>
          <p className="text-surface-500 mt-2">Create a trip first to start tracking your budget</p>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105">
            Plan Your First Trip
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 lg:pb-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">Budget Tracker</h1>
          <p className="text-surface-600 mt-1">Monitor your travel expenses and stay on budget</p>
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center space-x-2 self-start sm:self-auto"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Trip Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Select Trip
        </label>
        <select
          value={selectedTrip}
          onChange={(e) => setSelectedTrip(e.target.value)}
          className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {trips.map(trip => (
            <option key={trip.id} value={trip.id}>
              {trip.destination} - {trip.currency} {trip.budget.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* Budget Overview */}
      {currentTrip && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-surface-600">Total Budget</p>
                <p className="text-2xl font-bold text-surface-900">
                  {currentTrip.currency} {currentTrip.budget.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-surface-600">Spent</p>
                <p className="text-2xl font-bold text-surface-900">
                  {currentTrip.currency} {totalExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Wallet" size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-surface-600">Remaining</p>
                <p className="text-2xl font-bold text-surface-900">
                  {currentTrip.currency} {(currentTrip.budget - totalExpenses).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Budget Progress */}
      {currentTrip && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900">Budget Progress</h3>
            <span className="text-sm font-medium text-surface-600">
              {budgetUsed.toFixed(1)}% used
            </span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-3 rounded-full ${
                budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 75 ? 'bg-accent' : 'bg-primary'
              }`}
            />
          </div>
          {budgetUsed > 100 && (
            <p className="text-sm text-red-600 mt-2">
              <ApperIcon name="AlertTriangle" size={16} className="inline mr-1" />
              You're over budget by {currentTrip.currency} {(totalExpenses - currentTrip.budget).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Spending by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBreakdown.map((category) => (
            <div key={category.key} className="flex items-center space-x-3 p-4 rounded-lg border border-surface-200">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                <ApperIcon name={category.icon} size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-surface-900">{category.label}</p>
                <p className="text-lg font-bold text-surface-900">
                  {currentTrip?.currency || 'USD'} {category.total.toLocaleString()}
                </p>
                <p className="text-xs text-surface-500">{category.count} expenses</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Expenses</h3>
        {getFilteredExpenses().length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Receipt" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No expenses recorded yet</p>
            <button
              onClick={() => setShowAddExpense(true)}
              className="mt-2 text-primary hover:text-blue-700 text-sm font-medium"
            >
              Add your first expense
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {getFilteredExpenses().slice(0, 10).map((expense) => {
              const category = categories.find(cat => cat.key === expense.category);
              return (
                <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg border border-surface-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category?.color || 'bg-gray-100 text-gray-600'}`}>
                      <ApperIcon name={category?.icon || 'MoreHorizontal'} size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-surface-900">{expense.description}</p>
                      <p className="text-sm text-surface-500">{expense.date} • {category?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-surface-900">
                      {currentTrip?.currency || 'USD'} {expense.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-1 text-surface-400 hover:text-red-600 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Add New Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.key} value={category.key}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="What did you spend on?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-2 bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Budget;