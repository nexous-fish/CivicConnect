import { useEffect, useState } from 'react';
import { TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

interface StatsCounterProps {
  totalReported: number;
  totalResolved: number;
  resolutionRate: number;
}

const StatsCounter = ({ totalReported, totalResolved, resolutionRate }: StatsCounterProps) => {
  const [animatedReported, setAnimatedReported] = useState(0);
  const [animatedResolved, setAnimatedResolved] = useState(0);
  const [animatedRate, setAnimatedRate] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 FPS
    const stepTime = duration / steps;

    const reportedStep = totalReported / steps;
    const resolvedStep = totalResolved / steps;
    const rateStep = resolutionRate / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedReported(Math.min(Math.round(reportedStep * currentStep), totalReported));
      setAnimatedResolved(Math.min(Math.round(resolvedStep * currentStep), totalResolved));
      setAnimatedRate(Math.min(Math.round(rateStep * currentStep), resolutionRate));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [totalReported, totalResolved, resolutionRate]);

  return (
    <div className="w-full bg-gradient-to-r from-civic/10 via-primary/5 to-success/10 border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Reported */}
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center gap-3 mb-2">
              <AlertTriangle className="w-8 h-8 text-civic animate-pulse" />
              <span className="text-2xl">🚧</span>
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-civic mb-1 tabular-nums">
              {animatedReported.toLocaleString()}
            </div>
            <div className="text-lg font-medium text-muted-foreground">
              Issues Reported
            </div>
          </div>

          {/* Total Resolved */}
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8 text-success animate-pulse" />
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-success mb-1 tabular-nums">
              {animatedResolved.toLocaleString()}
            </div>
            <div className="text-lg font-medium text-muted-foreground">
              Resolved
            </div>
          </div>

          {/* Resolution Rate */}
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-primary mb-1 tabular-nums">
              {animatedRate}%
            </div>
            <div className="text-lg font-medium text-muted-foreground">
              Success Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;