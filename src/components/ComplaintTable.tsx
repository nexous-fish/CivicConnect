import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Users, 
  Calendar,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Sample data - replace with real data from Supabase
const sampleComplaints = [
  {
    id: 'CMP001',
    category: 'roads',
    location: 'Subhas Nagar, Durg, Chhattisgarh',
    citizenName: 'Rajesh Kumar',
    citizenPhone: '+91 98765 43210',
    description: 'Large pothole on main road causing traffic issues',
    status: 'pending',
    createdAt: '2024-01-15',
    daysPending: 5,
    contractor: null,
  },
  {
    id: 'CMP002',
    category: 'sewage',
    location: 'Central Avenue, Bhilai, Chhattisgarh',
    citizenName: 'Priya Sharma',
    citizenPhone: '+91 87654 32109',
    description: 'Sewage overflow near residential area',
    status: 'resolved',
    createdAt: '2024-01-10',
    daysPending: 0,
    contractor: 'ABC Contractors',
  },
  {
    id: 'CMP003',
    category: 'sanitation',
    location: 'Padmanapur, Durg, Chhattisgarh',
    citizenName: 'Amit Patel',
    citizenPhone: '+91 76543 21098',
    description: 'Garbage not collected for 3 days',
    status: 'delayed',
    createdAt: '2024-01-08',
    daysPending: 12,
    contractor: 'City Clean Services',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case 'resolved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
    case 'delayed':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Delayed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'roads':
      return '🕳️';
    case 'sewage':
      return '💧';
    case 'sanitation':
      return '🧹';
    default:
      return '📝';
  }
};

const ComplaintTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredComplaints = sampleComplaints.filter(complaint => {
    const matchesSearch = complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <Card className="shadow-sm border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-800 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-600" />
          Complaint Management
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by ID, location, or citizen name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
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
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="roads">Roads</SelectItem>
              <SelectItem value="sewage">Sewage</SelectItem>
              <SelectItem value="sanitation">Sanitation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">ID</TableHead>
                <TableHead className="font-semibold text-slate-700">Category</TableHead>
                <TableHead className="font-semibold text-slate-700">Location</TableHead>
                <TableHead className="font-semibold text-slate-700">Citizen</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700">Days</TableHead>
                <TableHead className="font-semibold text-slate-700">Contractor</TableHead>
                <TableHead className="font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium text-blue-600">
                    {complaint.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCategoryIcon(complaint.category)}</span>
                      <span className="capitalize">{complaint.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{complaint.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-900">{complaint.citizenName}</div>
                      <div className="text-sm text-slate-500">{complaint.citizenPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(complaint.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className={`font-medium ${
                        complaint.daysPending > 7 ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {complaint.daysPending}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {complaint.contractor ? (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-600">{complaint.contractor}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        View
                      </Button>
                      {complaint.status === 'pending' && (
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                          Assign
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No complaints found matching your filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintTable;