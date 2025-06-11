import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import IconLabel from '@/components/atoms/IconLabel';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import WeatherWidget from '@/components/molecules/WeatherWidget';
import destinationService from '@/services/api/destinationService';

const DestinationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

useEffect(() => {
    const loadDestination = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validate ID before making API call
        const parsedId = parseInt(id);
        if (isNaN(parsedId) || parsedId <= 0) {
          throw new Error(`Invalid destination ID: ${id}`);
        }
        
        const data = await destinationService.getById(parsedId);
        if (!data) {
          throw new Error('Destination not found');
        }
        
        setDestination(data);
        // Check if destination is saved (mock implementation)
        const savedDestinations = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
        setIsSaved(savedDestinations.includes(parsedId));
      } catch (err) {
        console.error('Error loading destination:', err);
        const errorMessage = err.message || 'Failed to load destination details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDestination();
    } else {
      setError('No destination ID provided');
    }
  }, [id]);

  const handleToggleSave = async () => {
    try {
      const savedDestinations = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      let newSaved;
      
      if (isSaved) {
        newSaved = savedDestinations.filter(destId => destId !== parseInt(id));
        toast.success('Destination removed from saved list');
      } else {
        newSaved = [...savedDestinations, parseInt(id)];
        toast.success('Destination saved successfully');
      }
      
      localStorage.setItem('savedDestinations', JSON.stringify(newSaved));
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error toggling save:', err);
      toast.error('Failed to update saved destinations');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-surface-600">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ErrorMessage message={error} />
          <div className="mt-6 space-x-4">
            <Button 
              onClick={handleBack}
              className="px-6 py-2 bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors"
            >
              Go Back
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-semibold text-surface-900 mb-2">
            Destination Not Found
          </h2>
          <p className="text-surface-600 mb-6">
            The destination you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            onClick={handleBack}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors"
              aria-label="Go back to previous page"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              <span>Back</span>
            </Button>
            
            <Button
              onClick={handleToggleSave}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-accent text-white hover:bg-red-600'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}
              aria-label={isSaved ? 'Remove from saved destinations' : 'Save destination'}
            >
              <ApperIcon name="Heart" size={16} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-96">
            <img
              src={destination.imageUrl}
              alt={`${destination.city}, ${destination.country}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-heading font-bold mb-2">{destination.city}</h1>
              <p className="text-xl opacity-90">{destination.country}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-surface-900 mb-4">
                    About {destination.city}
                  </h2>
                  <p className="text-surface-700 leading-relaxed">
                    {destination.description}
                  </p>
                </div>

                {destination.attractions && destination.attractions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-surface-900 mb-4">
                      Top Attractions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {destination.attractions.map((attraction, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
                          <ApperIcon name="MapPin" size={16} className="text-primary flex-shrink-0" />
                          <span className="text-surface-700">{attraction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-surface-50 rounded-lg p-6">
                  <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
                    Quick Info
                  </h3>
                  <div className="space-y-3">
                    <IconLabel 
                      icon="Star" 
                      className="text-accent" 
                      textClassName="text-sm text-surface-700"
                    >
                      {destination.rating} • {destination.reviews} reviews
                    </IconLabel>
                    
                    <IconLabel 
                      icon="MapPin" 
                      className="text-surface-500" 
                      textClassName="text-sm text-surface-600"
                    >
                      {destination.attractions?.length || 0} attractions
                    </IconLabel>

                    {destination.bestTimeToVisit && (
                      <IconLabel 
                        icon="Calendar" 
                        className="text-surface-500" 
                        textClassName="text-sm text-surface-600"
                      >
                        Best time: {destination.bestTimeToVisit}
                      </IconLabel>
                    )}
                  </div>
                </div>

                <WeatherWidget cityName={destination.city} />

                <div className="space-y-3">
                  <Button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Plan Trip Here
                  </Button>
                  <Button className="w-full px-4 py-3 bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors font-medium">
                    View on Map
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationDetailsPage;