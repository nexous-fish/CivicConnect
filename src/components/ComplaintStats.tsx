import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral',
  color 
}) => (
  <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-slate-900 mb-1">
        {value.toLocaleString()}
      </div>
      {change && (
        <p className={`text-xs flex items-center ${
          changeType === 'positive' ? 'text-green-600' : 
          changeType === 'negative' ? 'text-red-600' : 'text-slate-500'
        }`}>
          <TrendingUp className="w-3 h-3 mr-1" />
          {change}
        </p>
      )}
    </CardContent>
  </Card>
);

interface ComplaintStatsProps {
  stats: {
    total: number;
    resolved: number;
    pending: number;
    delayed: number;
  };
}

const ComplaintStats: React.FC<ComplaintStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Complaints"
        value={stats.total}
        icon={<FileText className="w-5 h-5 text-blue-600" />}
        change="+12% from last month"
        changeType="positive"
        color="bg-blue-50"
      />
      
      <StatsCard
        title="Resolved"
        value={stats.resolved}
        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        change="+8% resolution rate"
        changeType="positive"
        color="bg-green-50"
      />
      
      <StatsCard
        title="Pending"
        value={stats.pending}
        icon={<Clock className="w-5 h-5 text-yellow-600" />}
        change="4% decrease"
        changeType="positive"
        color="bg-yellow-50"
      />
      
      <StatsCard
        title="Delayed"
        value={stats.delayed}
        icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
        change="2% increase"
        changeType="negative"
        color="bg-red-50"
      />
    </div>
  );
};

export default ComplaintStats;