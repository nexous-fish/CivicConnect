"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility Function ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Card Components ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AnimatedCard({ className, ...props }: CardProps) {
  return (
    <div
      role="region"
      aria-labelledby="card-title"
      aria-describedby="card-description"
      className={cn(
        "group/animated-card relative w-[356px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-900 dark:bg-black",
        className
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: CardProps) {
  return (
    <div
      role="group"
      className={cn(
        "flex flex-col space-y-1.5 border-t border-zinc-200 p-4 dark:border-zinc-900",
        className
      )}
      {...props}
    />
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-black dark:text-white",
        className
      )}
      {...props}
    />
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm text-neutral-500 dark:text-neutral-400",
        className
      )}
      {...props}
    />
  );
}

export function CardVisual({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("h-[180px] w-[356px] overflow-hidden", className)}
      {...props}
    />
  );
}

// --- Visual Components ---
interface VisualProps {
  mainColor?: string;
  secondaryColor?: string;
  gridColor?: string;
}

interface LayerProps {
  color: string;
  secondaryColor?: string;
  hovered?: boolean;
}

// Shared Components
const GridLayer: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div
      style={{ "--grid-color": color } as React.CSSProperties}
      className="pointer-events-none absolute inset-0 z-[4] h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-70 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
    />
  );
};

const EllipseGradient: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="absolute inset-0 z-[5] flex h-full w-full items-center justify-center">
      <svg
        width="356"
        height="196"
        viewBox="0 0 356 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="356" height="180" fill="url(#paint0_radial)" />
        <defs>
          <radialGradient
            id="paint0_radial"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(178 98) rotate(90) scale(98 178)"
          >
            <stop stopColor={color} stopOpacity="0.25" />
            <stop offset="0.34" stopColor={color} stopOpacity="0.15" />
            <stop offset="1" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

// Visual1 - Line Chart
export function Visual1({ mainColor = "#8b5cf6", secondaryColor = "#fbbf24", gridColor = "#80808015" }: VisualProps) {
  const Layer1 = ({ color, secondaryColor }: LayerProps) => {
    return (
      <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute top-0 left-0 z-[6] transform transition-transform duration-500 group-hover/animated-card:translate-x-[-50%]">
        <svg className="w-[712px]" viewBox="0 0 712 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 178C8 176.343 9.34315 175 11 175H25C26.6569 175 28 176.343 28 178V196H8V178Z" fill={color} />
          <path d="M32 168C32 166.343 33.3431 165 35 165H49C50.6569 165 52 166.343 52 168V196H32V168Z" fill={secondaryColor} />
          <path d="M67 173C67 171.343 68.3431 170 70 170H84C85.6569 170 87 171.343 87 173V196H67V173Z" fill={color} />
          <path d="M91 153C91 151.343 92.3431 150 94 150H108C109.657 150 111 151.343 111 153V196H91V153Z" fill={secondaryColor} />
        </svg>
      </div>
    );
  };

  const Layer2 = ({ color }: LayerProps) => {
    return (
      <div className="absolute top-0 left-[-1px] h-full w-[356px]">
        <svg className="h-full w-[356px]" viewBox="0 0 356 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_25_384)">
            <path d="M1 131.5L33.5 125.5L64 102.5L93.5 118.5L124.5 90L154 100.5L183.5 76L207.5 92L244.5 51L274.5 60.5L307.5 46L334.5 28.5L356.5 1" stroke={color} />
            <path d="M33.5 125.5L1 131.5V197H356.5V1L335 28.5L306.5 46L274.5 60.5L244.5 51L207.5 92L183.5 76L154 100.5L124.5 90L93.5 118.5L64 102.5L33.5 125.5Z" fill={color} fillOpacity="0.3" />
          </g>
          <defs>
            <clipPath id="clip0_25_384">
              <rect width="356" height="180" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  };

  return (
    <div aria-hidden className="relative h-full w-full overflow-hidden rounded-t-lg">
      <Layer1 color={mainColor} secondaryColor={secondaryColor} />
      <Layer2 color={mainColor} />
      <EllipseGradient color={mainColor} />
      <GridLayer color={gridColor} />
    </div>
  );
}

// Visual2 - Donut Chart (Interactive)
export function Visual2({ mainColor = "#8b5cf6", secondaryColor = "#fbbf24", gridColor = "#80808015" }: VisualProps) {
  const [hovered, setHovered] = useState(false);

  const Layer1: React.FC<LayerProps> = ({ hovered, color, secondaryColor }) => {
    const [mainProgress, setMainProgress] = useState(12.5);
    const [secondaryProgress, setSecondaryProgress] = useState(0);

    useEffect(() => {
      let timeout: NodeJS.Timeout;
      if (hovered) {
        timeout = setTimeout(() => {
          setMainProgress(66);
          setSecondaryProgress(100);
        }, 200);
      } else {
        setMainProgress(12.5);
        setSecondaryProgress(0);
      }
      return () => clearTimeout(timeout);
    }, [hovered]);

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const mainDashoffset = circumference - (mainProgress / 100) * circumference;
    const secondaryDashoffset = circumference - (secondaryProgress / 100) * circumference;

    return (
      <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute top-0 left-0 z-[7] flex h-[360px] w-[356px] transform items-center justify-center transition-transform duration-500 group-hover/animated-card:-translate-y-[90px] group-hover/animated-card:scale-110">
        <div className="relative flex h-[120px] w-[120px] items-center justify-center text-[#00000050] dark:text-white">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" opacity={0.2} />
            <circle cx="50" cy="50" r={radius} stroke={secondaryColor} strokeWidth="14" fill="transparent" strokeDasharray={circumference} strokeDashoffset={secondaryDashoffset} transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.6, 0.6, 0, 1)" }} />
            <circle cx="50" cy="50" r={radius} stroke={color} strokeWidth="14" fill="transparent" strokeDasharray={circumference} strokeDashoffset={mainDashoffset} transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.6, 0.6, 0, 1)" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-gilroy text-xl text-black dark:text-white">
              {hovered ? (secondaryProgress > 66 ? secondaryProgress : mainProgress) : mainProgress}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="absolute inset-0 z-20" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} />
      <div className="relative h-[180px] w-[356px] overflow-hidden rounded-t-lg">
        <Layer1 hovered={hovered} color={mainColor} secondaryColor={secondaryColor} />
        <EllipseGradient color={mainColor} />
        <GridLayer color={gridColor} />
      </div>
    </>
  );
}

