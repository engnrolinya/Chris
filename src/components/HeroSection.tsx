import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MapPin,
  Building2,
  Sun,
  Shield,
} from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';
import slide1Img from '../assets/images/hero_new_dawn_smart_city_1792253580563.jpg';
import slide2Img from '../assets/images/estate_entrance_gate_1792253581050.jpg';
import slide3Img from '../assets/images/modern_smart_villa_1792253581571.jpg';
import slide4Img from '../assets/images/estate_road_infrastructure_1792253581935.jpg';

interface HeroSectionProps {
  onExplorePlans: () => void;
  onBookInspection: () => void;
  onSpeakToTeam: () => void;
}

interface SlideData {
  id: number;
  image: string;
  tag: string;
  headline: string;
  highlightText: string;
  description: string;
  badgeIcon: 'security' | 'estate' | 'villa' | 'road';
  statText: string;
  cardBadge: string;
  cardTitle: string;
  cardLocation: string;
  cardPoints: string[];
}

const CAROUSEL_SLIDES: SlideData[] = [
  {
    id: 1,
    image: slide1Img,
    tag: 'Consistent Experts · New Asaba, Delta State',
    headline: 'Own Your Future at',
    highlightText: 'New Dawn Smart City',
    description:
      'Discover a smarter way to own property in New Asaba, Delta State. Explore our flexible payment plans and take your next step towards property ownership with Consistent Experts.',
    badgeIcon: 'estate',
    statText: 'Strategic Growth Corridor',
    cardBadge: 'Featured Development',
    cardTitle: 'New Dawn Smart City',
    cardLocation: 'Plot 20, New Asaba, Delta State',
    cardPoints: [
      '500 SQM standard residential plots',
      'Designed with steady electricity & solar streetlights',
      'Gated community with 24/7 security provision',
    ],
  },
  {
    id: 2,
    image: slide2Img,
    tag: 'Gated Community & 24/7 Security Arrangements',
    headline: 'Architectural Gatehouse &',
    highlightText: 'Controlled Access',
    description:
      'A secure gated residential environment featuring controlled resident and visitor access lanes, boom barriers, and security arrangements designed to protect property owners.',
    badgeIcon: 'security',
    statText: 'Secure Estate Living',
    cardBadge: 'Access & Security',
    cardTitle: 'Architectural Gatehouse',
    cardLocation: 'Main Estate Entrance Boulevard',
    cardPoints: [
      'Dual access entry and exit lanes',
      'Boom barriers & 24/7 patrol security',
      'Perimeter fencing around the entire estate',
    ],
  },
  {
    id: 3,
    image: slide3Img,
    tag: 'Prime 500 SQM Parcel Allocations',
    headline: 'Contemporary Design &',
    highlightText: 'Serene Environment',
    description:
      'A calm, comfortable environment designed for modern residential living, with well-portioned 500 SQM plots suited for elegant contemporary family duplexes.',
    badgeIcon: 'villa',
    statText: '500 SQM Standard Plots',
    cardBadge: 'Modern Architecture',
    cardTitle: 'Contemporary Living',
    cardLocation: 'Serene Residential Enclave',
    cardPoints: [
      'Engineered for premium detached duplexes',
      'Peaceful surroundings with green verges',
      'Clear beacons and verified survey boundaries',
    ],
  },
  {
    id: 4,
    image: slide4Img,
    tag: 'Planned Infrastructure & Utilities',
    headline: 'Good Road Network &',
    highlightText: 'Solar Street Lights',
    description:
      'Engineered internal road infrastructure designed to enhance accessibility, paired with street lighting and steady electricity access across all estate carriageways.',
    badgeIcon: 'road',
    statText: 'Paved Roads & Streetlights',
    cardBadge: 'Smart Infrastructure',
    cardTitle: 'Paved Internal Roads',
    cardLocation: 'Complete Estate Carriageway Network',
    cardPoints: [
      'Interconnected smooth roadway network',
      'Energy-efficient solar street lighting',
      'Covered drainage channels & utility ducts',
    ],
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplorePlans,
  onBookInspection,
  onSpeakToTeam,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-advance slider every 6.5 seconds (smoothly slides right to left)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, currentSlide]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden bg-neutral-950 text-white min-h-[660px] lg:min-h-[720px] flex flex-col justify-between select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="New Dawn Smart City Highlight Slider"
    >
      {/* 
        Horizontal Sliding Track:
        All slides and their contents sit together in a continuous horizontal row.
        As currentSlide changes, the track smoothly and gently slides from right to left together with its contents.
      */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {CAROUSEL_SLIDES.map((slide) => {
          return (
            <div
              key={slide.id}
              className="w-full shrink-0 flex-none relative min-h-[660px] lg:min-h-[720px] flex flex-col justify-between"
            >
              {/* Slide Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image}
                  alt={`${slide.headline} ${slide.highlightText}`}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                {/* High-Contrast Scrim Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/80 to-neutral-950/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50" />
              </div>

              {/* Slide Content (Slides smoothly together with the image) */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full flex-1 flex flex-col justify-center">
                <div className="grid lg:grid-cols-12 gap-10 items-center">
                  {/* Left Column: Headlines, Description & Actions */}
                  <div className="lg:col-span-8 space-y-7">
                    {/* Tag / Counter */}
                    <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-300">
                      <span className="text-[#E96818] font-bold">{slide.tag}</span>
                      <span aria-hidden="true" className="text-neutral-500">·</span>
                      <span className="text-neutral-400 font-mono">0{slide.id} / 04</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] text-balance">
                      {slide.headline}{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#E96818]">
                        {slide.highlightText}
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg lg:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl text-pretty min-h-[72px]">
                      {slide.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        onClick={onExplorePlans}
                        className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-[#E96818] hover:bg-[#d65b10] active:scale-98 rounded-xl shadow-lg shadow-[#E96818]/25 transition-all whitespace-nowrap cursor-pointer"
                      >
                        <span>Explore Payment Plans</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={onBookInspection}
                        className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 active:scale-98 border border-white/25 rounded-xl backdrop-blur-sm transition-all whitespace-nowrap cursor-pointer"
                      >
                        <CalendarCheck className="w-4 h-4 text-[#E96818]" />
                        <span>Book an Inspection</span>
                      </button>

                      <button
                        onClick={onSpeakToTeam}
                        className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-neutral-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4 text-[#E96818]" />
                        <span>Speak to Our Team</span>
                      </button>
                    </div>

                    {/* Trust Highlights */}
                    <div className="pt-6 border-t border-white/15 flex items-center flex-wrap gap-4 text-xs sm:text-sm text-neutral-300 font-medium">
                      <span>Modern Living</span>
                      <span aria-hidden="true" className="text-neutral-500">|</span>
                      <span>Flexible Payment Options</span>
                      <span aria-hidden="true" className="text-neutral-500">|</span>
                      <span>Secure Estate Environment</span>
                    </div>
                  </div>

                  {/* Right Column: Slide Context Card */}
                  <div className="lg:col-span-4 hidden lg:block">
                    <div className="bg-neutral-900/85 backdrop-blur-md border border-neutral-700/80 rounded-3xl p-6 shadow-2xl space-y-5 text-white">
                      <div className="border-b border-neutral-800 pb-4">
                        <div className="text-xs font-semibold text-[#E96818] uppercase tracking-wider">
                          {slide.cardBadge}
                        </div>
                        <div className="text-xl font-bold mt-1 text-white">
                          {slide.cardTitle}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#E96818] shrink-0" />
                          <span>{slide.cardLocation}</span>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-300">
                        {slide.cardPoints.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#E96818] shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-neutral-800">
                        <div className="text-[11px] text-neutral-400 uppercase font-semibold mb-2">
                          Direct Inquiries & Bookings
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {DEFAULT_SITE_SETTINGS.phones.slice(0, 2).map((p) => (
                            <a
                              key={p}
                              href={`tel:${p.replace(/\s+/g, '')}`}
                              className="px-2.5 py-1.5 bg-neutral-800/80 hover:bg-neutral-700 rounded-lg text-center font-medium text-neutral-200 transition-colors"
                            >
                              {p}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom padding spacer to clear controls */}
              <div className="h-16 w-full pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Bootstrap Classic Side Navigation Controls (Anchored over slider) */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden sm:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/45 hover:bg-black/80 active:scale-95 border border-white/20 items-center justify-center text-white/90 hover:text-white backdrop-blur-md transition-all cursor-pointer group shadow-xl"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="hidden sm:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/45 hover:bg-black/80 active:scale-95 border border-white/20 items-center justify-center text-white/90 hover:text-white backdrop-blur-md transition-all cursor-pointer group shadow-xl"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Bootstrap-Style Bottom Navigation Controls & Slide Indicators */}
      <div className="absolute bottom-0 inset-x-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-7 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none">
        {/* Indicators: 4 Clickable slide indicators */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {CAROUSEL_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 cursor-pointer rounded-full ${
                  isActive
                    ? 'w-10 h-2.5 bg-[#E96818] shadow-md shadow-[#E96818]/60'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}: ${slide.highlightText}`}
              />
            );
          })}
        </div>

        {/* Carousel Arrow Controls & Play/Pause */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={prevSlide}
            className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-xs"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            aria-label={isPaused ? 'Resume Carousel Auto-Play' : 'Pause Carousel'}
            title={isPaused ? 'Resume Auto-Play' : 'Pause Auto-Play'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={nextSlide}
            className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-xs"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
