import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MapPin, Phone, User, Camera, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const complaintSchema = z.object({
  citizen_name: z.string().min(2, 'Name must be at least 2 characters'),
  citizen_phone: z.string().regex(/^[+]?[\d\s-()]+$/, 'Invalid phone number'),
  state_id: z.string().uuid('Please select a state'),
  city_id: z.string().uuid('Please select a city'),
  nagar_id: z.string().uuid('Please select a nagar/ward'),
  category: z.enum(['roads', 'sewage', 'sanitation'], { required_error: 'Please select a category' }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
});

type ComplaintData = z.infer<typeof complaintSchema>;

interface LocationData {
  states: Array<{ id: string; name: string }>;
  cities: Array<{ id: string; name: string; state_id: string }>;
  nagars: Array<{ id: string; name: string; city_id: string }>;
}

export default function ComplaintFormWizard({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [locationData, setLocationData] = useState<LocationData>({ states: [], cities: [], nagars: [] });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const form = useForm<ComplaintData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      citizen_name: '',
      citizen_phone: '',
      description: '',
    },
  });

  const watchedState = form.watch('state_id');
  const watchedCity = form.watch('city_id');

  // Fetch location data
  React.useEffect(() => {
    fetchStates();
  }, []);

  React.useEffect(() => {
    if (watchedState) {
      fetchCities(watchedState);
      form.setValue('city_id', '');
      form.setValue('nagar_id', '');
    }
  }, [watchedState]);

  React.useEffect(() => {
    if (watchedCity) {
      fetchNagars(watchedCity);
      form.setValue('nagar_id', '');
    }
  }, [watchedCity]);

  const fetchStates = async () => {
    const { data } = await supabase.from('states').select('id, name').order('name');
    if (data) setLocationData(prev => ({ ...prev, states: data }));
  };

  const fetchCities = async (stateId: string) => {
    const { data } = await supabase.from('cities').select('id, name, state_id').eq('state_id', stateId).order('name');
    if (data) setLocationData(prev => ({ ...prev, cities: data }));
  };

  const fetchNagars = async (cityId: string) => {
    const { data } = await supabase.from('nagars').select('id, name, city_id').eq('city_id', cityId).order('name');
    if (data) setLocationData(prev => ({ ...prev, nagars: data }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

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

  const handleSubmit = async (data: ComplaintData) => {
    setIsSubmitting(true);
    try {
      const { data: complaint, error } = await supabase
        .from('complaints')
        .insert({
          citizen_name: data.citizen_name,
          citizen_phone: data.citizen_phone,
          state_id: data.state_id,
          city_id: data.city_id,
          nagar_id: data.nagar_id,
          category: data.category,
          description: data.description,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
        })
        .select('id')
        .single();

      if (error) throw error;

      setReferenceId(complaint.id.substring(0, 8).toUpperCase());
      setIsSuccess(true);
      toast({
        title: "Complaint Submitted Successfully",
        description: "Your complaint has been registered and will be reviewed by authorities.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-xl">Thank You!</CardTitle>
          <CardDescription>Your complaint has been submitted successfully</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-semibold">Reference ID</p>
            <p className="text-lg font-mono">{referenceId}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Please save this reference ID for tracking your complaint status.
          </p>
          <Button onClick={onClose} className="w-full">Close</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Report a Problem</CardTitle>
            <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <User className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Personal Details</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="citizen_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="citizen_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Location Details</h3>
                </div>

                <FormField
                  control={form.control}
                  name="state_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locationData.states.map((state) => (
                            <SelectItem key={state.id} value={state.id}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locationData.cities.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nagar_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nagar/Ward</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select nagar/ward" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locationData.nagars.map((nagar) => (
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
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Camera className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Problem Category & Photo</h3>
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="roads">Roads</SelectItem>
                          <SelectItem value="sewage">Sewage</SelectItem>
                          <SelectItem value="sanitation">Sanitation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Upload Photo</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <span className="text-sm text-muted-foreground">
                        {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Problem Description</h3>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe the Problem</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please provide a detailed description of the problem..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}