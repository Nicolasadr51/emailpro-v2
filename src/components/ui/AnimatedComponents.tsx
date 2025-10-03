import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '../../lib/utils';

// Variants d'animation prédéfinis
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -50
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 50
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Composants animés réutilisables
interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variants;
  delay?: number;
  duration?: number;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className,
  variant = fadeInUp,
  delay = 0,
  duration
}) => {
  const customVariant = duration ? {
    ...variant,
    animate: {
      ...variant.animate,
      transition: {
        duration,
        delay
      }
    }
  } : variant;

  return (
    <motion.div
      className={className}
      variants={customVariant}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

interface StaggeredListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  className,
  staggerDelay = 0.1
}) => {
  const customStaggerContainer = {
    ...staggerContainer,
    animate: {
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={customStaggerContainer}
      initial="initial"
      animate="animate"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={staggerItem}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

interface FadeTransitionProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  children,
  show,
  className
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

interface SlideTransitionProps {
  children: React.ReactNode;
  show: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  children,
  show,
  direction = 'up',
  className
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 20 };
      case 'down': return { y: -20 };
      case 'left': return { x: 20 };
      case 'right': return { x: -20 };
      default: return { y: 20 };
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={className}
          initial={{ opacity: 0, ...getInitialPosition() }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, ...getInitialPosition() }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Composant pour les notifications animées
interface AnimatedNotificationProps {
  children: React.ReactNode;
  show: boolean;
  position?: 'top' | 'bottom' | 'top-right' | 'bottom-right';
  className?: string;
}

export const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({
  children,
  show,
  position = 'top-right',
  className
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const getInitialPosition = () => {
    switch (position) {
      case 'top':
      case 'top-right':
        return { y: -100 };
      case 'bottom':
      case 'bottom-right':
        return { y: 100 };
      default:
        return { y: -100 };
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            'fixed z-50',
            getPositionClasses(),
            className
          )}
          initial={{ opacity: 0, ...getInitialPosition() }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, ...getInitialPosition() }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Composant pour les modales animées
interface AnimatedModalProps {
  children: React.ReactNode;
  show: boolean;
  onClose?: () => void;
  className?: string;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  children,
  show,
  onClose,
  className
}) => (
  <AnimatePresence>
    {show && (
      <>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center p-4',
            className
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// Hook pour les animations de liste
export const useListAnimation = (items: any[]) => {
  return {
    container: staggerContainer,
    item: staggerItem,
    itemCount: items.length
  };
};

// Composant pour les boutons avec micro-interactions
interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'scale' | 'lift' | 'glow';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className,
  disabled = false,
  variant = 'scale'
}) => {
  const getHoverAnimation = () => {
    switch (variant) {
      case 'scale':
        return { scale: 1.05 };
      case 'lift':
        return { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" };
      case 'glow':
        return { boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" };
      default:
        return { scale: 1.05 };
    }
  };

  const getTapAnimation = () => {
    switch (variant) {
      case 'scale':
        return { scale: 0.95 };
      case 'lift':
        return { y: 0 };
      case 'glow':
        return { scale: 0.98 };
      default:
        return { scale: 0.95 };
    }
  };

  return (
    <motion.button
      className={cn(
        'transition-colors duration-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? undefined : getHoverAnimation()}
      whileTap={disabled ? undefined : getTapAnimation()}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};
