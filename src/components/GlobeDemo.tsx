import { Globe } from "@/components/ui/globe"

const CITY_MARKERS = [
  // Indian Cities
  { location: [28.6139, 77.209] as [number, number], size: 0.08, name: "New Delhi" },
  { location: [19.076, 72.8777] as [number, number], size: 0.1, name: "Mumbai" },
  { location: [13.0827, 80.2707] as [number, number], size: 0.08, name: "Chennai" },
  { location: [22.5726, 88.3639] as [number, number], size: 0.08, name: "Kolkata" },
  { location: [12.9716, 77.5946] as [number, number], size: 0.08, name: "Bangalore" },
  { location: [17.385, 78.4867] as [number, number], size: 0.07, name: "Hyderabad" },
  { location: [23.0225, 72.5714] as [number, number], size: 0.07, name: "Ahmedabad" },
  { location: [18.5204, 73.8567] as [number, number], size: 0.06, name: "Pune" },
  { location: [26.9124, 75.7873] as [number, number], size: 0.05, name: "Jaipur" },
  { location: [21.1458, 79.0882] as [number, number], size: 0.05, name: "Nagpur" },
  
  // International Cities
  { location: [40.7128, -74.006] as [number, number], size: 0.1, name: "New York" },
  { location: [51.5074, -0.1278] as [number, number], size: 0.09, name: "London" },
  { location: [35.6762, 139.6503] as [number, number], size: 0.09, name: "Tokyo" },
  { location: [48.8566, 2.3522] as [number, number], size: 0.08, name: "Paris" },
  { location: [39.9042, 116.4074] as [number, number], size: 0.1, name: "Beijing" },
  { location: [-23.5505, -46.6333] as [number, number], size: 0.08, name: "São Paulo" },
  { location: [55.7558, 37.6173] as [number, number], size: 0.08, name: "Moscow" },
  { location: [25.2048, 55.2708] as [number, number], size: 0.07, name: "Dubai" },
  { location: [1.3521, 103.8198] as [number, number], size: 0.06, name: "Singapore" },
  { location: [-33.8688, 151.2093] as [number, number], size: 0.07, name: "Sydney" },
  { location: [37.7749, -122.4194] as [number, number], size: 0.08, name: "San Francisco" },
  { location: [52.52, 13.405] as [number, number], size: 0.07, name: "Berlin" },
  { location: [41.9028, 12.4964] as [number, number], size: 0.06, name: "Rome" },
  { location: [40.4168, -3.7038] as [number, number], size: 0.07, name: "Madrid" },
  { location: [59.9311, 10.7570] as [number, number], size: 0.05, name: "Oslo" },
  { location: [45.4642, 9.1900] as [number, number], size: 0.06, name: "Milan" },
  { location: [50.1109, 8.6821] as [number, number], size: 0.06, name: "Frankfurt" },
  { location: [47.3769, 8.5417] as [number, number], size: 0.05, name: "Zurich" },
  { location: [60.1699, 24.9384] as [number, number], size: 0.05, name: "Helsinki" },
  { location: [55.6761, 12.5683] as [number, number], size: 0.05, name: "Copenhagen" },
  { location: [59.3293, 18.0686] as [number, number], size: 0.05, name: "Stockholm" },
  { location: [52.3676, 4.9041] as [number, number], size: 0.06, name: "Amsterdam" },
  { location: [50.8503, 4.3517] as [number, number], size: 0.05, name: "Brussels" },
  { location: [38.7223, -9.1393] as [number, number], size: 0.05, name: "Lisbon" }
];

export function GlobeDemo() {
  return (
    <div className="relative w-full h-[700px] flex items-center justify-center overflow-hidden">
      {/* City Labels */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-h-[600px] overflow-y-auto">
        <h4 className="font-semibold mb-2 text-civic">Cities Worldwide ({CITY_MARKERS.length})</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {CITY_MARKERS.map((city, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: `hsl(${(city.size * 1000) % 360}, 70%, 60%)` }}
              ></div>
              <span>{city.name}</span>
            </div>
          ))}
        </div>
      </div>

      <Globe 
        className="w-full h-full max-w-none"
        config={{
          width: 800,
          height: 800,
          onRender: () => {},
          devicePixelRatio: 2,
          phi: 0,
          theta: 0.3,
          dark: 0,
          diffuse: 0.4,
          mapSamples: 16000,
          mapBrightness: 1.2,
          baseColor: [0.1, 0.1, 0.1],
          markerColor: [251 / 255, 100 / 255, 21 / 255],
          glowColor: [0.2, 0.4, 1],
          markers: CITY_MARKERS,
        }}
      />
      
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.1),rgba(255,255,255,0))]" />
    </div>
  )
}