import { Injectable } from "@angular/core";
import { ISprite } from "../interfaces/sprite.interface";
import { TimeService } from "./time.service";


@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private static readonly FPS = 60;
  private readonly sprites: ISprite[] = [];
  
  constructor(private timeService: TimeService) {
    this.run();
  }

  register(sprite: ISprite) {
    this.sprites.push(sprite);
  }

  private run() {
    requestAnimationFrame(this.updateSprites.bind(this));
  }

  private updateSprites() {
    const elapsed = this.timeService.newFrameTime();
    if (elapsed > 1 / AnimationService.FPS) {
      this.sprites.forEach((sprite: ISprite) => sprite.update(elapsed));
    }

    requestAnimationFrame(this.updateSprites.bind(this));
  }
}
