import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '@/components/atoms/ProgressBar';
import LinkButton from '@/components/atoms/LinkButton';
import ApperIcon from '@/components/ApperIcon';
const DashboardBudgetSection = ({ totalBudget, totalExpenses }) => {
  const budgetUsed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-surface-900">Budget Overview</h3>
        <Link to="/budget" className="text-primary hover:text-blue-700 text-sm font-medium">
          Detailed Budget
        </Link>
      </div>
      
      {/* Budget Progress */}
      <div className="bg-surface-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-surface-900">${totalExpenses.toLocaleString()}</p>
            <p className="text-sm text-surface-600">of ${totalBudget.toLocaleString()} spent</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-surface-900">{budgetUsed.toFixed(1)}%</p>
            <p className="text-sm text-surface-600">used</p>
          </div>
        </div>
        
        <ProgressBar value={budgetUsed} />
        
        <div className="flex items-center justify-between text-sm mt-4">
          <span className="text-surface-600">Remaining: ${(totalBudget - totalExpenses).toLocaleString()}</span>
          {budgetUsed > 100 && (
            <span className="text-red-600 font-medium">Over budget</span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LinkButton
          to="/budget"
          icon="Plus"
          type="ghost"
          className="items-center space-x-3 p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors group justify-start"
          iconSize={20}
        >
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <ApperIcon name="Plus" size={20} className="text-accent" />
          </div>
          <div>
            <p className="font-medium text-surface-900">Add Expense</p>
            <p className="text-sm text-surface-600">Track your spending</p>
          </div>
        </LinkButton>
        
        <LinkButton
          to="/budget"
          icon="PieChart"
          type="ghost"
          className="items-center space-x-3 p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors group justify-start"
          iconSize={20}
        >
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <ApperIcon name="PieChart" size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-surface-900">View Analytics</p>
            <p className="text-sm text-surface-600">Spending breakdown</p>
          </div>
        </LinkButton>
      </div>
    </div>
  );
};

export default DashboardBudgetSection;