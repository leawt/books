import React, { useEffect, useState } from 'react';

const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const symbols = ['✦', '✧', '•', '✩', '✪'];
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      size: Math.random() * 4 + 6,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            fontSize: `${particle.size}px`,
          }}
        >
          {particle.symbol}
        </div>
      ))}
    </div>
  );
};

export default FloatingParticles;

