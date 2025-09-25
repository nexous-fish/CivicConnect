import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  MapPin,
  LogOut,
  Filter,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Complaint {
  id: string;
  citizen_name: string;
  citizen_phone: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
  resolved_at?: string;
  states: { name: string };
  cities: { name: string };
  nagars: { name: string };
  assigned_contractor_id?: string;
  contractors?: { name: string };
}

interface Contractor {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export default function OfficerDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    delayed: 0
  });
  const [filter, setFilter] = useState({ status: 'all', category: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchComplaints();
    fetchContractors();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/officer-auth');
      return;
    }
  };

  const fetchComplaints = async () => {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        states:state_id(name),
        cities:city_id(name),
        nagars:nagar_id(name),
        contractors:assigned_contractor_id(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching complaints",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setComplaints(data || []);
    
    // Calculate stats
    const total = data?.length || 0;
    const pending = data?.filter(c => c.status === 'pending').length || 0;
    const resolved = data?.filter(c => c.status === 'resolved').length || 0;
    const delayed = data?.filter(c => {
      const daysSinceCreated = Math.floor((Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceCreated > 7 && c.status !== 'resolved';
    }).length || 0;

    setStats({ total, pending, resolved, delayed });
  };

  const fetchContractors = async () => {
    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: "Error fetching contractors",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setContractors(data || []);
  };

  const handleAssignContractor = async (complaintId: string, contractorId: string) => {
    const { error } = await supabase
      .from('complaints')
      .update({
        assigned_contractor_id: contractorId,
        status: 'assigned',
        assigned_at: new Date().toISOString()
      })
      .eq('id', complaintId);

    if (error) {
      toast({
        title: "Assignment failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Contractor assigned successfully",
        description: "The complaint has been assigned to the contractor.",
      });
      fetchComplaints();
    }
  };

  const handleStatusUpdate = async (complaintId: string, status: string) => {
    const updateData: any = { status };
    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', complaintId);

    if (error) {
      toast({
        title: "Status update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status updated successfully",
        description: `Complaint marked as ${status}.`,
      });
      fetchComplaints();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Chart data
  const categoryData = [
    { name: 'Roads', value: complaints.filter(c => c.category === 'roads').length },
    { name: 'Sewage', value: complaints.filter(c => c.category === 'sewage').length },
    { name: 'Sanitation', value: complaints.filter(c => c.category === 'sanitation').length },
  ];

  const statusData = [
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Assigned', value: complaints.filter(c => c.status === 'assigned').length, color: '#3b82f6' },
    { name: 'In Progress', value: complaints.filter(c => c.status === 'in_progress').length, color: '#8b5cf6' },
    { name: 'Resolved', value: stats.resolved, color: '#10b981' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filter.status === 'all' || complaint.status === filter.status;
    const matchesCategory = filter.category === 'all' || complaint.category === filter.category;
    const matchesSearch = searchTerm === '' || 
      complaint.citizen_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.includes(searchTerm);
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      assigned: { label: 'Assigned', className: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'In Progress', className: 'bg-purple-100 text-purple-800' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
      delayed: { label: 'Delayed', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Municipal Officer Dashboard</h1>
              <p className="text-muted-foreground">Manage civic complaints and track resolutions</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delayed</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.delayed}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complaints by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Complaints</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                
                <Select value={filter.status} onValueChange={(value) => setFilter({...filter, status: value})}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filter.category} onValueChange={(value) => setFilter({...filter, category: value})}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="roads">Roads</SelectItem>
                    <SelectItem value="sewage">Sewage</SelectItem>
                    <SelectItem value="sanitation">Sanitation</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Complaints Table */}
            <Card>
              <CardHeader>
                <CardTitle>Complaints ({filteredComplaints.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Citizen</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-mono text-xs">
                          {complaint.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{complaint.citizen_name}</div>
                            <div className="text-sm text-muted-foreground">{complaint.citizen_phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {complaint.nagars?.name}, {complaint.cities?.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {complaint.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(complaint.status)}
                        </TableCell>
                        <TableCell>
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {complaint.status === 'pending' && (
                              <Select onValueChange={(contractorId) => handleAssignContractor(complaint.id, contractorId)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Assign" />
                                </SelectTrigger>
                                <SelectContent>
                                  {contractors.map((contractor) => (
                                    <SelectItem key={contractor.id} value={contractor.id}>
                                      {contractor.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            
                            {complaint.status !== 'resolved' && (
                              <Select onValueChange={(status) => handleStatusUpdate(complaint.id, status)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Update" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Areas with Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      complaints.reduce((acc, complaint) => {
                        const area = complaint.nagars?.name || 'Unknown';
                        acc[area] = (acc[area] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([area, count]) => (
                      <div key={area} className="flex justify-between items-center">
                        <span className="font-medium">{area}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Resolution Time</CardTitle>
                  <CardDescription>Days taken to resolve complaints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {Math.round(
                        complaints
                          .filter(c => c.status === 'resolved' && c.resolved_at)
                          .reduce((acc, c) => {
                            const days = Math.floor(
                              (new Date(c.resolved_at!).getTime() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24)
                            );
                            return acc + days;
                          }, 0) / complaints.filter(c => c.status === 'resolved').length || 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">days average</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}