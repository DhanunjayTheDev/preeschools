import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaTimes, FaPaperPlane } from "react-icons/fa";

const WHATSAPP_NUMBER = "919100033055";
const WA_URL = (msg) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

/* ─── Knowledge Base ─────────────────────────────────────────── */
const BOT_QA = [
  {
    patterns: ["hi", "hello", "hey", "start", "namaste", "good morning", "good afternoon", "good evening"],
    answer:
      "👋 Hello! Welcome to **Kohsha Academy**!\n\nI'm your virtual assistant. Ask me about our programs, fees, admissions, activities, or anything else. How can I help you today? 😊",
  },
  {
    patterns: ["program", "programs", "course", "courses", "offer", "class", "classes"],
    answer:
      "We offer **6 amazing programs** at Kohsha Academy:\n\n🍼 **Daycare** (6 mo – 2 yrs) — ₹4,500/mo\n🧸 **Toddler Club** (2 – 3 yrs) — ₹5,000/mo\n🎨 **Nursery** (3 – 4 yrs) — ₹5,500/mo\n📖 **K1** (4 – 5 yrs) — ₹6,000/mo\n🎓 **K2** (5 – 6 yrs) — ₹6,500/mo\n⚽ **After School** (3 – 8 yrs) — ₹3,000/mo\n\nWould you like details on any specific program?",
  },
  {
    patterns: ["fee", "fees", "cost", "price", "pricing", "charge", "charges", "pay", "₹", "rupee", "rupees", "monthly"],
    answer:
      "Our monthly fee structure:\n\n• Daycare — ₹4,500\n• Toddler Club — ₹5,000\n• Nursery — ₹5,500\n• K1 — ₹6,000\n• K2 — ₹6,500\n• After School — ₹3,000\n\nAll fees include learning materials and activities! 🎉",
  },
  {
    patterns: ["admission", "admissions", "enroll", "enrollment", "apply", "application", "join", "register", "registration"],
    answer:
      "🎓 **Admission Process:**\n\n1️⃣ Fill out the online form on our Admissions page\n2️⃣ Our team contacts you within **24 hours**\n3️⃣ Schedule a school visit\n4️⃣ Complete enrollment formalities\n\nLimited seats available — apply soon! Tap the WhatsApp button below to get started right away. 🌟",
  },
  {
    patterns: ["activit", "activities", "art", "music", "sport", "sports", "craft", "dance", "science", "drama", "garden", "gardening"],
    answer:
      "🎉 **Our Activities:**\n\n🎨 Arts & Crafts — painting, clay modeling\n🎵 Music & Dance — rhythm and movement\n⚽ Sports & Games — fitness and teamwork\n🎭 Drama & Storytelling — confidence building\n🌱 Nature & Gardening — environmental awareness\n🔬 Science Discoveries — fun experiments\n\nEvery day is an adventure at Kohsha! 🚀",
  },
  {
    patterns: ["schedule", "timetable", "daily", "day", "routine", "time", "timing", "when"],
    answer:
      "⏰ **A Typical Day at Kohsha:**\n\n8:30 AM — Welcome Circle & Free Play 🤗\n9:00 AM — Literacy & Numeracy 📖\n9:45 AM — Snack Time 🍎\n10:00 AM — Outdoor Play & Sports ⚽\n10:45 AM — Art & Craft Workshop 🎨\n11:30 AM — Music & Movement 🎵\n12:00 PM — Lunch 🍽️\n12:30 PM — Quiet Time / Story 📚\n1:00 PM — Science & Nature 🔬\n1:45 PM — Review & Dismissal 🎒",
  },
  {
    patterns: ["safe", "safety", "secure", "security", "cctv", "protect", "protection"],
    answer:
      "🛡️ **Your Child's Safety is Our #1 Priority!**\n\n✅ 24/7 CCTV-monitored premises\n✅ Secure, single-entry/exit system\n✅ Background-verified, trained staff\n✅ Emergency response protocols\n✅ Regular safety drills\n\nWe ensure every child feels safe, loved, and confident. 💕",
  },
  {
    patterns: ["teacher", "teachers", "staff", "faculty", "team", "educator", "educators"],
    answer:
      "👩‍🏫 **Meet Our Amazing Team:**\n\n🏫 Mrs. Kohsha Rani — Founder & Director\n📚 Ms. Priya Devi — Head of Curriculum\n⚽ Mr. Arjun Singh — Sports Coach\n🎨 Ms. Meera Nair — Art & Music Lead\n\nWe have **50+ expert educators** trained in early childhood development. ✨",
  },
  {
    patterns: ["about", "history", "founded", "found", "year", "since", "established", "start", "story"],
    answer:
      "🏫 **About Kohsha Academy**\n\nFounded in **2009** by Mrs. Kohsha Rani with a simple mission — provide a joyful, safe, and stimulating environment where every child discovers their unique potential.\n\n✨ 500+ Happy Students\n👩‍🏫 50+ Expert Teachers\n🏆 15+ Years of Excellence\n\nOur curriculum blends Montessori, Reggio Emilia & traditional methods. 🌱",
  },
  {
    patterns: ["contact", "phone", "address", "location", "email", "reach", "visit", "office", "come", "direction", "map"],
    answer:
      "📞 **Contact Kohsha Academy:**\n\n📍 123 Education Lane, Learning City\n📱 +91 98765 43210\n✉️ info@kohshaacademy.com\n🕐 Mon–Sat: 8:00 AM – 5:00 PM\n\nOr chat with us directly on WhatsApp! 💬",
  },
  {
    patterns: ["daycare", "infant", "baby", "6 month", "newborn"],
    answer:
      "🍼 **Daycare Program**\n\nAge: 6 months – 2 years\nSchedule: Mon–Fri, 8:00 AM – 6:00 PM\nFee: ₹4,500/month\n\nA warm, safe haven for your littlest ones. Our trained caregivers provide sensory play, tummy time activities, and gentle routines that help babies feel secure. 💕",
  },
  {
    patterns: ["toddler club", "toddler", "2 year", "2-3"],
    answer:
      "🧸 **Toddler Club**\n\nAge: 2 – 3 years\nSchedule: Mon–Fri, 9:00 AM – 12:30 PM\nFee: ₹5,000/month\n\nAn exciting world of exploration! Language, motor skills, and social confidence through guided play, music, and hands-on sensory activities. 🎵",
  },
  {
    patterns: ["nursery", "3 year", "3-4"],
    answer:
      "🎨 **Nursery Program**\n\nAge: 3 – 4 years\nSchedule: Mon–Fri, 8:30 AM – 1:00 PM\nFee: ₹5,500/month\n\nStructured yet playful! Literacy, numeracy, and science basics through art, storytelling, and group projects. 📚",
  },
  {
    patterns: ["k1", "kindergarten 1", "4 year", "4-5"],
    answer:
      "📖 **K1 Program**\n\nAge: 4 – 5 years\nSchedule: Mon–Fri, 8:30 AM – 2:00 PM\nFee: ₹6,000/month\n\nPre-reading, writing practice, mathematical concepts, and fascinating science experiments to prepare young minds for formal learning! 🔬",
  },
  {
    patterns: ["k2", "kindergarten 2", "5 year", "5-6", "school ready", "school readiness", "primary"],
    answer:
      "🎓 **K2 Program**\n\nAge: 5 – 6 years\nSchedule: Mon–Fri, 8:30 AM – 2:30 PM\nFee: ₹6,500/month\n\nOur school-readiness program develops advanced literacy, numeracy, critical thinking, and social-emotional skills for a smooth transition to primary school! 🏆",
  },
  {
    patterns: ["after school", "afterschool", "evening", "3pm", "extracurricular", "extra"],
    answer:
      "⚽ **After School Activities**\n\nAge: 3 – 8 years\nSchedule: Mon–Fri, 3:00 PM – 6:00 PM\nFee: ₹3,000/month\n\nSports, art, music, dance, cooking, and STEM activities led by specialist instructors! 🌟",
  },
  {
    patterns: ["gallery", "photo", "photos", "picture", "pictures", "image", "images", "moment"],
    answer:
      "📸 **Our Gallery**\n\nBrowse beautiful moments from Kohsha Academy:\n\n🎭 School Events\n🏫 Classroom Activities\n🌳 Outdoor Adventures\n🎨 Art & Craft Creations\n⚽ Sports Days\n\nVisit our Gallery page to see all the magical memories! 😊",
  },
  {
    patterns: ["review", "reviews", "testimonial", "testimonials", "parent say", "parents", "feedback", "rating"],
    answer:
      '💬 **What Parents Say:**\n\n⭐⭐⭐⭐⭐ "Kohsha Academy has been amazing for my son. He loves going every day!" — Priya Sharma\n\n⭐⭐⭐⭐⭐ "The teachers are incredibly caring and patient." — Rajesh Kumar\n\n⭐⭐⭐⭐⭐ "Tremendous growth in confidence and creativity!" — Meera Patel',
  },
  {
    patterns: ["holiday", "vacation", "break", "closed", "off", "leave"],
    answer:
      "📅 We follow the standard academic calendar with holidays for all major festivals and national holidays.\n\nFor the specific holiday schedule, please contact us:\n📱 +91 98765 43210\n✉️ info@kohshaacademy.com\n\nOr ask us directly on WhatsApp! 💬",
  },
  {
    patterns: ["thank", "thanks", "bye", "goodbye", "great", "awesome", "wonderful", "perfect", "ok", "okay", "got it"],
    answer:
      "🌟 You're welcome! It was a pleasure helping you.\n\nIf you have any more questions or would like to schedule a visit, don't hesitate to reach out! Tap the **WhatsApp** button below to connect with our team directly. 💛\n\nWishing you and your little one a wonderful day! 😊",
  },
];

