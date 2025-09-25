import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, UserPlus, MapPin, Search, Filter, Phone, User } from 'lucide-react';

const ComplaintTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sample complaint data with enhanced info
  const complaints = [
    {
      id: 'CMP-001',
      category: 'Roads',
      categoryIcon: '🛣️',
      location: 'Andheri West, Mumbai, Maharashtra',
      citizen: 'Rahul Sharma',  
      phone: '+91 98765 43210',
      daysPending: 3,
      status: 'pending',
      contractor: 'ABC Infrastructure',
      priority: 'medium'
    },
    {
      id: 'CMP-002',
      category: 'Sewage',
      categoryIcon: '💧',
      location: 'Connaught Place, Delhi, Delhi',
      citizen: 'Priya Patel',
      phone: '+91 87654 32109',
      daysPending: 0,
      status: 'resolved',
      contractor: 'XYZ Contractors',
      priority: 'high'
    },
    {
      id: 'CMP-003',
      category: 'Sanitation',
      categoryIcon: '🧹',
      location: 'Koramangala, Bangalore, Karnataka',
      citizen: 'Arjun Kumar',
      phone: '+91 76543 21098',
      daysPending: 12,
      status: 'delayed',
      contractor: 'Clean City Corp',
      priority: 'high'
    },
    {
      id: 'CMP-004',
      category: 'Other',
      categoryIcon: '⚙️',
      location: 'T. Nagar, Chennai, Tamil Nadu',
      citizen: 'Meera Nair',
      phone: '+91 65432 10987',
      daysPending: 5,
      status: 'pending',
      contractor: 'Not Assigned',
      priority: 'low'
    },
    {
      id: 'CMP-005',
      category: 'Roads',
      categoryIcon: '🛣️',
      location: 'Banjara Hills, Hyderabad, Telangana',
      citizen: 'Vikram Singh',
      phone: '+91 54321 09876',
      daysPending: 1,
      status: 'resolved',
      contractor: 'Road Masters Ltd',
      priority: 'medium'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      resolved: { 
        className: "bg-success/10 text-success border-success/20 hover:bg-success/20", 
        label: "Resolved" 
      },
      pending: { 
        className: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20", 
        label: "Pending" 
      },
      delayed: { 
        className: "bg-danger/10 text-danger border-danger/20 hover:bg-danger/20", 
        label: "Delayed" 
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={`${config.className} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <Card className="w-full border-0 shadow-lg bg-gradient-to-br from-white to-muted/10">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            Recent Complaints Management
          </CardTitle>
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 h-10 border-border/50 focus:border-primary"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32 h-10 border-border/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-32 h-10 border-border/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Roads">🛣️ Roads</SelectItem>
                <SelectItem value="Sewage">💧 Sewage</SelectItem>
                <SelectItem value="Sanitation">🧹 Sanitation</SelectItem>
                <SelectItem value="Other">⚙️ Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 border-b border-border/50 hover:bg-muted/30">
                <TableHead className="font-semibold text-foreground">ID</TableHead>
                <TableHead className="font-semibold text-foreground">Category</TableHead>
                <TableHead className="font-semibold text-foreground">Location</TableHead>
                <TableHead className="font-semibold text-foreground">Citizen Info</TableHead>
                <TableHead className="font-semibold text-foreground">Duration</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Contractor</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint, index) => (
                <TableRow 
                  key={complaint.id} 
                  className={`hover:bg-muted/20 transition-colors border-b border-border/30 ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/10"
                  }`}
                >
                  <TableCell className="font-semibold text-primary">
                    {complaint.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{complaint.categoryIcon}</span>
                      <Badge variant="outline" className="text-xs font-medium border-border/50">
                        {complaint.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-48">
                    <div className="truncate" title={complaint.location}>
                      {complaint.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {complaint.citizen}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {complaint.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      complaint.daysPending > 7 ? 'bg-danger/10 text-danger' : 
                      complaint.daysPending > 3 ? 'bg-warning/10 text-warning' : 
                      complaint.daysPending === 0 ? 'bg-success/10 text-success' :
                      'bg-muted/20 text-muted-foreground'
                    }`}>
                      {complaint.daysPending === 0 ? 'Completed' : `${complaint.daysPending} days`}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(complaint.status)}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className={`flex items-center gap-2 ${
                      complaint.contractor === 'Not Assigned' ? 'text-muted-foreground italic' : 'text-foreground'
                    }`}>
                      {complaint.contractor !== 'Not Assigned' && (
                        <div className="w-6 h-6 bg-gradient-to-br from-primary to-civic rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {complaint.contractor.charAt(0)}
                        </div>
                      )}
                      <span className="truncate max-w-32" title={complaint.contractor}>
                        {complaint.contractor}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-3 hover-lift border-border/50 hover:border-primary hover:text-primary"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {complaint.contractor === 'Not Assigned' && (
                        <Button 
                          size="sm" 
                          className="h-8 px-3 hover-lift civic-gradient text-white hover:opacity-90"
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredComplaints.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <div className="text-4xl mb-2">🔍</div>
              <p>No complaints found matching your criteria.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplaintTable;