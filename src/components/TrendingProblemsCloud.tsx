import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

const TrendingProblemsCloud = () => {
  // Sample data with frequency weights
  const problems = [
    { text: "Potholes", frequency: 45, color: "text-red-500" },
    { text: "Sewage", frequency: 38, color: "text-orange-500" },
    { text: "Garbage", frequency: 32, color: "text-yellow-500" },
    { text: "Street Lights", frequency: 28, color: "text-green-500" },
    { text: "Water Supply", frequency: 25, color: "text-blue-500" },
    { text: "Road Damage", frequency: 22, color: "text-purple-500" },
    { text: "Drainage", frequency: 18, color: "text-pink-500" },
    { text: "Traffic Signals", frequency: 15, color: "text-indigo-500" }
  ];

  const getFontSize = (frequency: number) => {
    if (frequency > 40) return "text-3xl";
    if (frequency > 30) return "text-2xl";
    if (frequency > 20) return "text-xl";
    return "text-lg";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Trending Problems
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 justify-center items-center min-h-[200px] p-4">
          {problems.map((problem, index) => (
            <span
              key={problem.text}
              className={`
                ${getFontSize(problem.frequency)} 
                ${problem.color} 
                font-bold 
                hover:scale-110 
                transition-transform 
                cursor-pointer
                animate-fade-in
              `}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                opacity: problem.frequency / 50 + 0.5
              }}
            >
              {problem.text}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingProblemsCloud;