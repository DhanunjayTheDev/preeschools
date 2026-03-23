import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Magnet from "@/components/ui/Magnet";
import BlurText from "@/components/ui/BlurText";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] overflow-hidden"
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #FF7A00 0%, #FF5722 35%, #FF9A3C 65%, #FFD93D 100%)" }} />
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }} />
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-25 bg-yellow-200" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20 bg-red-300" />

          <div className="relative z-10 py-20 px-8 md:px-20 text-center text-white">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm mb-8 text-sm font-medium">
              <span className="text-base">🚀</span> Limited Seats Available
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-[1.1]">
              <span className="block text-white">Give Your Child</span>
              <span className="block text-white/90">The Best Start 🚀</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              Join hundreds of happy families who trust Kohsha Academy for their child's early education journey.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Magnet padding={60} magnetStrength={4}>
                <Link to="/admissions" className="px-10 py-4 bg-white text-primary rounded-2xl font-bold shadow-2xl shadow-black/20 hover:shadow-3xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                  <span>Apply Now</span> <span className="text-lg">✨</span>
                </Link>
              </Magnet>
              <Magnet padding={60} magnetStrength={4}>
                <Link to="/contact" className="px-10 py-4 border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                  <span>Schedule a Tour</span> <span className="text-lg">🏫</span>
                </Link>
              </Magnet>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
