import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CheckCircle } from 'lucide-react';

const ResolvedHighlightsCarousel = () => {
  // Sample data - will connect to Supabase later
  const resolvedIssues = [
    {
      id: 1,
      location: "Indore",
      description: "Road repaired in 3 days",
      beforeImage: "/placeholder.svg?height=200&width=300&text=Before",
      afterImage: "/placeholder.svg?height=200&width=300&text=After",
      resolvedDate: "2024-01-15"
    },
    {
      id: 2,
      location: "Mumbai",
      description: "Sewage issue fixed in 2 days",
      beforeImage: "/placeholder.svg?height=200&width=300&text=Before",
      afterImage: "/placeholder.svg?height=200&width=300&text=After",
      resolvedDate: "2024-01-14"
    },
    {
      id: 3,
      location: "Delhi",
      description: "Street lights restored overnight",
      beforeImage: "/placeholder.svg?height=200&width=300&text=Before",
      afterImage: "/placeholder.svg?height=200&width=300&text=After",
      resolvedDate: "2024-01-13"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" />
          👏 Recently Fixed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {resolvedIssues.map((issue) => (
              <CarouselItem key={issue.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Before/After Images */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <img
                            src={issue.beforeImage}
                            alt="Before"
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <span className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Before
                          </span>
                        </div>
                        <div className="relative">
                          <img
                            src={issue.afterImage}
                            alt="After"
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            After
                          </span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div>
                        <h4 className="font-semibold text-sm">{issue.location}</h4>
                        <p className="text-xs text-muted-foreground">{issue.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default ResolvedHighlightsCarousel;