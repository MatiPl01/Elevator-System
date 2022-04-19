import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ElevatorService } from 'src/app/services/elevator.service';

@Component({
  selector: 'app-floors-tab',
  templateUrl: './floors-tab.component.html'
})
export class FloorsTabComponent {
  public minFloorNum: number;
  public maxFloorNum: number;

  constructor(public elevatorService: ElevatorService) {
    this.minFloorNum = this.elevatorService.minFloorNum;
    this.maxFloorNum = this.elevatorService.maxFloorNum;
  }

  updateFloors(f: NgForm) {
    if (f.valid) {
      this.elevatorService.updateFloors(this.minFloorNum, this.maxFloorNum);
    }
  }
}
