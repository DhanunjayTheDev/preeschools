import { lazy, Suspense } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import ActivitiesSection from "@/sections/ActivitiesSection";
import { FaClock } from "react-icons/fa";

const ActivitiesScene = lazy(() => import("@/components/3d/ActivitiesScene"));

const schedule = [
  { time: "8:30 AM", activity: "Welcome Circle & Free Play", icon: "🤗" },
  { time: "9:00 AM", activity: "Literacy & Numeracy", icon: "📖" },
  { time: "9:45 AM", activity: "Snack Time", icon: "🍎" },
  { time: "10:00 AM", activity: "Outdoor Play & Sports", icon: "⚽" },
  { time: "10:45 AM", activity: "Art & Craft Workshop", icon: "🎨" },
  { time: "11:30 AM", activity: "Music & Movement", icon: "🎵" },
  { time: "12:00 PM", activity: "Lunch", icon: "🍽️" },
  { time: "12:30 PM", activity: "Quiet Time / Story", icon: "📚" },
  { time: "1:00 PM", activity: "Science / Nature Exploration", icon: "🔬" },
  { time: "1:45 PM", activity: "Review & Dismissal", icon: "🎒" },
];

export default function Activities() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-20 gradient-bg overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 bg-warm/10 text-red-500 rounded-full text-sm font-semibold mb-4">Activities</span>
            <h1 className="text-5xl sm:text-6xl font-display font-bold text-foreground mb-6">
              A Day Full of{" "}
              <span className="bg-gradient-to-r from-warm to-primary bg-clip-text text-transparent">Adventure</span>
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed">
              Every day at Kohsha Academy is packed with exciting activities designed to develop creativity, fitness, and a lifelong love for learning.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="h-[350px] rounded-3xl overflow-hidden">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
                <ActivitiesScene />
              </Suspense>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Activities Grid */}
      <ActivitiesSection />

      {/* Daily Schedule */}
      <section className="py-24 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                <FaClock className="inline mr-1" /> Schedule
              </span>
              <h2 className="text-4xl font-display font-bold text-foreground">A Typical Day</h2>
            </div>
          </AnimatedSection>
          <div className="space-y-4">
            {schedule.map((s, i) => (
              <AnimatedSection key={s.time} delay={i * 0.05}>
                <div className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all duration-300">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="flex-1">
                    <p className="font-display font-bold text-foreground">{s.activity}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">{s.time}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
