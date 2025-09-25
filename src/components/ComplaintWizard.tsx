import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, Camera, MapPin, Phone, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface ComplaintData {
  photo: File | null;
  municipality: string;
  address: string;
  phone: string;
  details: string;
  category: string;
}

const ComplaintWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complaintData, setComplaintData] = useState<ComplaintData>({
    photo: null,
    municipality: '',
    address: '',
    phone: '',
    details: '',
    category: ''
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const municipalities = [
    'Mumbai Municipal Corporation',
    'Delhi Municipal Corporation', 
    'Bangalore Municipal Corporation',
    'Chennai Municipal Corporation',
    'Kolkata Municipal Corporation',
    'Hyderabad Municipal Corporation',
    'Pune Municipal Corporation',
    'Ahmedabad Municipal Corporation'
  ];

  const categories = [
    { value: 'roads', label: '🕳️ Roads (Potholes, Broken roads)', icon: '🕳️' },
    { value: 'sewage', label: '💧 Sewage (Leakages, Drainage issues)', icon: '💧' },
    { value: 'sanitation', label: '🧹 Sanitation (Garbage, Filth)', icon: '🧹' }
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

  if (currentStep === 6) {
    return (
      <Card className="w-full max-w-md mx-auto card-shadow">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-xl font-bold text-success mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-4">
            Your complaint has been submitted to {complaintData.municipality}
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
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-civic transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG up to 10MB
                  </p>
                </label>
              </div>
              {complaintData.photo && (
                <p className="text-sm text-success">✓ Photo uploaded: {complaintData.photo.name}</p>
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

          {/* Step 3: Municipality & Address */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="municipality">Municipality/City</Label>
                <Select value={complaintData.municipality} onValueChange={(value) => 
                  setComplaintData({ ...complaintData, municipality: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your municipality" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map((municipality) => (
                      <SelectItem key={municipality} value={municipality}>
                        {municipality}
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