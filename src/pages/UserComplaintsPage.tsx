import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  Search,
  FileText,
  Timer,
  Eye,
  Filter,
  LayoutDashboard,
  HelpCircle,
  User,
  Plus,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ComplaintWizard from "@/components/ComplaintWizard";
import { format, differenceInDays } from 'date-fns';

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

const navItems = [
  { name: "Dashboard", url: "/user-dashboard", icon: LayoutDashboard },
  { name: "My Complaints", url: "/user-dashboard/complaints", icon: FileText },
  { name: "Profile", url: "/user-dashboard/profile", icon: User },
  { name: "Help", url: "/user-dashboard/help", icon: HelpCircle },
];

const UserComplaintsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showComplaintWizard, setShowComplaintWizard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
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
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select('*')
        .eq('citizen_phone', profileData.phone)
        .order('created_at', { ascending: false });

      if (complaintsError) throw complaintsError;
      setComplaints(complaintsData || []);
      
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

  const filteredComplaints = React.useMemo(() => {
    if (!searchQuery) return complaints;
    
    return complaints.filter(complaint =>
      complaint.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [complaints, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-success/10 text-success border-success/20';
      case 'in_progress':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'assigned':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getDelayedStatus = (complaint: Complaint) => {
    if (complaint.status !== 'pending') return false;
    const daysDiff = differenceInDays(new Date(), new Date(complaint.created_at));
    return daysDiff > 7;
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'assigned': return 50;
      case 'in_progress': return 75;
      case 'resolved': return 100;
      default: return 0;
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
      <div className="min-h-screen bg-gradient-to-br from-civic-light via-background to-primary-light/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg font-medium">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (showComplaintWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-civic-light via-background to-primary-light/30">
        <main className="pt-8 pb-24 sm:pb-6">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => setShowComplaintWizard(false)}
              className="mb-4 hover:bg-muted/50"
            >
              ← Back to Complaints
            </Button>
            <ComplaintWizard onClose={() => {
              setShowComplaintWizard(false);
              if (profile && user) loadUserData(user.id);
            }} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-light via-background to-primary-light/30">
      <NavBar items={navItems} />
      
      <main className="pt-4 sm:pt-16 pb-24 sm:pb-6">
        <div className="px-3 sm:px-6 py-3 sm:py-6 bg-background/80 backdrop-blur-sm border border-border mx-2 sm:mx-4 rounded-xl mb-4 sm:mb-6 shadow-card-shadow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Complaints</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 bg-success rounded-full animate-pulse"></span>
                Track and manage all your reported issues
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-left sm:text-right">
                <div className="text-sm font-medium text-foreground">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-civic rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-lg">
                  {(profile?.full_name || 'U').charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors duration-200"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-serif">All My Complaints</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Detailed view of all your reported issues</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search complaints..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full md:w-80"
                    />
                  </div>
                  <Button 
                    onClick={() => setShowComplaintWizard(true)}
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredComplaints.length === 0 && complaints.length > 0 ? (
                <div className="text-center py-8">
                  <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No complaints match your search</p>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">No complaints filed yet</h3>
                  <p className="text-muted-foreground mb-6">Start by reporting your first civic issue</p>
                  <Button 
                    onClick={() => setShowComplaintWizard(true)}
                    variant="outline"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    File Your First Complaint
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComplaints.map((complaint) => {
                    const isDelayed = getDelayedStatus(complaint);
                    const progress = getProgressPercentage(complaint.status);
                    
                    return (
                      <Card 
                        key={complaint.id} 
                        className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                          selectedComplaint === complaint.id ? 'ring-2 ring-primary' : ''
                        } ${isDelayed ? 'border-danger/20 bg-danger/5' : ''}`}
                        onClick={() => setSelectedComplaint(
                          selectedComplaint === complaint.id ? null : complaint.id
                        )}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(complaint.status)}
                                <Badge className={`${getStatusColor(complaint.status)} border`}>
                                  {complaint.status.replace('_', ' ')}
                                </Badge>
                                {isDelayed && (
                                  <Badge variant="destructive" className="text-xs">
                                    Delayed
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(complaint.created_at), 'MMM d, yyyy')}</span>
                              <Button variant="ghost" size="sm" className="ml-2">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-lg capitalize text-foreground">
                                {complaint.category}
                              </h4>
                              <p className="text-muted-foreground mt-1 line-clamp-2">
                                {complaint.description}
                              </p>
                            </div>

                            {complaint.address && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{complaint.address}</span>
                              </div>
                            )}

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Progress</span>
                                <span className="text-sm text-muted-foreground">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span className={progress >= 25 ? 'text-primary' : ''}>Filed</span>
                                <span className={progress >= 50 ? 'text-primary' : ''}>Assigned</span>
                                <span className={progress >= 75 ? 'text-primary' : ''}>In Progress</span>
                                <span className={progress >= 100 ? 'text-success' : ''}>Resolved</span>
                              </div>
                            </div>

                            {complaint.resolved_at && (
                              <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
                                <div className="flex items-center gap-2 text-success font-medium">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Resolved on {format(new Date(complaint.resolved_at), 'MMM d, yyyy')}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserComplaintsPage;