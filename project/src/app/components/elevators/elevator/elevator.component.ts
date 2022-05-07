import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ElevatorState } from 'src/app/enums/elevator-state.enum';
import { ISprite } from 'src/app/interfaces/sprite.interface';
import { AnimationService } from 'src/app/services/animation.service';
import { ElevatorService } from 'src/app/services/elevator.service';
import { TimeService } from 'src/app/services/time.service';
import { ElevatorConfig } from 'src/app/types/elevator-config.type';
import { RouteData } from 'src/app/types/route-data.type';
import { NextFloorData } from 'src/app/types/next-floor-data.type';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html'
})
export class ElevatorComponent implements OnInit, OnDestroy, ISprite {
  @Input() idx!: number;

  public ElevatorState = ElevatorState;
  public id!: string;
  private config!: ElevatorConfig;

  private _state = ElevatorState.IDLE;
  private _nextFloors: NextFloorData[] = [{ floorNum: NaN }];
  private _currentFloorNum!: number;
  private timeout!: any;
  private stoppedStartTime = 0;
  public bottom: number = 0;

  private subscriptions: Subscription[] = [];

  constructor(public timeService: TimeService,
              public elevatorService: ElevatorService,
              public animationService: AnimationService) {
      this.subscriptions.push(
        this.elevatorService.elevatorRemoved.subscribe((idx: number) => {
          if (this.idx > idx) {
            this.idx--;
            this.id = this.elevatorService.getElevatorId(this.idx);
          }
        }),
        this.elevatorService.floorsChange.subscribe(() => {
          this.updateAvailableFloors();
          this.reset();
          this.elevatorService.notifyElevatorFloorsChange(this.idx);
        })
    )
  }

  get state(): ElevatorState {
    return this._state;
  }

  get nextFloor(): NextFloorData|null {
    return this._nextFloors.length > 1 ? this._nextFloors[1] : null;
  }

  get nextFloors(): NextFloorData[] {
    return this._nextFloors.slice(1);
  }

  get currentFloorNum(): number {
    return this._currentFloorNum;
  }

  get totalStopDuration(): number {
    return 2 * this.toggleDoorDuration + this.stopDuration;
  }

  get minFloorNum(): number {
    return this.config.minFloorNum;
  }

  get maxFloorNum(): number {
    return this.config.maxFloorNum;
  }

  get idleFloorNum(): number {
    return this.config.idleFloorNum;
  }

  get maxLoad(): number {
    return this.config.maxLoad;
  }

  get speed(): number {
    return this.config.speed;
  }

  get stopDuration(): number {
    return this.config.stopDuration;
  }

  get toggleDoorDuration(): number {
    return this.config.toggleDoorDuration;
  }

