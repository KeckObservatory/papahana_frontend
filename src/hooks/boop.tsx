import { useState, useEffect } from 'react';
import { SpringValue, useSpring } from 'react-spring';

interface Args {
  x?: number;
  y?: number;
  z?: number;
  rotation?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  scale?: number;
  sx?: number;
  sy?: number;
  sz?: number;
  skewX?: number;
  skewY?: number;
  timing?: number;
  springConfig?: {
    tension?: number;
    friction?: number;
  };
  delay?: number;
};

interface SpringStyle {
  color?: string,
  transform?: SpringValue<string>;
};

type Boop = (args: Args) => [SpringStyle, any];

const useBoop: Boop = ({
  x = 0,
  y = 0,
  z = 0,
  rotation = 45,
  rx = 0,
  ry = 0,
  rz = rotation,
  scale = 1,
  sx = scale || 1,
  sy = scale || 1,
  sz = scale || 1,
  skewX = 0,
  skewY = 0,
  timing = 150,
  springConfig = {
    tension: 300,
    friction: 10,
  },
  delay = 0,
} = {}) => {
  const [isBooped, setIsBooped] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [loop, setLoop] = useState( null as any );

  const style: SpringStyle = useSpring({
    transform: isBooped
      ? `translate3D(${x}px, ${y}px, ${z}px)
         rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)
         scale3D(${sx},${sy},${sz})
         skew(${skewX}deg, ${skewY}deg)`
      : `translate3D(0px, 0px, 0px)
         rotateX(0deg) rotateY(0deg) rotateZ(0deg)
         scale3D(1, 1, 1)
         skew(0deg, 0deg)`,
    config: springConfig,
  });

  const trigger = (triggered: boolean=true) => {
    console.log(`setting to triggered to`)
    console.log(triggered)
    setIsTriggered(triggered);
  };

  useEffect(() => {
    if (isTriggered) {
      console.log('setting interval')
      setLoop(
        setInterval(
        () => setIsBooped(true),
        1000
      )
      )
    }
    else {
      console.log('clearing interval')
      clearInterval(loop)
    };
  }, [isTriggered, delay]);

  useEffect(() => {
    if (!isBooped) return;
    console.log('booping')
    const timeoutId = window.setTimeout(() => setIsBooped(false), timing);
    return () => window.clearTimeout(timeoutId);
  }, [isBooped, timing]);

  return [style, trigger];
};

export default useBoop;