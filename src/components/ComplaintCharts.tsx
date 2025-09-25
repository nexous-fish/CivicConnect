import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

const ComplaintCharts: React.FC = memo(() => {
  // Sample data for charts with earthy colors
  const categoryData = [
    { name: 'Roads', value: 156, color: 'hsl(var(--danger))', icon: '🛣️' },
    { name: 'Sewage', value: 89, color: 'hsl(var(--warning))', icon: '💧' },
    { name: 'Sanitation', value: 134, color: 'hsl(var(--success))', icon: '🧹' },
    { name: 'Other', value: 45, color: 'hsl(var(--primary))', icon: '⚙️' },
  ];

  const locationData = [
    { name: 'Mumbai', value: 125, color: 'hsl(var(--primary))' },
    { name: 'Delhi', value: 98, color: 'hsl(var(--civic))' },
    { name: 'Bangalore', value: 87, color: 'hsl(var(--success))' },
    { name: 'Hyderabad', value: 64, color: 'hsl(var(--warning))' },
    { name: 'Chennai', value: 50, color: 'hsl(var(--danger))' },
  ];

  const trendData = [
    { month: 'Jan', complaints: 45 },
    { month: 'Feb', complaints: 52 },
    { month: 'Mar', complaints: 48 },
    { month: 'Apr', complaints: 61 },
    { month: 'May', complaints: 55 },
    { month: 'Jun', complaints: 67 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Category Bar Chart */}
        <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-white to-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              Complaints by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  fontSize={12} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  fontSize={12} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px -4px hsl(var(--primary) / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))" 
                  radius={[6, 6, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Donut Chart */}
        <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-white to-civic/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-civic/10">
                <PieChartIcon className="h-4 w-4 text-civic" />
              </div>
              Distribution by City
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={11}
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px -4px hsl(var(--primary) / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Area Chart */}
        <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-white to-success/5 lg:col-span-2 xl:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  fontSize={12} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  fontSize={12} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px -4px hsl(var(--primary) / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="complaints"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

ComplaintCharts.displayName = 'ComplaintCharts';

export default ComplaintCharts;