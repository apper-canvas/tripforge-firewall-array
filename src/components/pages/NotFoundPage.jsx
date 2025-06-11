import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import LinkButton from '@/components/atoms/LinkButton';

const NotFoundPage = () => {
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
        <LinkButton
          to="/"
          icon="Home"
          type="primary"
          className="mt-8 inline-flex px-6 py-3"
          iconSize={20}
        >
          Back to Dashboard
        </LinkButton>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;