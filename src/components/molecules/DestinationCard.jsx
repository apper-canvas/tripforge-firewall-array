import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import LinkButton from '@/components/atoms/LinkButton'
import IconLabel from '@/components/atoms/IconLabel'
import WeatherWidget from '@/components/molecules/WeatherWidget.jsx'
const DestinationCard = ({ destination, isSaved, onToggleSave }) => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewDetails = async () => {
    try {
      setIsNavigating(true);
      
      // Add slight delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Navigate to destination details page
      navigate(`/destination/${destination.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate to destination details');
      setIsNavigating(false);
    }
  };

  const handleKeyDown = (event) => {
    // Handle keyboard navigation for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleViewDetails();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden group"
    >
      <div className="relative h-56">
        <img
          src={destination.imageUrl}
          alt={`${destination.city}, ${destination.country}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-heading font-semibold">{destination.city}</h3>
          <p className="text-sm opacity-90">{destination.country}</p>
        </div>
        <Button
          onClick={() => onToggleSave(destination.id)}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all bg-transparent ${
            isSaved
              ? 'bg-accent text-white'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          aria-label={isSaved ? `Remove ${destination.city} from saved destinations` : `Save ${destination.city} to favorites`}
        >
          <ApperIcon name="Heart" size={16} />
        </Button>
      </div>
      
      <div className="p-6">
        <p className="text-surface-600 text-sm mb-4 line-clamp-3">
          {destination.description}
        </p>
        
        <div className="space-y-3">
          <IconLabel icon="Star" className="text-accent" textClassName="text-sm text-surface-700">
            {destination.rating} • {destination.reviews} reviews
          </IconLabel>
          
          <IconLabel icon="MapPin" className="text-surface-500" textClassName="text-sm text-surface-600">
            {destination.attractions?.length || 0} attractions
          </IconLabel>
        </div>
        
        <WeatherWidget cityName={destination.city} />
        
        <div className="pt-4 border-t border-surface-100 mt-4">
          <div className="flex space-x-2">
            <Button 
              onClick={handleViewDetails}
              onKeyDown={handleKeyDown}
              disabled={isNavigating}
              className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label={`View details for ${destination.city}, ${destination.country}`}
              role="button"
              tabIndex={0}
            >
              {isNavigating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                'View Details'
              )}
            </Button>
            <Button 
              className="px-3 py-2 bg-surface-100 text-surface-700 rounded-lg text-sm font-medium hover:bg-surface-200 transition-colors"
              aria-label={`Add ${destination.city} to trip planner`}
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;