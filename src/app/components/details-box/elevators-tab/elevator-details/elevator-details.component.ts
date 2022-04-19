import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ElevatorService } from 'src/app/services/elevator.service';
import { ElevatorComponent } from '../../../elevators/elevator/elevator.component';

@Component({
  selector: 'app-elevator-details',
  templateUrl: './elevator-details.component.html'
})
export class ElevatorDetailsComponent {
  @Input() elevator!: ElevatorComponent;

  constructor(public elevatorService: ElevatorService) {}

  removeElevator() {

  }

  changeSettings(f: NgForm) {
    console.log('now')
  }
}
