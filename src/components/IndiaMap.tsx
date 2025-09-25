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

const mockStateData: CityData[] = [
  { id: '1', name: 'Maharashtra', complaints: 1234, topCategory: 'Roads', x: 18, y: 45, level: 'high' },
  { id: '2', name: 'Delhi', complaints: 890, topCategory: 'Sanitation', x: 28, y: 25, level: 'high' },
  { id: '3', name: 'Karnataka', complaints: 756, topCategory: 'Sewage', x: 25, y: 65, level: 'high' },
  { id: '4', name: 'Tamil Nadu', complaints: 623, topCategory: 'Roads', x: 35, y: 70, level: 'medium' },
  { id: '5', name: 'West Bengal', complaints: 498, topCategory: 'Sanitation', x: 45, y: 40, level: 'medium' },
  { id: '6', name: 'Telangana', complaints: 387, topCategory: 'Sewage', x: 32, y: 58, level: 'medium' },
  { id: '7', name: 'Gujarat', complaints: 276, topCategory: 'Roads', x: 15, y: 35, level: 'low' },
  { id: '8', name: 'Rajasthan', complaints: 234, topCategory: 'Sanitation', x: 20, y: 30, level: 'low' },
  { id: '9', name: 'Uttar Pradesh', complaints: 567, topCategory: 'Roads', x: 32, y: 28, level: 'medium' },
  { id: '10', name: 'Madhya Pradesh', complaints: 345, topCategory: 'Sewage', x: 25, y: 38, level: 'medium' },
  { id: '11', name: 'Chhattisgarh', complaints: 156, topCategory: 'Sanitation', x: 35, y: 42, level: 'low' },
  { id: '12', name: 'Odisha', complaints: 234, topCategory: 'Roads', x: 42, y: 48, level: 'low' },
];

const IndiaMap: React.FC = () => {
  const [hoveredState, setHoveredState] = useState<CityData | null>(null);
  const [selectedState, setSelectedState] = useState<CityData | null>(null);
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

  const getMarkerCount = (complaints: number) => {
    if (complaints >= 1000) return Math.floor(complaints / 100);
    if (complaints >= 100) return Math.floor(complaints / 10);
    return complaints;
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-secondary/20 to-background rounded-2xl overflow-hidden">
      {/* Map Background with Detailed India Outline */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 500 400"
          className="w-full h-full"
          onMouseMove={handleMouseMove}
        >
          {/* Detailed India Map with States */}
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(var(--civic-accent))" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Main India Outline */}
          <path
            d="M 100 100 L 140 80 L 180 70 L 220 75 L 260 85 L 300 95 L 340 110 L 370 130 L 385 160 L 380 190 L 365 220 L 340 250 L 300 275 L 250 285 L 200 280 L 150 270 L 110 250 L 85 220 L 75 190 L 80 160 L 90 130 L 100 100 Z"
            fill="url(#mapGradient)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            className="map-state"
          />
          
          {/* State Boundaries (Simplified) - Maharashtra */}
          <path
            d="M 150 170 L 180 160 L 200 180 L 185 200 L 160 195 Z"
            fill="hsl(var(--primary))"
            fillOpacity="0.1"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            className="map-state"
          />
          
          {/* State Boundaries - Karnataka */}
          <path
            d="M 160 200 L 190 195 L 205 220 L 180 225 L 165 210 Z"
            fill="hsl(var(--primary))"
            fillOpacity="0.1"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            className="map-state"
          />
          
          {/* State Boundaries - Gujarat */}
          <path
            d="M 120 130 L 150 125 L 160 150 L 140 155 L 125 145 Z"
            fill="hsl(var(--primary))"
            fillOpacity="0.1"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            className="map-state"
          />
          
          {/* State Markers */}
          {mockStateData.map((state) => (
            <g key={state.id}>
              <circle
                cx={state.x * 5} // Scale to SVG coordinates
                cy={state.y * 4}
                r={12}
                className={getMarkerClass(state.level)}
                onMouseEnter={() => setHoveredState(state)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => setSelectedState(selectedState?.id === state.id ? null : state)}
              >
                <animate
                  attributeName="r"
                  values="12;14;12"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x={state.x * 5}
                y={state.y * 4}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xs font-bold fill-white pointer-events-none"
              >
                {getMarkerCount(state.complaints)}
              </text>
              <text
                x={state.x * 5}
                y={state.y * 4 + 25}
                textAnchor="middle"
                className="text-xs font-medium fill-foreground"
              >
                {state.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredState && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 80,
          }}
        >
          <Card className="card-shadow border-2 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg text-primary mb-2">{hoveredState.name}</h3>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-civic-accent">
                  {hoveredState.complaints} Total Complaints
                </p>
                <p className="text-xs text-muted-foreground">
                  Most Common: {hoveredState.topCategory}
                </p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  hoveredState.level === 'high' ? 'bg-danger/10 text-danger' :
                  hoveredState.level === 'medium' ? 'bg-warning/10 text-warning' :
                  'bg-success/10 text-success'
                }`}>
                  {hoveredState.level.toUpperCase()} Priority
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected State Details */}
      {selectedState && (
        <div className="absolute top-4 right-4 max-w-sm">
          <Card className="card-shadow bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-xl text-primary">{selectedState.name}</h3>
                <button
                  onClick={() => setSelectedState(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-civic-accent">{selectedState.complaints}</p>
                  <p className="text-sm text-muted-foreground">Total Complaints Filed</p>
                </div>
                <div>
                  <p className="font-semibold text-primary">{selectedState.topCategory}</p>
                  <p className="text-sm text-muted-foreground">Most Reported Issue</p>
                </div>
                <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold ${
                  selectedState.level === 'high' ? 'bg-danger/10 text-danger' :
                  selectedState.level === 'medium' ? 'bg-warning/10 text-warning' :
                  'bg-success/10 text-success'
                }`}>
                  {selectedState.level.toUpperCase()} Priority Region
                </div>
              </div>
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