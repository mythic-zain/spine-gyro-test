import React, { useEffect } from 'react';

const GyroMotion = () => {
  const handleMotion = (event: DeviceMotionEvent) => {
    const x = event.accelerationIncludingGravity?.x; // Get the device's left-right acceleration (in m/s^2)
    const y = event.accelerationIncludingGravity?.y; // Get the device's front-back acceleration (in m/s^2)
    const item = document.getElementById('myItem'); // Get your item element
    if (item) {
      item.style.transform = `translate(${x}px, ${y}px)`; // Move the item based on the acceleration
    }
  };

  useEffect(() => {
    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return (
    <div>
      <h1>Moving Component using Device Motion</h1>
      <div id="myItem" style={{ height: '50px', width: '50px', backgroundColor: 'red' }}></div>
      <p>Move your device to move the red square horizontally and vertically.</p>
    </div>
  );
};

export default GyroMotion;