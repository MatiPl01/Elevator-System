import { Component } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';


@Component({
  selector: 'app-elevators',
  templateUrl: './elevators.component.html'
})
export class ElevatorsComponent {
  constructor(public elevatorService: ElevatorService) {}
}
