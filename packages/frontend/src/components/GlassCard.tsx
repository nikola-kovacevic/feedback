import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, style, className }) => {
  const cls = className ? `glass-card ${className}` : 'glass-card';
  return (
    <div className={cls} style={{ padding: 24, ...style }}>
      {children}
    </div>
  );
};

export default GlassCard;
