import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const contractorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  nagar_id: z.string().min(1, "Please select a nagar"),
});

type ContractorFormData = z.infer<typeof contractorSchema>;

interface Nagar {
  id: string;
  name: string;
}

interface Contractor {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  nagar_id: string;
}

interface EditContractorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contractor: Contractor | null;
  officerCityId: string;
}

const EditContractorDialog: React.FC<EditContractorDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  contractor,
  officerCityId
}) => {
  const [nagars, setNagars] = useState<Nagar[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContractorFormData>({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      nagar_id: "",
    },
  });

  useEffect(() => {
    if (isOpen && officerCityId) {
      fetchNagars();
    }
  }, [isOpen, officerCityId]);

  useEffect(() => {
    if (contractor) {
      form.reset({
        name: contractor.name,
        phone: contractor.phone,
        email: contractor.email || "",
        nagar_id: contractor.nagar_id,
      });
    }
  }, [contractor, form]);

  const fetchNagars = async () => {
    try {
      const { data, error } = await supabase
        .from('nagars')
        .select('id, name')
        .eq('city_id', officerCityId)
        .order('name');

      if (error) throw error;
      setNagars(data || []);
    } catch (error) {
      console.error('Error fetching nagars:', error);
      toast({
        title: "Error",
        description: "Failed to load nagars",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: ContractorFormData) => {
    if (!contractor) return;
    
    setLoading(true);
    try {
      const contractorData = {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        nagar_id: data.nagar_id,
      };

      const { error } = await supabase
        .from('contractors')
        .update(contractorData)
        .eq('id', contractor.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contractor updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating contractor:', error);
      toast({
        title: "Error",
        description: "Failed to update contractor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Contractor</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Contractor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 9999999999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contractor@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nagar_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nagar *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a nagar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {nagars.map((nagar) => (
                        <SelectItem key={nagar.id} value={nagar.id}>
                          {nagar.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Contractor"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContractorDialog;