import { useEffect } from 'react';

const CursorTrail = () => {
  useEffect(() => {
    let trails = [];
    const maxTrails = 8;

    const createTrail = (e) => {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
      document.body.appendChild(trail);
      trails.push(trail);

      // Remove old trails
      if (trails.length > maxTrails) {
        const oldTrail = trails.shift();
        if (oldTrail) {
          oldTrail.remove();
        }
      }

      // Remove trail after animation
      setTimeout(() => {
        trail.remove();
        trails = trails.filter(t => t !== trail);
      }, 500);
    };

    window.addEventListener('mousemove', createTrail);

    return () => {
      window.removeEventListener('mousemove', createTrail);
      trails.forEach(trail => trail.remove());
    };
  }, []);

  return null;
};

export default CursorTrail;
