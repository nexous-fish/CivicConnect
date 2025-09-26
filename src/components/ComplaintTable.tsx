import React, { useState, useEffect } from 'react';
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ComplaintTableProps {
  cityId?: string;
}

const ComplaintTable: React.FC<ComplaintTableProps> = ({ cityId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, [cityId]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      
      const query = supabase
        .from('complaints')
        .select(`
          *,
          cities:city_id (name),
          nagars:nagar_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (cityId) {
        query.eq('city_id', cityId);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast({
        title: "Error",
        description: "Failed to load complaints",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysPending = (createdAt: string, status: string) => {
    if (status === 'resolved') return 0;
    const now = new Date();
    const createdDate = new Date(createdAt);
    return Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'roads': '🛣️',
      'sewage': '💧', 
      'sanitation': '🧹',
      'other': '⚙️'
    };
    return icons[category.toLowerCase()] || '⚙️';
  };
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
      in_progress: { 
        className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20", 
        label: "In Progress" 
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
    const matchesSearch = (complaint.complaint_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (complaint.citizen_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (complaint.address || '').toLowerCase().includes(searchTerm.toLowerCase());
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
                <SelectItem value="in_progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-32 h-10 border-border/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="roads">🛣️ Roads</SelectItem>
                <SelectItem value="sewage">💧 Sewage</SelectItem>
                <SelectItem value="sanitation">🧹 Sanitation</SelectItem>
                <SelectItem value="other">⚙️ Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
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
                  <TableHead className="font-semibold text-foreground text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint, index) => {
                  const daysPending = calculateDaysPending(complaint.created_at, complaint.status);
                  return (
                    <TableRow 
                      key={complaint.id} 
                      className={`hover:bg-muted/20 transition-colors border-b border-border/30 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/10"
                      }`}
                    >
                      <TableCell className="font-semibold text-primary">
                        {complaint.complaint_number || `CMP-${complaint.id.slice(0, 8)}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(complaint.category)}</span>
                          <Badge variant="outline" className="text-xs font-medium border-border/50">
                            {complaint.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-48">
                        <div className="truncate" title={complaint.address || 'No address provided'}>
                          {complaint.address || complaint.nagars?.name || 'Unknown location'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {complaint.citizen_name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {complaint.citizen_phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          daysPending > 7 ? 'bg-danger/10 text-danger' : 
                          daysPending > 3 ? 'bg-warning/10 text-warning' : 
                          daysPending === 0 ? 'bg-success/10 text-success' :
                          'bg-muted/20 text-muted-foreground'
                        }`}>
                          {daysPending === 0 ? 'Completed' : `${daysPending} days`}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(complaint.status)}
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
                          {complaint.status === 'pending' && (
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
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredComplaints.length === 0 && !loading && (
              <div className="p-8 text-center text-muted-foreground">
                <div className="text-4xl mb-2">📋</div>
                <p>No complaints found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintTable;