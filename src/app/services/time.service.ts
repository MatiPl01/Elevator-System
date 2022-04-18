import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  public static readonly MIN_TIME_MULTIPLIER = .25;
  public static readonly MAX_TIME_MULTIPLIER = 10;
  private _timeRatio = 2.5;
  private lastFrameTime = 0;

  constructor() {
    this.lastFrameTime = this.getTime();
  }

  get timeRatio(): number {
    return this._timeRatio;
  }

  set timeRatio(ratio: number) {
    if (ratio >= TimeService.MIN_TIME_MULTIPLIER && ratio <= TimeService.MAX_TIME_MULTIPLIER) {
      this._timeRatio = ratio;
    }
  }

  convertDuration(realDuration: number): number {
    return realDuration / this._timeRatio;
  }

  getElapsedTime(startTime: number): number {
    return (this.getTime() - startTime) * this._timeRatio;
  }

  newFrameTime(): number {
    const elapsed = this.getElapsedTime(this.lastFrameTime);
    this.lastFrameTime = this.getTime();
    return elapsed;
  }

  getTime(): number {
    return (new Date().getTime()) / 1000;
  }
}
