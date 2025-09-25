import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Sample data - replace with real data from Supabase
const categoryData = [
  { name: 'Roads', value: 45, count: 145 },
  { name: 'Sewage', value: 30, count: 98 },
  { name: 'Sanitation', value: 20, count: 67 },
  { name: 'Other', value: 5, count: 18 },
];

const locationData = [
  { name: 'Subhas Nagar', complaints: 32 },
  { name: 'Central Avenue', complaints: 28 },
  { name: 'Padmanapur', complaints: 24 },
  { name: 'Sec 2', complaints: 19 },
  { name: 'Kolihapuri', complaints: 17 },
  { name: 'Sec 4', complaints: 15 },
];

const trendData = [
  { date: '2024-01', complaints: 45 },
  { date: '2024-02', complaints: 52 },
  { date: '2024-03', complaints: 38 },
  { date: '2024-04', complaints: 67 },
  { date: '2024-05', complaints: 73 },
  { date: '2024-06', complaints: 56 },
  { date: '2024-07', complaints: 84 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const ComplaintCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {/* Category Bar Chart */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-blue-600" />
            Complaints by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [value, 'Complaints']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribution Pie Chart */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-green-600" />
            Distribution by Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, 'Complaints']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trend Line Chart */}
      <Card className="lg:col-span-2 xl:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
            <LineChart className="w-5 h-5 mr-2 text-purple-600" />
            Monthly Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [value, 'Complaints']}
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="complaints" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintCharts;