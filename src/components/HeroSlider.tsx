import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
}

interface HeroSliderProps {
  onReportClick: () => void;
}

const slides: SlideData[] = [
  {
    id: 1,
    title: "Report Road Issues",
    subtitle: "Help us fix potholes and broken roads in your area",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "Damaged road with potholes"
  },
  {
    id: 2,
    title: "Sanitation Concerns",
    subtitle: "Report garbage collection and cleanliness issues",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "Garbage collection and sanitation"
  },
  {
    id: 3,
    title: "Sewage Problems",
    subtitle: "Help resolve drainage and water logging issues",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "Sewage and drainage issues"
  },
  {
    id: 4,
    title: "Building Better Cities",
    subtitle: "Your reports help create cleaner, safer communities",
    image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    alt: "Clean modern city skyline"
  }
];

const HeroSlider: React.FC<HeroSliderProps> = ({ onReportClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden rounded-2xl">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 font-light opacity-90">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="hero" 
                    onClick={onReportClick}
                    className="text-lg px-8 py-6 bg-gradient-to-r from-civic-accent to-primary hover:from-civic-accent/90 hover:to-primary/90"
                  >
                    🚩 Submit Your Complaint
                  </Button>
                  <Button 
                    variant="civic-outline" 
                    className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary"
                  >
                    📊 View Live Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;