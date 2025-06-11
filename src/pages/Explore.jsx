import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import destinationService from '../services/api/destinationService';

const Explore = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedDestinations, setSavedDestinations] = useState(new Set());

  const categories = [
    { key: 'all', label: 'All Destinations', icon: 'Globe' },
    { key: 'beaches', label: 'Beaches', icon: 'Sun' },
    { key: 'mountains', label: 'Mountains', icon: 'Mountain' },
    { key: 'cities', label: 'Cities', icon: 'Building2' },
    { key: 'culture', label: 'Culture', icon: 'Camera' }
  ];

  useEffect(() => {
    const loadDestinations = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await destinationService.getAll();
        setDestinations(result);
      } catch (err) {
        setError(err.message || 'Failed to load destinations');
        toast.error('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };
    loadDestinations();
  }, []);

  const handleSaveDestination = (destinationId) => {
    const newSaved = new Set(savedDestinations);
    if (newSaved.has(destinationId)) {
      newSaved.delete(destinationId);
      toast.success('Destination removed from saved');
    } else {
      newSaved.add(destinationId);
      toast.success('Destination saved!');
    }
    setSavedDestinations(newSaved);
  };

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           dest.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-6"></div>
          <div className="flex space-x-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-surface-200 rounded w-24"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-80 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load destinations</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 lg:pb-6 space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">Explore Destinations</h1>
        <p className="text-surface-600">Discover amazing places around the world</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <ApperIcon name="Search" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search destinations, cities, or countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-surface-700 hover:bg-surface-50 border border-surface-200'
            }`}
          >
            <ApperIcon name={category.icon} size={16} />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-center text-surface-600">
        {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
      </div>

      {/* Destinations Grid */}
      <AnimatePresence>
        {filteredDestinations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="MapPin" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900">No destinations found</h3>
            <p className="text-surface-500 mt-2">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden group"
              >
                <div className="relative h-56">
                  <img
                    src={destination.imageUrl}
                    alt={destination.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-heading font-semibold">{destination.city}</h3>
                    <p className="text-sm opacity-90">{destination.country}</p>
                  </div>
                  <button
                    onClick={() => handleSaveDestination(destination.id)}
                    className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
                      savedDestinations.has(destination.id)
                        ? 'bg-accent text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <ApperIcon name="Heart" size={16} />
                  </button>
                </div>
                
                <div className="p-6">
                  <p className="text-surface-600 text-sm mb-4 line-clamp-3">
                    {destination.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Star" size={16} className="text-accent" />
                      <span className="text-sm text-surface-700">{destination.rating} • {destination.reviews} reviews</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="MapPin" size={16} className="text-surface-500" />
                      <span className="text-sm text-surface-600">{destination.attractions?.length || 0} attractions</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-surface-100 mt-4">
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-2 bg-surface-100 text-surface-700 rounded-lg text-sm font-medium hover:bg-surface-200 transition-colors">
                        <ApperIcon name="Plus" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Explore;