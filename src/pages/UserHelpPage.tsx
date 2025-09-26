import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { 
  User, 
  Phone, 
  LogOut,
  Plus,
  Eye,
  Search,
  Timer,
  FileText,
  LayoutDashboard,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  phone: string;
  full_name: string;
}

const navItems = [
  { name: "Dashboard", url: "/user-dashboard", icon: LayoutDashboard },
  { name: "My Complaints", url: "/user-dashboard/complaints", icon: FileText },
  { name: "Profile", url: "/user-dashboard/profile", icon: User },
  { name: "Help", url: "/user-dashboard/help", icon: HelpCircle },
];

const UserHelpPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-civic-light via-background to-primary-light/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg font-medium">Loading help...</p>
        </div>
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
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Help & Support</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 bg-success rounded-full animate-pulse"></span>
                Get assistance with using the platform
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

        <div className="px-4 sm:px-6 space-y-6">
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
                    <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">How long does it take to resolve a complaint?</h4>
                      <p className="text-muted-foreground text-sm">
                        Resolution time varies depending on the type and complexity of the issue. Most complaints are resolved within 7-15 business days.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Can I update my complaint after filing?</h4>
                      <p className="text-muted-foreground text-sm">
                        Currently, complaint updates must be made through our support team. Contact us if you need to add information to your complaint.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">What if my complaint is marked as delayed?</h4>
                      <p className="text-muted-foreground text-sm">
                        Delayed complaints are automatically escalated to higher authorities. You will receive updates on the progress.
                      </p>
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
                        Call Support: 1800-123-CIVIC
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
      </main>
    </div>
  );
};

export default UserHelpPage;