import React, { useEffect, useRef, useState } from 'react';
import Loading from './Loading';
import UseSpineAnimation from './UseSpineAnimation';

const WhimsyBearStory: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null)

    const spineUrl = 'assets/story/1/WhimsyBear_Story.json'
    const bearSpine = UseSpineAnimation(canvasRef, spineUrl)

    const [sceneIndex, setSceneIndex] = useState<number>(1)
    const [stateIndex, setStateIndex] = useState<number>(1)
    const [isFinished, setIsFinished] = useState<boolean>(false)

    const maxScene = 7

    const onNextClicked = () => {
        if (sceneIndex <= maxScene) {
            setStateIndex(0)
            setSceneIndex(sceneIndex + 1)
        }
    }

    const onPrevClicked = () => {
        if (sceneIndex > 1) {
            setStateIndex(1)
            setSceneIndex(sceneIndex - 1)
        }
    }

    useEffect(() => {
        if (!bearSpine) return

        const sceneState = ['out', 'in', 'idle']
        let animation = 'scene'+sceneIndex+'_'+sceneState[stateIndex]
        if (!isFinished && stateIndex === 0) {
            let current = sceneIndex
            let startIndex = current - 1
            animation = 'scene'+startIndex+'_'+sceneState[stateIndex]
        }

        bearSpine.state.setAnimation(0, animation, stateIndex === 2)

        bearSpine.state.addListener({
            complete: function() {
                if (!isFinished) {
                    if (stateIndex < sceneState.length - 1) {
                        setStateIndex(stateIndex + 1)
                    } else {
                        if (sceneIndex === maxScene) {
                            setStateIndex(0)
                            setIsFinished(true)
                        }
                    }
                }
            }
        })
    }, [bearSpine, sceneIndex, stateIndex, isFinished])

    return (
        <div style={{height: 600, width: 900, margin: 'auto'}}>
            {!bearSpine && <Loading color="#f1c232" indeterminate={true} />}
            <div style={{height: 'inherit', width: 'inherit'}} ref={canvasRef}></div>
            <button type='button' onClick={onPrevClicked}>Previous</button>
    	    <button type='button' onClick={onNextClicked}>Next</button>
        </div>
    );
};

export default WhimsyBearStory;
