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

    let app: Application
    let container: Container
    let targetBone: IBoneWithCoordinate

    const moveSpine = (position: ICursorPosition) => {
        const maxX = 958;
        const newX = position.x - app.screen.width / 2;
        const currentX = targetBone.x;
        targetBone.x = newX < -maxX || newX > maxX ? currentX : newX;
        targetBone.y = -position.y + app.screen.height;
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

        console.log('view', app.view)
        canvasRef.current.appendChild(app.view)

        return () => {
            app.destroy();
        };
    }, [canvasRef]);

    return bearSpine
} 

export default UseSpineAnimation