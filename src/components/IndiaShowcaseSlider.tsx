import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface ShowcaseSlide {
  image: string;
  title: string;
  description: string;
  location: string;
}

const showcaseSlides: ShowcaseSlide[] = [
  {
    image: "/assets/varanasi-ghats.jpg",
    title: "Cultural Heritage Preservation",
    description: "Beautiful ghats of Varanasi showcasing India's rich cultural heritage and urban planning along sacred rivers.",
    location: "Varanasi, Uttar Pradesh"
  },
  {
    image: "/assets/highway-infrastructure.jpg", 
    title: "Modern Infrastructure Development",
    description: "World-class highway infrastructure connecting cities with smooth roads and landscaped medians.",
    location: "Ahmedabad-Vadodara Highway"
  },
  {
    image: "/assets/indore-cleaning.jpg",
    title: "Clean India Mission Success",
    description: "Community participation in maintaining clean streets and public spaces across Indian cities.",
    location: "Indore, Madhya Pradesh"
  }
];

const IndiaShowcaseSlider = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold mb-2">Celebrating India's Civic Progress</h3>
        <p className="text-muted-foreground">From heritage preservation to modern infrastructure - see the transformation</p>
      </div>
      
      <Carousel
        className="w-full"
        plugins={[Autoplay({ delay: 4000 })]}
      >
        <CarouselContent>
          {showcaseSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <div className="aspect-video relative">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="space-y-2">
                      <div className="text-sm opacity-80 font-medium">{slide.location}</div>
                      <h4 className="text-xl font-bold">{slide.title}</h4>
                      <p className="text-sm opacity-90 leading-relaxed">{slide.description}</p>
                    </div>
                  </div>
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

export default IndiaShowcaseSlider;