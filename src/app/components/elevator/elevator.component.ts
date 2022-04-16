import { Component, Input, OnInit } from '@angular/core';
import { ElevatorState } from 'src/app/enums/elevator-state.enum';
import { ISprite } from 'src/app/interfaces/sprite.interface';
import { AnimationService } from 'src/app/services/animation.service';
import { ElevatorService } from 'src/app/services/elevator.service';
import { TimeService } from 'src/app/services/time.service';
import { ElevatorConfig } from 'src/app/types/elevator-config.type';
import { Queue } from 'src/app/utils/data-structures/queue.data-structure';


@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html'
})
export class ElevatorComponent implements OnInit, ISprite {
  @Input() config!: ElevatorConfig;

  private state = ElevatorState.IDLE;
  private speed!: number;
  private maxLoad!: number;
  private maxAvailableFloor!: number;
  private minAvailableFloor!: number;
  private leavingCountsMap = new Map<number, number>();
  private totalCost = 0;
  private noPassengers = 0;
  private stopDuration = 0;
  private currentFloor = 0;
  private stoppedStartTime = 0;
  private nextFloors = new Queue();

  public bottom: number = 0;
  

  constructor(private timeService: TimeService,
              public elevatorService: ElevatorService,
              public animationService: AnimationService) {
    // TODO - remove code below
    this.nextFloors.enqueue(3);
    this.nextFloors.enqueue(1);
    this.nextFloors.enqueue(8);
    this.nextFloors.enqueue(-1);
  }

  ngOnInit(): void {
    this.speed = this.config.speed;
    this.maxLoad = this.config.maxLoad;
    this.stopDuration = this.config.stopDuration;
    this.currentFloor = this.config.initialFloor;
    this.maxAvailableFloor = this.config.maxAvailableFloor;
    this.minAvailableFloor = this.config.minAvailableFloor;

    this.bottom = this.elevatorService.getFloorHeight(this.currentFloor)!
      - this.elevatorService.getFloorHeight(this.minAvailableFloor)!;

    this.animationService.register(this);
  }

  update(deltaTime: number) {
    switch (this.state) {
      case ElevatorState.UP:
        this.move(this.calcDistance(deltaTime));
        break;
      case ElevatorState.DOWN:
        this.move(-this.calcDistance(deltaTime));
        break;
      case ElevatorState.STOPPED:
        if (this.timeService.getElapsedTime(this.stoppedStartTime) >= this.stopDuration) {
          if (!this.nextFloors.length) this.state = ElevatorState.IDLE;
          this.startMoving();
        }
        break;
      case ElevatorState.IDLE:
        if (this.nextFloors.length) this.startMoving();
        break;
    }
  }

  addPerson(floorNum: number) {
    const noLeaving = this.leavingCountsMap.get(floorNum) || 0;
    // If there was nobody leaving at the specified floor,
    // add the number of a floor to the nextFloors queue
    if (!noLeaving) this.nextFloors.enqueue(floorNum);
    this.leavingCountsMap.set(floorNum, noLeaving + 1);
  }

  private calcDistance(time: number): number {
    return this.speed * time;
  }

  private move(distance: number) {
    this.bottom += distance;
    
    const nextFloor = this.nextFloors.first;
    const nextHeight = this.elevatorService.getFloorHeight(nextFloor);
    
    if (Math.abs(this.bottom - nextHeight) < Math.abs(1.25 * distance)) {
      this.bottom = nextHeight;
      this.currentFloor = nextFloor;
      this.nextFloors.dequeue();
      this.state = ElevatorState.STOPPED;
      this.stoppedStartTime = this.timeService.getTime();
    }
  }

  private startMoving() {
    if (this.nextFloors.first > this.currentFloor) this.state = ElevatorState.UP;
    else if (this.nextFloors.first < this.currentFloor) this.state = ElevatorState.DOWN;
    else this.nextFloors.dequeue();
  }
}
