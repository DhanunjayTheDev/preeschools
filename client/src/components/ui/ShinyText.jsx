import { motion, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";

const ShinyText = ({
  text,
  disabled = false,
  speed = 3,
  className = "",
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
}) => {
  const [isPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const animationDuration = speed * 1000;

  useAnimationFrame((time) => {
    if (disabled || isPaused) { lastTimeRef.current = null; return; }
    if (lastTimeRef.current === null) { lastTimeRef.current = time; return; }
    elapsedRef.current += time - lastTimeRef.current;
    lastTimeRef.current = time;
    const cycleTime = elapsedRef.current % animationDuration;
    progress.set((cycleTime / animationDuration) * 100);
  });

  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);

  return (
    <motion.span
      className={className}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundPosition,
      }}
    >
      {text}
    </motion.span>
  );
};

export default ShinyText;
