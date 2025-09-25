import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ComplaintStatsProps {
  stats: {
    total: number;
    resolved: number;
    pending: number;
    delayed: number;
  };
}

const ComplaintStats: React.FC<ComplaintStatsProps> = memo(({ stats }) => {
  const cards = [
    {
      title: "Total Complaints",
      value: stats.total,
      description: "All time",
      icon: TrendingUp,
      color: "text-foreground",
      bgGradient: "from-primary/5 to-primary/10",
      iconColor: "text-primary"
    },
    {
      title: "Resolved",
      value: stats.resolved,
      description: `${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% completion rate`,
      icon: CheckCircle,
      color: "text-success",
      bgGradient: "from-success/5 to-success/10",
      iconColor: "text-success"
    },
    {
      title: "Pending",
      value: stats.pending,
      description: "Awaiting action",
      icon: Clock,
      color: "text-warning",
      bgGradient: "from-warning/5 to-warning/10",
      iconColor: "text-warning"
    },
    {
      title: "Delayed",
      value: stats.delayed,
      description: "Over 7 days",
      icon: AlertTriangle,
      color: "text-danger",
      bgGradient: "from-danger/5 to-danger/10",
      iconColor: "text-danger"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card 
          key={card.title}
          className={`hover-lift border-0 shadow-lg bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-white/80 ${card.iconColor}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-3xl font-bold ${card.color} mb-1`}>
              {card.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

ComplaintStats.displayName = 'ComplaintStats';

export default ComplaintStats;