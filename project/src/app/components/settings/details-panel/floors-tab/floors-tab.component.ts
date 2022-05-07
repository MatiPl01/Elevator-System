import { Component } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { defaultsConfig } from 'src/app/config';

@Component({
  selector: 'app-floors-tab',
  templateUrl: './floors-tab.component.html'
})
export class FloorsTabComponent {
  public defaultsConfig = defaultsConfig;
  public minFloorNum: number;
  public maxFloorNum: number;

  constructor(public elevatorService: ElevatorService) {
    this.minFloorNum = this.elevatorService.floors.minFloor;
    this.maxFloorNum = this.elevatorService.floors.maxFloor;
  }

  updateFloors() {
    this.elevatorService.updateFloors(this.minFloorNum, this.maxFloorNum);
  }

  updateOnInput(event: Event) {
    const inputEl = (event as InputEvent).target as HTMLInputElement;

    if (inputEl.value === '') return;
    if (inputEl.name === 'minFloorNum') {
      this.updateMaxFloor();
      this.updateMinFloor();
    } else {
      this.updateMinFloor();
      this.updateMaxFloor();
    }
  }

  updateOnBlur(event: Event) {
    this.updateMinFloor();
    this.updateMaxFloor();

    const inputEl = (event as InputEvent).target as HTMLInputElement;
    if (inputEl.name === 'minFloorNum') inputEl.value = String(this.minFloorNum);
    else inputEl.value = String(this.maxFloorNum);
  }

  private updateMinFloor() {
    this.minFloorNum = Math.trunc(Math.max(
      Math.min(this.minFloorNum, this.maxFloorNum),
      this.defaultsConfig.minPossibleFloorNum
    ));
  }

  private updateMaxFloor() {
    this.maxFloorNum = Math.trunc(Math.min(
      Math.max(this.minFloorNum, this.maxFloorNum),
      this.defaultsConfig.maxPossibleFloorNum
    ));
  }
}
