import { lazy, Suspense } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { FaShieldAlt, FaHeart, FaStar, FaUsers, FaBook, FaSeedling } from "react-icons/fa";

const AboutScene = lazy(() => import("@/components/3d/AboutScene"));

const values = [
  { icon: FaHeart, title: "Love & Care", desc: "Every child is treated with warmth and individual attention." },
  { icon: FaShieldAlt, title: "Safety First", desc: "CCTV-monitored, secure premises with trained staff at all times." },
  { icon: FaStar, title: "Excellence", desc: "We strive for the highest standards in early childhood education." },
  { icon: FaUsers, title: "Community", desc: "Building a strong bond between home, school, and community." },
  { icon: FaBook, title: "Holistic Learning", desc: "Balancing academics with creative, physical, and social growth." },
  { icon: FaSeedling, title: "Growth Mindset", desc: "Encouraging curiosity, resilience, and a love for learning." },
];

const team = [
  { name: "Mrs. Kohsha Rani", role: "Founder & Director", emoji: "👩‍🏫" },
  { name: "Ms. Priya Devi", role: "Head of Curriculum", emoji: "📚" },
  { name: "Mr. Arjun Singh", role: "Sports Coach", emoji: "⚽" },
  { name: "Ms. Meera Nair", role: "Art & Music Lead", emoji: "🎨" },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-20 gradient-bg overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">About Us</span>
            <h1 className="text-5xl sm:text-6xl font-display font-bold text-foreground mb-6">
              Nurturing Young{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Minds</span>{" "}
              Since 2009
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed mb-6">
              Kohsha Academy was founded with a simple mission — to provide a joyful, safe, and stimulating learning environment where every child can discover their unique potential.
            </p>
            <p className="text-foreground/60 leading-relaxed">
              Over 15 years, we've watched thousands of children blossom under our care. Our play-based curriculum blends the best of Montessori, Reggio Emilia, and traditional methods.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="h-[400px] rounded-3xl overflow-hidden">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
                <AboutScene />
              </Suspense>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-secondary/10 text-yellow-600 rounded-full text-sm font-semibold mb-4">Our Values</span>
              <h2 className="text-4xl font-display font-bold text-foreground">What We Stand For</h2>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="glass-card rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                    <v.icon size={22} />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-cyan-600 rounded-full text-sm font-semibold mb-4">Our Team</span>
              <h2 className="text-4xl font-display font-bold text-foreground">Meet Our Team</h2>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="glass-card rounded-3xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="text-5xl mb-4">{t.emoji}</div>
                  <h3 className="font-display font-bold text-foreground mb-1">{t.name}</h3>
                  <p className="text-sm text-foreground/60">{t.role}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
