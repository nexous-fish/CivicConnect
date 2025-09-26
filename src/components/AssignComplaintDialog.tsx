import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Users, Phone, Mail } from 'lucide-react';

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

interface Complaint {
  id: string;
  complaint_number: string | null;
  citizen_name: string;
  nagar_id: string;
  status: string;
}

interface AssignComplaintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  complaint: Complaint | null;
  officerCityId: string;
}

const AssignComplaintDialog: React.FC<AssignComplaintDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  complaint,
  officerCityId
}) => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingContractors, setFetchingContractors] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && officerCityId) {
      fetchContractors();
      setSelectedContractor('');
    }
  }, [isOpen, officerCityId]);

  // Auto-select contractor based on complaint's nagar
  useEffect(() => {
    if (contractors.length > 0 && complaint?.nagar_id && !selectedContractor) {
      const matchingContractor = contractors.find(c => c.nagar_id === complaint.nagar_id);
      if (matchingContractor) {
        setSelectedContractor(matchingContractor.id);
      }
    }
  }, [contractors, complaint?.nagar_id, selectedContractor]);

  const fetchContractors = async () => {
    try {
      setFetchingContractors(true);
      
      // First get nagars for this city
      const { data: nagars, error: nagarError } = await supabase
        .from('nagars')
        .select('id')
        .eq('city_id', officerCityId);

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
    } finally {
      setFetchingContractors(false);
    }
  };

  const handleAssign = async () => {
    if (!complaint || !selectedContractor) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('complaints')
        .update({
          assigned_contractor_id: selectedContractor,
          assigned_at: new Date().toISOString(),
          status: 'in_progress'
        })
        .eq('id', complaint.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Complaint assigned successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning complaint:', error);
      toast({
        title: "Error",
        description: "Failed to assign complaint",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedContractor('');
    onClose();
  };

  if (!complaint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Assign Complaint
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Complaint Info */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Complaint Details</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>ID: {complaint.complaint_number || `CMP-${complaint.id.slice(0, 8)}`}</div>
              <div>Citizen: {complaint.citizen_name}</div>
            </div>
          </div>

          {/* Contractor Selection */}
          <div className="space-y-2">
            <Label htmlFor="contractor">Select Contractor *</Label>
            {fetchingContractors ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : contractors.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No contractors available</p>
                <p className="text-xs">Add contractors first to assign complaints</p>
              </div>
            ) : (
              <Select value={selectedContractor} onValueChange={setSelectedContractor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a contractor" />
                </SelectTrigger>
                <SelectContent>
                  {contractors.map((contractor) => (
                    <SelectItem key={contractor.id} value={contractor.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-civic rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {contractor.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{contractor.name}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {contractor.phone}
                            {contractor.email && (
                              <>
                                <Mail className="w-3 h-3 ml-1" />
                                {contractor.email}
                              </>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {contractor.nagars?.name || 'Unknown Nagar'}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={loading || !selectedContractor || contractors.length === 0}
            >
              {loading ? "Assigning..." : "Assign Complaint"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignComplaintDialog;