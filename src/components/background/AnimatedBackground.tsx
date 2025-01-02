import { AnimatedShape } from './AnimatedShape';

export function AnimatedBackground() {
  const shapes = [
    // Larger, more vibrant shapes with gradient overlays
    { 
      gradient: ['#4F46E5', '#7C3AED'],
      size: 400, 
      top: '5%', 
      left: '10%', 
      duration: 25, 
      delay: 0,
      blur: 60
    },
    { 
      gradient: ['#EC4899', '#F43F5E'],
      size: 350, 
      top: '60%', 
      left: '85%', 
      duration: 20, 
      delay: 2,
      blur: 50
    },
    { 
      gradient: ['#06B6D4', '#3B82F6'],
      size: 300, 
      top: '25%', 
      left: '65%', 
      duration: 22, 
      delay: 1,
      blur: 45
    },
    { 
      gradient: ['#8B5CF6', '#D946EF'],
      size: 280, 
      top: '75%', 
      left: '20%', 
      duration: 28, 
      delay: 3,
      blur: 55
    },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-indigo-50 to-pink-50">
      {shapes.map((shape, index) => (
        <AnimatedShape key={index} {...shape} />
      ))}
    </div>
  );
}