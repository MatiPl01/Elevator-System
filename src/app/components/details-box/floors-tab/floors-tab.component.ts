import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  updateFloors(f: NgForm) {
    if (f.valid) {
      this.elevatorService.updateFloors(this.minFloorNum, this.maxFloorNum);
    }
  }
}
