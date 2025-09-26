import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, Camera, MapPin, Phone, FileText, CheckCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ComplaintData {
  photo: File | null;
  state_id: string;
  city_id: string;
  nagar_id: string;
  address: string;
  name: string;
  phone: string;
  details: string;
  category: string;
  complaint_reference?: string;
}

interface State {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
  state_id: string;
}

interface Nagar {
  id: string;
  name: string;
  city_id: string;
}

const ComplaintWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complaintData, setComplaintData] = useState<ComplaintData>({
    photo: null,
    state_id: '',
    city_id: '',
    nagar_id: '',
    address: '',
    name: '',
    phone: '',
    details: '',
    category: ''
  });

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [nagars, setNagars] = useState<Nagar[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // Fetch states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (complaintData.state_id) {
      fetchCities(complaintData.state_id);
      setComplaintData(prev => ({ ...prev, city_id: '', nagar_id: '' }));
    }
  }, [complaintData.state_id]);

  // Fetch nagars when city changes
  useEffect(() => {
    if (complaintData.city_id) {
      fetchNagars(complaintData.city_id);
      setComplaintData(prev => ({ ...prev, nagar_id: '' }));
    }
  }, [complaintData.city_id]);

  const fetchStates = async () => {
    try {
      const { data, error } = await supabase
        .from('states')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setStates(data || []);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (stateId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, state_id')
        .eq('state_id', stateId)
        .order('name');
      
      if (error) throw error;
      setCities(data || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNagars = async (cityId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('nagars')
        .select('id, name, city_id')
        .eq('city_id', cityId)
        .order('name');
      
      if (error) throw error;
      setNagars(data || []);
    } catch (error) {
      console.error('Error fetching nagars:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'roads', label: 'Roads (Potholes, Broken roads)', icon: '🕳️' },
    { value: 'sewage', label: 'Sewage (Leakages, Drainage issues)', icon: '💧' },
    { value: 'sanitation', label: 'Sanitation (Garbage, Filth)', icon: '🧹' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      console.log('Starting complaint submission...', complaintData);
      
      // Upload photo to Supabase storage if available
      let photoUrl = null;
      if (complaintData.photo) {
        toast({
          title: "Uploading photo...",
          description: "Please wait while we upload your photo.",
        });
        
        const fileExt = complaintData.photo.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('complaint-photos')
          .upload(fileName, complaintData.photo);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Photo upload failed",
            description: "Failed to upload photo. Please try again.",
            variant: "destructive",
          });
          return;
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('complaint-photos')
            .getPublicUrl(fileName);
          photoUrl = publicUrl;
          console.log('Photo uploaded successfully:', photoUrl);
        }
      }

      toast({
        title: "Saving complaint...",
        description: "Please wait while we save your complaint.",
      });

      // Save complaint to database first (without contractor assignment)
      console.log('Saving complaint to database...');
      const { data: complaintRecord, error } = await supabase
        .from('complaints')
        .insert({
          state_id: complaintData.state_id,
          city_id: complaintData.city_id,
          nagar_id: complaintData.nagar_id,
          address: complaintData.address,
          citizen_name: complaintData.name,
          citizen_phone: complaintData.phone,
          description: complaintData.details,
          category: complaintData.category as any,
          photo_url: photoUrl,
          status: 'pending' as any
        })
        .select('*, complaint_number')
        .single();

      if (error) {
        console.error('Database error:', error);
        toast({
          title: "Submission failed",
          description: `Failed to submit complaint: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Complaint saved successfully:', complaintRecord);

      // Try to assign contractor using the security definer function
      console.log('Attempting to assign contractor for nagar_id:', complaintData.nagar_id);
      
      let contractorAssignmentData = null;
      try {
        const { data: assignmentResult, error: assignmentError } = await supabase
          .rpc('assign_contractor_to_complaint', {
            p_complaint_id: complaintRecord.id,
            p_nagar_id: complaintData.nagar_id
          });

        console.log('Contractor assignment result:', { assignmentResult, assignmentError });

        if (!assignmentError && assignmentResult && assignmentResult.length > 0) {
          const assignment = assignmentResult[0];
          if (assignment.success) {
            contractorAssignmentData = assignment;
            console.log('✅ Contractor assigned successfully:', {
              contractorId: assignment.contractor_id,
              contractorName: assignment.contractor_name
            });
          } else {
            console.log('ℹ️ No contractor available for this nagar');
          }
        }
      } catch (assignmentError) {
        console.error('❌ Contractor assignment error (non-critical):', assignmentError);
      }

      // Send contractor assignment webhook if contractor was assigned
      if (contractorAssignmentData && contractorAssignmentData.success) {
        console.log('🚀 Preparing to send contractor assignment webhook...');
        try {
          // Use contractor data already returned by the security definer function
          const assignmentWebhookData = {
            // Complaint details
            complaint_id: complaintRecord.id,
            complaint_number: complaintRecord.complaint_number,
            citizen_name: complaintData.name,
            citizen_phone: complaintData.phone,
            category: complaintData.category,
            description: complaintData.details,
            address: complaintData.address,
            photo_url: photoUrl || '',
            status: 'in_progress', // Status was updated by the function
            created_at: complaintRecord.created_at,
            assigned_at: new Date().toISOString(),
            // Contractor details from the function result
            contractor_id: contractorAssignmentData.contractor_id,
            contractor_name: contractorAssignmentData.contractor_name,
            contractor_phone: contractorAssignmentData.contractor_phone,
            contractor_email: contractorAssignmentData.contractor_email || ''
          };

          console.log('📤 Sending contractor assignment webhook to n8n...', assignmentWebhookData);

          const assignmentFormData = new FormData();
          Object.entries(assignmentWebhookData).forEach(([key, value]) => {
            assignmentFormData.append(key, String(value));
          });

          const webhookResponse = await fetch('https://mitulz.app.n8n.cloud/webhook/cf099891-51ee-49a9-9ef3-ee64b51d9778', {
            method: 'POST',
            body: assignmentFormData,
            mode: 'no-cors'
          });

          console.log('✅ Contractor assignment webhook sent successfully to n8n!');
        } catch (webhookError) {
          console.error('❌ Contractor assignment webhook error (non-critical):', webhookError);
        }
      } else {
        console.log('ℹ️ No contractor assigned, skipping contractor assignment webhook');
      }

      // Send webhook notification
      try {
        const webhookData = {
          id: complaintRecord.id,
          complaint_number: complaintRecord.complaint_number,
          citizen_name: complaintData.name,
          citizen_phone: complaintData.phone,
          category: complaintData.category,
          description: complaintData.details,
          address: complaintData.address,
          photo_url: photoUrl || '',
          status: complaintRecord.status,
          created_at: complaintRecord.created_at
        };

        console.log('Sending webhook notification...', webhookData);

        // Send as form data for better webhook compatibility
        const formData = new FormData();
        Object.entries(webhookData).forEach(([key, value]) => {
          formData.append(key, String(value));
        });

        const webhookResponse = await fetch('https://mitulz.app.n8n.cloud/webhook/992930c7-973a-4357-8105-c6e3ca32faf9', {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });

        console.log('Webhook sent successfully');
      } catch (webhookError) {
        console.error('Webhook error (non-critical):', webhookError);
        // Don't fail the submission if webhook fails
      }

      toast({
        title: "Complaint submitted successfully!",
        description: "Your complaint has been registered and we'll notify you of updates.",
      });

      setCurrentStep(6); // Show success screen
      
      // Store complaint number for success screen
      setComplaintData(prev => ({ 
        ...prev, 
        complaint_reference: complaintRecord.complaint_number 
      }));
      
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setComplaintData({ ...complaintData, photo: event.target.files[0] });
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setComplaintData({ ...complaintData, photo: event.target.files[0] });
    }
  };

  if (currentStep === 6) {
    return (
      <Card className="w-full max-w-md mx-auto card-shadow">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-xl font-bold text-success mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-4">
            Your complaint has been submitted successfully
          </p>
          <div className="bg-success/10 p-4 rounded-lg">
            <p className="text-sm text-success font-medium">
              Complaint Number: {complaintData.complaint_reference || 'Generating...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="card-shadow">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {currentStep === 1 && <><Camera className="w-5 h-5" />Upload Photo</>}
            {currentStep === 2 && <><FileText className="w-5 h-5" />Select Category</>}
            {currentStep === 3 && <><MapPin className="w-5 h-5" />Choose Location</>}
            {currentStep === 4 && <><Phone className="w-5 h-5" />Contact Details</>}
            {currentStep === 5 && <><FileText className="w-5 h-5" />Problem Details</>}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step 1: Photo Upload */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Upload from gallery */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-civic transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload from gallery
                    </p>
                  </label>
                </div>

                {/* Take photo with camera */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-civic transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="hidden"
                    id="camera-capture"
                  />
                  <label htmlFor="camera-capture" className="cursor-pointer">
                    <Camera className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Take photo
                    </p>
                  </label>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  JPG, PNG up to 10MB
                </p>
              </div>

              {complaintData.photo && (
                <p className="text-sm text-success text-center">✓ Photo captured: {complaintData.photo.name}</p>
              )}
            </div>
          )}

          {/* Step 2: Category Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>Select complaint category:</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Card
                    key={category.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      complaintData.category === category.value
                        ? 'border-civic bg-civic/5'
                        : 'border-border hover:border-civic/50'
                    }`}
                    onClick={() => setComplaintData({ ...complaintData, category: category.value })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="font-medium">{category.label}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Location Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Select 
                  value={complaintData.state_id} 
                  onValueChange={(value) => 
                    setComplaintData({ ...complaintData, state_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Select 
                  value={complaintData.city_id} 
                  onValueChange={(value) => 
                    setComplaintData({ ...complaintData, city_id: value })
                  }
                  disabled={!complaintData.state_id || loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !complaintData.state_id 
                        ? "Select state first" 
                        : loading 
                          ? "Loading cities..." 
                          : "Select your city"
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nagar">Nagar/Ward</Label>
                <Select 
                  value={complaintData.nagar_id} 
                  onValueChange={(value) => 
                    setComplaintData({ ...complaintData, nagar_id: value })
                  }
                  disabled={!complaintData.city_id || loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !complaintData.city_id 
                        ? "Select city first" 
                        : loading 
                          ? "Loading nagars..." 
                          : "Select your nagar/ward"
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {nagars.map((nagar) => (
                      <SelectItem key={nagar.id} value={nagar.id}>
                        {nagar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter the exact location address..."
                  value={complaintData.address}
                  onChange={(e) => setComplaintData({ ...complaintData, address: e.target.value })}
                />
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  📍 Tip: Be as specific as possible with the address for faster resolution
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Contact Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={complaintData.name}
                  onChange={(e) => setComplaintData({ ...complaintData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={complaintData.phone}
                  onChange={(e) => setComplaintData({ ...complaintData, phone: e.target.value })}
                />
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  📱 We'll send you updates about your complaint resolution
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Details */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="details">Describe the problem</Label>
                <Textarea
                  id="details"
                  placeholder="Please provide detailed description of the issue..."
                  value={complaintData.details}
                  onChange={(e) => setComplaintData({ ...complaintData, details: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  ✍️ More details help officials understand and resolve the issue faster
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                variant="civic"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="civic"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Complaint
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintWizard;