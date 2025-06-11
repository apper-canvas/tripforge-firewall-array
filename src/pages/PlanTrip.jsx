import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import tripService from '../services/api/tripService';

const PlanTrip = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD',
    travelers: 1,
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await tripService.create({
        ...formData,
        budget: parseFloat(formData.budget),
        travelers: parseInt(formData.travelers)
      });
      toast.success('Trip created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.destination && formData.startDate && formData.endDate;
      case 2:
        return formData.budget && formData.travelers;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 lg:pb-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">Plan Your Trip</h1>
        <p className="text-surface-600">Let's create your perfect adventure together</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step >= num
                    ? 'bg-primary text-white'
                    : 'bg-surface-200 text-surface-500'
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`w-20 h-1 mx-2 transition-all ${
                    step > num ? 'bg-primary' : 'bg-surface-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-surface-600">
          <span>Destination</span>
          <span>Budget</span>
          <span>Review</span>
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-surface-200 p-8">
        {/* Step 1: Destination & Dates */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold text-surface-900 mb-4">Where are you going?</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <ApperIcon name="MapPin" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="Where would you like to go?"
                      className="w-full pl-10 pr-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate}
                      className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Budget & Travelers */}
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
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Budget
                    </label>
                    <div className="relative">
                      <ApperIcon name="DollarSign" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Number of Travelers
                  </label>
                  <div className="relative">
                    <ApperIcon name="Users" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                    <input
                      type="number"
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      className="w-full pl-10 pr-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
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

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any special requirements or notes for your trip..."
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t border-surface-200">
          <button
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
          </button>
          
          {step < 3 ? (
            <button
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
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
              <span>{loading ? 'Creating...' : 'Create Trip'}</span>
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default PlanTrip;