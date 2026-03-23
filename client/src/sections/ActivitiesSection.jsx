import { motion } from "framer-motion";
import TiltCard from "@/components/ui/TiltCard";
import BlurText from "@/components/ui/BlurText";
import { FaPaintBrush, FaMusic, FaFutbol, FaTheaterMasks, FaSeedling, FaFlask } from "react-icons/fa";

const activities = [
  { icon: FaPaintBrush, title: "Arts & Crafts", desc: "Unleash creativity through painting, drawing, clay modeling and mixed media projects.", gradient: "from-red-400 to-pink-500", glow: "rgba(248,113,113,0.15)" },
  { icon: FaMusic, title: "Music & Dance", desc: "Rhythm and movement classes to develop coordination and musical appreciation.", gradient: "from-purple-400 to-violet-500", glow: "rgba(167,139,250,0.15)" },
  { icon: FaFutbol, title: "Sports & Games", desc: "Age-appropriate physical activities promoting fitness, teamwork and motor skills.", gradient: "from-green-400 to-emerald-500", glow: "rgba(74,222,128,0.15)" },
  { icon: FaTheaterMasks, title: "Drama & Storytelling", desc: "Building confidence and communication through role-play and creative stories.", gradient: "from-yellow-400 to-orange-500", glow: "rgba(251,191,36,0.15)" },
  { icon: FaSeedling, title: "Gardening", desc: "Hands-on nature activities teaching responsibility and environmental awareness.", gradient: "from-lime-400 to-green-500", glow: "rgba(163,230,53,0.15)" },
  { icon: FaFlask, title: "Science Explore", desc: "Fun experiments and discoveries that spark curiosity and scientific thinking.", gradient: "from-blue-400 to-cyan-500", glow: "rgba(96,165,250,0.15)" },
];

export default function ActivitiesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-warm/5 via-transparent to-primary/5" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-warm/10 text-red-500 rounded-full text-sm font-semibold mb-6 border border-red-400/15">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />Fun Activities
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            <span style={{ background: "linear-gradient(135deg, #1C0800, #4A2000)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Fun-Filled{" "}</span>
            <span style={{ background: "linear-gradient(135deg, #FF5722, #FF7A00)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Activities 🎉</span>
          </h2>
          <p className="text-foreground/55 max-w-2xl mx-auto text-lg">A full spectrum of activities designed to develop every aspect of your child's potential.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }} viewport={{ once: true }}
            >
              <TiltCard rotateAmplitude={8} scaleOnHover={1.03} className="h-full">
                <div className="relative rounded-3xl overflow-hidden h-full border border-foreground/8 bg-card/60 backdrop-blur-sm group"
                  style={{ boxShadow: `0 4px 24px ${a.glow}` }}>
                  <div className={`h-1.5 w-full bg-gradient-to-r ${a.gradient}`} />
                  <div className="p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${a.gradient} flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <a.icon size={22} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-3">{a.title}</h3>
                    <p className="text-foreground/55 leading-relaxed text-sm">{a.desc}</p>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${a.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
