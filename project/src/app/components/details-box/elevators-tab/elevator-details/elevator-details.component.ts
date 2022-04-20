import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { defaultsConfig, defaultElevatorConfig } from 'src/app/config';
import { ElevatorData } from 'src/app/services/elevator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-elevator-details',
  templateUrl: './elevator-details.component.html'
})
export class ElevatorDetailsComponent implements OnInit, OnDestroy {
  @Input() idx!: number;
  
  public id!: string;
  public elevator!: ElevatorData;
  public defaultsConfig = defaultsConfig;
  public defaultElevatorConfig = defaultElevatorConfig;
  private subscription: Subscription;

  constructor(public elevatorService: ElevatorService) {
    this.subscription = this.elevatorService.elevatorRemoved.subscribe((idx: number) => {
      if (this.idx > idx) {
        this.idx--;
        this.id = this.elevatorService.getElevatorId(this.idx);
      }
    })
  }
  
  ngOnInit() {
    this.elevator = this.elevatorService.elevators[this.idx];  
    this.id = this.elevatorService.getElevatorId(this.idx);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeElevator() {
    this.elevatorService.removeElevator(this.idx);
  }

  updateElevatorFloors() {
    const config = this.elevator.config;
    config.minFloorNum = Math.min(config.minFloorNum, config.maxFloorNum);
    config.maxFloorNum = Math.max(config.minFloorNum, config.maxFloorNum);
    config.idleFloorNum = Math.min(Math.max(config.minFloorNum, config.idleFloorNum), config.maxFloorNum);
    this.elevator?.component?.reset();
    this.elevatorService.notifyElevatorFloorsChange(this.idx);
  }
}
