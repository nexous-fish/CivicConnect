import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import indiaMapImage from "@/assets/india-map.png";
interface CityData {
  id: string;
  name: string;
  complaints: number;
  topCategory: string;
  x: number; // Percentage position
  y: number; // Percentage position
  level: 'low' | 'medium' | 'high';
}
const mockCityData: CityData[] = [{
  id: '1',
  name: 'Mumbai',
  complaints: 234,
  topCategory: 'Roads',
  x: 18,
  y: 45,
  level: 'high'
}, {
  id: '2',
  name: 'Delhi',
  complaints: 189,
  topCategory: 'Sanitation',
  x: 28,
  y: 25,
  level: 'high'
}, {
  id: '3',
  name: 'Bangalore',
  complaints: 156,
  topCategory: 'Sewage',
  x: 25,
  y: 65,
  level: 'medium'
}, {
  id: '4',
  name: 'Chennai',
  complaints: 123,
  topCategory: 'Roads',
  x: 35,
  y: 70,
  level: 'medium'
}, {
  id: '5',
  name: 'Kolkata',
  complaints: 98,
  topCategory: 'Sanitation',
  x: 45,
  y: 40,
  level: 'medium'
}, {
  id: '6',
  name: 'Hyderabad',
  complaints: 87,
  topCategory: 'Sewage',
  x: 32,
  y: 58,
  level: 'low'
}, {
  id: '7',
  name: 'Pune',
  complaints: 76,
  topCategory: 'Roads',
  x: 22,
  y: 48,
  level: 'low'
}, {
  id: '8',
  name: 'Ahmedabad',
  complaints: 65,
  topCategory: 'Sanitation',
  x: 15,
  y: 35,
  level: 'low'
}];
const IndiaMap: React.FC = () => {
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    });
  };
  const getMarkerClass = (level: string) => {
    switch (level) {
      case 'low':
        return 'map-marker low';
      case 'medium':
        return 'map-marker medium';
      case 'high':
        return 'map-marker high';
      default:
        return 'map-marker';
    }
  };
  return <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl overflow-hidden">
      {/* Map Background Image */}
      

      {/* Tooltip */}
      {hoveredCity && <div className="fixed z-50 pointer-events-none" style={{
      left: mousePosition.x + 10,
      top: mousePosition.y - 80
    }}>
          <Card className="card-shadow border-2">
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm">{hoveredCity.name}</h3>
              <p className="text-xs text-muted-foreground">
                {hoveredCity.complaints} complaints
              </p>
              <p className="text-xs font-medium">
                Top: {hoveredCity.topCategory}
              </p>
            </CardContent>
          </Card>
        </div>}

      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <Card className="bg-white/90 backdrop-blur-sm">
          
        </Card>
      </div>
    </div>;
};
export default IndiaMap;