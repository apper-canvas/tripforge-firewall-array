import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const BudgetSummary = ({ totalBudget, totalExpenses, currency }) => {
  const remainingBudget = totalBudget - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon="Target"
        iconBgClass="bg-primary/10"
        iconColorClass="text-primary"
        label="Total Budget"
        value={`${currency} ${totalBudget.toLocaleString()}`}
      />
      <StatCard
        icon="TrendingUp"
        iconBgClass="bg-accent/10"
        iconColorClass="text-accent"
        label="Spent"
        value={`${currency} ${totalExpenses.toLocaleString()}`}
      />
      <StatCard
        icon="Wallet"
        iconBgClass="bg-green-100"
        iconColorClass="text-green-600"
        label="Remaining"
        value={`${currency} ${remainingBudget.toLocaleString()}`}
      />
    </div>
  );
};

export default BudgetSummary;