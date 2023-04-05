import React, { useState, useEffect } from 'react';

function GyroscopeSensor() {
  const [gyroscopeData, setGyroscopeData] = useState({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    window.addEventListener('deviceorientation', handleOrientationEvent);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientationEvent);
    };
  }, []);

  function handleOrientationEvent(event: DeviceOrientationEvent) {
    console.log('masuk sini')
    setGyroscopeData({
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0
    });
  }

  return (
    <div>
      <h2>Gyroscope Sensor Data</h2>
      <p>Rotation around z-axis (alpha): {gyroscopeData.alpha}</p>
      <p>Rotation around x-axis (beta): {gyroscopeData.beta}</p>
      <p>Rotation around y-axis (gamma): {gyroscopeData.gamma}</p>
    </div>
  );
}

export default GyroscopeSensor;