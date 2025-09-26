import React, { useState, useEffect } from 'react';
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, FileText, Users, BarChart3, Settings, User, Bell, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { name: "Dashboard", url: "/officer-dashboard", icon: LayoutDashboard },
  { name: "Complaints", url: "/officer-dashboard/complaints", icon: FileText },
  { name: "Contractors", url: "/officer-dashboard/contractors", icon: Users },
  { name: "Analytics", url: "/officer-dashboard/analytics", icon: BarChart3 },
  { name: "Settings", url: "/officer-dashboard/settings", icon: Settings },
];

const OfficerSettings: React.FC = () => {
  const [officerData, setOfficerData] = useState<any>(null);
  const [notifications, setNotifications] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOfficerData();
  }, []);

  const fetchOfficerData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/officer-auth');
        return;
      }

      const { data: officer, error } = await supabase
        .from('officers')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !officer) {
        toast({
          title: "Error",
          description: "Could not load officer data",
          variant: "destructive",
        });
        return;
      }

      setOfficerData(officer);
    } catch (error) {
      console.error('Error fetching officer data:', error);
    } finally {
      setLoading(false);
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
      <div className="min-h-screen bg-gradient-to-br from-civic-light via-background to-primary-light/30 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={officerData?.name || ''} 
                    readOnly 
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={officerData?.email || ''} 
                    readOnly 
                    className="bg-muted/50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="city">City ID</Label>
                <Input 
                  id="city" 
                  value={officerData?.city_id || ''} 
                  readOnly 
                  className="bg-muted/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email alerts for new complaints</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-assign">Auto-assign Complaints</Label>
                  <p className="text-sm text-muted-foreground">Automatically assign complaints to contractors</p>
                </div>
                <Switch 
                  id="auto-assign" 
                  checked={autoAssign}
                  onCheckedChange={setAutoAssign}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full sm:w-auto">
                Change Password
              </Button>
              <Separator />
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OfficerSettings;