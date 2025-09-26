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
  Filter,
  LayoutDashboard,
  HelpCircle,
  Settings,
  Edit3
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
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

// Navigation items for user dashboard
const navItems = [
  { name: "Dashboard", url: "/user-dashboard", icon: LayoutDashboard },
  { name: "My Complaints", url: "/user-dashboard/complaints", icon: FileText },
  { name: "Profile", url: "/user-dashboard/profile", icon: User },
  { name: "Help", url: "/user-dashboard/help", icon: HelpCircle },
];

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, delayed: 0 });
  const [showComplaintWizard, setShowComplaintWizard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get current section from URL path
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/complaints')) return 'complaints';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/help')) return 'help';
    return 'dashboard';
  };

  const currentSection = getCurrentSection();

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

  // Filter complaints based on search query
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

  // Render dashboard content
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

      {/* Recent Complaints Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-serif">Recent Complaints</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Your latest reported issues</p>
            </div>
            {complaints.length > 3 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/user-dashboard/complaints')}
              >
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
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
            <div className="space-y-3">
              {complaints.slice(0, 3).map((complaint) => {
                const isDelayed = getDelayedStatus(complaint);
                const progress = getProgressPercentage(complaint.status);
                
                return (
                  <Card 
                    key={complaint.id} 
                    className={`transition-all duration-200 hover:shadow-md ${
                      isDelayed ? 'border-danger/20 bg-danger/5' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(complaint.status)}
                          <Badge className={`${getStatusColor(complaint.status)} border text-xs`}>
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                          {isDelayed && (
                            <Badge variant="destructive" className="text-xs">
                              Delayed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(complaint.created_at), 'MMM d')}</span>
                        </div>
                      </div>

                      <h4 className="font-medium capitalize text-foreground mb-1">
                        {complaint.category}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {complaint.description}
                      </p>

                      {complaint.address && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">{complaint.address}</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Progress</span>
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
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

  // Render complaints content
  const renderComplaintsContent = () => (
    <div className="space-y-6">
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

  // Render profile content
  const renderProfileContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif">Profile Information</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Your account details and preferences</p>
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
            <div className="ml-auto">
              <Button variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Total Complaints</p>
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
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates about your complaints via email</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Get SMS alerts for important updates</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  // Render help content
  const renderHelpContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif">Help & Support</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Get help with using the platform</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    How to file a complaint?
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Click on "Add New Complaint" button and follow the step-by-step wizard to report your civic issue.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    Track complaint status
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    View the progress bar and status badges to track your complaint from filing to resolution.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-primary" />
                    Search complaints
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Use the search bar to quickly find specific complaints by category, description, or location.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Timer className="w-4 h-4 text-danger" />
                    Delayed complaints
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Complaints pending for more than 7 days are marked as delayed and highlighted in red.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complaint Status Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-muted text-muted-foreground">Pending</Badge>
                    <span>Complaint has been filed and is waiting for review</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20">Assigned</Badge>
                    <span>Complaint has been assigned to a contractor</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-warning/10 text-warning border-warning/20">In Progress</Badge>
                    <span>Work is currently being done on your complaint</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-success/10 text-success border-success/20">Resolved</Badge>
                    <span>Your complaint has been successfully resolved</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Need additional help? Contact our support team for assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Support
                  </Button>
                  <Button variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-civic-light via-background to-primary-light/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (showComplaintWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-civic-light via-background to-primary-light/30">
        {/* No NavBar when showing complaint wizard */}
        <main className="pt-8 pb-24 sm:pb-6">
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
        {/* Header */}
        <div className="px-3 sm:px-6 py-3 sm:py-6 bg-background/80 backdrop-blur-sm border border-border mx-2 sm:mx-4 rounded-xl mb-4 sm:mb-6 shadow-card-shadow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {currentSection === 'dashboard' && 'User Dashboard'}
                {currentSection === 'complaints' && 'My Complaints'}
                {currentSection === 'profile' && 'My Profile'}
                {currentSection === 'help' && 'Help & Support'}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 bg-success rounded-full animate-pulse"></span>
                {currentSection === 'dashboard' && `Welcome back, ${profile?.full_name || 'User'}`}
                {currentSection === 'complaints' && 'Track and manage all your reported issues'}
                {currentSection === 'profile' && 'Manage your account information and settings'}
                {currentSection === 'help' && 'Get assistance with using the platform'}
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

        {/* Main Content */}
        <div className="px-4 sm:px-6 space-y-8">
          {currentSection === 'dashboard' && renderDashboardContent()}
          {currentSection === 'complaints' && renderComplaintsContent()}
          {currentSection === 'profile' && renderProfileContent()}
          {currentSection === 'help' && renderHelpContent()}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;