import React, { useState, useEffect } from 'react';
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, FileText, Users, BarChart3, Settings, Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { name: "Dashboard", url: "/officer-dashboard", icon: LayoutDashboard },
  { name: "Complaints", url: "/officer-dashboard/complaints", icon: FileText },
  { name: "Contractors", url: "/officer-dashboard/contractors", icon: Users },
  { name: "Analytics", url: "/officer-dashboard/analytics", icon: BarChart3 },
  { name: "Settings", url: "/officer-dashboard/settings", icon: Settings },
];

interface Contractor {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  nagar_id: string;
}

const OfficerContractors: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const { data, error } = await supabase
        .from('contractors')
        .select('*');

      if (error) throw error;
      
      setContractors(data || []);
    } catch (error) {
      console.error('Error fetching contractors:', error);
      toast({
        title: "Error",
        description: "Failed to load contractors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-light via-background to-primary-light/30">
      <NavBar items={navItems} />
      
      <main className="pt-4 sm:pt-16 pb-24 sm:pb-6">
        {/* Header */}
        <div className="px-3 sm:px-6 py-3 sm:py-6 bg-background/80 backdrop-blur-sm border border-border mx-2 sm:mx-4 rounded-xl mb-4 sm:mb-6 shadow-card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Contractors</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage registered contractors
              </p>
            </div>
            <Button variant="default">Add Contractor</Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contractors.map((contractor) => (
                <Card key={contractor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {contractor.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {contractor.phone}
                    </div>
                    {contractor.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {contractor.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      Nagar ID: {contractor.nagar_id}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Remove</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!loading && contractors.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No contractors found</h3>
              <p className="text-muted-foreground">Add contractors to manage civic maintenance work.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OfficerContractors;