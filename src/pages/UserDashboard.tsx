import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  LogOut,
  Plus,
  Calendar,
  Search,
  TrendingUp,
  FileText,
  BarChart3,
  Timer,
  Eye,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ComplaintWizard from "@/components/ComplaintWizard";
import { UserSidebar } from "@/components/UserSidebar";
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

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, delayed: 0 });
  const [showComplaintWizard, setShowComplaintWizard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
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
      setFilteredComplaints(complaintsData || []);
      
      // Calculate stats
      const total = complaintsData?.length || 0;
      const resolved = complaintsData?.filter(c => c.status === 'resolved').length || 0;
      const pending = complaintsData?.filter(c => c.status === 'pending').length || 0;
      
      // Calculate delayed complaints (pending for more than 7 days)
      const now = new Date();
      const delayed = complaintsData?.filter(c => {
        if (c.status !== 'pending') return false;
        const daysDiff = differenceInDays(now, new Date(c.created_at));
        return daysDiff > 7;
      }).length || 0;
      
      setStats({ total, pending, resolved, delayed });
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

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredComplaints(complaints);
      return;
    }
    
    const filtered = complaints.filter(complaint =>
      complaint.category.toLowerCase().includes(query.toLowerCase()) ||
      complaint.description.toLowerCase().includes(query.toLowerCase()) ||
      complaint.address?.toLowerCase().includes(query.toLowerCase()) ||
      complaint.status.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredComplaints(filtered);
  };

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg font-medium">Loading dashboard...</p>
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
            className="mb-4 hover:bg-muted/50"
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

  const renderDashboardContent = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/80 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-success mt-1">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground mt-1">✅ Completed</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-warning mt-1">{stats.pending}</p>
                <p className="text-xs text-muted-foreground mt-1">⏳ In progress</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delayed</p>
                <p className="text-3xl font-bold text-danger mt-1">{stats.delayed}</p>
                <p className="text-xs text-muted-foreground mt-1">⚠️ Over 7 days</p>
              </div>
              <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-danger" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary to-civic text-primary-foreground">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Need to report an issue?</h3>
              <p className="opacity-90">File a new complaint and get it resolved by local authorities.</p>
            </div>
            <Button 
              onClick={() => setShowComplaintWizard(true)}
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Complaint
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Complaints */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-serif">My Complaints</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Track and manage your reported issues</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-full md:w-80"
              />
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

                        {/* Progress Tracker */}
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
  );

  const renderComplaintsContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">All My Complaints</CardTitle>
          <p className="text-muted-foreground">Detailed view of all your reported issues</p>
        </CardHeader>
        <CardContent>
          {/* Same complaints list as dashboard */}
          {renderDashboardContent()}
        </CardContent>
      </Card>
    </div>
  );

  const renderProfileContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Profile Information</CardTitle>
          <p className="text-muted-foreground">Your account details and preferences</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-civic rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {profile?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{profile?.full_name}</h3>
              <p className="text-muted-foreground">{profile?.phone}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Full Name</p>
                      <p className="text-muted-foreground">{profile?.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone Number</p>
                      <p className="text-muted-foreground">{profile?.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Account Statistics</p>
                      <p className="text-muted-foreground">{stats.total} complaints filed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Success Rate</p>
                      <p className="text-muted-foreground">
                        {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolved
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHelpContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Help & Support</CardTitle>
          <p className="text-muted-foreground">Get help with using the platform</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">How to file a complaint?</h4>
              <p className="text-muted-foreground text-sm">
                Click on "Add New Complaint" button and follow the step-by-step wizard to report your civic issue.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Complaint status meanings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="bg-muted text-muted-foreground">Pending</Badge>
                  <span>Complaint has been filed and is waiting for review</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">Assigned</Badge>
                  <span>Complaint has been assigned to a contractor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-warning/10 text-warning border-warning/20">In Progress</Badge>
                  <span>Work is currently being done on your complaint</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success/10 text-success border-success/20">Resolved</Badge>
                  <span>Your complaint has been successfully resolved</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'complaints': return renderComplaintsContent();
      case 'profile': return renderProfileContent();
      case 'help': return renderHelpContent();
      default: return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 flex">
      {/* Sidebar */}
      <UserSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={handleSignOut}
        userName={profile?.full_name || 'User'}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-serif text-foreground">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'complaints' && 'My Complaints'}
                  {activeTab === 'profile' && 'Profile'}
                  {activeTab === 'help' && 'Help & Support'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {activeTab === 'dashboard' && 'Overview of your civic engagement'}
                  {activeTab === 'complaints' && 'All your reported issues in one place'}
                  {activeTab === 'profile' && 'Manage your account information'}
                  {activeTab === 'help' && 'Get assistance and learn how to use the platform'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
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
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 overflow-auto h-[calc(100vh-140px)]">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;