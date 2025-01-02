import React from 'react';

interface AnimatedShapeProps {
  gradient: string[];
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  blur: number;
}

export function AnimatedShape({ gradient, size, top, left, duration, delay, blur }: AnimatedShapeProps) {
  return (
    <div
      className="absolute rounded-full mix-blend-multiply filter animate-float opacity-60"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top,
        left,
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        background: `linear-gradient(45deg, ${gradient[0]}, ${gradient[1]})`,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}