import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BlurText from "@/components/ui/BlurText";
import CountUp from "@/components/ui/CountUp";
import Magnet from "@/components/ui/Magnet";
import ShinyText from "@/components/ui/ShinyText";
import Orbs from "@/components/ui/Orbs";

const PlaygroundScene = lazy(() => import("@/components/3d/PlaygroundScene"));

const stats = [
  { value: 500, suffix: "+", label: "Happy Students" },
  { value: 50, suffix: "+", label: "Expert Teachers" },
  { value: 15, suffix: "+", label: "Years of Trust" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-bg">
      <Orbs count={5} />
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "linear-gradient(#FF7A00 1px, transparent 1px), linear-gradient(to right, #FF7A00 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <ShinyText text="Welcome to Kohsha Academy" color="#FF7A00" shineColor="#FFD93D" speed={4} className="text-sm font-semibold" />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
            <span className="block mb-1" style={{ background: "linear-gradient(135deg, #1C0800, #3D1500)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Where Every</span>
            <span className="block mb-1" style={{ background: "linear-gradient(135deg, #2A0E00, #FF4500)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Child Shines</span>
            <span className="block" style={{ background: "linear-gradient(135deg, #FF7A00, #FFD93D 50%, #5CD6FF)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Bright ✨</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-foreground/60 max-w-xl mb-10 leading-relaxed"
          >
            A nurturing preschool where curiosity meets creativity. Safe, fun, and stimulating for your little ones to learn and grow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <Magnet padding={60} magnetStrength={4}>
              <Link to="/admissions" className="px-8 py-4 rounded-2xl font-semibold text-white flex items-center gap-2 relative overflow-hidden group shadow-lg shadow-primary/25"
                style={{ background: "linear-gradient(135deg, #FF7A00, #FF9A3C)" }}>
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-2xl" />
                <span className="relative">Enroll Now</span>
                <span className="relative">🎓</span>
              </Link>
            </Magnet>
            <Magnet padding={60} magnetStrength={4}>
              <Link to="/programs" className="px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 border-2 border-primary/25 text-primary hover:bg-primary/5 transition-colors duration-300">
                Our Programs <span>→</span>
              </Link>
            </Magnet>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.9 }}
            className="flex gap-10 border-t border-primary/10 pt-8"
          >
            {stats.map((s, i) => (
              <div key={s.label}>
                <p className="text-3xl font-display font-bold text-primary">
                  <CountUp to={s.value} duration={2} delay={0.9 + i * 0.15} />{s.suffix}
                </p>
                <p className="text-sm text-foreground/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="relative h-[480px] lg:h-[560px]"
        >
          <div className="absolute inset-8 rounded-full blur-[80px] opacity-25"
            style={{ background: "radial-gradient(circle, #FF7A00 0%, #FFD93D 50%, transparent 70%)" }} />
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <PlaygroundScene />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
