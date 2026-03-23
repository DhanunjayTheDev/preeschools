import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

export default function CountUp({ to, from = 0, delay = 0, duration = 2, className = "", separator = "" }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const formatValue = useCallback(
    (latest) => {
      const options = { useGrouping: !!separator, minimumFractionDigits: 0, maximumFractionDigits: 0 };
      const formatted = Intl.NumberFormat("en-US", options).format(Math.round(latest));
      return separator ? formatted.replace(/,/g, separator) : formatted;
    },
    [separator]
  );

  useEffect(() => {
    if (ref.current) ref.current.textContent = formatValue(from);
  }, [from, formatValue]);

  useEffect(() => {
    if (isInView) {
      const id = setTimeout(() => { motionValue.set(to); }, delay * 1000);
      return () => clearTimeout(id);
    }
  }, [isInView, motionValue, to, delay]);

  useEffect(() => {
    const unsub = springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = formatValue(latest);
    });
    return () => unsub();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}
