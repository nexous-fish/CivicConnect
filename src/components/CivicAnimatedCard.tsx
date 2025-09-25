import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
  Visual2,
} from "@/components/ui/animated-card-diagram";

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
  secondaryColor,
}: CivicAnimatedCardProps) {
  return (
    <AnimatedCard>
      <CardVisual>
        <Visual2 mainColor={mainColor} secondaryColor={secondaryColor} />
      </CardVisual>
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardBody>
    </AnimatedCard>
  );
}