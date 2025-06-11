import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PlanTripForm = ({ step, formData, handleInputChange, handleSubmit, nextStep, prevStep, isStepValid, loading }) => {
  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-surface-200 p-8">
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-xl font-semibold text-surface-900 mb-4">Where are you going?</h3>
            <div className="space-y-4">
              <FormField
                label="Destination"
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="Where would you like to go?"
                icon="MapPin"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate}
                  required
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-xl font-semibold text-surface-900 mb-4">Budget & Travelers</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Budget"
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="0"
                  icon="DollarSign"
                  required
                />
                <FormField
                  label="Currency"
                  type="select"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  options={currencies}
                />
              </div>
              <FormField
                label="Number of Travelers"
                type="number"
                name="travelers"
                value={formData.travelers}
                onChange={handleInputChange}
                min="1"
                max="20"
                icon="Users"
                required
              />
            </div>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-xl font-semibold text-surface-900 mb-4">Review Your Trip</h3>
            <div className="bg-surface-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Destination:</span>
                <span className="font-medium text-surface-900">{formData.destination}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Dates:</span>
                <span className="font-medium text-surface-900">
                  {formData.startDate && formData.endDate &&
                    `${format(new Date(formData.startDate), 'MMM d')} - ${format(new Date(formData.endDate), 'MMM d, yyyy')}`
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Budget:</span>
                <span className="font-medium text-surface-900">{formData.currency} {formData.budget}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Travelers:</span>
                <span className="font-medium text-surface-900">{formData.travelers}</span>
              </div>
            </div>
            <FormField
              label="Additional Notes (Optional)"
              type="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any special requirements or notes for your trip..."
              rows={4}
            />
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-surface-200">
        <Button
          type="button"
          onClick={prevStep}
          disabled={step === 1}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            step === 1
              ? 'bg-surface-200 text-surface-400 cursor-not-allowed'
              : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
          }`}
        >
          Previous
        </Button>
        
        {step < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid()}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isStepValid()
                ? 'bg-primary text-white hover:bg-blue-700'
                : 'bg-surface-200 text-surface-400 cursor-not-allowed'
            }`}
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
            <span>{loading ? 'Creating...' : 'Create Trip'}</span>
          </Button>
        )}
      </div>
    </form>
  );
};

export default PlanTripForm;