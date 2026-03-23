import { lazy, Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { submitAdmission } from "@/lib/api";
import confetti from "canvas-confetti";

const AdmissionsScene = lazy(() => import("@/components/3d/AdmissionsScene"));

const programOptions = ["Daycare", "Toddler Club", "Nursery", "K1", "K2", "After School Activities"];

export default function Admissions() {
  const [form, setForm] = useState({ parentName: "", childName: "", age: "", phone: "", email: "", program: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    const e = {};
    if (!form.parentName.trim()) e.parentName = "Parent name is required";
    if (!form.childName.trim()) e.childName = "Child name is required";
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 10) e.age = "Age must be between 1 and 10";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) e.phone = "Valid phone number is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.program) e.program = "Please select a program";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      await submitAdmission({ ...form, age: Number(form.age) });
      setStatus("success");
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      setForm({ parentName: "", childName: "", age: "", phone: "", email: "", program: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-20 gradient-bg overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">Admissions</span>
            <h1 className="text-5xl sm:text-6xl font-display font-bold text-foreground mb-6">
              Begin Your Child's{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Journey</span>
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed">
              Fill out the form below and our admissions team will get in touch with you within 24 hours to discuss the best program for your child.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="h-[350px] rounded-3xl overflow-hidden">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
                <AdmissionsScene />
              </Suspense>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Form */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Admission Form</h2>
              <p className="text-foreground/60 mb-8">All fields are required.</p>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <span className="text-6xl block mb-4">🎉</span>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">Application Submitted!</h3>
                    <p className="text-foreground/60 mb-6">We'll contact you within 24 hours.</p>
                    <button onClick={() => setStatus("idle")} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                      Submit Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Parent Name */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Parent/Guardian Name
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.parentName}
                        onChange={(e) => handleChange("parentName", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-background border-2 ${errors.parentName ? "border-red-400" : "border-border"} focus:border-primary focus:outline-none transition-colors text-foreground`}
                        placeholder="Enter parent name"
                        required
                      />
                      {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName}</p>}
                    </div>

                    {/* Child Name */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Child's Name
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.childName}
                        onChange={(e) => handleChange("childName", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-background border-2 ${errors.childName ? "border-red-400" : "border-border"} focus:border-primary focus:outline-none transition-colors text-foreground`}
                        placeholder="Enter child's name"
                        required
                      />
                      {errors.childName && <p className="text-red-500 text-sm mt-1">{errors.childName}</p>}
                    </div>

                    {/* Age & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Child's Age
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={form.age}
                          onChange={(e) => handleChange("age", e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl bg-background border-2 ${errors.age ? "border-red-400" : "border-border"} focus:border-primary focus:outline-none transition-colors text-foreground`}
                          placeholder="Age"
                          required
                        />
                        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Phone Number
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl bg-background border-2 ${errors.phone ? "border-red-400" : "border-border"} focus:border-primary focus:outline-none transition-colors text-foreground`}
                          placeholder="Phone"
                          required
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Email Address
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-background border-2 ${errors.email ? "border-red-400" : "border-border"} focus:border-primary focus:outline-none transition-colors text-foreground`}
                        placeholder="email@example.com"
                        required
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Program */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Select Program
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        value={form.program}
                        onChange={(e) => handleChange("program", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-background border-2 ${errors.program ? "border-red-400" : "border-border"} focus:border-primary focus:outline-none transition-colors text-foreground`}
                        required
                      >
                        <option value="">Choose a program...</option>
                        {programOptions.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      {errors.program && <p className="text-red-500 text-sm mt-1">{errors.program}</p>}
                    </div>

                    {status === "error" && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{errorMsg}</div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        "Submit Application 🎓"
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
