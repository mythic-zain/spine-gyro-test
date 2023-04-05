import React, { useState, useEffect } from 'react';

const GyroMotion = () => {
  const [rotationRate, setRotationRate] = useState({ alpha: 0, beta: 0, gamma: 0 });

  const handleMotion = (event: DeviceMotionEvent) => {
    setRotationRate({
      alpha: event.rotationRate?.alpha || 0,
      beta: event.rotationRate?.beta || 0,
      gamma: event.rotationRate?.gamma || 0,
    });
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
    <div>
      <p>Rotation rate:</p>
      <ul>
        <li>X-axis: {rotationRate.alpha.toFixed(2)}</li>
        <li>Y-axis: {rotationRate.beta.toFixed(2)}</li>
        <li>Z-axis: {rotationRate.gamma.toFixed(2)}</li>
      </ul>
    </div>
  );
};

export default GyroMotion;

// 0.25 up to 768
// 0.5 768 - 2559
// 1 > 2560