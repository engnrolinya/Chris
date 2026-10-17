import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/initialData';

export const GallerySection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Architecture', 'Security', 'Infrastructure'];

  const filteredItems =
    activeFilter === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#F2F6EF]/40 border-t border-neutral-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-[#373E0C]">
              Architectural Vision & Planning
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#373E0C] tracking-tight mt-2">
              Estate Visual Gallery
            </h2>
            <p className="text-sm text-neutral-600 mt-3">
              Explore the contemporary architectural designs, gated security infrastructure, and internal road concepts planned for New Dawn Smart City.
            </p>
          </div>

          {/* Category Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-200/80 rounded-xl shadow-xs self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeFilter === cat
                    ? 'bg-[#373E0C] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mandatory Transparency Notice */}
        <div className="mb-8 p-3.5 rounded-xl bg-white border border-neutral-200/90 text-xs text-neutral-600 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#E96818] shrink-0" />
          <span>
            <strong>Illustrative Preview Notice:</strong> Gallery imagery contains architectural renders and conceptual representations of planned infrastructure. We warmly invite prospective buyers to book an on-site physical inspection at Plot 20, New Asaba.
          </span>
        </div>

        {/* Responsive Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <img
                  src={item.imagePath}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-3 bg-white/90 text-neutral-900 rounded-full shadow-lg backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-5 h-5 text-[#373E0C]" />
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-neutral-900/70 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {item.category} · Conceptual Render
                </div>
              </div>

              {/* Caption */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#373E0C] group-hover:text-[#E96818] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
                  <span>New Dawn Smart City</span>
                  <span className="text-[#373E0C] font-semibold group-hover:text-[#E96818] flex items-center gap-1">
                    Expand view
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 text-white">
              <div className="text-xs font-semibold text-neutral-300">
                {filteredItems[lightboxIndex].category} · {lightboxIndex + 1} of {filteredItems.length}
              </div>
              <button
                onClick={closeLightbox}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Lightbox Image */}
            <div className="relative aspect-[16/10] max-h-[68vh] w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={filteredItems[lightboxIndex].imagePath}
                alt={filteredItems[lightboxIndex].title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next Controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightbox();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-900/80 text-white hover:bg-[#E96818] transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightbox();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-900/80 text-white hover:bg-[#E96818] transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="p-5 bg-neutral-900 text-white border-t border-neutral-800">
              <h4 className="text-base font-bold text-white">
                {filteredItems[lightboxIndex].title}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {filteredItems[lightboxIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
