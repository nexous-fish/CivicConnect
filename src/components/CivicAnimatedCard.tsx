import { useComplaintStats } from "@/hooks/useComplaintStats";
import { AnimatedCard, CardBody, CardDescription, CardTitle, CardVisual, Visual2 } from "@/components/ui/animated-card-diagram";
interface CivicAnimatedCardProps {
  title: string;
  description: string;
  mainColor: string;
  secondaryColor: string;
}
export default function CivicAnimatedCard({
  title,
  description,
  mainColor,
  secondaryColor
}: CivicAnimatedCardProps) {
  const {
    data: stats
  } = useComplaintStats();
  return <AnimatedCard>
      <CardVisual>
        <Visual2 mainColor={mainColor} secondaryColor={secondaryColor} resolutionRate={stats?.resolution_rate || 23.8} totalComplaints={stats?.total_complaints || 256} resolvedCount={stats?.resolved_count || 61} />
      </CardVisual>
      
    </AnimatedCard>;
}