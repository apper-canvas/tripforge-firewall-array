import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import LinkButton from '@/components/atoms/LinkButton';
import Button from '@/components/atoms/Button';

const EmptyState = ({
  icon = 'Info',
  title,
  message,
  actionText,
  actionLink,
  onActionClick,
  animateIcon = false,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={animateIcon ? { y: [0, -10, 0] } : {}}
        transition={animateIcon ? { repeat: Infinity, duration: 3 } : {}}
      >
        <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto mb-4" />
      </motion.div>
      <h3 className="text-lg font-medium text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-500 mt-2">{message}</p>
      {(actionLink || onActionClick) && (
        <div className="mt-4">
          {actionLink ? (
            <LinkButton to={actionLink} icon="Plus" type="primary" className="inline-flex">
              {actionText}
            </LinkButton>
          ) : (
            <Button onClick={onActionClick} className="bg-primary text-white hover:bg-blue-700">
              {actionText}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;