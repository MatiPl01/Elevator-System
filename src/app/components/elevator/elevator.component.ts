import { Component, Input, OnInit } from '@angular/core';
import { ElevatorState } from 'src/app/enums/elevator-state.enum';
import { StopReason } from 'src/app/enums/stop-reason.enum';
import { ISprite } from 'src/app/interfaces/sprite.interface';
import { AnimationService } from 'src/app/services/animation.service';
import { ElevatorService } from 'src/app/services/elevator.service';
import { TimeService } from 'src/app/services/time.service';
import { ElevatorConfig } from 'src/app/types/elevator-config.type';

// TODO - remove data-structures

type NextFloorData = {
  // Floor number
  floorNum: number,
  
  details?: {
    // Number of people leaving the elevator on the floorNum floor
    noLeaving: number,
    // Number of people entering the elevator on the floorNum floor
    noEntering: number,
    // Number of people waiting inside the elevator on the floorNum floor
    noInside: number
  }
}

export type RouteData = {
  totalTime: number,
  enterIdx: number,
  leaveIdx: number,
  fromFloorNum: number,
  toFloorNum: number
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
  private stopDuration!: number;
  private idleFloorNum!: number;
  private currentFloorNum!: number;
  
  private stoppedStartTime = 0;

  private nextFloors: NextFloorData[] = [{ floorNum: NaN }];

  
  private timeout!: any;
  public bottom: number = 0;

  constructor(public timeService: TimeService,
              public elevatorService: ElevatorService,
              public animationService: AnimationService) {
    this.id = this.elevatorService.registerElevator(this);
  }

  get state(): ElevatorState {
    return this._state;
  }

  get nextFloor(): NextFloorData|null {
    return this.nextFloors.length > 1 ? this.nextFloors[1] : null;
  }

  get toggleDoorDuration(): number {
    return this._toggleDoorDuration;
  }

  get totalStopDuration(): number {
    return 2 * this._toggleDoorDuration + this.stopDuration;
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
    this.idleFloorNum = this.config.idleFloorNum;
    this.currentFloorNum = this.config.idleFloorNum;
    this._maxAvailableFloor = this.config.maxAvailableFloor;
    this._minAvailableFloor = this.config.minAvailableFloor;
    this._toggleDoorDuration = this.config.toggleDoorDuration;

    this.bottom = this.calcDistanceFromBottom(this.currentFloorNum);
    this.animationService.register(this);
  }

  update(deltaTime: number) {
    switch (this._state) {
      case ElevatorState.MOVING:
        const sign = this.nextFloor?.floorNum! < this.currentFloorNum ? -1 : 1;
        this.move(sign * this.calcMoveDistance(deltaTime));
        break;

      case ElevatorState.WAITING:
        const elapsed = this.timeService.getElapsedTime(this.stoppedStartTime);  
        if (elapsed >= this.stopDuration) {
          if (!this.nextFloor) this._state = ElevatorState.IDLE;
          else this._state = ElevatorState.CLOSE_DOOR;
        }
        break;

      case ElevatorState.OPEN_DOOR:
      case ElevatorState.CLOSE_DOOR:
        if (!this.timeout) {
          const waitTime = this.timeService.convertDuration(this._toggleDoorDuration * 1000);
          this.timeout = setTimeout(this.toggleDoor.bind(this), waitTime);
        }
        break;

      case ElevatorState.IDLE:
        if (this.nextFloor) this._state = ElevatorState.CLOSE_DOOR;
        else {
          // TODO - go to the initial position
        }
        break;
    }
  }

  addRoute(route: RouteData) {
    let { enterIdx, leaveIdx, fromFloorNum, toFloorNum } = route;

    console.log("Elevator " + this.id + ' from ' + fromFloorNum + ' to ' + toFloorNum);

    this.insertStop(leaveIdx, toFloorNum, StopReason.LEAVE);
    this.insertStop(enterIdx, fromFloorNum, StopReason.ENTER);

    console.log('ADD', this.nextFloors)
  }

  findBestRoute(fromFloorNum: number, toFloorNum: number): RouteData {
    console.log(this.id, this.currentFloorNum)

    // Going up
    if (fromFloorNum < toFloorNum) {
      this.nextFloors[0].floorNum = -Infinity;
      this.nextFloors.push({ floorNum: Infinity });
    // Going down
    } else if (fromFloorNum > toFloorNum) {
      this.nextFloors[0].floorNum = Infinity;
      this.nextFloors.push({ floorNum: -Infinity });
    }

    // Find possible indexes where the elevator can stop
    const possibleStops = this.findPossibleStopsIndexes(fromFloorNum, toFloorNum);
    this.nextFloors[0].floorNum = NaN;
    this.nextFloors.pop();

    console.log(possibleStops, this.nextFloors)

    // Find the lowest time cost indexes
    const [totalTime, enterIdx, leaveIdx] = this.findLowestTimeRoute(fromFloorNum, toFloorNum, possibleStops);

    return {
      totalTime, 
      enterIdx, 
      leaveIdx,
      fromFloorNum,
      toFloorNum
    };
  }

  private insertStop(idx: number, floorNum: number, stopReason: StopReason) {
    let details;

    if (stopReason === StopReason.ENTER && idx === 0 && floorNum === this.currentFloorNum) return;

    if (this.nextFloors[idx].floorNum === floorNum) {
      details = { ...this.nextFloors[idx].details };
      if (stopReason === StopReason.ENTER) details.noEntering!++;
      if (stopReason === StopReason.LEAVE) details.noLeaving!++;
    } else {
      idx++;
      details = {
        noLeaving: 0,
        noEntering: 1,
        noInside: 0
      };
    }

    this.nextFloors.splice(idx, 0, {
      floorNum,
      // @ts-ignore
      details
    });
  }

  private findPossibleStopsIndexes(fromFloorNum: number, toFloorNum: number): number[][] {
    const res = [];
    let s = 0, t = 0;
    
    // If is going up
    if (fromFloorNum < toFloorNum) {
      if (toFloorNum > fromFloorNum) {
        while (t + 1 < this.nextFloors.length) {
          while (s + 1 < this.nextFloors.length
            && !(this.nextFloors[s].floorNum <= fromFloorNum && fromFloorNum < this.nextFloors[s + 1].floorNum)) s++;

          t = s;

          while (t + 1 < this.nextFloors.length
            && this.nextFloors[t] < this.nextFloors[t + 1]
            && !(this.nextFloors[t].floorNum <= fromFloorNum && fromFloorNum < this.nextFloors[t + 1].floorNum)) t++;

          res.push([s, t]);
          s++;
        }
      }

    // If is going down
    } else {
      if (fromFloorNum > toFloorNum) {
        while (t + 1 < this.nextFloors.length) {
          while (s + 1 < this.nextFloors.length
            && !(this.nextFloors[s].floorNum >= fromFloorNum && fromFloorNum > this.nextFloors[s + 1].floorNum)) s++;

          t = s;

          while (t + 1 < this.nextFloors.length
            && this.nextFloors[t] > this.nextFloors[t + 1]
            && !(this.nextFloors[t].floorNum >= fromFloorNum && fromFloorNum > this.nextFloors[t + 1].floorNum)) t++;

          res.push([s, t]);
          s++;
        }
      }
    }

    return res;
  }

  private findLowestTimeRoute(fromFloorNum: number, toFloorNum: number, possibleStops: number[][]): number[] {
    let lowestTime = Infinity;
    let bestEnterIdx = -1, bestLeaveIdx = -1;

    for (const [enterIdx, leaveIdx] of possibleStops) {
      const cost = this.calcTotalTime(fromFloorNum, toFloorNum, enterIdx, leaveIdx);
      if (cost < lowestTime) {
        lowestTime = cost;
        bestEnterIdx = enterIdx;
        bestLeaveIdx = leaveIdx;
      }
    }

    return [lowestTime, bestEnterIdx, bestLeaveIdx];
  }

  private calcTotalTime(fromFloorNum: number, toFloorNum: number, enterIdx: number, leaveIdx: number): number {
    // Check if there is enough space in the elevator for the person
    for (let i = enterIdx; i < leaveIdx; i++) {
      const { noEntering, noInside } = this.nextFloors[i].details!;
      if (noEntering + noInside >= this.maxLoad) return Infinity; // Return an infinity as a total time
    }

    // Calculate the total time of the added person's travel
    let totalTime = this.totalStopDuration + this.calcDistanceBetweenFloors(fromFloorNum, toFloorNum) / this.speed;
    if (!this.nextFloor || enterIdx === 1) {
      totalTime += this.calcDistanceToFloor(fromFloorNum) / this.speed;
    } else {
      totalTime += this.calcDistanceToFloor(this.nextFloor.floorNum) / this.speed;
    }

    for (let i = 1; i < Math.min(enterIdx, this.nextFloors.length - 1); i++) {
      const distance = this.calcDistanceBetweenFloors(
        this.nextFloors[i].floorNum,
        this.nextFloors[i + 1].floorNum
      );
      totalTime += distance / this.speed;
    }

    console.log(this.id, 1, totalTime)

    // Add waiting time for all passengers whose travel time has increased due to elevator stop
    if (this.nextFloor) {
      let noPassengers = 0;
      if (this.nextFloors[enterIdx].floorNum !== fromFloorNum) {
        if (!isNaN(this.nextFloors[enterIdx].floorNum)) {
          const { noEntering, noInside } = this.nextFloors[enterIdx].details!;
          noPassengers = noEntering + noInside;
        }
        // The person will enter the elevator on a floor that will be inserted
        // between the enterIdx and enterIdx + 1 indexes in the nextFloors array
        // so we can skip the floor saved at enterIdx index
        for (let i = enterIdx + 1; i < this.nextFloors.length; i++) {
          noPassengers += this.nextFloors[i].details!.noEntering;
        }
      }

      // The second stop of the elevator will increase waiting time of all people who will
      // enter the elevator after the current person leaves
      if (leaveIdx + 1 < this.nextFloors.length && this.nextFloors[leaveIdx].floorNum !== toFloorNum) {
        const { noInside } = this.nextFloors[leaveIdx + 1].details!;
        noPassengers = noInside;
        for (let i = leaveIdx + 1; i < this.nextFloors.length; i++) {
          noPassengers += this.nextFloors[i].details!.noEntering;
        }
      }

      totalTime += noPassengers * this.totalStopDuration;

      console.log(this.id, 2, totalTime)
    }

    return totalTime;
  }

  private calcMoveDistance(time: number): number {
    return this.speed * time;
  }

  private calcDistanceFromBottom(floorNum: number): number {
    return this.elevatorService.getFloorHeight(floorNum)! 
         - this.elevatorService.getFloorHeight(this.minAvailableFloor)!;
  }

  private calcDistanceToFloor(floorNum: number): number {
    return Math.abs(this.calcDistanceFromBottom(floorNum) - this.bottom);
  }

  private calcDistanceBetweenFloors(fromFloorNum: number, toFloorNum: number): number {
    return Math.abs(this.calcDistanceFromBottom(fromFloorNum) - this.calcDistanceFromBottom(toFloorNum));
  }

  private move(distance: number) {
    if (!this.nextFloor) {
      this._state = ElevatorState.OPEN_DOOR;
      return;
    }

    this.bottom += distance;
    const nextBottom = this.calcDistanceFromBottom(this.nextFloor.floorNum);
    
    if (Math.abs(this.bottom - nextBottom) < Math.abs(1.25 * distance)) {
      this._state = ElevatorState.OPEN_DOOR;
      this.bottom = nextBottom;
      this.currentFloorNum = this.nextFloor.floorNum;
      this.nextFloors.splice(1, 1);

      console.log('AAAA', this.nextFloors)
    }
  }

  private toggleDoor() {
    if (this._state === ElevatorState.OPEN_DOOR) {
      if (this.nextFloor) {
        this._state = ElevatorState.WAITING;
        this.stoppedStartTime = this.timeService.getTime();
      } else {
        this._state = ElevatorState.IDLE;
      }
    } else {
      this._state = ElevatorState.MOVING;
    }
    this.timeout = null;
  }
}
