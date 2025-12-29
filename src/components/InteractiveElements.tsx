import React from 'react';
import { useMagneticEffect } from '@/hooks/useInteractions';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  strength = 0.3, 
  className = '', 
  ...props 
}) => {
  const { position, handleMouseMove, handleMouseLeave, style } = useMagneticEffect(strength);

  return (
    <button
      className={`interactive-scale ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

interface FloatingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  delay = 0, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`glass-card float ${className}`}
      style={{ animationDelay: `${delay}s` }}
      {...props}
    >
      {children}
    </div>
  );
};

interface GlowTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GlowText: React.FC<GlowTextProps> = ({ children, className = '' }) => {
  return (
    <span className={`text-fire ${className}`}>
      {children}
    </span>
  );
};

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({ children, className = '' }) => {
  return (
    <span className={`gold-shimmer ${className}`}>
      {children}
    </span>
  );
};

interface PulseElementProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const PulseElement: React.FC<PulseElementProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`ember-pulse ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'magnetic' | 'neon' | 'premium';
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({ 
  children, 
  variant = 'magnetic', 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`glass-card hover:scale-105 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
