import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ElevatorService } from 'src/app/services/elevator.service';
import { ElevatorComponent } from '../../../elevators/elevator/elevator.component';
import { defaultsConfig, defaultElevatorConfig } from 'src/app/config';
import { ElevatorData } from 'src/app/services/elevator.service';

@Component({
  selector: 'app-elevator-details',
  templateUrl: './elevator-details.component.html'
})
export class ElevatorDetailsComponent {
  @Input() elevator!: ElevatorData;
  @Input() idx!: number;

  public defaultsConfig = defaultsConfig;
  public defaultElevatorConfig = defaultElevatorConfig;
  public id: string;

  constructor(private elevatorService: ElevatorService) {
    this.id = elevatorService.getElevatorId(this.idx);
  }

  removeElevator() {
    this.elevatorService.removeElevator(this.idx);
  }

  changeSettings(f: NgForm) {
    console.log('now')
  }
}
