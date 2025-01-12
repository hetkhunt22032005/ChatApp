import { motion, AnimatePresence } from "framer-motion";
import React from "react";

export const AnimationWrapper = ({ keyValue, children }) => {
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35 } },
    exit: { opacity: 0, transition: { duration: 0.35 } },
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
