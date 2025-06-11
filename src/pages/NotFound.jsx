import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 flex items-center justify-center min-h-96"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ApperIcon name="MapPin" className="w-24 h-24 text-surface-300 mx-auto" />
        </motion.div>
        <h1 className="mt-6 text-4xl font-heading font-bold text-surface-900">
          Lost in transit?
        </h1>
        <p className="mt-4 text-lg text-surface-600">
          The page you're looking for doesn't exist.
        </p>
        <p className="text-surface-500">
          Let's get you back on track to your next adventure.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
        >
          <ApperIcon name="Home" size={20} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;