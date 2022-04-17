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

  private readonly id;
  private state = ElevatorState.IDLE;
  private speed!: number;
  private maxLoad!: number;
  private _maxAvailableFloor!: number;
  private _minAvailableFloor!: number;
  private stopDuration = 0;
  private currentFloorNum = 0;
  private stoppedStartTime = 0;
  private nextFloors = new Queue();
  
  private totalCost = 0;
  private noPassengers = 0;
  private leavingCountsMap = new Map<number, number>();

  public bottom: number = 0;
  

  constructor(private timeService: TimeService,
              public elevatorService: ElevatorService,
              public animationService: AnimationService) {
    this.id = this.elevatorService.registerElevator(this);
  }

  get nextFloor(): number {
    return this.nextFloors.first;
  }

  get maxAvailableFloor(): number {
    return this._maxAvailableFloor;
  }

  get minAvailableFloor(): number {
    return this._minAvailableFloor;
  }

  ngOnInit(): void {
    this.speed = this.config.speed;
    this.maxLoad = this.config.maxLoad;
    this.stopDuration = this.config.stopDuration;
    this.currentFloorNum = this.config.initialFloorNum;
    this._maxAvailableFloor = this.config.maxAvailableFloor;
    this._minAvailableFloor = this.config.minAvailableFloor;

    this.bottom = this.calcDistanceFromBottom(this.currentFloorNum);
    this.animationService.register(this);
  }

  update(deltaTime: number) {
    switch (this.state) {
      case ElevatorState.MOVING:
        const sign = this.nextFloor < this.currentFloorNum ? -1 : 1;
        this.move(sign * this.calcDistance(deltaTime));
        break;
      case ElevatorState.STOPPED:
        if (this.timeService.getElapsedTime(this.stoppedStartTime) >= this.stopDuration) {
          if (!this.nextFloor) this.state = ElevatorState.IDLE;
          this.startMoving();
        }
        break;
      case ElevatorState.IDLE:
        if (this.nextFloor) this.startMoving();
        break;
    }
  }

  calcIncreaseOfETD(fromFloorNum: number, toFloorNum: number): number {
    return 0; // TODO
  }

  addRoute(fromFloorNum: number, toFloorNum: number) {
    console.log("Elevator " + this.id + ' from ' + fromFloorNum + ' to ' + toFloorNum);
    // TODO -remove lines below and implement this method
    this.nextFloors.enqueue(fromFloorNum);
    this.nextFloors.enqueue(toFloorNum);
  }

  private calcDistanceFromBottom(floorNum: number): number {
    return this.elevatorService.getFloorHeight(floorNum)! 
         - this.elevatorService.getFloorHeight(this.minAvailableFloor)!;
  }

  private calcDistance(time: number): number {
    return this.speed * time;
  }

  private move(distance: number) {
    if (!this.nextFloor) {
      this.state = ElevatorState.STOPPED;
      this.stoppedStartTime = this.timeService.getTime();
      return;
    }

    this.bottom += distance;
    const nextBottom = this.calcDistanceFromBottom(this.nextFloor);
    
    if (Math.abs(this.bottom - nextBottom) < Math.abs(1.25 * distance)) {
      this.bottom = nextBottom;
      this.currentFloorNum = this.nextFloor;
      this.nextFloors.dequeue();
    }
  }

  private startMoving() {
    if (this.nextFloor && this.nextFloor != this.currentFloorNum) {
      this.state = ElevatorState.MOVING;
    } else this.nextFloors.dequeue();
  }
}
