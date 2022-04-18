import { Component } from '@angular/core';
import { AnimationState } from 'src/app/enums/animation-state.enum';
import { AnimationService } from 'src/app/services/animation.service';
import { TimeService } from 'src/app/services/time.service';


@Component({
  selector: 'app-settings-box',
  templateUrl: './settings-box.component.html'
})
export class SettingsBoxComponent {
  public readonly MIN_SCALE = .25;
  public readonly MAX_SCALE = 4;
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
    const scrollRatio = (window.scrollY + window.innerHeight / 2) / document.body.offsetHeight;
    document.documentElement.style.setProperty('--scale', String(scale));
    const scrollY = scrollRatio * document.body.offsetHeight - window.innerHeight / 2;
    window.scrollTo({ top: scrollY });
  }
}
