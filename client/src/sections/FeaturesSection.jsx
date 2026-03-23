import { motion } from "framer-motion";
import TiltCard from "@/components/ui/TiltCard";
import BlurText from "@/components/ui/BlurText";
import { FaGraduationCap, FaPalette, FaMusic, FaRunning, FaFlask, FaHeart } from "react-icons/fa";

const features = [
  { icon: FaGraduationCap, title: "Expert Teachers", desc: "Trained educators who nurture every child's unique potential.", gradient: "from-orange-400 to-primary", glow: "rgba(255,122,0,0.15)" },
  { icon: FaPalette, title: "Creative Learning", desc: "Art, craft, and hands-on activities that spark imagination.", gradient: "from-yellow-400 to-secondary", glow: "rgba(255,217,61,0.15)" },
  { icon: FaMusic, title: "Music & Dance", desc: "Rhythm and movement to develop coordination and expression.", gradient: "from-cyan-400 to-accent", glow: "rgba(92,214,255,0.15)" },
  { icon: FaRunning, title: "Sports & Play", desc: "Physical activities for fitness, teamwork, and motor skills.", gradient: "from-red-400 to-warm", glow: "rgba(255,99,71,0.15)" },
  { icon: FaFlask, title: "Science Discovery", desc: "Fun experiments that build curiosity and critical thinking.", gradient: "from-emerald-400 to-mint", glow: "rgba(72,199,142,0.15)" },
  { icon: FaHeart, title: "Safe Environment", desc: "A secure, loving space where children feel confident and happy.", gradient: "from-pink-400 to-purple-400", glow: "rgba(232,121,249,0.15)" },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6 border border-primary/15">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />Why Choose Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            <span style={{ background: "linear-gradient(135deg, #1C0800, #4A2000)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>What Makes Us{" "}</span>
            <span style={{ background: "linear-gradient(135deg, #FF7A00, #FFD93D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Special ✨</span>
          </h2>
          <p className="text-foreground/55 max-w-2xl mx-auto text-lg">Everything your child needs to grow, learn, and thrive in a joyful environment.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }} viewport={{ once: true }}
            >
              <TiltCard rotateAmplitude={8} scaleOnHover={1.03} className="h-full">
                <div className="relative rounded-3xl p-8 h-full overflow-hidden border border-foreground/8 bg-card/60 backdrop-blur-sm group"
                  style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 20px 40px ${f.glow}` }}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: `var(--tw-gradient-from)` }} />
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">{f.title}</h3>
                  <p className="text-foreground/55 leading-relaxed">{f.desc}</p>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
