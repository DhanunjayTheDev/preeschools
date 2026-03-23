import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TiltCard from "@/components/ui/TiltCard";
import BlurText from "@/components/ui/BlurText";
import { getPrograms } from "@/lib/api";

const fallbackPrograms = [
  { _id: "1", name: "Daycare", ageGroup: "6 months – 2 years", description: "Safe and nurturing care for your little ones with age-appropriate activities.", color: "#FF6B6B", emoji: "🍼" },
  { _id: "2", name: "Toddler Club", ageGroup: "2 – 3 years", description: "Playful learning experiences that encourage exploration and social skills.", color: "#4ECDC4", emoji: "🧸" },
  { _id: "3", name: "Nursery", ageGroup: "3 – 4 years", description: "Structured learning with creative play to build a strong foundation.", color: "#FFD93D", emoji: "🎨" },
  { _id: "4", name: "K1", ageGroup: "4 – 5 years", description: "Pre-reading, math concepts, and hands-on science experiments.", color: "#5CD6FF", emoji: "📖" },
  { _id: "5", name: "K2", ageGroup: "5 – 6 years", description: "School readiness program with literacy, numeracy, and critical thinking.", color: "#FF7A00", emoji: "🎓" },
  { _id: "6", name: "After School", ageGroup: "3 – 8 years", description: "Sports, arts, music, and enrichment activities after school hours.", color: "#A78BFA", emoji: "⚽" },
];

export default function ProgramsSection() {
  const [programs, setPrograms] = useState(fallbackPrograms);

  useEffect(() => {
    getPrograms().then((res) => {
      if (res.data?.length) setPrograms(res.data.map((p, i) => ({ ...fallbackPrograms[i], ...p })));
    }).catch(() => {});
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-accent/3" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 text-yellow-600 rounded-full text-sm font-semibold mb-6 border border-yellow-400/15">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />Our Programs
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            <span style={{ background: "linear-gradient(135deg, #1C0800, #4A2000)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Learning Programs{" "}</span>
            <span style={{ background: "linear-gradient(135deg, #5CD6FF, #A78BFA)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>for Every Age 🌱</span>
          </h2>
          <p className="text-foreground/55 max-w-2xl mx-auto text-lg">Age-appropriate programs designed to nurture every stage of your child's development.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.09 }} viewport={{ once: true }}
            >
              <TiltCard rotateAmplitude={8} scaleOnHover={1.03} className="h-full">
                <div className="relative rounded-3xl overflow-hidden h-full border border-foreground/8 bg-card/60 backdrop-blur-sm group"
                  style={{ boxShadow: `0 4px 24px ${p.color}22` }}>
                  <div className="h-1.5 w-full" style={{ background: p.color }} />
                  <div className="absolute top-4 right-4 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ background: p.color }} />
                  <div className="p-8">
                    <span className="text-5xl mb-5 block">{p.emoji || "📚"}</span>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">{p.name}</h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: `${p.color}18`, color: p.color }}>
                      🕐 {p.ageGroup}
                    </span>
                    <p className="text-foreground/55 leading-relaxed text-sm">{p.description}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }} />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
