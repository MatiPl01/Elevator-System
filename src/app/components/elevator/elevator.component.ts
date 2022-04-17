import { Component, Input, OnInit } from '@angular/core';
import { ElevatorState } from 'src/app/enums/elevator-state.enum';
import { ISprite } from 'src/app/interfaces/sprite.interface';
import { AnimationService } from 'src/app/services/animation.service';
import { ElevatorService } from 'src/app/services/elevator.service';
import { TimeService } from 'src/app/services/time.service';
import { ElevatorConfig } from 'src/app/types/elevator-config.type';
import { Queue } from 'src/app/utils/data-structures/queue.data-structure';


type StopData = {
  floorNum: number,
  noPassengers: number, // In an elevator
  noWaiting: number    // For an elevator to come
}

@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html'
})
export class ElevatorComponent implements OnInit, ISprite {
  @Input() config!: ElevatorConfig;

  public ElevatorState = ElevatorState;
  
  public readonly id: string;
  private _state = ElevatorState.IDLE;
  private _maxAvailableFloor!: number;
  private _minAvailableFloor!: number;
  private _toggleDoorDuration!: number;
  private speed!: number;
  private maxLoad!: number;
  private waitForPeopleDuration!: number;
  private currentFloorNum!: number;
  
  private stoppedStartTime = 0;
  private stopsQueue = new Queue();
  
  private timeout!: any;
  public bottom: number = 0;

  constructor(private timeService: TimeService,
              public elevatorService: ElevatorService,
              public animationService: AnimationService) {
    this.id = this.elevatorService.registerElevator(this);
  }

  get state(): ElevatorState {
    return this._state;
  }

  get nextFloor(): number {
    return (this.stopsQueue.first as StopData)?.floorNum;
  }

  get toggleDoorDuration(): number {
    return this._toggleDoorDuration;
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
    this._toggleDoorDuration = this.config.toggleDoorDuration;
    this.waitForPeopleDuration = this.config.waitForPeopleDuration;
    this.currentFloorNum = this.config.initialFloorNum;
    this._maxAvailableFloor = this.config.maxAvailableFloor;
    this._minAvailableFloor = this.config.minAvailableFloor;

    this.bottom = this.calcDistanceFromBottom(this.currentFloorNum);
    this.animationService.register(this);
  }

  update(deltaTime: number) {
    switch (this._state) {
      case ElevatorState.MOVING:
        const sign = this.nextFloor < this.currentFloorNum ? -1 : 1;
        this.move(sign * this.calcDistance(deltaTime));
        break;
      case ElevatorState.STOPPED:
        const elapsed = this.timeService.getElapsedTime(this.stoppedStartTime);  
        if (elapsed >= this.waitForPeopleDuration) {
          if (!this.nextFloor) this._state = ElevatorState.IDLE;
          else this._state = ElevatorState.CLOSE_DOOR;
        }
        break;
      case ElevatorState.OPEN_DOOR:
      case ElevatorState.CLOSE_DOOR:
        if (!this.timeout) {
          this.timeout = setTimeout(this.toggleDoor.bind(this), this._toggleDoorDuration * 1000);
        }
        break;
      case ElevatorState.IDLE:
        if (this.nextFloor) this._state = ElevatorState.CLOSE_DOOR;
        break;
    }
  }

  calcTotalCost(fromFloorNum: number, toFloorNum: number): number {
    /**
     * Assumptions:
     * - the elevator does not turn back as long as there are still some 
     * floors in the same direction in which it is going,
     * - the elevator always stops for the same time,
    */
    // Find possible stops


    return 0; // TODO
  }

  addRoute(fromFloorNum: number, toFloorNum: number) {
    console.log("Elevator " + this.id + ' from ' + fromFloorNum + ' to ' + toFloorNum);
    // TODO -remove lines below and implement this method
    // this.nextFloors.enqueue(fromFloorNum);
    this.stopsQueue.enqueue({
      floorNum: toFloorNum,
      noPassengers: 0,
      noWaiting: 0
    });
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
      this._state = ElevatorState.OPEN_DOOR;
      this.stoppedStartTime = this.timeService.getTime();
      return;
    }

    this.bottom += distance;
    const nextBottom = this.calcDistanceFromBottom(this.nextFloor);
    
    if (Math.abs(this.bottom - nextBottom) < Math.abs(1.25 * distance)) {
      this.bottom = nextBottom;
      this.currentFloorNum = this.nextFloor;
      this.stopsQueue.dequeue();
    }
  }

  private toggleDoor() {
    if (this._state === ElevatorState.OPEN_DOOR) {
      this._state = ElevatorState.STOPPED;
    } else {
      this._state = ElevatorState.MOVING;
    }
    this.timeout = null;
  }
}
