import { delay } from '../index';

let expenses = [];

// Load initial data
const loadExpenses = async () => {
  try {
    const { default: mockExpenses } = await import('../mockData/expenses.json');
    expenses = [...mockExpenses];
  } catch (error) {
    console.error('Failed to load expenses data:', error);
    expenses = [];
  }
};

// Initialize data
loadExpenses();

const expenseService = {
  async getAll() {
    await delay(300);
    return [...expenses];
  },

  async getById(id) {
    await delay(200);
    const expense = expenses.find(e => e.id === id);
    if (!expense) throw new Error('Expense not found');
    return { ...expense };
  },

  async getByTripId(tripId) {
    await delay(250);
    return expenses.filter(expense => expense.tripId === tripId).map(expense => ({ ...expense }));
  },

  async create(expenseData) {
    await delay(350);
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      createdAt: new Date().toISOString()
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  async update(id, updateData) {
    await delay(300);
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    
    expenses[index] = { ...expenses[index], ...updateData, updatedAt: new Date().toISOString() };
    return { ...expenses[index] };
  },

  async delete(id) {
    await delay(250);
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    
    expenses.splice(index, 1);
    return { success: true };
  }
};

export default expenseService;