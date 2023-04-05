import React, { useEffect, useRef } from 'react'
import Loading from './Loading';
import UseSpineAnimation from './UseSpineAnimation';

const WhimsyBearMoving: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    const spineUrl = 'assets/hero/1/WhimsyBear_Animation.json'
    const bearSpine  = UseSpineAnimation(canvasRef, spineUrl, 0.5)

    useEffect(() => {
        if (bearSpine) {
            bearSpine.state.setAnimation(0, 'idle', true)
        }
    }, [bearSpine])

    return (
        <div style={{height: 300, width: 450}}>
            {!bearSpine && <Loading color="#f1c232" indeterminate={true} />}
            <div style={{height: 'inherit', width: 'inherit'}} ref={canvasRef}></div>
        </div>
    );
};

export default WhimsyBearMoving
