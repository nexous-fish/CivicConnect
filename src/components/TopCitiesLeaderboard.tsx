import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

const TopCitiesLeaderboard = () => {
  // Sample data - will connect to Supabase later
  const topCities = [
    { name: "Mumbai", count: 230 },
    { name: "Delhi", count: 180 },
    { name: "Bangalore", count: 140 }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Highest Complaints This Week
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topCities.map((city, index) => (
          <div 
            key={city.name}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                index === 0 ? 'bg-red-500' : 
                index === 1 ? 'bg-orange-500' : 
                'bg-yellow-500'
              }`}>
                {index + 1}
              </div>
              <span className="font-medium">{city.name}</span>
            </div>
            <span className="font-bold text-lg">{city.count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopCitiesLeaderboard;