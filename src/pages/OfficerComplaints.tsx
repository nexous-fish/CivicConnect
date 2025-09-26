import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from "@/components/ui/tubelight-navbar";
import ComplaintTable from "@/components/ComplaintTable";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LayoutDashboard, FileText, Users, BarChart3, Settings } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { name: "Dashboard", url: "/officer-dashboard", icon: LayoutDashboard },
  { name: "Complaints", url: "/officer-dashboard/complaints", icon: FileText },
  { name: "Contractors", url: "/officer-dashboard/contractors", icon: Users },
  { name: "Analytics", url: "/officer-dashboard/analytics", icon: BarChart3 },
  { name: "Settings", url: "/officer-dashboard/settings", icon: Settings },
];

const OfficerComplaints: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [officerData, setOfficerData] = useState<any>(null);

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
      
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/officer-auth');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-light via-background to-primary-light/30">
      <NavBar items={navItems} />
      
      <main className="pt-4 sm:pt-16 pb-24 sm:pb-6">
        {/* Header */}
        <div className="px-3 sm:px-6 py-3 sm:py-6 bg-background/80 backdrop-blur-sm border border-border mx-2 sm:mx-4 rounded-xl mb-4 sm:mb-6 shadow-card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Complaints Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage citizen complaints
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6">
          <ErrorBoundary>
            <ComplaintTable cityId={officerData?.city_id} />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default OfficerComplaints;