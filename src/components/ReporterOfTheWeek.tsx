import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, User, Phone } from 'lucide-react';

interface TopReporter {
  name: string;
  phone: string;
  weeklyCount: number;
}

interface ReporterOfTheWeekProps {
  reporter?: TopReporter;
}

const ReporterOfTheWeek = ({ reporter }: ReporterOfTheWeekProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const maskPhone = (phone: string) => {
    if (phone.length < 4) return phone;
    return phone.slice(0, -4) + '****';
  };

  if (!reporter) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-xl">🏅</span>
            Reporter of the Week
            <Trophy className="w-5 h-5 text-warning ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-warning/10 via-warning/5 to-background border-warning/20 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-xl">🏅</span>
          Reporter of the Week
          <Trophy className="w-5 h-5 text-warning ml-auto animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {/* Profile Avatar */}
        <div className="relative mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-warning to-warning-foreground rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg">
            {getInitials(reporter.name)}
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center">
            <Trophy className="w-4 h-4 text-warning-foreground" />
          </div>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-foreground mb-2">
          {reporter.name}
        </h3>

        {/* Phone (masked) */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
          <Phone className="w-4 h-4" />
          <span>{maskPhone(reporter.phone)}</span>
        </div>

        {/* Badge */}
        <Badge className="bg-warning text-warning-foreground font-bold text-lg px-4 py-2">
          {reporter.weeklyCount} Reports This Week
        </Badge>

        {/* Achievement message */}
        <p className="text-sm text-muted-foreground mt-4 font-medium">
          🎉 Thank you for making your community better!
        </p>
      </CardContent>
    </Card>
  );
};

export default ReporterOfTheWeek;