import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import DashboardOverviewSection from '@/components/organisms/DashboardOverviewSection';
import DashboardItinerarySection from '@/components/organisms/DashboardItinerarySection';
import DashboardBudgetSection from '@/components/organisms/DashboardBudgetSection';
import Button from '@/components/atoms/Button';

const FeatureTabSection = ({ trips, upcomingActivities, totalBudget, totalExpenses }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { key: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
    { key: 'budget', label: 'Budget', icon: 'DollarSign' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverviewSection trips={trips} />;
      case 'itinerary':
        return <DashboardItinerarySection upcomingActivities={upcomingActivities} />;
      case 'budget':
        return <DashboardBudgetSection totalBudget={totalBudget} totalExpenses={totalExpenses} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-surface-200">
        <nav className="flex space-x-0">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all bg-transparent ${
                activeTab === tab.key
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-surface-600 hover:text-surface-900 hover:bg-surface-50'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeTab} // Key changes to re-trigger animation on tab switch
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureTabSection;