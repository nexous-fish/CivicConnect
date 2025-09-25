import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface CityData {
  id: string;
  name: string;
  complaints: number;
  topCategory: string;
  x: number; // Percentage position
  y: number; // Percentage position
  level: 'low' | 'medium' | 'high';
}

const mockCityData: CityData[] = [
  { id: '1', name: 'Mumbai', complaints: 234, topCategory: 'Roads', x: 18, y: 45, level: 'high' },
  { id: '2', name: 'Delhi', complaints: 189, topCategory: 'Sanitation', x: 28, y: 25, level: 'high' },
  { id: '3', name: 'Bangalore', complaints: 156, topCategory: 'Sewage', x: 25, y: 65, level: 'medium' },
  { id: '4', name: 'Chennai', complaints: 123, topCategory: 'Roads', x: 35, y: 70, level: 'medium' },
  { id: '5', name: 'Kolkata', complaints: 98, topCategory: 'Sanitation', x: 45, y: 40, level: 'medium' },
  { id: '6', name: 'Hyderabad', complaints: 87, topCategory: 'Sewage', x: 32, y: 58, level: 'low' },
  { id: '7', name: 'Pune', complaints: 76, topCategory: 'Roads', x: 22, y: 48, level: 'low' },
  { id: '8', name: 'Ahmedabad', complaints: 65, topCategory: 'Sanitation', x: 15, y: 35, level: 'low' },
];

const IndiaMap: React.FC = () => {
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const getMarkerClass = (level: string) => {
    switch (level) {
      case 'low': return 'map-marker low';
      case 'medium': return 'map-marker medium';
      case 'high': return 'map-marker high';
      default: return 'map-marker';
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl overflow-hidden">
      {/* Map Background with India Outline */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
          onMouseMove={handleMouseMove}
        >
          {/* Simplified India Map Outline */}
          <path
            d="M80 80 L120 60 L160 50 L200 55 L240 70 L280 80 L300 100 L320 130 L315 160 L300 190 L280 220 L250 240 L200 250 L150 245 L100 230 L80 200 L70 170 L75 140 L80 110 Z"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
            className="transition-all duration-300"
          />
          
          {/* City Markers */}
          {mockCityData.map((city) => (
            <g key={city.id}>
              <circle
                cx={city.x * 4} // Scale to SVG coordinates
                cy={city.y * 3}
                r={8}
                className={getMarkerClass(city.level)}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
              />
              <text
                x={city.x * 4}
                y={city.y * 3 + 20}
                textAnchor="middle"
                className="text-xs font-medium fill-foreground"
              >
                {city.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredCity && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 80,
          }}
        >
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
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <h4 className="text-xs font-semibold mb-2">Complaint Levels</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-xs">Low (0-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span className="text-xs">Medium (100-200)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger"></div>
                <span className="text-xs">High (200+)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndiaMap;