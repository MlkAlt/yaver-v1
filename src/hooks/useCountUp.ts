import { useState, useEffect } from 'react';

export function useCountUp(target: number, duration = 1000, delay = 0): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const step = target / (duration / 16);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return count;
}
