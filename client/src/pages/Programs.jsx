import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { getPrograms } from "@/lib/api";

const ProgramsScene = lazy(() => import("@/components/3d/ProgramsScene"));

const fallbackPrograms = [
  { _id: "1", name: "Daycare", ageGroup: "6 months - 2 years", description: "A warm and safe haven for your littlest ones. Our trained caregivers provide personalized attention with sensory play, tummy time activities, and gentle routines that help babies and toddlers feel secure.", schedule: "Mon-Fri, 8AM-6PM", color: "#FF6B6B", emoji: "🍼" },
  { _id: "2", name: "Toddler Club", ageGroup: "2 - 3 years", description: "An exciting world of exploration! Toddlers develop language, motor skills, and social confidence through guided play, music, movement, and hands-on sensory activities.", schedule: "Mon-Fri, 9AM-12:30PM", color: "#4ECDC4", emoji: "🧸" },
  { _id: "3", name: "Nursery", ageGroup: "3 - 4 years", description: "A structured yet playful program that builds foundational skills in literacy, numeracy, and science through art, storytelling, and group projects.", schedule: "Mon-Fri, 8:30AM-1PM", color: "#FFD93D", emoji: "🎨" },
  { _id: "4", name: "K1", ageGroup: "4 - 5 years", description: "Preparing young minds for formal learning with pre-reading, writing practice, mathematical concepts, and fascinating science experiments.", schedule: "Mon-Fri, 8:30AM-2PM", color: "#5CD6FF", emoji: "📖" },
  { _id: "5", name: "K2", ageGroup: "5 - 6 years", description: "Our school readiness program develops advanced literacy, numeracy, critical thinking, and social-emotional skills for a smooth transition to primary school.", schedule: "Mon-Fri, 8:30AM-2:30PM", color: "#FF7A00", emoji: "🎓" },
  { _id: "6", name: "After School Activities", ageGroup: "3 - 8 years", description: "An enriching after-school experience featuring sports, art, music, dance, cooking, and STEM activities led by specialist instructors.", schedule: "Mon-Fri, 3PM-6PM", color: "#A78BFA", emoji: "⚽" },
];

export default function Programs() {
  const [programs, setPrograms] = useState(fallbackPrograms);

  useEffect(() => {
    getPrograms().then((res) => {
      if (res.data?.length) {
        setPrograms(res.data.map((p, i) => ({ ...fallbackPrograms[i], ...p })));
      }
    }).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-20 gradient-bg overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">Programs</span>
            <h1 className="text-5xl sm:text-6xl font-display font-bold text-foreground mb-6">
              Find the Perfect{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Program</span>
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed">
              From infant care to school readiness, our programs are carefully designed to nurture every stage of your child's growth journey.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="h-[350px] rounded-3xl overflow-hidden">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
                <ProgramsScene />
              </Suspense>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {programs.map((p, i) => (
              <AnimatedSection key={p._id} delay={0.1}>
                <div className={`glass-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""} lg:flex`}>
                  <div className="lg:w-1/3 p-8 flex flex-col items-center justify-center text-center" style={{ background: `${p.color || "#FF7A00"}15` }}>
                    <span className="text-6xl mb-4">{p.emoji || "📚"}</span>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">{p.name}</h3>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: p.color || "#FF7A00" }}>
                      {p.ageGroup}
                    </span>
                  </div>
                  <div className="lg:w-2/3 p-8 flex flex-col justify-center">
                    <p className="text-foreground/70 leading-relaxed text-lg mb-4">{p.description}</p>
                    {p.schedule && (
                      <p className="text-sm text-foreground/50 mb-4">🕐 {p.schedule}</p>
                    )}
                    <Link to="/admissions" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{ color: p.color || "#FF7A00" }}>
                      Apply for {p.name} <span>→</span>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
