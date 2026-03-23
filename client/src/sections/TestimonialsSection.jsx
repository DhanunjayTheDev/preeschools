import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TiltCard from "@/components/ui/TiltCard";
import BlurText from "@/components/ui/BlurText";
import { getTestimonials } from "@/lib/api";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const fallbackTestimonials = [
  { _id: "1", parentName: "Priya Sharma", childName: "Aarav", message: "Kohsha Academy has been absolutely amazing for my son. He loves going to school every single day and has grown so much!", rating: 5, avatar: "PS" },
  { _id: "2", parentName: "Rajesh Kumar", childName: "Ananya", message: "The teachers are incredibly caring and patient. The curriculum is perfectly designed for early development. Highly recommend!", rating: 5, avatar: "RK" },
  { _id: "3", parentName: "Meera Patel", childName: "Dev", message: "We've seen tremendous growth in our child's confidence, social skills, and creativity. Kohsha is the best decision we made.", rating: 5, avatar: "MP" },
];

const avatarColors = ["#FF7A00", "#4ECDC4", "#A78BFA"];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    getTestimonials().then((res) => {
      if (res.data?.length) setTestimonials(res.data.map((t, i) => ({ avatar: t.parentName?.slice(0,2).toUpperCase() || "👤", ...t })));
    }).catch(() => {});
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-cyan-600 rounded-full text-sm font-semibold mb-6 border border-cyan-400/15">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />Parent Reviews
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            <span style={{ background: "linear-gradient(135deg, #1C0800, #4A2000)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>What Parents{" "}</span>
            <span style={{ background: "linear-gradient(135deg, #FF7A00, #FF6B6B)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Say About Us 💬</span>
          </h2>
          <p className="text-foreground/55 max-w-xl mx-auto">Real stories from real families who trust us with their most precious ones.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }} viewport={{ once: true }}
            >
              <TiltCard rotateAmplitude={6} scaleOnHover={1.02} className="h-full">
                <div className="relative rounded-3xl p-8 h-full border border-foreground/8 bg-card/70 backdrop-blur-sm overflow-hidden group"
                  style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 20px 40px rgba(0,0,0,0.06)` }}>
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: avatarColors[i % avatarColors.length] }} />
                  <div className="flex justify-between items-start mb-5">
                    <FaQuoteLeft size={28} style={{ color: avatarColors[i % avatarColors.length], opacity: 0.3 }} />
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating || 5 }).map((_, j) => (
                        <FaStar key={j} size={13} className="text-secondary" />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground/65 leading-relaxed mb-8 text-sm">{t.message}</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-foreground/8">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-inner flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${avatarColors[i % avatarColors.length]}, ${avatarColors[(i + 1) % avatarColors.length]})` }}>
                      {t.avatar || t.parentName?.slice(0,2)}
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground text-sm">{t.parentName}</p>
                      <p className="text-xs text-foreground/45">Parent of {t.childName}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${avatarColors[i % avatarColors.length]}, transparent)` }} />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
