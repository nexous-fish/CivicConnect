import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, FileText, Users, BarChart3, Settings, Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AddContractorDialog from "@/components/AddContractorDialog";
import EditContractorDialog from "@/components/EditContractorDialog";
import DeleteContractorDialog from "@/components/DeleteContractorDialog";

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
  nagars?: {
    name: string;
  };
}

const OfficerContractors: React.FC = () => {
  const navigate = useNavigate();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [officerData, setOfficerData] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const { toast } = useToast();

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
      fetchContractors(officer.city_id);
      
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/officer-auth');
    } finally {
      setLoading(false);
    }
  };

  const handleEditContractor = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setShowEditDialog(true);
  };

  const handleDeleteContractor = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setShowDeleteDialog(true);
  };

  const handleDialogSuccess = () => {
    if (officerData) {
      fetchContractors(officerData.city_id);
    }
  };

  const fetchContractors = async (cityId: string) => {
    try {
      // First get nagars for this city
      const { data: nagars, error: nagarError } = await supabase
        .from('nagars')
        .select('id')
        .eq('city_id', cityId);

      if (nagarError) throw nagarError;

      const nagarIds = nagars?.map(n => n.id) || [];

      if (nagarIds.length === 0) {
        setContractors([]);
        return;
      }

      // Then get contractors for these nagars
      const { data, error } = await supabase
        .from('contractors')
        .select(`
          *,
          nagars:nagar_id (
            name
          )
        `)
        .in('nagar_id', nagarIds);

      if (error) throw error;
      
      setContractors(data || []);
    } catch (error) {
      console.error('Error fetching contractors:', error);
      toast({
        title: "Error",
        description: "Failed to load contractors",
        variant: "destructive",
      });
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
            <Button variant="default" onClick={() => setShowAddDialog(true)}>
              Add Contractor
            </Button>
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
                      {contractor.nagars?.name || 'Unknown Nagar'}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditContractor(contractor)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteContractor(contractor)}
                      >
                        Remove
                      </Button>
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

      {/* Add Contractor Dialog */}
      {officerData && (
        <>
          <AddContractorDialog
            isOpen={showAddDialog}
            onClose={() => setShowAddDialog(false)}
            onSuccess={handleDialogSuccess}
            officerCityId={officerData.city_id}
          />
          
          <EditContractorDialog
            isOpen={showEditDialog}
            onClose={() => setShowEditDialog(false)}
            onSuccess={handleDialogSuccess}
            contractor={selectedContractor}
            officerCityId={officerData.city_id}
          />
          
          <DeleteContractorDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onSuccess={handleDialogSuccess}
            contractor={selectedContractor}
          />
        </>
      )}
    </div>
  );
};

export default OfficerContractors;