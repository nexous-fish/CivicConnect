import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Upload, MapPin, Phone, CheckCircle, TrendingUp, Users, Clock } from 'lucide-react';

interface InfoCard {
  id: number;
  type: 'process' | 'stats' | 'success';
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  value?: string;
  subValue?: string;
}

const infoCards: InfoCard[] = [
  {
    id: 1,
    type: 'process',
    title: 'Upload Photo',
    description: 'Take a photo of the issue using your camera or upload from gallery',
    icon: <Upload className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    type: 'process',
    title: 'Select Location',
    description: 'Pin-point the exact location of the problem on the map',
    icon: <MapPin className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1519452634681-4d49ad2cea04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    type: 'process',
    title: 'Verify Details',
    description: 'Provide your contact information for updates and verification',
    icon: <Phone className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    type: 'process',
    title: 'Get Resolution',
    description: 'Track your complaint status and receive updates until resolved',
    icon: <CheckCircle className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 5,
    type: 'stats',
    title: 'Total Complaints',
    description: 'Issues reported across India',
    icon: <TrendingUp className="w-8 h-8" />,
    value: '2,847',
    subValue: '+12% this month'
  },
  {
    id: 6,
    type: 'stats',
    title: 'Active Users',
    description: 'Citizens actively reporting issues',
    icon: <Users className="w-8 h-8" />,
    value: '15,429',
    subValue: 'Growing daily'
  },
  {
    id: 7,
    type: 'stats',
    title: 'Avg Resolution Time',
    description: 'How quickly issues get resolved',
    icon: <Clock className="w-8 h-8" />,
    value: '48 hrs',
    subValue: 'Getting faster'
  },
  {
    id: 8,
    type: 'success',
    title: 'Pothole Fixed - Mumbai',
    description: 'Reported on March 15, Fixed on March 17. Thanks to citizen report, this dangerous pothole was repaired quickly.',
    icon: <CheckCircle className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7048?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
];

const InfoSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= infoCards.length ? 0 : prev + itemsPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, infoCards.length - itemsPerView) : Math.max(0, prev - itemsPerView)
    );
  };

  const visibleCards = infoCards.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
            How CivicConnect Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From reporting to resolution - see how your complaints help build better cities
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white shadow-lg hover:shadow-xl"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white shadow-lg hover:shadow-xl"
            disabled={currentIndex + itemsPerView >= infoCards.length}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
            {visibleCards.map((card, index) => (
              <Card key={card.id} className="hover-lift card-shadow group">
                <CardContent className="p-6">
                  {card.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      card.type === 'process' ? 'bg-primary/10 text-primary' :
                      card.type === 'stats' ? 'bg-civic-accent/10 text-civic-accent' :
                      'bg-success/10 text-success'
                    }`}>
                      {card.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                      
                      {card.type === 'stats' && card.value && (
                        <div className="mb-2">
                          <div className="text-2xl font-bold text-civic-accent">{card.value}</div>
                          <div className="text-sm text-muted-foreground">{card.subValue}</div>
                        </div>
                      )}
                      
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(infoCards.length / itemsPerView) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * itemsPerView)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerView) === i
                    ? 'bg-civic-accent scale-125'
                    : 'bg-muted hover:bg-civic-accent/50'
                }`}
                aria-label={`Go to slide group ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSlider;