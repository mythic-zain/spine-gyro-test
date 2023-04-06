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

interface IOrientationCoordinate {
    vAxis: number,
    hAxis: number
}

const UseSpineAnimation = (canvasRef: any, spineUrl: string, skeletonScale = 1) => {
    const [bearSpine, setBearSpine] = useState<Spine>()
    const scaleModifier = skeletonScale === 1 ? skeletonScale : 0.8;
    const [initialOrientationData, setInitialOrientationData] = useState<IOrientationCoordinate>();
    const [pixiApp, setPixiApp] = useState<Application>()
    const [bone, setBone] = useState<IBoneWithCoordinate>()

    let app: Application
    let container: Container
    let targetBone: IBoneWithCoordinate

    const moveSpine = (position: ICursorPosition) => {
        console.log('pos', position)
        const maxX = 958;
        // const newX = position.x - app.screen.width / 2;
        // const currentX = targetBone.x;
        // targetBone.x = newX < -maxX || newX > maxX ? currentX : newX;
        // targetBone.y = -position.y + app.screen.height;
        // console.log('pos', position, targetBone.x, targetBone.y)

        const newX = position.x - pixiApp!.screen.width / 2;
        const currentX = bone!.x;
        bone!.x = newX < -maxX || newX > maxX ? currentX : newX;
        // bone!.y = -position.y + app.screen.height;
        // console.log('pos', position, targetBone.x, targetBone.y)
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

    const handleOrientation = (e: DeviceOrientationEvent) => {
        if (!initialOrientationData) {
            setInitialOrientationData({
                vAxis: e.beta || 0,
                hAxis: e.gamma || 0
            })
        } else {
            const axisModifier = 10
            const currVAxis = e.beta || 0
            const currHAxis = e.gamma || 0
            const newVAxis = currVAxis - initialOrientationData.vAxis
            const newHAxis = currHAxis - initialOrientationData.hAxis

            let xPos = newHAxis * axisModifier
            if (pixiApp && xPos >= 0) xPos += pixiApp.screen.width

            const position = { x: xPos, y: 0 }
            moveSpine(position)

            console.log('initial', initialOrientationData)
            console.log('new', newVAxis, newHAxis)
        }
    }

    const onAssetsLoaded = (loader: Loader, res: any) => {
        const spine = new Spine(res.whimsyBear.spineData)
        container = SpineContainer(spine, app, scaleModifier);
        app.stage.addChild(container)

        targetBone = spine.skeleton.findBone("AAA_Target") as IBoneWithCoordinate

        // app.stage.on('mousemove', (e) => {    
        //     const position = { x: e.data.global.x, y: e.data.global.y }
        //     moveSpine(position)
        // })

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
        setBone(targetBone)
        setBearSpine(spine)
    }

    useEffect(() => {
        if (!canvasRef.current) return;

        app = new Application({ resizeTo: canvasRef.current, backgroundAlpha: 0 });
        app.stage.interactive = true

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

        if (window.DeviceOrientationEvent) {
          window.addEventListener("deviceorientation", handleOrientation);
          return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
          };
        } else {
          console.log("Device orientation not supported.");
        }
    }, [bearSpine, initialOrientationData])

    return bearSpine
} 

export default UseSpineAnimation