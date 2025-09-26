import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Medal, User } from 'lucide-react';

const ReporterOfTheWeek = () => {
  // Sample data - will connect to Supabase later
  const topReporter = {
    name: "Rajesh Kumar",
    reportsCount: 12,
    avatar: "/placeholder.svg?height=60&width=60&text=RK"
  };

  return (
    <Card className="w-full bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Medal className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 z-10" />
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Medal className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Top Citizen Reporter
              </span>
            </div>
            <h3 className="font-bold text-lg">{topReporter.name}</h3>
            <p className="text-sm text-muted-foreground">
              {topReporter.reportsCount} reports this week
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{topReporter.reportsCount}</div>
            <div className="text-xs text-muted-foreground">Reports</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReporterOfTheWeek;