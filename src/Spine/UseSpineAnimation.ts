import { useEffect, useState } from 'react'
import {Application, Loader, isMobile, Container} from 'pixi.js'
import { IBone, Spine } from 'pixi-spine'
import SpineContainer from './SpineContainer'

interface IBoneWithCoordinate extends IBone {
    x: number,
    y: number
}

interface ICursorPosition {
    x: number,
    y: number,
}

const UseSpineAnimation = (canvasRef: any, spineUrl: string, skeletonScale = 1) => {
    const [bearSpine, setBearSpine] = useState<Spine>()
    const scaleModifier = skeletonScale === 1 ? skeletonScale : 0.8;
    const [pixiApp, setPixiApp] = useState<Application>()
    const [bone, setBone] = useState<IBoneWithCoordinate>()
    const [gyroPosition, setGyroPosition] = useState({ x: 0, y: 0 });
    const [initialBoneY, setInitialBoneY] = useState<number>(0)

    let app: Application
    let container: Container
    let targetBone: IBoneWithCoordinate

    const moveSpine = (position: ICursorPosition) => {
        console.log('pos', position)
        const maxX = 958;
        const newX = position.x - app.screen.width / 2;
        const currentX = targetBone.x;
        targetBone.x = newX < -maxX || newX > maxX ? currentX : newX;
        targetBone.y = -position.y + app.screen.height;
        console.log('pos', position, targetBone.x, targetBone.y)
    };

    const resizeContainer = () => {
        const newScale = Math.min(
            (app.screen.width * scaleModifier) / container.width,
            (app.screen.height * scaleModifier) / container.height
        );
    
        const scale = newScale * container.scale.x;
        container.scale.set(scale, scale);
        container.position.set(
            (app.screen.width - container.width) * 0.5,
            (app.screen.height - container.height) * 0.5
        );
    };

    // const handleOrientation = (e: DeviceOrientationEvent) => {
    //     if (!initialOrientationData) {
    //         setInitialOrientationData({
    //             vAxis: e.beta || 0,
    //             hAxis: e.gamma || 0
    //         })
    //     } else {
    //         const axisModifier = 15
    //         const currVAxis = e.beta || 0
    //         const currHAxis = e.gamma || 0
    //         const newVAxis = currVAxis - initialOrientationData.vAxis
    //         const newHAxis = currHAxis - initialOrientationData.hAxis

    //         const xPos = newHAxis * axisModifier
    //         const yPos = newVAxis * axisModifier

    //         const position = { x: xPos, y: yPos }
    //         moveSpineGyro(position)

    //         console.log('initial', initialOrientationData)
    //         console.log('new', newVAxis, newHAxis)
    //     }
    // }

    const moveSpineByGyro = () => {
        const maxX = 958;

        const newX = -gyroPosition.x + pixiApp!.screen.width / 2;
        const currentX = bone!.x;
        bone!.x = newX < -maxX || newX > maxX ? currentX : newX;
        bone!.y = -gyroPosition.y + pixiApp!.screen.height;
        console.log('bone', bone!.x, bone!.y)
    }

    const handleMotion = (e: DeviceMotionEvent) => {
        const alpha = e.rotationRate?.alpha || 0;
        const beta = e.rotationRate?.beta || 0;

        setGyroPosition(prevPosition => ({
            x: prevPosition.x - beta / 2,
            y: prevPosition.y + alpha / 2,
        }));
    }

    const onAssetsLoaded = (loader: Loader, res: any) => {
        const spine = new Spine(res.whimsyBear.spineData)
        container = SpineContainer(spine, app, scaleModifier);
        app.stage.addChild(container)

        targetBone = spine.skeleton.findBone("AAA_Target") as IBoneWithCoordinate

        app.stage.on('mousemove', (e) => {    
            const position = { x: e.data.global.x, y: e.data.global.y }
            moveSpine(position)
        })

        app.stage.on('touchmove', (e) => {
            const position = { x: e.data.global.x, y: e.data.global.y }
            moveSpine(position)
        })

        canvasRef.current?.children[0].addEventListener('touchstart', (e: any) => {
            const position = { x: e.touches[0].pageX, y: e.touches[0].pageY }
            moveSpine(position)
        })

        window.onresize = function () {
            resizeContainer();
        };

        setPixiApp(app)
        setInitialBoneY(targetBone.y)
        setBone(targetBone)
        setBearSpine(spine)
    }

    useEffect(() => {
        if (!canvasRef.current) return;

        app = new Application({ resizeTo: canvasRef.current, backgroundAlpha: 0 });
        app.stage.interactive = true
        app.renderer.view.style.touchAction = 'auto';

        const url = isMobile.any ? spineUrl.replace('1', '0.25') : spineUrl
        app.loader
            .add("whimsyBear", url, { crossOrigin: "*", metadata: { spineSkeletonScale: skeletonScale } })
            .load(onAssetsLoaded);
            // .onProgress.add(() => setIsLoading(true))
        
        if (canvasRef.current && canvasRef.current.children.length > 0) {
            canvasRef.current.removeChild(canvasRef.current.children[0])
        }

        canvasRef.current.appendChild(app.view)

        return () => {
            app.destroy();
        };
    }, [canvasRef]);

    useEffect(() => {
        if (!bearSpine) return;

        if (window.DeviceMotionEvent) {
          window.addEventListener('devicemotion', handleMotion, true);
          return () => window.removeEventListener('devicemotion', handleMotion);
        } else {
          console.warn('DeviceMotionEvent is not supported');
        }
      }, [bearSpine]);

    useEffect(() => {
        if (pixiApp && bone) {
            const maxX = 850;
            console.log('init', initialBoneY)
            
            console.log('gyro', gyroPosition)
            const currentX = bone.x;
            const currentY = bone.y;
            const newX = gyroPosition.x - pixiApp.screen.width / 2;
            const newY = gyroPosition.y + initialBoneY;
            console.log('currentXY', currentY)
            console.log('newXY', newY)
            bone.x = newX < -maxX || newX > maxX ? currentX : newX;
            bone.y = newY < -400 || newY > 950 ? currentY : newY;
        }
    }, [pixiApp, bone, gyroPosition, initialBoneY]);

    return {bearSpine, gyroPosition, bone}
} 

export default UseSpineAnimation