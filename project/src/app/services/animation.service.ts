import { Injectable } from "@angular/core";
import { AnimationState } from "../enums/animation-state.enum";
import { ISprite } from "../interfaces/sprite.interface";
import { TimeService } from "./time.service";


@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private static readonly FPS = 144;
  private readonly sprites: ISprite[] = [];
  private lastFrameTime: number = 0;
  private _state = AnimationState.PAUSED;
  
  constructor(private timeService: TimeService) {
    this.lastFrameTime = this.timeService.getTime();
    this.play();
  }

  get state(): AnimationState {
    return this._state;
  }

  play() {
    if (this._state === AnimationState.PAUSED) {
      this._state = AnimationState.PLAYING;
      this.lastFrameTime = this.timeService.getTime();
      requestAnimationFrame(this.updateSprites.bind(this));
    }
  }

  pause() {
    this._state = AnimationState.PAUSED;
  }

  register(sprite: ISprite) {
    this.sprites.push(sprite);
  }

  private updateSprites() {
    if (this._state === AnimationState.PAUSED) return;
    const elapsed = this.timeService.getTime() - this.lastFrameTime;
    if (elapsed >= 1 / AnimationService.FPS) {
      const modifiedElapsed = this.timeService.getElapsedTime(this.lastFrameTime);
      this.sprites.forEach((sprite: ISprite) => sprite.update(modifiedElapsed));
      this.lastFrameTime = this.timeService.getTime();
    }
    requestAnimationFrame(this.updateSprites.bind(this));
  }
}
