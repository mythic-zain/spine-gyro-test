import { Spine } from "pixi-spine";
import { Application, Container } from "pixi.js";

export default function SpineContainer(spine: Spine, app: Application, modifier: number = 1) {
    const container = new Container()
    container.addChild(spine)

    const localRect = spine.getLocalBounds()
    spine.position.set(-localRect.x, -localRect.y)

    const scale = Math.min(
      (app.screen.width * modifier) / container.width,
      (app.screen.height * modifier) / container.height
    )

    container.scale.set(scale, scale);
    container.position.set(
      (app.screen.width - container.width) * 0.5,
      (app.screen.height - container.height) * 0.5,
    );

    return container
}