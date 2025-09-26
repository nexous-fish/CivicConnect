import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, MapPin, Users } from 'lucide-react';

// Sample analytics data
const complaintsByCategory = [
  { name: 'Road Issues', value: 456, color: '#ef4444' },
  { name: 'Sewage Problems', value: 321, color: '#f59e0b' },
  { name: 'Sanitation Issues', value: 457, color: '#10b981' },
  { name: 'Street Lights', value: 234, color: '#3b82f6' },
  { name: 'Water Supply', value: 189, color: '#8b5cf6' }
];

const monthlyTrends = [
  { month: 'Jan', complaints: 324, resolved: 298 },
  { month: 'Feb', complaints: 278, resolved: 301 },
  { month: 'Mar', complaints: 456, resolved: 389 },
  { month: 'Apr', complaints: 392, resolved: 421 },
  { month: 'May', complaints: 534, resolved: 478 },
  { month: 'Jun', complaints: 421, resolved: 467 }
];

const topCities = [
  { city: 'Mumbai', complaints: 892, resolved: 756 },
  { city: 'Delhi', complaints: 743, resolved: 681 },
  { city: 'Bengaluru', complaints: 651, resolved: 598 },
  { city: 'Chennai', complaints: 534, resolved: 489 },
  { city: 'Kolkata', complaints: 467, resolved: 421 }
];

const resolutionStats = [
  { status: 'Resolved', count: 2847, percentage: 68.5 },
  { status: 'In Progress', count: 847, percentage: 20.4 },
  { status: 'Pending', count: 461, percentage: 11.1 }
];

const AnalyticsSection = () => {
  return (
    <div id="analytics-section" className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Analytics Dashboard</h2>
          <p className="text-muted-foreground text-lg">Real-time insights into civic complaint management across India</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5 text-civic" />
                <span className="text-2xl font-bold">4,155</span>
              </div>
              <p className="text-xs text-success">+12.3% from last month</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-2xl font-bold">2,847</span>
              </div>
              <p className="text-xs text-success">68.5% resolution rate</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Resolution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                <span className="text-2xl font-bold">48hrs</span>
              </div>
              <p className="text-xs text-success">-15% improvement</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">34</span>
              </div>
              <p className="text-xs text-muted-foreground">Across 12 states</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Complaints by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={complaintsByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {complaintsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Complaint Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="complaints" stroke="#ef4444" strokeWidth={2} name="Complaints" />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Cities */}
          <Card>
            <CardHeader>
              <CardTitle>Top Cities by Complaint Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCities.map((city, index) => (
                  <div key={city.city} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                      <span className="font-medium">{city.city}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{city.complaints}</div>
                      <div className="text-sm text-success">{city.resolved} resolved</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resolution Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Resolution Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={resolutionStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;