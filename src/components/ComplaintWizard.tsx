import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, Camera, MapPin, Phone, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface ComplaintData {
  photo: File | null;
  state_id: string;
  city_id: string;
  nagar_id: string;
  address: string;
  phone: string;
  details: string;
  category: string;
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
    phone: '',
    details: '',
    category: ''
  });

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [nagars, setNagars] = useState<Nagar[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = () => {
    // Simulate submission
    setCurrentStep(6); // Show success screen
    setTimeout(() => {
      onClose();
    }, 3000);
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
              Reference ID: #CMP{Date.now().toString().slice(-6)}
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

          {/* Step 4: Phone Number */}
          {currentStep === 4 && (
            <div className="space-y-4">
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
                className="flex items-center gap-2"
              >
                Submit Complaint
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintWizard;