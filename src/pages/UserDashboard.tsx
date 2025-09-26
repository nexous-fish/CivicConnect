import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  LogOut,
  Plus,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ComplaintWizard from "@/components/ComplaintWizard";
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  phone: string;
  full_name: string;
}

interface Complaint {
  id: string;
  category: string;
  status: string;
  description: string;
  address: string;
  created_at: string;
  resolved_at: string | null;
}

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [showComplaintWizard, setShowComplaintWizard] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        navigate('/user-auth');
        return;
      }

      setUser(session.user);
      await loadUserData(session.user.id);
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/user-auth');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load user complaints with stats
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select('*')
        .eq('citizen_phone', profileData.phone)
        .order('created_at', { ascending: false });

      if (complaintsError) throw complaintsError;
      
      setComplaints(complaintsData || []);
      
      // Calculate stats
      const total = complaintsData?.length || 0;
      const resolved = complaintsData?.filter(c => c.status === 'resolved').length || 0;
      const pending = total - resolved;
      
      setStats({ total, pending, resolved });
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (showComplaintWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => setShowComplaintWizard(false)}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <ComplaintWizard onClose={() => {
            setShowComplaintWizard(false);
            if (profile) loadUserData(user.id);
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 civic-gradient rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">My Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {profile?.full_name}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Name:</span>
                <span>{profile?.full_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span>{profile?.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Complaints</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Complaint Button */}
        <div className="mb-8">
          <Button 
            onClick={() => setShowComplaintWizard(true)}
            className="civic-gradient text-white hover:opacity-90"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Report New Issue
          </Button>
        </div>

        {/* Complaints List */}
        <Card>
          <CardHeader>
            <CardTitle>My Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            {complaints.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No complaints filed yet</p>
                <Button 
                  onClick={() => setShowComplaintWizard(true)}
                  variant="outline"
                  className="mt-4"
                >
                  File Your First Complaint
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(complaint.status)}
                        <span className="font-medium capitalize">{complaint.category}</span>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                    {complaint.address && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{complaint.address}</span>
                      </div>
                    )}
                    {complaint.resolved_at && (
                      <div className="mt-2 text-sm text-green-600">
                        ✅ Resolved on {format(new Date(complaint.resolved_at), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;