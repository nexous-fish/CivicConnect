import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

// Fix for default marker icon in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(initialLocation ? { ...initialLocation, address: '' } : null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Default to India coordinates if no initial location
    const lat = initialLocation?.latitude || 20.5937;
    const lng = initialLocation?.longitude || 78.9629;

    const leafletMap = L.map(mapContainer.current).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(leafletMap);

    // Add initial marker if location exists
    if (initialLocation) {
      const m = L.marker([lat, lng])
        .addTo(leafletMap)
        .bindPopup('Selected Location')
        .openPopup();
      setMarker(m);
    }

    // Handle map clicks
    leafletMap.on('click', (e: L.LeafletMouseEvent) => {
      handleMapClick(e.latlng.lat, e.latlng.lng, leafletMap);
    });

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, []);

  const handleMapClick = async (lat: number, lng: number, mapInstance?: L.Map) => {
    setLoading(true);
    try {
      // Remove old marker
      if (marker) {
        marker.remove();
      }

      // Add new marker
      const newMarker = L.marker([lat, lng])
        .addTo(mapInstance || map!)
        .bindPopup('Selected Location')
        .openPopup();
      setMarker(newMarker);

      // Try to get address using reverse geocoding (OpenStreetMap Nominatim)
      let address = '';
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await response.json();
        address = data.address?.road || data.address?.village || data.address?.suburb || 
                 data.address?.city || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      } catch (error) {
        console.log('Reverse geocoding failed, using coordinates');
        address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }

      setSelectedLocation({
        latitude: lat,
        longitude: lng,
        address: address,
      });

      toast({
        title: "Location Selected",
        description: `Address: ${address}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select location",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (map) {
            map.setView([latitude, longitude], 15);
            handleMapClick(latitude, longitude, map);
          }
          setLocating(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          toast({
            title: "Location Permission Denied",
            description: "Manually select location on the map instead. You can still click on the map to choose a location.",
          });
          setLocating(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support GPS. Manually select location on the map.",
      });
      setLocating(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      toast({
        title: "Location Confirmed",
        description: "Location has been added to your complaint.",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Select Location on Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Container */}
        <div
          ref={mapContainer}
          className="w-full h-80 rounded-lg border border-slate-200 shadow-md"
        />

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={locating || loading}
            variant="outline"
            className="flex-1"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {locating ? 'Getting Location...' : 'Use My Location'}
          </Button>
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Selected Location</p>
                <p className="text-xs text-green-700 mt-1">{selectedLocation.address}</p>
                <p className="text-xs text-green-600 mt-2">
                  📍 {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </p>
              </div>
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            </div>

            <Button
              type="button"
              onClick={handleConfirm}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              Confirm This Location
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            💡 <strong>How to use:</strong> Click on the map to select a location, or use the "Use My Location" button to get your current GPS position. The address will be fetched automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationPicker;
