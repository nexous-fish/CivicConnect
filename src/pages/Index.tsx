// Update this page (the content is just a fallback if you fail to update the page)

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, Phone, Clock, TrendingUp } from 'lucide-react';
import { GlobeDemo } from "@/components/GlobeDemo";
import ComplaintWizard from "@/components/ComplaintWizard";
import StatsCard from "@/components/StatsCard";
import CivicIssuesSlider from "@/components/CivicIssuesSlider";
import CivicAnimatedCard from "@/components/CivicAnimatedCard";
import { useStateComplaintData, useWeeklyComplaintData } from "@/hooks/useComplaintStats";
import { 
  AnimatedCard, 
  CardBody as AnimatedCardBody, 
  CardDescription as AnimatedCardDescription, 
  CardTitle as AnimatedCardTitle, 
  CardVisual, 
  Visual1 
} from "@/components/ui/animated-card";
import { 
  AnimatedCard as AnimatedChartCard, 
  CardBody as ChartCardBody, 
  CardDescription as ChartCardDescription, 
  CardTitle as ChartCardTitle, 
  CardVisual as ChartCardVisual, 
  Visual3 
} from "@/components/ui/animated-card-chart";

const Index = () => {
  const [showWizard, setShowWizard] = useState(false);
  const { data: stateData } = useStateComplaintData();
  const { data: weeklyData } = useWeeklyComplaintData();

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
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 civic-gradient rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CivicConnect</h1>
                <p className="text-sm text-muted-foreground">Municipal Complaint Portal</p>
              </div>
            </div>
            <Button 
              variant="civic-outline" 
              size="sm"
              onClick={() => window.location.href = '/officer-auth'}
            >
              Officer Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-primary/5 via-civic/5 to-success/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Report Civic Issues,{' '}
                  <span className="bg-gradient-to-r from-civic to-primary bg-clip-text text-transparent">
                    Build Better Cities
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Help improve your community by reporting roads, sewage, and sanitation issues directly to municipal authorities.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  onClick={() => setShowWizard(true)}
                  className="w-full sm:w-auto"
                >
                  🚩 Report a Problem
                </Button>
                <Button variant="civic-outline" className="w-full sm:w-auto">
                  📊 View Analytics
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-civic">2,847</div>
                  <div className="text-sm text-muted-foreground">Issues Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">48hrs</div>
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">156</div>
                  <div className="text-sm text-muted-foreground">Active Cases</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <CivicIssuesSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Live Complaint Dashboard</h3>
            <p className="text-muted-foreground">Real-time overview of civic issues across India</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

          {/* Animated Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 justify-items-center">
            <CivicAnimatedCard
              title="Resolution Rate Analytics"
              description="Real-time complaint resolution tracking with interactive visualization"
              mainColor="hsl(var(--success))"
              secondaryColor="hsl(var(--primary))"
            />
            <AnimatedCard>
              <CardVisual>
                <Visual1 mainColor="hsl(var(--civic-accent))" secondaryColor="hsl(var(--primary))" />
              </CardVisual>
              <AnimatedCardBody>
                <AnimatedCardTitle>Monthly Complaint Trends</AnimatedCardTitle>
                <AnimatedCardDescription>
                  Top state: {stateData?.[0]?.state_name || 'Maharashtra'} with {stateData?.[0]?.complaint_count || 72} complaints this month
                </AnimatedCardDescription>
              </AnimatedCardBody>
            </AnimatedCard>
            <AnimatedChartCard>
              <ChartCardVisual>
                <Visual3 mainColor="hsl(var(--warning))" secondaryColor="hsl(var(--success))" />
              </ChartCardVisual>
              <ChartCardBody>
                <ChartCardTitle>Weekly Resolution Analytics</ChartCardTitle>
                <ChartCardDescription>
                  Latest week: {weeklyData?.[weeklyData.length - 1]?.resolved_complaints || 22} of {weeklyData?.[weeklyData.length - 1]?.total_complaints || 34} complaints resolved
                </ChartCardDescription>
              </ChartCardBody>
            </AnimatedChartCard>
          </div>

          {/* COBE Globe - Full Width */}
          <div className="w-full">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <MapPin className="w-6 h-6 text-civic" />
                Interactive Earth Globe
              </h3>
              <p className="text-muted-foreground">Available in more than 30+ cities</p>
            </div>
            <GlobeDemo />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 civic-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6 text-white">
            <h3 className="text-3xl font-bold">
              Be the Change Your City Needs
            </h3>
            <p className="text-xl opacity-90">
              Every report counts. Help build cleaner, safer, and better-maintained communities for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero"
                onClick={() => setShowWizard(true)}
                className="bg-white text-civic hover:bg-white/90"
              >
                🚩 Submit Your First Report
              </Button>
              <Button variant="civic-outline" className="border-white text-white hover:bg-white hover:text-civic">
                📱 Download Mobile App
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 civic-gradient rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">CivicConnect</span>
              </div>
              <p className="text-muted-foreground">
                Empowering citizens to improve their communities through technology and civic engagement.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-civic transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-civic transition-colors">Municipality Login</a></li>
                <li><a href="#" className="hover:text-civic transition-colors">Help & Support</a></li>
                <li><a href="#" className="hover:text-civic transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>📧 support@civicconnect.gov.in</li>
                <li>📞 1800-123-4567 (Toll Free)</li>
                <li>🕒 24/7 Emergency Hotline</li>
                <li>📍 Digital India Initiative</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CivicConnect. A Digital India Initiative. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
