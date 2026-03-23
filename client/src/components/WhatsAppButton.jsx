import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "919100033055";
const DEFAULT_MESSAGE = "Hello! I'm interested in learning more about your preschool programs. Could you please share some details?";

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.18, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.88, transition: { duration: 0.1 } }}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        width: 56,
        height: 56,
        borderRadius: "50%",
        backgroundColor: "#25D366",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(37,211,102,0.45)",
        zIndex: 50,
      }}
    >
      <motion.span
        whileHover={{ rotate: 360, transition: { duration: 0.5, type: "tween" } }}
        style={{ display: "flex" }}
      >
        <FaWhatsapp size={28} />
      </motion.span>
    </motion.a>
  );
}
