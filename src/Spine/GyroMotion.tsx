import React, { useState, useEffect } from 'react';

const GyroMotion = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMotion = (event: DeviceMotionEvent) => {
    const alpha = event.rotationRate?.alpha || 0;
    const beta = event.rotationRate?.beta || 0;

    setPosition(prevPosition => ({
      x: prevPosition.x - beta / 10,
      y: prevPosition.y + alpha / 10,
    }));
  };

  useEffect(() => {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion, true);
      return () => window.removeEventListener('devicemotion', handleMotion);
    } else {
      console.warn('DeviceMotionEvent is not supported');
    }
  }, []);

  return (
    <div style={{ position: 'absolute', top: `${position.y}px`, left: `${position.x}px` }}>
      <p>Move me using gyroscope sensor!</p>
      <p>X = {position.x}</p>
      <p>Y = {position.y}</p>
    </div>
  );
};

export default GyroMotion;