// Visual3 - Bar Chart (Interactive)
export function Visual3({ mainColor = "#8b5cf6", secondaryColor = "#fbbf24", gridColor = "#80808015" }: VisualProps) {
  const [hovered, setHovered] = useState(false);

  const Layer4: React.FC<LayerProps> = ({ color, secondaryColor, hovered }) => {
    const rectsData = [
      { width: 15, height: 20, y: 110, hoverHeight: 20, hoverY: 130, x: 40, fill: "currentColor", hoverFill: secondaryColor },
      { width: 15, height: 20, y: 90, hoverHeight: 20, hoverY: 130, x: 60, fill: color, hoverFill: color },
      { width: 15, height: 40, y: 70, hoverHeight: 30, hoverY: 120, x: 80, fill: color, hoverFill: color },
      { width: 15, height: 30, y: 80, hoverHeight: 50, hoverY: 100, x: 100, fill: color, hoverFill: color },
      { width: 15, height: 30, y: 110, hoverHeight: 40, hoverY: 110, x: 120, fill: "currentColor", hoverFill: secondaryColor },
      { width: 15, height: 50, y: 110, hoverHeight: 20, hoverY: 130, x: 140, fill: "currentColor", hoverFill: secondaryColor },
      { width: 15, height: 50, y: 60, hoverHeight: 30, hoverY: 120, x: 160, fill: color, hoverFill: color },
      { width: 15, height: 30, y: 80, hoverHeight: 20, hoverY: 130, x: 180, fill: color, hoverFill: color },
      { width: 15, height: 20, y: 110, hoverHeight: 40, hoverY: 110, x: 200, fill: "currentColor", hoverFill: secondaryColor },
      { width: 15, height: 40, y: 70, hoverHeight: 60, hoverY: 90, x: 220, fill: color, hoverFill: color },
      { width: 15, height: 30, y: 110, hoverHeight: 70, hoverY: 80, x: 240, fill: "currentColor", hoverFill: secondaryColor },
      { width: 15, height: 50, y: 110, hoverHeight: 50, hoverY: 100, x: 260, fill: "currentColor", hoverFill: secondaryColor },
      { width: 15, height: 20, y: 110, hoverHeight: 80, hoverY: 70, x: 280, fill: "currentColor", hoverFill: secondaryColor },
      { width: 15, height: 30, y: 80, hoverHeight: 90, hoverY: 60, x: 300, fill: color, hoverFill: color },
    ];

    return (
      <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-0 z-[8] flex h-[180px] w-[356px] items-center justify-center text-neutral-800/10 transition-transform duration-500 group-hover/animated-card:scale-150 dark:text-white/15">
        <svg width="356" height="180" xmlns="http://www.w3.org/2000/svg">
          {rectsData.map((rect, index) => (
            <rect
              key={index}
              width={rect.width}
              height={hovered ? rect.hoverHeight : rect.height}
              x={rect.x}
              y={hovered ? rect.hoverY : rect.y}
              fill={hovered ? rect.hoverFill : rect.fill}
              rx="2"
              ry="2"
              className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] transition-all duration-500"
            />
          ))}
        </svg>
      </div>
    );
  };

  return (
    <>
      <div className="absolute inset-0 z-20" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} />
      <div className="relative h-[180px] w-[356px] overflow-hidden rounded-t-lg">
        <Layer4 color={mainColor} secondaryColor={secondaryColor} hovered={hovered} />
        <EllipseGradient color={mainColor} />
        <GridLayer color={gridColor} />
      </div>
    </>
  );
}

// Unified Civic Card Component
interface CivicAnimatedCardProps {
  title: string;
  description: string;
  mainColor: string;
  secondaryColor: string;
  visualType?: 'donut' | 'line' | 'bar';
}

export default function CivicAnimatedCard({
  title,
  description,
  mainColor,
  secondaryColor,
  visualType = 'donut',
}: CivicAnimatedCardProps) {
  const renderVisual = () => {
    switch (visualType) {
      case 'line':
        return <Visual1 mainColor={mainColor} secondaryColor={secondaryColor} />;
      case 'bar':
        return <Visual3 mainColor={mainColor} secondaryColor={secondaryColor} />;
      case 'donut':
      default:
        return <Visual2 mainColor={mainColor} secondaryColor={secondaryColor} />;
    }
  };

  return (
    <AnimatedCard>
      <CardVisual>
        {renderVisual()}
      </CardVisual>
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardBody>
    </AnimatedCard>
  );
}