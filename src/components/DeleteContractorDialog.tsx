import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Contractor {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  nagar_id: string;
}

interface DeleteContractorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contractor: Contractor | null;
}

const DeleteContractorDialog: React.FC<DeleteContractorDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  contractor
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!contractor) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contractors')
        .delete()
        .eq('id', contractor.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contractor removed successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting contractor:', error);
      toast({
        title: "Error",
        description: "Failed to remove contractor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Contractor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{contractor?.name}</strong>? 
            This action cannot be undone and will permanently delete the contractor from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? "Removing..." : "Remove Contractor"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteContractorDialog;