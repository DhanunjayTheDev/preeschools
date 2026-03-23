import { lazy, Suspense, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

const ContactScene = lazy(() => import("@/components/3d/ContactScene"));

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just show success — could integrate with a backend endpoint later
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    { icon: FaMapMarkerAlt, title: "Address", details: "123 Education Lane, Learning City", color: "text-primary" },
    { icon: FaPhone, title: "Phone", details: "+91 98765 43210", color: "text-green-500" },
    { icon: FaEnvelope, title: "Email", details: "info@kohshaacademy.com", color: "text-accent" },
    { icon: FaClock, title: "Office Hours", details: "Mon-Sat, 8:00 AM - 5:00 PM", color: "text-secondary" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-20 gradient-bg overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 bg-mint/10 text-emerald-600 rounded-full text-sm font-semibold mb-4">Contact</span>
            <h1 className="text-5xl sm:text-6xl font-display font-bold text-foreground mb-6">
              Let's{" "}
              <span className="bg-gradient-to-r from-primary to-mint bg-clip-text text-transparent">Talk</span>
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed">
              Have a question? Want to schedule a visit? We'd love to hear from you. Reach out and we'll respond within 24 hours.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="h-[350px] rounded-3xl overflow-hidden">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
                <ContactScene />
              </Suspense>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <AnimatedSection>
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-8">Get in Touch</h2>
              <div className="space-y-6 mb-10">
                {contactInfo.map((c) => (
                  <div key={c.title} className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center ${c.color} shrink-0`}>
                      <c.icon size={20} />
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground">{c.title}</p>
                      <p className="text-foreground/60">{c.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="font-display font-bold text-foreground mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { icon: FaWhatsapp, color: "bg-green-500" },
                    { icon: FaFacebook, color: "bg-blue-600" },
                    { icon: FaInstagram, color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" },
                  ].map((s, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full ${s.color} text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}>
                      <s.icon size={18} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection delay={0.2}>
            <div className="glass-card rounded-3xl p-8 md:p-10">
              {submitted ? (
                <div className="text-center py-12">
                  <span className="text-5xl block mb-4">💌</span>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-foreground/60 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                  <button onClick={() => setSubmitted(false)} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors text-foreground"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors text-foreground"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors text-foreground"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors text-foreground resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                    Send Message 📨
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
