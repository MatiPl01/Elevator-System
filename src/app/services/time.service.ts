import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private static readonly TIME_MULTIPLIER = 5;
  private lastFrameTime = 0;

  constructor() {
    this.lastFrameTime = this.getTime();
  }

  convertDuration(realDuration: number): number {
    return realDuration / TimeService.TIME_MULTIPLIER;
  }

  getElapsedTime(startTime: number): number {
    return (this.getTime() - startTime) * TimeService.TIME_MULTIPLIER;
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
