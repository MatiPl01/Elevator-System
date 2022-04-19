import { Component, Input, OnInit } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { defaultsConfig } from 'src/app/config';


@Component({
  selector: 'app-floor-details',
  templateUrl: './floor-details.component.html'
})
export class FloorDetailsComponent implements OnInit {
  @Input() idx!: number;

  public floorNum!: number;
  public floorHeight!: number;
  public defaultsConfig = defaultsConfig;

  constructor(private elevatorService: ElevatorService) {}

  ngOnInit() {
    this.floorNum = this.elevatorService.floors.minFloor + this.idx;
    this.floorHeight = this.elevatorService.floors.heights[this.idx];
  }

  updateHeight() {
    this.elevatorService.floors.heights[this.idx] = this.floorHeight;
    // this.elevatorService.notifyFloorChange(); // TODO ?
  }
}
