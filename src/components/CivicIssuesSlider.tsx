import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import roadIssues from "@/assets/road-issues.png";
import sewageIssues from "@/assets/sewage-issues.png";
import garbageIssues from "@/assets/garbage-issues.png";

interface SlideData {
  image: string;
  title: string;
  description: string;
}

const slides: SlideData[] = [
  {
    image: roadIssues,
    title: "Road Issues",
    description: "Potholes and broken roads affecting daily commute"
  },
  {
    image: sewageIssues,
    title: "Sewage Problems",
    description: "Drainage and water infrastructure issues"
  },
  {
    image: garbageIssues,
    title: "Sanitation Issues",
    description: "Waste management and cleanliness concerns"
  }
];

const CivicIssuesSlider = () => {
  return (
    <div className="relative">
      <Carousel 
        className="w-full" 
        opts={{ align: "start", loop: true }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl p-6">
                  <h3 className="text-white text-xl font-bold mb-2">{slide.title}</h3>
                  <p className="text-white/90 text-sm">{slide.description}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default CivicIssuesSlider;