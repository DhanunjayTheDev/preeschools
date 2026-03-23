import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-display text-xl font-bold">K</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">KOHSHA</h3>
                <p className="text-xs text-white/50">ACADEMY</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Nurturing young minds with love, creativity, and excellence since 2010.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              {["About", "Programs", "Activities", "Gallery", "Admissions", "Contact"].map((link) => (
                <Link key={link} to={`/${link.toLowerCase()}`} className="block text-white/60 hover:text-primary transition-colors text-sm">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Programs</h4>
            <div className="space-y-3 text-sm text-white/60">
              {["Daycare", "Toddler Club", "Nursery", "K1", "K2", "After School"].map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-4 text-sm text-white/60">
              <div className="flex items-center gap-3">
                <FaPhone className="text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-primary" />
                <span>info@kohshaacademy.com</span>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-1" />
                <span>123 Education Lane, Bangalore 560001</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Icon size={16} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Kohsha Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
