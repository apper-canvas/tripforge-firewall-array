import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const QuickStatsGrid = ({ totalTrips, activeTripsCount, totalBudget, totalExpenses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon="Map"
        iconBgClass="bg-primary/10"
        iconColorClass="text-primary"
        label="Total Trips"
        value={totalTrips}
      />
      <StatCard
        icon="Clock"
        iconBgClass="bg-secondary/10"
        iconColorClass="text-secondary"
        label="Active Trips"
        value={activeTripsCount}
      />
      <StatCard
        icon="DollarSign"
        iconBgClass="bg-accent/10"
        iconColorClass="text-accent"
        label="Total Budget"
        value={`$${totalBudget.toLocaleString()}`}
      />
      <StatCard
        icon="TrendingUp"
        iconBgClass="bg-green-100"
        iconColorClass="text-green-600"
        label="Spent"
        value={`$${totalExpenses.toLocaleString()}`}
      />
    </div>
  );
};

export default QuickStatsGrid;