import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

interface TrendingProblem {
  category: string;
  count: number;
}

interface TrendingProblemsCloudProps {
  problems: TrendingProblem[];
}

const TrendingProblemsCloud = ({ problems }: TrendingProblemsCloudProps) => {
  const getWordSize = (count: number, maxCount: number) => {
    const minSize = 12;
    const maxSize = 32;
    const ratio = count / maxCount;
    return minSize + (maxSize - minSize) * ratio;
  };

  const getWordColor = (index: number) => {
    const colors = [
      'text-civic hover:text-civic-accent',
      'text-primary hover:text-primary/80',
      'text-success hover:text-success/80',
      'text-warning hover:text-warning/80',
      'text-danger hover:text-danger/80',
      'text-purple-600 hover:text-purple-500',
      'text-blue-600 hover:text-blue-500',
      'text-green-600 hover:text-green-500'
    ];
    return colors[index % colors.length];
  };

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'roads': '🛣️',
      'sewage': '🚰',
      'garbage': '🗑️',
      'street_lights': '💡',
      'water_supply': '💧',
      'parks': '🌳',
      'drainage': '⚡',
      'traffic': '🚦'
    };
    return emojiMap[category] || '⚠️';
  };

  const maxCount = Math.max(...problems.map(p => p.count));

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-xl">🔥</span>
          Trending Problems
          <TrendingUp className="w-5 h-5 text-civic ml-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px] p-4">
          {problems.map((problem, index) => (
            <div
              key={problem.category}
              className={`cursor-pointer transition-all duration-300 hover:scale-110 font-bold ${getWordColor(index)}`}
              style={{ fontSize: `${getWordSize(problem.count, maxCount)}px` }}
              title={`${problem.count} reports`}
            >
              <span className="mr-1">{getCategoryEmoji(problem.category)}</span>
              {problem.category.replace('_', ' ')}
            </div>
          ))}
        </div>
        {problems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No trending data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingProblemsCloud;