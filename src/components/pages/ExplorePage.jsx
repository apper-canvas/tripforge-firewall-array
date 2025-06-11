import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import FormField from '@/components/molecules/FormField';
import FilterButton from '@/components/atoms/FilterButton';
import ExploreDestinationsGrid from '@/components/organisms/ExploreDestinationsGrid';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import destinationService from '@/services/api/destinationService';

const ExplorePage = () => {
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
    return <LoadingSpinner message="Discovering destinations..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load destinations" details={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 lg:pb-6 space-y-6"
    >
      <PageHeader
        title="Explore Destinations"
        subtitle="Discover amazing places around the world"
        className="text-center"
      />

      <div className="max-w-2xl mx-auto">
        <FormField
          type="text"
          placeholder="Search destinations, cities, or countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="Search"
          className="text-lg"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <FilterButton
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            label={category.label}
            icon={category.icon}
            active={selectedCategory === category.key}
          />
        ))}
      </div>

      <div className="text-center text-surface-600">
        {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
      </div>

      <ExploreDestinationsGrid
        destinations={filteredDestinations}
        savedDestinations={savedDestinations}
        onToggleSave={handleSaveDestination}
      />
    </motion.div>
  );
};

export default ExplorePage;