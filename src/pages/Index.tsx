// Update this page (the content is just a fallback if you fail to update the page)

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import { GlobeDemo } from "@/components/GlobeDemo";
import ComplaintWizard from "@/components/ComplaintWizard";
import StatsCounter from "@/components/StatsCounter";
import TopCitiesLeaderboard from "@/components/TopCitiesLeaderboard";
import TrendingProblemsCloud from "@/components/TrendingProblemsCloud";
import ResolvedHighlightsCarousel from "@/components/ResolvedHighlightsCarousel";
import QuickReportButton from "@/components/QuickReportButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ReporterOfTheWeek from "@/components/ReporterOfTheWeek";
import { useHomepageStats } from "@/hooks/useHomepageStats";

const Index = () => {
  const [showWizard, setShowWizard] = useState(false);
  const { data: stats, isLoading } = useHomepageStats();

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
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 civic-gradient rounded-lg flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CivicConnect</h1>
                <p className="text-sm text-muted-foreground">Smart Governance Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button 
                variant="civic-outline" 
                size="sm"
                onClick={() => window.location.href = '/officer-auth'}
                className="hover:scale-105 transition-transform duration-200"
              >
                Officer Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Counter Hero */}
      {!isLoading && stats && (
        <StatsCounter 
          totalReported={stats.totalReported}
          totalResolved={stats.totalResolved}
          resolutionRate={stats.resolutionRate}
        />
      )}

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background via-primary/5 to-civic/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Report Civic Issues,{' '}
              <span className="bg-gradient-to-r from-civic to-primary bg-clip-text text-transparent">
                Build Better Cities
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join thousands of citizens making their communities better through smart governance and technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                onClick={() => setShowWizard(true)}
                className="text-lg px-8 py-3 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                🚩 Report an Issue
              </Button>
              <Button 
                variant="civic-outline" 
                className="text-lg px-8 py-3 hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' })}
              >
                📊 View Analytics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Data Dashboard */}
      <section id="analytics" className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Live Data Dashboard</h3>
            <p className="text-xl text-muted-foreground">
              Real-time insights from civic engagement across India
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Top Cities Leaderboard */}
            <TopCitiesLeaderboard cities={stats?.topCities || []} />
            
            {/* Trending Problems Cloud */}
            <TrendingProblemsCloud problems={stats?.trendingProblems || []} />
            
            {/* Reporter of the Week */}
            <ReporterOfTheWeek reporter={stats?.topReporter} />
          </div>

          {/* Resolved Highlights Carousel */}
          <div className="mb-12">
            <ResolvedHighlightsCarousel resolvedItems={stats?.recentlyResolved || []} />
          </div>

          {/* Interactive Globe */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <MapPin className="w-6 h-6 text-civic" />
              Interactive Earth Globe
            </h3>
            <p className="text-muted-foreground">Available in more than 30+ cities</p>
          </div>
          <GlobeDemo />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 civic-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-civic/90 to-primary/90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h3 className="text-4xl lg:text-5xl font-bold">
              Be the Change Your City Needs
            </h3>
            <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
              Every report counts. Join thousands of citizens building cleaner, safer, and better-maintained communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Button 
                variant="hero"
                onClick={() => setShowWizard(true)}
                className="bg-white text-civic hover:bg-white/90 text-lg px-8 py-4 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                🚩 Submit Your First Report
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-civic text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
              >
                📱 Download Mobile App
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Report Floating Button */}
      <QuickReportButton />

      {/* Footer */}
      <footer className="border-t bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 civic-gradient rounded-lg flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl">CivicConnect</span>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Empowering citizens to build better communities through smart governance, technology, and collective action.
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-civic">{stats?.totalReported.toLocaleString() || '0'}</div>
                  <div className="text-sm text-muted-foreground">Total Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{stats?.totalResolved.toLocaleString() || '0'}</div>
                  <div className="text-sm text-muted-foreground">Issues Resolved</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-civic transition-colors hover:underline">How it Works</a></li>
                <li><a href="/officer-auth" className="hover:text-civic transition-colors hover:underline">Officer Portal</a></li>
                <li><a href="#" className="hover:text-civic transition-colors hover:underline">Help & Support</a></li>
                <li><a href="#" className="hover:text-civic transition-colors hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-civic transition-colors hover:underline">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Contact Info</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <a href="mailto:support@civicconnect.gov.in" className="hover:text-civic transition-colors">
                    support@civicconnect.gov.in
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>1800-123-4567 (Toll Free)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🕒</span>
                  <span>24/7 Emergency Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Digital India Initiative</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center">
            <p className="text-muted-foreground text-lg">
              &copy; 2024 CivicConnect. A Digital India Initiative. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Building better communities through technology and civic engagement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
