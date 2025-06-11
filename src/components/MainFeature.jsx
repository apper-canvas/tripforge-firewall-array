import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';

const MainFeature = ({ trips, upcomingActivities, totalBudget, totalExpenses }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const activeTrips = trips.filter(trip => 
    new Date(trip.startDate) <= new Date() && new Date(trip.endDate) >= new Date()
  );
  
  const upcomingTrips = trips.filter(trip => 
    new Date(trip.startDate) > new Date()
  ).slice(0, 3);

  const budgetUsed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { key: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
    { key: 'budget', label: 'Budget', icon: 'DollarSign' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-surface-200">
        <nav className="flex space-x-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-surface-600 hover:text-surface-900 hover:bg-surface-50'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Active Trips */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900">Active Trips</h3>
                <Link to="/dashboard" className="text-primary hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              {activeTrips.length === 0 ? (
                <div className="text-center py-8 bg-surface-50 rounded-lg">
                  <ApperIcon name="Plane" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                  <p className="text-surface-500">No active trips</p>
                  <Link to="/plan-trip" className="text-primary hover:text-blue-700 text-sm font-medium">
                    Plan a trip
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeTrips.slice(0, 2).map((trip) => (
                    <div key={trip.id} className="flex items-center space-x-4 p-4 bg-surface-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon name="MapPin" size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-surface-900">{trip.destination}</h4>
                        <p className="text-sm text-surface-600">
                          {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-surface-900">${trip.budget.toLocaleString()}</p>
                        <p className="text-xs text-surface-500">{trip.travelers} travelers</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Trips */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900">Upcoming Trips</h3>
                <Link to="/dashboard" className="text-primary hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              {upcomingTrips.length === 0 ? (
                <div className="text-center py-8 bg-surface-50 rounded-lg">
                  <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                  <p className="text-surface-500">No upcoming trips</p>
                  <Link to="/plan-trip" className="text-primary hover:text-blue-700 text-sm font-medium">
                    Plan your next adventure
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingTrips.map((trip) => (
                    <motion.div
                      key={trip.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border border-surface-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                          <ApperIcon name="MapPin" size={16} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-surface-900">{trip.destination}</h4>
                          <p className="text-xs text-surface-600">{trip.travelers} travelers</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-surface-600">
                          <ApperIcon name="Calendar" size={14} />
                          <span>{format(new Date(trip.startDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-surface-600">
                          <ApperIcon name="DollarSign" size={14} />
                          <span>${trip.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'itinerary' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">Upcoming Activities</h3>
              <Link to="/dashboard" className="text-primary hover:text-blue-700 text-sm font-medium">
                Manage Itinerary
              </Link>
            </div>
            
            {upcomingActivities.length === 0 ? (
              <div className="text-center py-12 bg-surface-50 rounded-lg">
                <ApperIcon name="Clock" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-surface-900">No activities planned</h4>
                <p className="text-surface-500 mt-2">Start building your itinerary for your next trip</p>
                <Link
                  to="/plan-trip"
                  className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
                >
                  <ApperIcon name="Plus" size={16} />
                  <span>Plan Activities</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 border border-surface-200 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="MapPin" size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-surface-900">{activity.activity}</h4>
                      <p className="text-sm text-surface-600 mt-1">{activity.location}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-surface-500">
                        <span>{format(new Date(activity.date), 'MMM d, yyyy')}</span>
                        <span>{activity.time}</span>
                        <span>{activity.duration} hours</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-surface-900">${activity.cost}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
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
              
              <div className="w-full bg-surface-200 rounded-full h-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-3 rounded-full ${
                    budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 75 ? 'bg-accent' : 'bg-primary'
                  }`}
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-600">Remaining: ${(totalBudget - totalExpenses).toLocaleString()}</span>
                {budgetUsed > 100 && (
                  <span className="text-red-600 font-medium">Over budget</span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/budget"
                className="flex items-center space-x-3 p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ApperIcon name="Plus" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-medium text-surface-900">Add Expense</p>
                  <p className="text-sm text-surface-600">Track your spending</p>
                </div>
              </Link>
              
              <Link
                to="/budget"
                className="flex items-center space-x-3 p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ApperIcon name="PieChart" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-surface-900">View Analytics</p>
                  <p className="text-sm text-surface-600">Spending breakdown</p>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MainFeature;