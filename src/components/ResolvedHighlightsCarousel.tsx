import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResolvedItem {
  id: string;
  category: string;
  cityName: string;
  stateName: string;
  resolvedAt: string;
  photoUrl?: string;
  description: string;
}

interface ResolvedHighlightsCarouselProps {
  resolvedItems: ResolvedItem[];
}

const ResolvedHighlightsCarousel = ({ resolvedItems }: ResolvedHighlightsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (resolvedItems.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % resolvedItems.length);
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(timer);
  }, [resolvedItems.length]);

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'roads': '🛣️',
      'sewage': '🚰',
      'garbage': '🗑️',
      'street_lights': '💡',
      'water_supply': '💧',
      'parks': '🌳',
      'drainage': '⚡',
      'traffic': '🚦',
      'other': '⚠️'
    };
    return emojiMap[category] || '⚠️';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (resolvedItems.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No resolved issues to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">👏</span>
        <h3 className="text-2xl font-bold">Recently Fixed</h3>
        <CheckCircle2 className="w-6 h-6 text-success ml-auto" />
      </div>
      
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {resolvedItems.map((item) => (
            <div key={item.id} className="w-full flex-shrink-0 px-2">
              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Photo placeholder or actual photo */}
                    <div className="w-24 h-24 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-success/20">
                      {item.photoUrl ? (
                        <img 
                          src={item.photoUrl} 
                          alt="Resolved issue"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-3xl">
                          {getCategoryEmoji(item.category)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                          ✅ Fixed
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {item.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <h4 className="font-semibold mb-2 line-clamp-2">
                        {item.description}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{item.cityName}, {item.stateName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.resolvedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {resolvedItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-success w-6' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResolvedHighlightsCarousel;