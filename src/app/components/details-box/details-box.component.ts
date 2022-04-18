import { Component } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';

@Component({
  selector: 'app-details-box',
  templateUrl: './details-box.component.html'
})
export class DetailsBoxComponent {
  constructor(public elevatorService: ElevatorService) {}
}
