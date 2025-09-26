import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from 'lucide-react';

interface TopCity {
  cityName: string;
  stateName: string;
  count: number;
}

interface TopCitiesLeaderboardProps {
  cities: TopCity[];
}

const TopCitiesLeaderboard = ({ cities }: TopCitiesLeaderboardProps) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `${index + 1}`;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return "text-warning";
      case 1: return "text-muted-foreground";
      case 2: return "text-orange-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-xl">⚠️</span>
          Highest Complaints This Week
          <TrendingUp className="w-5 h-5 text-civic ml-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {cities.map((city, index) => (
          <div 
            key={`${city.cityName}-${city.stateName}`}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
              index === 0 
                ? 'bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20' 
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`text-xl font-bold min-w-[2rem] text-center ${getRankColor(index)}`}>
                {getRankIcon(index)}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-civic" />
                <div>
                  <div className="font-semibold text-foreground">
                    {city.cityName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {city.stateName}
                  </div>
                </div>
              </div>
            </div>
            <Badge 
              variant={index === 0 ? "default" : "secondary"}
              className={`font-bold ${index === 0 ? 'bg-warning text-warning-foreground' : ''}`}
            >
              {city.count}
            </Badge>
          </div>
        ))}
        {cities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopCitiesLeaderboard;