import { useEffect } from 'react';

const CursorTrail = () => {
  useEffect(() => {
    // Disable the sparkle trail since we're using retro cursors now
    // The retro cursors themselves provide the nostalgic feel
    return () => {};
  }, []);

  return null;
};

export default CursorTrail;
