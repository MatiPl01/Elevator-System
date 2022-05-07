import { Component } from '@angular/core';
import { AnimationState } from 'src/app/enums/animation-state.enum';
import { AnimationService } from 'src/app/services/animation.service';
import { TimeService } from 'src/app/services/time.service';


@Component({
  selector: 'app-options',
  templateUrl: './options.component.html'
})
export class SettingsBoxComponent {
  public readonly MIN_SCALE = .1;
  public readonly MAX_SCALE = 2;
  public readonly SCALE_STEP = .05;
  public TimeService = TimeService;

  constructor(public timeService: TimeService,
              private animationService: AnimationService) {}

  get isPlayingAnimation(): boolean {
    return this.animationService.state === AnimationState.PLAYING;
  }

  playAnimation() {
    this.animationService.play();
  }

  pauseAnimation() {
    this.animationService.pause();
  }

  changeTimeRatio(ratio: number) {
    this.timeService.timeRatio = ratio;
  }

  changeScale(scale: number) {
    const scrollYRatio = (window.scrollY + window.innerHeight / 2) / document.body.offsetHeight;
    const scrollXRatio = (window.scrollX + window.innerWidth / 2) / document.body.offsetWidth;
    document.documentElement.style.setProperty('--scale', String(scale));
    const scrollY = scrollYRatio * document.body.offsetHeight - window.innerHeight / 2;
    const scrollX = scrollXRatio * document.body.offsetWidth - window.innerWidth / 2;
    window.scrollTo({ top: scrollY, left: scrollX });
    document.body.scrollTop = scrollY;
  }
}
