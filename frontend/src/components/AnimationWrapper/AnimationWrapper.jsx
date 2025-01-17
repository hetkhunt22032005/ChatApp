import { motion, AnimatePresence } from "framer-motion";

// eslint-disable-next-line react/prop-types
export const AnimationWrapper = ({ keyValue, children }) => {
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={keyValue}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={formVariants}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
