import { lazy, Suspense, useEffect, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { getGallery } from "@/lib/api";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const GalleryScene = lazy(() => import("@/components/3d/GalleryScene"));

const categories = ["All", "Events", "Classroom", "Outdoor", "Art", "Sports"];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGallery()
      .then((res) => {
        const data = res.data || [];
        setImages(data);
        setFiltered(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFiltered(images);
    } else {
      setFiltered(images.filter((img) => img.category === activeCategory));
    }
  }, [activeCategory, images]);

  const openLightbox = (index) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);

  const navigate = (dir) => {
    if (lightbox === null) return;
    const next = lightbox + dir;
    if (next >= 0 && next < filtered.length) setLightbox(next);
  };

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-20 gradient-bg overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-cyan-600 rounded-full text-sm font-semibold mb-4">Gallery</span>
            <h1 className="text-5xl sm:text-6xl font-display font-bold text-foreground mb-6">
              Capturing{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Precious Moments</span>
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed">
              Browse through beautiful moments from our school — events, activities, and the everyday magic of childhood learning.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="h-[350px] rounded-3xl overflow-hidden">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
                <GalleryScene />
              </Suspense>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-card text-foreground/60 hover:bg-primary/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <AnimatedSection>
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">📷</span>
                <p className="text-foreground/60 text-lg">No images found. Check back soon!</p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filtered.map((img, i) => (
                <AnimatedSection key={img._id || i} delay={(i % 6) * 0.05}>
                  <div
                    className="break-inside-avoid glass-card rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
                    onClick={() => openLightbox(i)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={img.imageUrl?.startsWith("http") ? img.imageUrl : `${apiBase}${img.imageUrl}`}
                        alt={img.title || "Gallery image"}
                        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white font-semibold text-sm">{img.title}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 text-white text-2xl z-50 p-2 hover:bg-white/20 rounded-full transition-colors" onClick={closeLightbox}>
            <FaTimes />
          </button>
          {lightbox > 0 && (
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl p-3 hover:bg-white/20 rounded-full transition-colors z-50" onClick={(e) => { e.stopPropagation(); navigate(-1); }}>
              <FaChevronLeft />
            </button>
          )}
          {lightbox < filtered.length - 1 && (
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl p-3 hover:bg-white/20 rounded-full transition-colors z-50" onClick={(e) => { e.stopPropagation(); navigate(1); }}>
              <FaChevronRight />
            </button>
          )}
          <img
            src={filtered[lightbox].imageUrl?.startsWith("http") ? filtered[lightbox].imageUrl : `${apiBase}${filtered[lightbox].imageUrl}`}
            alt={filtered[lightbox].title || "Gallery image"}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
