import { Component, Input } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { FloorConfig } from 'src/app/types/floor-config.type';

@Component({
  selector: 'app-floor-details',
  templateUrl: './floor-details.component.html'
})
export class FloorDetailsComponent {
  @Input() floor!: FloorConfig;
  constructor(public elevatorService: ElevatorService) {}

  updateHeight() {
    this.elevatorService.notifyFloorChange();
  }
}
