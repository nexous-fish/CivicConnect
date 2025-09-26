import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from "@/components/ui/tubelight-navbar";
import ComplaintStats from "@/components/ComplaintStats";
import ComplaintCharts from "@/components/ComplaintCharts";
import ComplaintTable from "@/components/ComplaintTable";
import ErrorBoundary from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  LogOut 
} from 'lucide-react';

// Demo data for stable initial render
const DEMO_STATS = {
  total: 328,
  resolved: 245,
  pending: 67,
  delayed: 16,
};

const navItems = [
  { name: "Dashboard", url: "/officer-dashboard", icon: LayoutDashboard },
  { name: "Complaints", url: "/officer-dashboard/complaints", icon: FileText },
  { name: "Contractors", url: "/officer-dashboard/contractors", icon: Users },
  { name: "Analytics", url: "/officer-dashboard/analytics", icon: BarChart3 },
  { name: "Settings", url: "/officer-dashboard/settings", icon: Settings },
];

const OfficerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [officerData, setOfficerData] = useState<any>(null);
  const [stats, setStats] = useState(DEMO_STATS);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/officer-auth');
        return;
      }

      // Check if user is an officer
      const { data: officer, error: officerError } = await supabase
        .from('officers')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (officerError || !officer) {
        toast({
          title: "Access denied",
          description: "Officer account required.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate('/');
        return;
      }

      setOfficerData(officer);
      
      // Fetch complaint statistics
      await fetchComplaintStats();
      
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/officer-auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintStats = async () => {
    try {
      // Fetch all complaints
      const { data: complaints, error } = await supabase
        .from('complaints')
        .select('status, created_at');

      if (error || !complaints || complaints.length === 0) {
        // Keep demo data, don't update if fetch fails
        return;
      }

      const total = complaints.length;
      const resolved = complaints.filter(c => c.status === 'resolved').length;
      const pending = complaints.filter(c => c.status === 'pending').length;
      
      // Calculate delayed complaints (pending for more than 7 days)
      const now = new Date();
      const delayed = complaints.filter(c => {
        if (c.status !== 'pending') return false;
        const createdDate = new Date(c.created_at);
        const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff > 7;
      }).length;

      // Only update if we have real data
      setStats({ total, resolved, pending, delayed });
      
    } catch (error) {
      console.error('Error in fetchComplaintStats:', error);
      // Keep existing stats, don't update on error
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-light via-background to-primary-light/30">
      <NavBar items={navItems} />
      
      <main className="pt-12 sm:pt-16 pb-20 sm:pb-6">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-background/80 backdrop-blur-sm border border-border mx-2 sm:mx-4 rounded-xl mb-6 mt-2 sm:mt-4 shadow-card-shadow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Officer Dashboard</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 bg-success rounded-full animate-pulse"></span>
                Welcome back, {officerData?.name || 'Officer'}
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
                  {(officerData?.name || 'O').charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
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
          <ErrorBoundary>
            <ComplaintStats stats={stats} />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <ComplaintCharts />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <ComplaintTable />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default OfficerDashboard;