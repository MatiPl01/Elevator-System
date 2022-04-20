import { Component } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';

@Component({
  selector: 'app-elevators-tab',
  templateUrl: './elevators-tab.component.html'
})
export class ElevatorsTabComponent {
  constructor(public elevatorService: ElevatorService) {}

  createNewElevator() {
    this.elevatorService.createElevator();
  }
}