  ngOnInit() {
    const elevatorData = this.elevatorService.elevators[this.idx];
    this.id = this.elevatorService.getElevatorId(this.idx);
    this.config = elevatorData.config;
    this.updateAvailableFloors();
    this._currentFloorNum = this.config.idleFloorNum;
    this.bottom = this.calcDistanceFromBottom(this._currentFloorNum);
    this.animationService.register(this);

    if (!elevatorData.component) {
      this.elevatorService.registerElevatorComponent(this.idx, this);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  update(deltaTime: number) {
    switch (this._state) {
      case ElevatorState.MOVING:
        const sign = this.nextFloor?.floorNum! < this.currentFloorNum ? -1 : 1;
        this.move(sign * this.calcMoveDistance(deltaTime));
        this.updateCurrentFloorNum();
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
          const waitTime = this.timeService.convertDuration(this.toggleDoorDuration * 1000);
          this.timeout = setTimeout(this.toggleDoor.bind(this), waitTime);
        }
        break;

      case ElevatorState.IDLE:
        if (this.nextFloor) this._state = ElevatorState.CLOSE_DOOR;
        else if (this.currentFloorNum !== this.idleFloorNum) {
          this._nextFloors.push({ floorNum: this.idleFloorNum });
        }
        break;
    }
  }

  reset() {
    this._state = ElevatorState.IDLE;
    this._nextFloors.splice(1);
    this._currentFloorNum = this.config.idleFloorNum;
    this.bottom = this.calcDistanceFromBottom(this._currentFloorNum);
  }

  addRoute(route: RouteData) {
    let { enterIdx, leaveIdx, fromFloorNum, toFloorNum } = route;

    // Remove the next floor data if the elevator was going to the IDLE floor number
    if (this.nextFloor && !this.nextFloor?.details && this.nextFloor?.floorNum === this.idleFloorNum) {
      this._nextFloors.splice(1, 1);
    }

    // Add enter and leave floor number at the end of the _nextFloors array if
    // there is no space in the elevator or there aro no more _nextFloors
    if (enterIdx === this._nextFloors.length) {
      this._nextFloors.push({
        floorNum: fromFloorNum,
        details: {
          noLeaving: 0,
          noEntering: 1,
          noInside: 0
        }
      });

      this._nextFloors.push({
        floorNum: toFloorNum,
        details: {
          noLeaving: 1,
          noEntering: 0,
          noInside: 0
        }
      });
      return;
    }

   /**
    * Entering the elevator
    */
    // Insert the next floor data after the enterIdx
    if (enterIdx === 0 || this._nextFloors[enterIdx].floorNum !== fromFloorNum) {
      // Don't add the next floor data if the elevator is already waiting at the
      // fromFloorNum (the current floor number is equal to the fromFloorNum)
      if (this.currentFloorNum === fromFloorNum && this._state !== ElevatorState.MOVING) {
        switch (this._state) {
          // Reopen the door it the elevator started closing the door
          case ElevatorState.CLOSE_DOOR:
            if (this.timeout) {
              clearTimeout(this.timeout);
              this.timeout = null;
            }
            this._state = ElevatorState.OPEN_DOOR;
            break;

          // Extend the waiting time if the elevator is in the IDLE/WAITING mode
          case ElevatorState.IDLE:
          case ElevatorState.WAITING:
            this._state = ElevatorState.WAITING;
            this.stoppedStartTime = this.timeService.getTime();
            break;
        }
      } else {
        this._nextFloors.splice(++enterIdx, 0, {
          floorNum: fromFloorNum,
          details: {
            noLeaving: 0,
            noEntering: 1,
            noInside: 0
          }
        });
        leaveIdx++;
      }
      // Otherwise, update the next floor data
    } else {
      this._nextFloors[enterIdx].details!.noEntering++;
    }

    /**
     * Leaving the elevator
     */
    // Insert the next floor data after the leaveIdx
    if (this._nextFloors[leaveIdx].floorNum !== toFloorNum) {
      this._nextFloors.splice(++leaveIdx, 0, {
        floorNum: toFloorNum,
        details: {
          noLeaving: 1,
          noEntering: 0,
          noInside: 0
        }
      });
      // Otherwise, update the next floor data
    } else {
      this._nextFloors[leaveIdx].details!.noLeaving++;
    }

    /**
     * Between entering and leaving the elevator
     */
    // Update the number of people inside the elevator
    for (let i = enterIdx + 1; i < leaveIdx; i++) {
      this._nextFloors[i].details!.noInside++;
    }
  }

  findBestRoute(fromFloorNum: number, toFloorNum: number): RouteData {
    // Find possible indexes where the elevator can stop
    const possibleStops = this.findPossibleStopsIndexes(fromFloorNum, toFloorNum);

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

  updateAvailableFloors() {
    const config = this.config;
    const floors = this.elevatorService.floors;
    config.maxFloorNum = Math.min(config.maxFloorNum, floors.maxFloor);
    config.minFloorNum = Math.max(config.minFloorNum, floors.minFloor);
    config.idleFloorNum = Math.min(Math.max(floors.minFloor, config.idleFloorNum), floors.maxFloor);

    if (config.maxFloorNum <= config.minFloorNum) {
      config.minFloorNum = floors.minFloor;
      config.maxFloorNum = floors.maxFloor;
    }
  }

  private findPossibleStopsIndexes(fromFloorNum: number, toFloorNum: number): number[][] {
    const res = [];
    let t = 0;
    this._nextFloors[0].floorNum = this.currentFloorNum;

    // If is going up
    if (fromFloorNum < toFloorNum) {
      this._nextFloors.push({ floorNum: Infinity });

      for (let s = 0; s + 1 < this._nextFloors.length; s++) {
        // Check if the fromFloorNum can be inserted after the s index
        // (or is already inserted at the s index)
        if (this._nextFloors[s].floorNum <= fromFloorNum && fromFloorNum < this._nextFloors[s + 1].floorNum) {
          // Find a possible toFloorNum insertion index
          t = s;
          while (t + 1 < this._nextFloors.length && this._nextFloors[t].floorNum < this._nextFloors[t + 1].floorNum) {
            // Check if the toFloorNum can be inserted after the t index
            // (or is already inserted at the t index)
            if (this._nextFloors[t].floorNum <= toFloorNum && toFloorNum < this._nextFloors[t + 1].floorNum) {
              res.push([s, t]);
              break;
            }
            t++;
          }
        }
      }

    // If is going down
    } else {
      if (fromFloorNum > toFloorNum) {
        this._nextFloors.push({ floorNum: -Infinity });

        for (let s = 0; s + 1 < this._nextFloors.length; s++) {
          // Check if the fromFloorNum can be inserted after the s index
          // (or is already inserted at the s index)
          if (this._nextFloors[s].floorNum >= fromFloorNum && fromFloorNum > this._nextFloors[s + 1].floorNum) {
            // Find a possible toFloorNum insertion index
            t = s;
            while (t + 1 < this._nextFloors.length && this._nextFloors[t].floorNum > this._nextFloors[t + 1].floorNum) {
              // Check if the toFloorNum can be inserted after the t index
              // (or is already inserted at the t index)
              if (this._nextFloors[t].floorNum >= toFloorNum && toFloorNum > this._nextFloors[t + 1].floorNum) {
                res.push([s, t]);
                break;
              }
              t++;
            }
          }
        }
      }
    }

    // A person can always wait for the elevator to complete all routes and then enter the elevator
    const lastIdx = this._nextFloors.length - 2;
    // Check if [lastIdx, lastIdx] pair has not been saved yet
    if (!res.length || !res[res.length - 1].every((v: number) => v === lastIdx)) {
      res.push([lastIdx, lastIdx]);
    }

    this._nextFloors[0].floorNum = NaN;
    this._nextFloors.pop();

    return res;
  }

  private findLowestTimeRoute(fromFloorNum: number, toFloorNum: number, possibleStops: number[][]): number[] {
    let lowestTime = Infinity;
    let lastIdx = this._nextFloors.length;
    let bestEnterIdx = lastIdx, bestLeaveIdx = lastIdx;

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
    if (!this.hasFreeSpace(fromFloorNum, toFloorNum, enterIdx, leaveIdx)) return Infinity;

    // Calculate the total time of the added person's travel
    let totalTime = this.totalStopDuration + this.calcDistanceBetweenFloors(fromFloorNum, toFloorNum) / this.speed;
    if (!this.nextFloor || enterIdx === 1) {
      totalTime += this.calcDistanceToFloor(fromFloorNum) / this.speed;
    } else {
      totalTime += this.calcDistanceToFloor(this.nextFloor.floorNum) / this.speed;
    }

    for (let i = 1; i < Math.min(enterIdx, this._nextFloors.length - 1); i++) {
      const distance = this.calcDistanceBetweenFloors(
        this._nextFloors[i].floorNum,
        this._nextFloors[i + 1].floorNum
      );
      totalTime += distance / this.speed;
    }

    // Add waiting time for all passengers whose travel time has increased due to elevator stop
    if (this.nextFloor) {
      let noPassengers = 0;
      if (this._nextFloors[enterIdx].floorNum !== fromFloorNum) {
        if (this._nextFloors[enterIdx].details) {
          const { noEntering, noInside } = this._nextFloors[enterIdx].details!;
          noPassengers = noEntering + noInside;
        }
        // The person will enter the elevator on a floor that will be inserted
        // between the enterIdx and enterIdx + 1 indexes in the _nextFloors array
        // so we can skip the floor saved at enterIdx index
        for (let i = enterIdx + 1; i < this._nextFloors.length; i++) {
          noPassengers += this._nextFloors[i].details!.noEntering;
        }
      }

      // The second stop of the elevator will increase waiting time of all people who will
      // enter the elevator after the current person leaves
      if (leaveIdx + 1 < this._nextFloors.length && this._nextFloors[leaveIdx].floorNum !== toFloorNum) {
        const { noInside } = this._nextFloors[leaveIdx + 1].details!;
        noPassengers = noInside;
        for (let i = leaveIdx + 1; i < this._nextFloors.length; i++) {
          noPassengers += this._nextFloors[i].details!.noEntering;
        }
      }

      totalTime += noPassengers * this.totalStopDuration;
    }

    return totalTime;
  }

  private hasFreeSpace(fromFloorNum: number, toFloorNum: number, enterIdx: number, leaveIdx: number): boolean {
    // Return true if there is no next floor or the next floor
    // or the elevator is heading to the idleFloorNum
    if (!this.nextFloor?.details) return true;

    // If the elevator already has a stored stop at fromFloorNum,
    // we have to check if there is enough space for the new passenger
    if (this._nextFloors[enterIdx].floorNum === fromFloorNum) {
      const { noEntering, noInside } = this._nextFloors[enterIdx].details!;
      if (noEntering + noInside >= this.maxLoad) return false;
    }

    // If the elevator already has a stored stop at toFloorNum
    if (this._nextFloors[leaveIdx].floorNum === toFloorNum) {
      const { noLeaving, noInside } = this._nextFloors[leaveIdx].details!;
      if (noLeaving + noInside >= this.maxLoad) return false;
    }

    // Check is there will be enough space in the elevator at
    // each intermediate stop (between the fromFloorNum and toFloorNum)
    for (let i = enterIdx + 1; i < leaveIdx; i++) {
      const { noEntering, noInside } = this._nextFloors[i].details!;
      if (noEntering + noInside >= this.maxLoad) return false;
    }

    return true;
  }

  private calcMoveDistance(time: number): number {
    return this.speed * time;
  }

  private calcDistanceFromBottom(floorNum: number): number {
    return this.elevatorService.getFloorHeight(floorNum)!
         - this.elevatorService.getFloorHeight(this.minFloorNum)!;
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
      this._currentFloorNum = this.nextFloor.floorNum;
      this._nextFloors.splice(1, 1);
    }
  }

  private updateCurrentFloorNum() {
    // If the elevator has passed the current floor while going up
    if (this.currentFloorNum < this.maxFloorNum
      && this.calcDistanceToFloor(this.currentFloorNum + 1) < 1e-6) this._currentFloorNum++;
    // If the elevator has passed the current floor while going down
    else if (this.currentFloorNum > this.minFloorNum
      && this.calcDistanceToFloor(this.currentFloorNum - 1) < 1e-6) this._currentFloorNum--;
  }

  private toggleDoor() {
    if (this._state === ElevatorState.OPEN_DOOR) {
      this._state = ElevatorState.WAITING;
      this.stoppedStartTime = this.timeService.getTime();
    } else {
      this._state = ElevatorState.MOVING;
    }
    this.timeout = null;
  }
}
