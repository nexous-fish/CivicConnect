import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, Phone, Clock, TrendingUp, Star, Award, Users } from 'lucide-react';
import HeroSlider from "@/components/HeroSlider";
import IndiaMap from "@/components/IndiaMap";
import ComplaintWizard from "@/components/ComplaintWizard";
import StatsCard from "@/components/StatsCard";
import InfoSlider from "@/components/InfoSlider";

const NewIndex = () => {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setShowWizard(false)}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <ComplaintWizard onClose={() => setShowWizard(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 civic-gradient rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-serif">CivicConnect</h1>
                <p className="text-sm text-muted-foreground">Municipal Complaint Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="civic-outline" size="sm">
                Officer Login
              </Button>
              <Button variant="ghost" size="sm">
                Help & Support
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Slider Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <HeroSlider onReportClick={() => setShowWizard(true)} />
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="py-8 bg-gradient-to-r from-primary/5 via-civic/5 to-success/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-civic font-serif">2,847</div>
              <div className="text-sm text-muted-foreground">Issues Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success font-serif">48hrs</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning font-serif">156</div>
              <div className="text-sm text-muted-foreground">Active Cases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary font-serif">15.4K</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive India Map */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
              Live Complaint Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time overview of civic issues across India. Click on any state to see detailed complaint statistics.
            </p>
          </div>

          <Card className="card-shadow border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <MapPin className="w-6 h-6 text-civic" />
                <span className="font-serif">India Complaint Heatmap</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <IndiaMap />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-16 bg-gradient-to-br from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
              Platform Statistics
            </h3>
            <p className="text-lg text-muted-foreground">
              Track our collective impact on improving civic infrastructure
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Complaints"
              value="1,234"
              description="+12% from last month"
              icon={AlertTriangle}
              trend="up"
              color="civic"
            />
            <StatsCard
              title="Road Issues"
              value="456"
              description="Potholes & broken roads"
              icon={MapPin}
              color="danger"
            />
            <StatsCard
              title="Sewage Problems"
              value="321"
              description="Drainage & leakages"
              icon={Phone}
              color="warning"
            />
            <StatsCard
              title="Sanitation Issues"
              value="457"
              description="Garbage & cleanliness"
              icon={TrendingUp}
              color="success"
            />
          </div>
        </div>
      </section>

      {/* Info Slider - How it Works */}
      <InfoSlider />

      {/* Complaint Submission Widget */}
      <section className="py-16 bg-gradient-to-br from-civic/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="card-shadow hover-lift">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4 font-serif">
                    Report a Civic Issue
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Help us improve your community by reporting problems that need attention
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-civic/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-civic" />
                    </div>
                    <h4 className="font-semibold mb-2">Quick Reporting</h4>
                    <p className="text-sm text-muted-foreground">Upload photos and describe the issue in under 2 minutes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Precise Location</h4>
                    <p className="text-sm text-muted-foreground">Pin-point exact location for faster resolution</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-success" />
                    </div>
                    <h4 className="font-semibold mb-2">Track Progress</h4>
                    <p className="text-sm text-muted-foreground">Get real-time updates until issue is resolved</p>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    variant="hero" 
                    onClick={() => setShowWizard(true)}
                    className="text-lg px-8 py-6 bg-gradient-to-r from-civic to-primary hover:from-civic/90 hover:to-primary/90"
                  >
                    🚩 Start Your Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Recognition Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
              Trusted by Millions
            </h3>
            <p className="text-lg text-muted-foreground">
              Recognized by government bodies and civic organizations across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover-lift">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-civic/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-civic" />
                </div>
                <h4 className="font-bold text-xl mb-2 font-serif">Digital India Award</h4>
                <p className="text-muted-foreground">
                  Recognized for excellence in citizen engagement and digital governance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold text-xl mb-2 font-serif">15.4K+ Active Users</h4>
                <p className="text-muted-foreground">
                  Growing community of engaged citizens working to improve their cities
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-success" />
                </div>
                <h4 className="font-bold text-xl mb-2 font-serif">4.8/5 Rating</h4>
                <p className="text-muted-foreground">
                  Highly rated by users for effectiveness and ease of use
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 civic-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h3 className="text-4xl md:text-5xl font-bold font-serif">
              Be the Change Your City Needs
            </h3>
            <p className="text-xl opacity-90 leading-relaxed">
              Every report counts. Help build cleaner, safer, and better-maintained communities for everyone. Together, we can create the India we dream of.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="hero"
                onClick={() => setShowWizard(true)}
                className="text-lg px-8 py-6 bg-white text-civic hover:bg-white/90 shadow-xl"
              >
                🚩 Submit Your First Report
              </Button>
              <Button variant="civic-outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-civic">
                📱 Download Mobile App
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 civic-gradient rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-2xl font-serif">CivicConnect</span>
                  <p className="text-sm text-muted-foreground">A Digital India Initiative</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Empowering citizens to improve their communities through technology and civic engagement. Building better cities, one report at a time.
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-civic font-serif">2.8K+</div>
                  <div className="text-xs text-muted-foreground">Issues Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary font-serif">15.4K</div>
                  <div className="text-xs text-muted-foreground">Active Citizens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success font-serif">4.8★</div>
                  <div className="text-xs text-muted-foreground">User Rating</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 font-serif">Quick Links</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-civic transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-civic transition-colors">Municipality Login</a></li>
                <li><a href="#" className="hover:text-civic transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-civic transition-colors">Help & Support</a></li>
                <li><a href="#" className="hover:text-civic transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 font-serif">Contact</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>📧 support@civicconnect.gov.in</li>
                <li>📞 1800-123-4567 (Toll Free)</li>
                <li>🕒 24/7 Emergency Hotline</li>
                <li>📍 Digital India Initiative</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CivicConnect. A Digital India Initiative. All rights reserved. | Made with ❤️ for a better India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewIndex;