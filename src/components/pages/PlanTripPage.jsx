import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import PlanTripForm from '@/components/organisms/PlanTripForm';
import tripService from '@/services/api/tripService';
import ApperIcon from '@/components/ApperIcon';

const PlanTripPage = () => {
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
      <PageHeader
        title="Plan Your Trip"
        subtitle="Let's create your perfect adventure together"
        className="text-center mb-8"
      />

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

      <PlanTripForm
        step={step}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        nextStep={nextStep}
        prevStep={prevStep}
        isStepValid={isStepValid}
        loading={loading}
      />
    </motion.div>
  );
};

export default PlanTripPage;