const SUGGESTED = [
  "What programs do you offer? 📚",
  "What are the fees? 💰",
  "How to enroll my child? 🎓",
  "What activities do you have? 🎨",
  "What is the daily schedule? ⏰",
  "Is the school safe? 🛡️",
  "Tell me about your team 👩‍🏫",
  "Contact information 📞",
  "About Kohsha Academy 🏫",
];

const FALLBACK =
  "I'm not sure about that, but our team would love to help! 😊\n\nYou can ask me about our programs, fees, admissions, activities, schedule, or safety. Or tap the **WhatsApp** button below to speak with our team directly!";

const GREETING =
  "👋 Hello! Welcome to **Kohsha Academy**!\n\nI'm your virtual assistant. I can help you with:\n\n📚 Programs & Fees\n🎓 Admissions\n🎨 Activities & Schedule\n📞 Contact Info\n\nPick a quick question or type your own! 😊";

/* ─── Helpers ─────────────────────────────────────────────────── */
function findAnswer(text) {
  const lower = text.toLowerCase();
  for (const qa of BOT_QA) {
    if (qa.patterns.some((p) => lower.includes(p))) {
      return qa.answer;
    }
  }
  return FALLBACK;
}

function FormattedText({ text }) {
  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
    </span>
  );
}

/* ─── Message Bubble ──────────────────────────────────────────── */
function MessageBubble({ msg }) {
  const isBot = msg.sender === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex gap-2.5 mb-3 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 shadow-md">
          K
        </div>
      )}
      <div
        className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isBot
            ? "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
            : "bg-gradient-to-br from-primary to-orange-400 text-white rounded-tr-sm"
        }`}
      >
        <FormattedText text={msg.text} />
      </div>
    </motion.div>
  );
}

/* ─── Typing Indicator ────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex gap-2.5 items-center mb-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
        K
      </div>
      <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 0.18, 0.36].map((delay, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/50"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const [botMsgCount, setBotMsgCount] = useState(1);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasNew(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    const lower = trimmed.toLowerCase();
    const isContactQuery =
      lower.includes("admission") ||
      lower.includes("enroll") ||
      lower.includes("apply") ||
      lower.includes("contact") ||
      lower.includes("phone") ||
      lower.includes("whatsapp") ||
      lower.includes("fee") ||
      lower.includes("register");

    setTimeout(
      () => {
        const answer = findAnswer(trimmed);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "bot", text: answer },
        ]);
        setIsTyping(false);
        setBotMsgCount((c) => {
          const next = c + 1;
          if (next >= 3 || isContactQuery) setShowWhatsApp(true);
          return next;
        });
      },
      700 + Math.random() * 500
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* ── Toggle button ──────────────────────────────────────── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.6 }}
        className="fixed bottom-6 left-6 z-50"
      >
        {/* Label bubble (disappears after first open) */}
        <AnimatePresence>
          {hasNew && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: 2.5 }}
              className="absolute bottom-full mb-2 left-0 bg-foreground text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg"
            >
              Ask us anything! 💬
              <span className="absolute -bottom-1.5 left-5 w-3 h-3 bg-foreground rotate-45 rounded-sm" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Open chat assistant"
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-orange-500 text-white shadow-lg shadow-primary/40 flex items-center justify-center overflow-visible"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.12, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-2xl"
              >
                💬
              </motion.span>
            )}
          </AnimatePresence>

          {/* Unread dot */}
          <AnimatePresence>
            {hasNew && !isOpen && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow"
              >
                1
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* ── Chat window ────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:w-[380px] z-50 flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/25"
            style={{ maxHeight: "min(580px, calc(100vh - 120px))" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4 shrink-0"
              style={{ background: "linear-gradient(135deg, #FF7A00, #FF5722)" }}
            >
              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-display font-bold text-xl shadow-inner shrink-0">
                K
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-display font-bold text-base leading-none">
                  Kohsha Assistant
                </p>
                <p className="text-white/70 text-xs mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-300 inline-block shrink-0" />
                  Online · Replies instantly
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <FaTimes size={15} />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 px-4 pt-4 pb-2">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick reply chips */}
            <div className="bg-white border-t border-gray-100 px-3 py-2.5 overflow-x-auto shrink-0">
              <div className="flex gap-2 w-max">
                {SUGGESTED.map((q) => (
                  <motion.button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={isTyping}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="shrink-0 text-xs px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA banner */}
            <AnimatePresence>
              {showWhatsApp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-green-50 border-t border-green-100 shrink-0"
                >
                  <div className="px-4 py-2.5">
                    <p className="text-xs text-green-700 font-medium text-center mb-2">
                      🎯 Want to talk to our team directly?
                    </p>
                    <a
                      href={WA_URL(
                        "Hello! I would like to know more about Kohsha Academy programs and admissions."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-semibold shadow-md shadow-green-500/25 transition-colors"
                      style={{ background: "#25D366" }}
                    >
                      <FaWhatsapp size={18} />
                      Continue on WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 items-center px-3 py-3 bg-white border-t border-gray-100 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isTyping}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isTyping}
                whileHover={{ scale: 1.08, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
                className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-md shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                style={{ background: "linear-gradient(135deg, #FF7A00, #FF5722)" }}
              >
                <FaPaperPlane size={14} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
