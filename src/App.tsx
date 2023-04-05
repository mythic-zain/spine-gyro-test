import React from 'react';
import './App.css';
import WhimsyBearMoving from './Spine/WhimsyBearMoving';
import WhimsyBearStory from './Spine/WhimsyBearStory';
import GyroscopeSensor from './Spine/GyroscopeSensor';
import GyroMotion from './Spine/GyroMotion';

function App() {

  	return (
    	<>
    		{/* <WhimsyBearMoving /> */}
			{/* <WhimsyBearStory /> */}
			<GyroscopeSensor />
			<GyroMotion />
    	</>
  	);
}

export default App;
